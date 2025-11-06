# Liberty Bitcoin

## Overview
Liberty Bitcoin is a cryptocurrency project promoting "The next chapter of Bitcoin" - an L2 (Layer 2) solution that is scalable, programmable, and gas-free. The project emphasizes community-first principles and offers a 1:10 ratio claim for all BTC holders at snapshot.

## Purpose
The website serves as the main landing page for Liberty Bitcoin, featuring:
- Token claim functionality for BTC holders
- Launch countdown timer
- LBTC calculator
- Eligibility checker
- Developer grants program information
- Community resources and social links
- Treasury and project phase information

## Tech Stack
- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Styling**: Tailwind CSS 4.1.16
- **Animation**: Motion 12.23.24
- **Additional Tools**: 
  - vite-plugin-svgr for SVG imports
  - ESLint for code quality

## Project Structure
```
├── public/                 # Static assets
├── src/
│   ├── assets/
│   │   ├── images/        # Image assets
│   │   └── video/         # Video assets
│   ├── components/        # React components
│   │   ├── CheckYourEligibility.jsx
│   │   ├── ClaimYourLBTC.jsx
│   │   ├── DeveloperGrantsProgram.jsx
│   │   ├── Footer.jsx
│   │   ├── GrantApplicationProcess.jsx
│   │   ├── Header.jsx
│   │   ├── JoinTheRevolution.jsx
│   │   ├── LaunchCountdown.jsx
│   │   ├── LBTCCalculator.jsx
│   │   ├── MarqueeText.jsx
│   │   ├── NewsAndUpdates.jsx
│   │   ├── ProjectPhases.jsx
│   │   ├── StayUpdated.jsx
│   │   ├── TopSection.jsx
│   │   ├── Treasury.jsx
│   │   └── WhyLiberty.jsx
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main App component
│   └── main.jsx           # Entry point
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies
```

## Recent Changes
- **November 6, 2025**: Initial setup for Replit environment
  - Configured Vite to run on 0.0.0.0:5000 for Replit hosting
  - Set up HMR (Hot Module Replacement) with WSS protocol
  - Configured deployment with autoscale target
  - Created workflow for development server

## Development
- **Run Dev Server**: The project uses `npm run dev` which starts Vite on port 5000
- **Build**: `npm run build` compiles the project for production
- **Preview**: `npm run preview` serves the production build

## Deployment
- **Type**: Autoscale (stateless website)
- **Build Command**: `npm run build`
- **Run Command**: `npx vite preview --host 0.0.0.0 --port 5000`
- **Port**: 5000 (required for Replit webview)

## Current State
The project is fully functional and ready to use. All core features are working:
- Website loads correctly with all components
- Development server runs on port 5000
- HMR is configured for live updates
- Deployment is configured and ready to publish
