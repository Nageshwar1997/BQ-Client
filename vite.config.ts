import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === "analyze" &&
      visualizer({
        open: true,
        filename: "stats.html",
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean),
  server: { port: 3001 },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          motion: ["framer-motion"],
        },
      },
    },
    // Optionally, adjust the chunk size warning limit (set to 1 MB here)
    chunkSizeWarningLimit: 1000, // 1 MB
  },
}));
