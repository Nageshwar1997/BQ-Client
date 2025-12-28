import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      filename: "stats.html",
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  server: {
    port: 3001,
    proxy: {
      "/api/image": {
        target: "https://lh3.googleusercontent.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/image/, ""),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Use manualChunks to split code into multiple chunks
        manualChunks(id) {
          // If it's from node_modules, place it in a vendor chunk
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
    // Optionally, adjust the chunk size warning limit (set to 1 MB here)
    chunkSizeWarningLimit: 1000, // 1 MB
  },
});
