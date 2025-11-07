# Liberty Bitcoin

## Overview
Liberty Bitcoin is a cryptocurrency project promoting "The next chapter of Bitcoin" - an L2 (Layer 2) solution that is scalable, programmable, and gas-free. The project emphasizes community-first principles and offers a 1:10 ratio claim for all BTC holders at snapshot.

## Purpose
The website serves as the main landing page for Liberty Bitcoin with a full-stack grant application system:
- Token claim functionality for BTC holders
- Launch countdown timer
- LBTC calculator
- Eligibility checker
- **Developer grants program with database-backed application submission**
- Community resources and social links
- Treasury and project phase information

## Tech Stack
### Frontend
- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Styling**: Tailwind CSS 4.1.16
- **Animation**: Motion 12.23.24
- **Data Fetching**: TanStack React Query
- **Form Handling**: React Hook Form + Zod validation
- **Additional Tools**: 
  - vite-plugin-svgr for SVG imports
  - ESLint for code quality

### Backend
- **Server**: Express 5.x with TypeScript
- **Database**: PostgreSQL (Neon-backed Replit database)
- **ORM**: Drizzle ORM
- **Authentication**: Passport.js with OAuth2 (Replit Auth - disabled in dev mode)
- **Email**: SendGrid for application notifications
- **Sessions**: Express-session with PostgreSQL store

## Project Structure
```
├── public/                 # Static assets (production build output)
├── server/                 # Backend Express server
│   ├── index.ts           # Main server entry point
│   ├── routes.ts          # API route definitions
│   ├── vite.ts            # Vite dev server & static file serving
│   ├── storage.ts         # Database storage layer (Drizzle)
│   ├── auth.ts            # Passport authentication setup
│   ├── sendgrid.ts        # Email notification service
│   └── file-logger.ts     # Grant application file logging
├── shared/                # Shared TypeScript code
│   └── schema.ts          # Database schema (Drizzle) & Zod validators
├── src/                   # Frontend React application
│   ├── assets/
│   │   ├── images/        # Image assets
│   │   └── video/         # Video assets
│   ├── components/        # React components
│   ├── modals/            # Modal components (e.g., GrantApplicationModal)
│   ├── contexts/          # React contexts (AuthContext, QueryProvider)
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main App component
│   └── main.tsx           # Entry point
├── drizzle.config.ts      # Drizzle ORM configuration
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies
```

## Database Schema
The application uses PostgreSQL with the following tables:
- **email_subscriptions**: Newsletter subscribers
- **grant_applications**: Grant application submissions
- **grants**: Grant program definitions
- **grant_categories**: Grant category taxonomy
- **chat_messages**: Admin-applicant messaging
- **users**: User authentication (OAuth)
- **sessions**: Express session storage

## API Endpoints

### Public Endpoints
- `POST /api/subscribe` - Email newsletter subscription
- `POST /api/check-eligibility` - BTC address eligibility check (Blockchain.com API)
- `POST /api/grant-applications` - Submit grant application
- `GET /api/grant-applications/:token/messages` - Get public chat messages
- `POST /api/grant-applications/:token/messages` - Post public chat message

### Admin Endpoints (require authentication)
- `GET /api/admin/grant-applications` - List all applications with filters
- `GET /api/admin/grant-applications/:id` - Get application details
- `PATCH /api/admin/grant-applications/:id/status` - Update application status
- `GET /api/admin/grant-applications/:id/messages` - Admin chat messages
- `POST /api/admin/grant-applications/:id/messages` - Send admin message
- `GET /api/grants` - List all grant programs
- `POST /api/grants` - Create new grant program
- `GET /api/grant-categories` - List grant categories

## Recent Changes
- **November 7, 2025**: Full-stack transformation
  - Converted from frontend-only to Express + PostgreSQL backend
  - Integrated Drizzle ORM with PostgreSQL database
  - Created complete API for grant application management
  - Set up Vite dev server in middleware mode with Express 5.x
  - Implemented Express 5.x routing with path-to-regexp v8 syntax (`{/*path}`)
  - Added React Query for data fetching
  - Integrated grant application form with backend API
  - Configured authentication system (Replit OAuth - disabled in dev)
  - Added email notifications via SendGrid
  - Development mode includes automatic database seeding

- **November 6, 2025**: Initial setup for Replit environment
  - Configured Vite to run on 0.0.0.0:5000 for Replit hosting
  - Set up HMR (Hot Module Replacement)
  - Configured deployment with autoscale target

## Development
- **Run Dev Server**: `npm run dev` 
  - Starts Express server with Vite middleware on port 5000
  - Sets NODE_ENV=development for dev-specific features
  - Auto-seeds database with test data if empty
  - Authentication disabled (mock user data)
- **Database Push**: `npm run db:push` - Sync schema changes to database
- **Database Studio**: `npm run db:studio` - Open Drizzle Studio
- **Build**: `npm run build` - Compile TypeScript backend + Vite frontend

## Deployment
- **Type**: VM (maintains server state for WebSocket connections and sessions)
- **Build Command**: `npm run build`
- **Run Command**: `NODE_ENV=production tsx server/index.ts`
- **Port**: 5000 (required for Replit webview)
- **Environment Variables Required**:
  - `DATABASE_URL` - PostgreSQL connection string (auto-provided by Replit)
  - `REPLIT_CLIENT_ID`, `REPLIT_CLIENT_SECRET`, `REPLIT_CALLBACK_URL` - OAuth (production only)
  - `SENDGRID_API_KEY` - Email notifications (optional)

## Current State
The project is a fully functional full-stack application:
- ✅ Frontend website loads with all components and styling
- ✅ Vite HMR working in development mode
- ✅ Express server with TypeScript
- ✅ PostgreSQL database integrated with Drizzle ORM
- ✅ API endpoints for grant applications working
- ✅ Grant application form submits to backend
- ✅ Development seeding for testing
- ✅ Production build configured
- ⚠️ Admin panel deferred (incompatible dependencies - backend API routes functional)

## Known Issues
- Minor React warning: Missing keys in DeveloperGrantsProgram list rendering (non-critical)
- Admin UI not implemented (backend admin API routes functional for future implementation)
- SendGrid API key not configured (email notifications disabled)
- Authentication disabled in development mode (OAuth requires production environment variables)
