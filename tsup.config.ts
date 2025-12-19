import { defineConfig } from "tsup";

/**
 * tsup config for MV3 scripts.
 *
 * We bundle background/content into single files to avoid dynamic import/chunk
 * behavior that can break content scripts or service workers in production.
 */
export default defineConfig({
  entry: {
    background: "src/background/index.ts",
    content: "src/content/index.ts",
  },
  outDir: "dist/scripts",
  format: ["iife"],
  sourcemap: true,
  clean: true,
  target: "es2022",
  minify: false,
});
