import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: {
      ...viteConfig.server,
      middlewareMode: true,
      hmr: { server }
    },
    appType: "custom",
  });

  app.use(vite.middlewares);
  
  app.use(async (req, res, next) => {
    // Skip API routes and documentation routes - they're handled separately
    if (req.path.startsWith('/api') || req.path.startsWith('/docs')) {
      return next();
    }
    
    try {
      const indexPath = path.resolve(import.meta.dirname, "..", "index.html");
      let html = await fs.promises.readFile(indexPath, "utf-8");
      html = await vite.transformIndexHtml(req.originalUrl, html);
      res.status(200).set({ "Content-Type": "text/html" }).send(html);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  app.use((req, res, next) => {
    // Skip API routes and documentation routes - they're handled separately
    if (req.path.startsWith('/api') || req.path.startsWith('/docs')) {
      return next();
    }
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
