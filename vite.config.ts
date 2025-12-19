import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";

/**
 * Vite config for multi-page extension UI (popup + options).
 *
 * Security notes:
 * - UI bundles are local-only (no remote code).
 * - Output is copied into dist/<target>/ by scripts/build.mjs.
 */
export default defineConfig({
  root: path.resolve(__dirname, "src"),
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist/ui"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, "src/popup/index.html"),
        options: path.resolve(__dirname, "src/options/index.html"),
      },
    },
  },
});
