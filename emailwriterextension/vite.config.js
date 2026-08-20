import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        background: 'src/background.js',
        content: 'src/content.jsx'
      },
      output: {
        entryFileNames: '[name].js'
      }
    }
  }
});
