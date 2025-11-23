import { defineConfig } from "vite";

// We use a custom project root inside /src to match the requested structure
export default defineConfig({
  root: "src",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
});