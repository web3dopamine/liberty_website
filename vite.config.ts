import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import path from "path";

export default defineConfig({
  plugins: [react(), svgr(), tailwindcss()],
  resolve: {
    alias: {
      "@shared": path.resolve(import.meta.dirname || __dirname, "./shared"),
      "@assets": path.resolve(import.meta.dirname || __dirname, "./attached_assets"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5000,
    strictPort: true,
    allowedHosts: true,
    // hmr: {
    //   clientPort: 443,
    //   protocol: "wss",
    // },
    hmr: {
      protocol: "ws", // plain ws for localhost
      host: "localhost",
      clientPort: 5000,
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 5000,
  },
});
