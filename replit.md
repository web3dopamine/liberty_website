# Liberty Bitcoin

### Overview
Liberty Bitcoin is a cryptocurrency project poised to be "The next chapter of Bitcoin" as a scalable, programmable, and gas-free L2 solution. It emphasizes a community-first approach and offers a 1:10 token claim for BTC holders. The project's primary digital presence is a website serving as a landing page and a full-stack AI Agent Launchpad (formerly Developer Grants Program) system. Key capabilities include token claim, a launch countdown, LBTC calculator, eligibility checker, and a database-backed application system for funding AI agent projects.

### User Preferences
No explicit user preferences were provided. The agent should infer best practices from the project's technical sophistication and focus on clear, concise communication when proposing changes. Assume a preference for modern coding standards and efficient solutions.

### System Architecture
The project is a full-stack application built with a clear separation of concerns.

**Frontend:**
*   **Framework:** React 19.1.1 with Vite 7.1.7 for fast development and bundling.
*   **Styling:** Tailwind CSS 4.1.16 for utility-first styling, complemented by Motion 12.23.24 for animations.
*   **Data Management:** TanStack React Query handles data fetching, and React Hook Form with Zod provides robust form handling and validation.
*   **Wallet Integration:** `ethers.js 6.x` is used for MetaMask and other EVM-compatible wallet connections, while dedicated hooks and utilities (`useBitcoinWallet`) support Bitcoin wallets (XVerse, Unisat, OKX) for PSBT and message signing.
*   **UI/UX Decisions:** Features like a transparent header with scroll effects, custom modal notifications for subscriptions, and a professional, modern design aesthetic (e.g., in the `/ownership` page and Admin Panel) are central. The "AI Agent Launchpad" and calculator UIs are designed for clarity and user-friendliness with quick select options and clear labels.

**Backend:**
*   **Server:** Express 5.x with TypeScript provides a robust API layer.
*   **Database:** PostgreSQL, leveraging Replit's Neon-backed database, managed by Drizzle ORM for type-safe schema definition and queries.
*   **Authentication:** Passport.js with OAuth2 (Replit Auth in production) handles user authentication, though it's disabled in development for ease of testing.
*   **Email Services:** SendGrid is integrated for email notifications (e.g., for grant applications).
*   **Bitcoin RPC Proxy:** Secure, admin-authenticated endpoints proxy Bitcoin Core RPC commands for PSBT operations (e.g., `createpsbt`, `finalizepsbt`), ensuring secure interaction with the Bitcoin network.

**Core Features & Implementations:**
*   **AI Agent Launchpad:** A rebranded and re-focused grant program for funding autonomous AI agents with specific categories (DeFi Trading, Smart Contract AI Auditor, Autonomous Portfolio Manager, On-Chain Analytics Agent) and funding ranges.
*   **Eligibility Checker:** Allows users to check BTC address eligibility, navigating to a dedicated `/ownership` page where PSBT and message signature verification can occur.
*   **LBTY Calculator:** Converts BTC to LBTY with quick select options and minimum claim validation.
*   **Email Subscription:** A functional newsletter subscription system with email validation and custom modal feedback.
*   **Admin Panel:** A comprehensive UI at `/admin` for managing AI Agent Launchpad applications, including search, filters, status updates, and an integrated real-time chat system between admins and applicants using unique tokens.
*   **PSBT Integration:** The system supports creating, finalizing, and broadcasting self-send PSBTs for ownership verification, integrating with various Bitcoin wallets.

### External Dependencies
*   **PostgreSQL (Neon-backed Replit database):** Primary database for all application data.
*   **Blockchain.com API:** Used for BTC address eligibility checks.
*   **SendGrid:** Email delivery service for notifications.
*   **Replit OAuth:** Authentication provider for production environments.
*   **Bitcoin Core RPC:** Interacted with via a secure proxy for PSBT operations and blockchain data.
*   **XVerse, Unisat, OKX Wallets:** Integrated for Bitcoin wallet connectivity and signing.
*   **MetaMask:** Integrated for EVM-compatible wallet connectivity.