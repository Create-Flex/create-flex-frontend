import api from '../../../api/axios';
import axios from 'axios';
import { API_CONFIG } from '../../../api/config';

export const authService = {
  // 로그인
  login: async (loginData) => {
    try {
      const response = await api.post('/auth/login', {
        memberAccount: loginData.memberAccount,
        password: loginData.password
      });
      return response.data; // { accessToken: "...", refreshToken: "..." }
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

  // 토큰 갱신
  reissue: async (refreshToken) => {
    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/reissue`, {
        refreshToken: refreshToken
      });
      return response.data; // { accessToken: "...", refreshToken: "..." }
    } catch (error) {
      console.error('토큰 갱신 에러:', error);
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
  },

  // 내 정보 수정
  updateMyInfo: async (data) => {
    try {
      const response = await api.patch('/employees/me', data);
      return response.data;
    } catch (error) {
      console.error('내 정보 수정 에러:', error);
      throw error;
    }
  },

  // 비밀번호 변경
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.patch('/employees/password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('비밀번호 변경 에러:', error);
      throw error;
    }
  }
};
