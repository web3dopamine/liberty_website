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
- **Wallet Integration**: ethers.js 6.x for MetaMask connection
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
│   ├── modals/            # Modal components (ConnectWalletModal, GrantApplicationModal)
│   ├── contexts/          # React contexts (WalletContext, AuthContext, QueryProvider)
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
- **November 7, 2025**: Email Subscription System & UI Enhancements
  - **Functional Email Newsletter**: Made StayUpdated component fully functional
    - Email validation with regex pattern
    - Database integration via `/api/subscribe` endpoint
    - Popup notifications for success/error/duplicate subscriptions
    - Loading state with "SUBSCRIBING..." indicator
    - Enter key support for quick submission
    - Stores emails in PostgreSQL `email_subscriptions` table
  - **Transparent Header with Scroll Effect**: 
    - Header is transparent at top of page
    - Fades to semi-transparent black (80% opacity) with backdrop blur when scrolling
    - Fixed position stays at top while scrolling
    - Smooth 300ms transition animation
  - **Bug Fix**: Added missing React keys in DeveloperGrantsProgram component

- **November 7, 2025**: MetaMask Wallet Integration
  - Installed ethers.js 6.x for Web3 functionality
  - Created WalletContext for global wallet state management
  - Implemented MetaMask connection with address truncation (first 5 + last 5 digits)
  - Updated Header to display connected wallet address
  - Updated ConnectWalletModal to handle MetaMask connection flow
  - Added automatic account change detection and chain change handling
  - Wallet connection persists across page reloads via localStorage

- **November 7, 2025**: Full-stack transformation & Admin Panel
  - Converted from frontend-only to Express + PostgreSQL backend
  - Integrated Drizzle ORM with PostgreSQL database
  - Created complete API for grant application management
  - Set up Vite dev server in middleware mode with Express 5.x
  - Implemented Express 5.x routing with path-to-regexp v8 syntax (`{/*path}`)
  - Added React Query for data fetching
  - Integrated grant application form with backend API
  - **Built admin panel UI at `/admin` for managing grant applications**
    - View all applications with status filtering
    - View detailed application information
    - Update application status (received, in-review, granted, rejected)
    - Clean, lightweight implementation using only React + Tailwind CSS
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
- ✅ **Admin panel complete and accessible at `/admin`**
- ✅ Development seeding for testing
- ✅ Production build configured

## Admin Panel Access
Visit `/admin` to access the professional grant application management interface:

### Features
- **Search & Filters**: Search by title/description, filter by category and status
- **Tabbed Status View**: Quick status overview with counts (Received, In Review, Granted, Rejected)
- **Application Table**: Clean table showing applicant info, project details, funding amount, and submission date
- **Quick Status Updates**: "Move to..." dropdown for each application
- **Detailed Application View**: Click "View Details" to see complete application information
- **Integrated Chat**: Real-time messaging between admin and applicants
  - Auto-refresh every 5 seconds
  - Applicants use unique chat token to respond
  - Chat history visible to both parties
  - Professional message interface with send/receive indicators
- **Status Management**: One-click status updates (Received → In Review → Granted/Rejected)
- In development mode, authentication is disabled for easy testing

### Chat System
Each grant application has a unique chat token that applicants can use to communicate with admins:
- Admins see all messages in the application detail modal
- Messages update automatically every 5 seconds
- Applicants can respond using their chat token at `/chat/:token`
- All message history is preserved in the database

## Known Issues
- Minor React warning: Missing keys in DeveloperGrantsProgram list rendering (non-critical)
- SendGrid API key not configured (email notifications disabled)
- Authentication disabled in development mode (OAuth requires production environment variables)
