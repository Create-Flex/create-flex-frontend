import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 인증 상태 관리 스토어
 * - Access Token은 localStorage에 저장
 * - Refresh Token은 HttpOnly Cookie로 서버에서 관리 (XSS 방어)
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // 로그인 (Refresh Token은 쿠키로 자동 설정됨)
      login: (userData, accessToken) => {
        localStorage.setItem('token', accessToken);
        set({
          user: userData,
          token: accessToken,
          isAuthenticated: true
        });
      },

      // 로그아웃 (Refresh Token 쿠키는 서버에서 삭제)
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

      // Access Token 설정 (토큰 갱신 시 사용)
      setToken: (accessToken) => {
        localStorage.setItem('token', accessToken);
        set({
          token: accessToken,
          isAuthenticated: true
        });
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
