import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// During local dev, proxy /api to the BFF. In the container, server.js
// handles the /api proxy instead.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
