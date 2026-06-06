import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      '@pages': path.resolve(__dirname, 'pages'),
      '@components': path.resolve(__dirname, 'components'),
      '@services': path.resolve(__dirname, 'services'),
      '@hooks': path.resolve(__dirname, 'hooks'),
      '@utils': path.resolve(__dirname, 'utils'),
      '@contexts': path.resolve(__dirname, 'contexts'),
      '@types': path.resolve(__dirname, 'types'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
})
