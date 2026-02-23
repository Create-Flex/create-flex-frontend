import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        // 백엔드 API 프록시 설정 (HttpOnly 쿠키 전송을 위해 same-origin 필요)
        proxy: {
          '/api/notifications/subscribe': {
            target: 'http://localhost:8888',
            changeOrigin: true,
            // SSE 연결 유지를 위한 설정
            timeout: 0,
            proxyTimeout: 0,
            headers: {
              'Connection': 'keep-alive',
              'Cache-Control': 'no-cache',
            },
          },
          '/api': {
            target: 'http://localhost:8888',
            changeOrigin: true,
          }
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
