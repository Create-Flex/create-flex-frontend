import api from './api';

export const authService = {
  // 로그인
  login: async (loginData) => {
    try {
      const response = await api.post('/auth/login', {
        memberAccount: loginData.memberAccount,
        password: loginData.password
      });
      return response.data; // { accesstoken: "..." }
    } catch (error) {
      console.error('로그인 API 에러:', error);
      throw error;
    }
  },

  // 로그아웃
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      console.error('로그아웃 API 에러:', error);
      throw error;
    }
  },

  // 내 정보 조회 (토큰으로 사용자 정보 가져오기)
  getMyInfo: async () => {
    try {
      // 백엔드에 내 정보 조회 API가 있다면 사용
      // 없다면 JWT 디코딩으로 사용자 정보 추출
      const response = await api.get('/members/me');
      return response.data;
    } catch (error) {
      console.error('내 정보 조회 에러:', error);
      throw error;
    }
  }
};