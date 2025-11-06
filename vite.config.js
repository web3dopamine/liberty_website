import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), tailwindcss()],
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
