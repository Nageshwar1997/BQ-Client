import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    mode === 'analyze' &&
      visualizer({ open: true, filename: 'stats.html', gzipSize: true, brotliSize: true }),
  ].filter(Boolean),
  resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },
  server: { port: 3001 },
  // `@mediapipe/tasks-vision` ships its own WASM runtime that it loads itself
  // (from a pinned CDN URL, see `FaceLandmarkerCache.ts`) - letting Vite's
  // dep pre-bundler touch it breaks that loading at dev time, so it's excluded.
  optimizeDeps: { exclude: ['@mediapipe/tasks-vision'] },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react';
            if (id.includes('react-dom')) return 'react';
          }

          return undefined;
        },
      },
    },
    chunkSizeWarningLimit: 1000, // 1 MB
  },
}));
