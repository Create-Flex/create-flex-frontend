import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // 로그인
      login: (userData, token) => {
        localStorage.setItem('token', token);
        set({
          user: userData,
          token: token,
          isAuthenticated: true
        });
      },

      // 로그아웃
      logout: () => {
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
      },

      // 사용자 정보 업데이트
      setUser: (userData) => {
        set({ user: userData });
      },

      // 토큰 설정
      setToken: (token) => {
        localStorage.setItem('token', token);
        set({ token, isAuthenticated: true });
      },

      // 인증 상태 초기화
      clearAuth: () => {
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
