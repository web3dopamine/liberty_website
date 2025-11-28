import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Development seeding - add test data if database is empty
  if (process.env.NODE_ENV === "development") {
    try {
      const existingApps = await storage.getGrantApplications();
      if (existingApps.length === 0) {
        console.log("🌱 Seeding development database with test applications...");
        
        // Create test applications (status defaults to "received", publicChatToken auto-generated)
        await storage.createGrantApplication({
          applicantName: "Test Developer",
          email: "test@example.com",
          organization: "Test Org",
          grantCategory: "defi",
          projectTitle: "Test Application 1",
          fundingAmount: "$10,000",
          projectDescription: "This is a test application for development",
          technicalDetails: "React, Node.js",
          timeline: "3 months",
          teamExperience: "Experienced team",
          githubRepo: "https://github.com/test/app1",
          additionalInfo: "Test application"
        });
        
        await storage.createGrantApplication({
          applicantName: "New Developer",
          email: "new@example.com", 
          organization: "New Org",
          grantCategory: "infrastructure",
          projectTitle: "Test Application 2",
          fundingAmount: "$15,000",
          projectDescription: "This is another test application",
          technicalDetails: "TypeScript, PostgreSQL",
          timeline: "4 months", 
          teamExperience: "Growing team",
          githubRepo: "https://github.com/test/app2",
          additionalInfo: "Second test application"
        });
        
        console.log("✅ Development database seeded successfully");
      }
    } catch (error) {
      console.error("❌ Failed to seed development database:", error);
    }
  }

  const server = await registerRoutes(app);

  // Serve documentation static files from the built Docusaurus site
  app.use('/docs', express.static(path.join(process.cwd(), 'docs/build')));

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  const isDev = process.env.NODE_ENV === "development";
  console.log(`Environment: ${process.env.NODE_ENV}, isDev: ${isDev}`);
  
  if (isDev) {
    console.log("Setting up Vite dev server...");
    try {
      await setupVite(app, server);
      console.log("Vite dev server setup completed");
    } catch (error) {
      console.error("Failed to setup Vite:", error);
      throw error;
    }
  } else {
    console.log("Setting up static file serving...");
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
