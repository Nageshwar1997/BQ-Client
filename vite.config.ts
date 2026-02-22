import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    mode === 'analyze' &&
      visualizer({
        open: true,
        filename: 'stats.html',
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean),
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: { port: 3001 },
  build: {
    rollupOptions: { output: { manualChunks: { react: ['react', 'react-dom'] } } },
    // Optionally, adjust the chunk size warning limit (set to 1 MB here)
    chunkSizeWarningLimit: 1000, // 1 MB
  },
}));
