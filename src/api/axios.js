import axios from 'axios';
import toast from 'react-hot-toast';
import { API_CONFIG } from './config';

const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS,
});

const fileApi = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
});

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
    (error) => {
        if (error.response) {
            //서버가 응답을 함
            const { status, data } = error.response;
            switch (status) {
                case 401:
                    //인증에러, 토스트 표시 안함 (로그아웃 처리됨)
                    window.location.href = '/login';
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
    (error) => {
        if (error.response) {
            //서버가 응답을 함
            const { status, data } = error.response;
            switch (status) {
                case 401:
                    //인증에러
                    window.location.href = '/login';
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