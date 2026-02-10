import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      // 로그인
      login: (userData, accessToken, refreshToken) => {
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        set({
          user: userData,
          token: accessToken,
          refreshToken: refreshToken,
          isAuthenticated: true
        });
      },

      // 로그아웃
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false
        });
      },

      // 사용자 정보 업데이트
      setUser: (userData) => {
        set({ user: userData });
      },

      // 토큰 설정 (토큰 갱신 시 사용)
      setTokens: (accessToken, refreshToken) => {
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        set({
          token: accessToken,
          refreshToken: refreshToken,
          isAuthenticated: true
        });
      },

      // 토큰 설정 (기존 호환성 유지)
      setToken: (token) => {
        localStorage.setItem('token', token);
        set({ token, isAuthenticated: true });
      },

      // Refresh Token 가져오기
      getRefreshToken: () => {
        return get().refreshToken || localStorage.getItem('refreshToken');
      },

      // 인증 상태 초기화
      clearAuth: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false
        });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
