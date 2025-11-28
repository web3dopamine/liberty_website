import "dotenv/config";
import passport from "passport";
import { Strategy as OAuth2Strategy } from "passport-oauth2";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

// Environment variable validation
const isDevelopment = process.env.NODE_ENV === "development";
const oauthVars = {
  REPLIT_CLIENT_ID: process.env.REPLIT_CLIENT_ID,
  REPLIT_CLIENT_SECRET: process.env.REPLIT_CLIENT_SECRET,
  REPLIT_CALLBACK_URL: process.env.REPLIT_CALLBACK_URL,
};
const requiredAlwaysVars = {
  SESSION_SECRET: process.env.SESSION_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
};

// Check OAuth variables conditionally
const hasOAuthVars = Object.values(oauthVars).every(value => !!value);
const isAuthEnabled = hasOAuthVars;

// In production, OAuth vars are required
// if (!isDevelopment && !hasOAuthVars) {
//   const missingOAuthVars = Object.entries(oauthVars)
//     .filter(([_, value]) => !value)
//     .map(([key]) => key);
//   throw new Error(
//     `Critical OAuth environment variables missing in production: ${missingOAuthVars.join(', ')}. ` +
//     "Authentication cannot function without these variables in production."
//   );
// }

// Always required variables (session secret and database)
for (const [key, value] of Object.entries(requiredAlwaysVars)) {
  if (!value) {
    throw new Error(`Critical environment variable ${key} is missing - application cannot function without it`);
  }
}

// Log authentication state
if (isDevelopment) {
  if (isAuthEnabled) {
    console.log("🔐 Authentication: ENABLED (OAuth variables found)");
  } else {
    console.log("⚠️  Authentication: DISABLED (OAuth variables missing - development mode)");
    console.log("   → All auth middleware will pass through with mock user data");
    console.log("   → Set REPLIT_CLIENT_ID, REPLIT_CLIENT_SECRET, and REPLIT_CALLBACK_URL to enable OAuth");
  }
} else {
  console.log("🔐 Authentication: ENABLED (production mode)");
}

// Session configuration
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL!,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'lax', // Prevent CSRF attacks on session cookies
      maxAge: sessionTtl,
    },
  });
}

// OAuth2 Strategy configuration (only if OAuth vars are available)
let oauth2Strategy: OAuth2Strategy | null = null;

if (isAuthEnabled) {
  oauth2Strategy = new OAuth2Strategy(
    {
      authorizationURL: "https://replit.com/oauth/authorize",
      tokenURL: "https://replit.com/oauth/token",
      clientID: process.env.REPLIT_CLIENT_ID!,
      clientSecret: process.env.REPLIT_CLIENT_SECRET!,
      callbackURL: process.env.REPLIT_CALLBACK_URL!,
      scope: ["user:read"],
      state: true, // Enable CSRF protection for OAuth flow
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        // Fetch user info from Replit API
        const response = await fetch("https://replit.com/api/user", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch user profile from Replit API:", response.status);
          return done(new Error("Failed to fetch user profile"));
        }

        const userProfile = await response.json();
        
        // Check if user is admin
        const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];
        const isAdmin = adminEmails.includes(userProfile.email);

        // Upsert user in database with Replit user ID
        await storage.upsertUser({
          id: String(userProfile.id), // Use Replit user ID as database ID
          email: userProfile.email,
          firstName: userProfile.firstName || userProfile.first_name,
          lastName: userProfile.lastName || userProfile.last_name,
          profileImageUrl: userProfile.avatar || userProfile.profile_image_url,
          isAdmin: isAdmin,
        });

        // Return user data for session
        return done(null, {
          id: String(userProfile.id), // Ensure consistent string ID
          email: userProfile.email,
          firstName: userProfile.firstName || userProfile.first_name,
          lastName: userProfile.lastName || userProfile.last_name,
          profileImageUrl: userProfile.avatar || userProfile.profile_image_url,
          isAdmin: isAdmin,
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      } catch (error) {
        console.error("OAuth strategy error:", error);
        return done(error);
      }
    }
  );
}

// Mock user data for development mode when auth is disabled
const getMockUser = () => ({
  id: "dev-user-1",
  email: "developer@example.com",
  firstName: "Dev",
  lastName: "User",
  profileImageUrl: "https://via.placeholder.com/150",
  isAdmin: true, // Grant admin access in development
  accessToken: "mock-access-token",
  refreshToken: "mock-refresh-token",
});

// User serialization for sessions
passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

// Setup authentication
export async function setupAuth(app: Express) {
  // Trust proxy for production
  app.set("trust proxy", 1);
  
  // Session middleware
  app.use(getSession());
  
  if (isAuthEnabled) {
    // Passport middleware (only when OAuth is enabled)
    app.use(passport.initialize());
    app.use(passport.session());
    
    // Register OAuth2 strategy
    passport.use("replit", oauth2Strategy!);
    
    // Auth routes
    app.get("/auth/replit", passport.authenticate("replit"));
    
    app.get("/auth/replit/callback", 
      passport.authenticate("replit", { 
        failureRedirect: "/login-failed" 
      }),
      (req, res) => {
        // Successful authentication, redirect to frontend
        res.redirect("/");
      }
    );

    // Login failure route
    app.get("/login-failed", (req, res) => {
      res.status(401).json({ 
        message: "Authentication failed", 
        error: "Failed to authenticate with Replit. Please try again." 
      });
    });
  } else {
    // Development mode routes when auth is disabled
    app.get("/auth/replit", (req, res) => {
      res.status(503).json({
        message: "Authentication disabled in development mode",
        error: "OAuth environment variables not configured. Add REPLIT_CLIENT_ID, REPLIT_CLIENT_SECRET, and REPLIT_CALLBACK_URL to enable authentication."
      });
    });
    
    app.get("/auth/replit/callback", (req, res) => {
      res.status(503).json({
        message: "Authentication disabled in development mode",
        error: "OAuth not configured"
      });
    });

    app.get("/login-failed", (req, res) => {
      res.status(503).json({
        message: "Authentication disabled in development mode",
        error: "OAuth not configured"
      });
    });
  }

  // API routes for auth management
  app.get("/api/me", requireAuth, async (req: any, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "No user session" });
      }
      
      if (isAuthEnabled) {
        // Get fresh user data from database to ensure isAdmin is current
        const dbUser = await storage.getUser(user.id);
        if (!dbUser) {
          return res.status(404).json({ message: "User not found in database" });
        }
        res.json(dbUser);
      } else {
        // Return mock user in development mode
        res.json(user);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      req.session.destroy((destroyErr) => {
        if (destroyErr) {
          console.error("Session destroy error:", destroyErr);
        }
        res.clearCookie('connect.sid');
        res.json({ message: "Logged out successfully" });
      });
    });
  });
}

// Authentication middleware
export const requireAuth: RequestHandler = (req, res, next) => {
  if (isAuthEnabled) {
    // Standard authentication when OAuth is enabled
    if (req.isAuthenticated() && req.user) {
      return next();
    }
    return res.status(401).json({ message: "Authentication required" });
  } else {
    // Development mode - inject mock user
    (req as any).user = getMockUser();
    (req as any).isAuthenticated = () => true;
    return next();
  }
};

// Admin middleware
export const requireAdmin: RequestHandler = (req, res, next) => {
  if (isAuthEnabled) {
    // Standard admin check when OAuth is enabled
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    return next();
  } else {
    // Development mode - inject mock admin user
    (req as any).user = getMockUser();
    (req as any).isAuthenticated = () => true;
    return next();
  }
};

// Backward compatibility aliases
export const isAuthenticated = requireAuth;