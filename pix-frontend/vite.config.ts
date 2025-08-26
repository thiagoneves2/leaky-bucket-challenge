import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import relay from 'vite-plugin-relay';

export default defineConfig({
  plugins: [react(), relay],
  server: {
    // optional: proxy
    // proxy: { '/graphql': 'http://localhost:3000', '/login': 'http://localhost:3000' }
  },
});
