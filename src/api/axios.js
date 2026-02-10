import axios from 'axios';
import toast from 'react-hot-toast';
import { API_CONFIG } from './config';
import { useAuthStore } from '../features/auth/model/useAuthStore';

const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS,
});

const fileApi = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
});

// 토큰 갱신 중인지 여부
let isRefreshing = false;
// 토큰 갱신 중 대기하는 요청들
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request Interceptor - 모든 요청에 토큰 자동 추가
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

fileApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response) {
            //서버가 응답을 함
            const { status, data } = error.response;

            // 401 에러 && 재시도가 아닌 경우 && reissue 요청이 아닌 경우
            if (status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/reissue')) {
                if (isRefreshing) {
                    // 이미 토큰 갱신 중이면 대기열에 추가
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    }).then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    }).catch(err => {
                        return Promise.reject(err);
                    });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                const refreshToken = localStorage.getItem('refreshToken');

                if (!refreshToken) {
                    // Refresh Token이 없으면 로그인 페이지로
                    isRefreshing = false;
                    useAuthStore.getState().clearAuth();
                    window.location.href = '/login';
                    return Promise.reject(error);
                }

                try {
                    // 토큰 갱신 요청
                    const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/reissue`, {
                        refreshToken: refreshToken
                    });

                    const { accessToken, refreshToken: newRefreshToken } = response.data;

                    // 새 토큰 저장
                    useAuthStore.getState().setTokens(accessToken, newRefreshToken);

                    // 대기 중인 요청들 처리
                    processQueue(null, accessToken);

                    // 원래 요청 재시도
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    // 갱신 실패 시 로그아웃
                    processQueue(refreshError, null);
                    useAuthStore.getState().clearAuth();
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            switch (status) {
                case 401:
                    // reissue 실패 등 이미 처리된 경우
                    break;
                case 403:
                    if (window.location.pathname !== '/login') {
                        toast.error(data?.message || '접근 권한이 없습니다.');
                    }
                    console.error('접근권한이 없습니다.');
                    break;
                case 404:
                    if (window.location.pathname !== '/login') {
                        toast.error(data?.message || '요청한 리소스를 찾을 수 없습니다.');
                    }
                    console.error('요청한 리소스를 찾을 수 없습니다.');
                    break;
                case 409:
                    // 충돌 에러 (중복 등) - 컴포넌트에서 직접 처리하도록 toast 표시 안함
                    console.error('충돌 에러:', data?.message);
                    break;
                case 500:
                    if (window.location.pathname !== '/login') {
                        toast.error(data?.message || '서버 에러가 발생했습니다.');
                    }
                    console.error('서버 에러 발생');
                    break;
                default:
                    if (window.location.pathname !== '/login') {
                        toast.error(data?.message || '알 수 없는 오류가 발생했습니다.');
                    }
                    console.error('API 에러 :', data);
            }
        } else if (error.request) {
            //요청은 했지만 응답을 받지 못함
            console.error('네트워크 에러 : ', error.request);
        } else {
            console.error('에러 :', error.message);
        }

        return Promise.reject(error);
    }
);

// Response Interceptor
fileApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response) {
            //서버가 응답을 함
            const { status, data } = error.response;

            // 401 에러 && 재시도가 아닌 경우
            if (status === 401 && !originalRequest._retry) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    }).then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return fileApi(originalRequest);
                    }).catch(err => {
                        return Promise.reject(err);
                    });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                const refreshToken = localStorage.getItem('refreshToken');

                if (!refreshToken) {
                    isRefreshing = false;
                    useAuthStore.getState().clearAuth();
                    window.location.href = '/login';
                    return Promise.reject(error);
                }

                try {
                    const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/reissue`, {
                        refreshToken: refreshToken
                    });

                    const { accessToken, refreshToken: newRefreshToken } = response.data;
                    useAuthStore.getState().setTokens(accessToken, newRefreshToken);
                    processQueue(null, accessToken);

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return fileApi(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    useAuthStore.getState().clearAuth();
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            switch (status) {
                case 401:
                    break;
                case 403:
                    if (window.location.pathname !== '/login') {
                        toast.error(data?.message || '접근 권한이 없습니다.');
                    }
                    console.error('접근권한이 없습니다.');
                    break;
                case 404:
                    if (window.location.pathname !== '/login') {
                        toast.error(data?.message || '요청한 리소스를 찾을 수 없습니다.');
                    }
                    console.error('요청한 리소스를 찾을 수 없습니다.');
                    break;
                case 409:
                    // 충돌 에러 (중복 등) - 컴포넌트에서 직접 처리하도록 toast 표시 안함
                    console.error('충돌 에러:', data?.message);
                    break;
                case 500:
                    if (window.location.pathname !== '/login') {
                        toast.error(data?.message || '서버 에러가 발생했습니다.');
                    }
                    console.error('서버 에러 발생');
                    break;
                default:
                    if (window.location.pathname !== '/login') {
                        toast.error(data?.message || '알 수 없는 오류가 발생했습니다.');
                    }
                    console.error('API 에러 :', data);
            }
        } else if (error.request) {
            //요청은 했지만 응답을 받지 못함
            console.error('네트워크 에러 : ', error.request);
        } else {
            console.error('에러 :', error.message);
        }

        return Promise.reject(error);
    }
);

export default api;

export { fileApi };