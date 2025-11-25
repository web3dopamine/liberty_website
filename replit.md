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
*   **Wallet Integration:** 
    - `ethers.js 6.x` for MetaMask and Phantom direct connections
    - **Reown AppKit (formerly WalletConnect)** for 500+ wallet integrations including Binance Wallet, Trust Wallet, and more with built-in search functionality
    - Dedicated Bitcoin wallet support (`useBitcoinWallet`) for XVerse, Unisat, and OKX for PSBT and message signing
*   **UI/UX Decisions:** Features like a transparent header with scroll effects, custom modal notifications for subscriptions, and a professional, modern design aesthetic (e.g., in the `/ownership` page and Admin Panel) are central. The "Grant Program" and calculator UIs are designed for clarity and user-friendliness with quick select options and clear labels.
*   **Responsive Design:** Fully responsive header navbar, hero section, and footer with mobile-first approach:
    - **Header**: Desktop navigation menu transforms into animated hamburger menu on mobile/tablet (below lg breakpoint). Includes automatic menu closure on viewport resize to desktop width and scroll-lock prevention.
    - **Hero Section**: Logo overlay scales from 90% width on mobile to 70% on desktop (max 1200px). Call-to-action buttons stack vertically on mobile and display side-by-side on tablet/desktop. Adaptive bottom positioning and button sizing across all breakpoints.
    - **Footer**: Single-column stacked layout on mobile/tablet, expanding to 4-column grid on desktop (lg breakpoint and above). All spacing and typography scales responsively across breakpoints.
    - **Breakpoints**: Mobile (default), md (768px), lg (1024px), xl (1280px)

**Backend:**
*   **Server:** Express 5.x with TypeScript provides a robust API layer.
*   **Database:** PostgreSQL, leveraging Replit's Neon-backed database, managed by Drizzle ORM for type-safe schema definition and queries.
*   **Authentication:** Passport.js with OAuth2 (Replit Auth in production) handles user authentication, though it's disabled in development for ease of testing.
*   **Email Services:** SendGrid is integrated for email notifications (e.g., for grant applications).
*   **Bitcoin Integration:** 
    - **Balance Checking:** Uses Blockstream.info API for instant BTC address balance lookups (replaced slow Bitcoin RPC `scantxoutset` method)
    - **PSBT Operations:** Bitcoin Core RPC integration for creating, finalizing, and broadcasting PSBTs (`createpsbt`, `finalizepsbt`). Uses environment secrets (`BITCOIN_RPC_URL`, `BITCOIN_RPC_USER`, `BITCOIN_RPC_PASS`) for secure authentication.

**Core Features & Implementations:**
*   **Video Showcase:** Cinematic full-width video section positioned between the Hero and Calculator sections, featuring autoplay looping video with subtle gradient overlay. Includes scroll-triggered fade-in animation for visual impact. The video is fully responsive with rounded corners and shadow effects.
*   **Claim Liberty Section:** Interactive section explaining the 4-step token claiming process. Features step-by-step breakdown: (1) Connect Bitcoin wallet, (2) Verify ownership via signature, (3) Link Liberty wallet address, (4) Claim LBTY tokens at 1:10 ratio. Displays disabled "Start Claim Now" button with launch date "February 10, 2026 at 12:00 AM UTC". Positioned after Treasury section to guide users through the claiming journey. Minimum 0.003 BTC required to claim.
*   **Grant Program:** Developer grants program for funding projects building on Bitcoin Liberty with various categories (DeFi, Infrastructure, Developer Tools, AI/ML) and customizable funding ranges.
*   **Ownership Verification (`/ownership`):** PSBT-based and message signature verification system for linking Bitcoin addresses to Liberty wallet addresses. Features "Share on X" button after successful verification, allowing users to announce their verified status on social media with pre-filled tweet text.
*   **Liberty Eligibility:** Real-time BTC address balance checker using Blockstream.info API for instant results (<1 second vs 1-5 minutes with RPC). Displays BTC balance and potential LBTY claimable amount (1:10 ratio) directly below the input field. Minimum 0.003 BTC required for eligibility.
*   **Liberty Calculator:** Converts BTC to LBTY with quick select options and minimum claim validation.
*   **Email Subscription:** A functional newsletter subscription system with email validation and custom modal feedback.
*   **Admin Panel:** A comprehensive UI at `/admin` for managing grant applications, including search, filters, status updates, and an integrated real-time chat system between admins and applicants using unique tokens.
*   **PSBT Integration:** The system supports creating, finalizing, and broadcasting self-send PSBTs for ownership verification, integrating with various Bitcoin wallets.
*   **Interactive Treasury Chart:** Dynamic SVG donut chart displaying Bitcoin supply distribution with exact data (Active Supply: 67.2%, Dormant 5-10yr: 13.3%, Lost BTC: 14.3%, Satoshi's Coins: 5.2%). Features cursor-following tooltips, segment hover effects with scale animations, and sequential reveal animations on scroll.
*   **Token Auction Page (`/auction`):** Frontend UI for LBTY token sale featuring English auction mechanics inspired by MegaETH's successful model. Displays oversubscription metrics (27.8x example), live auction status, top bids leaderboard, clearing price, and FDV calculations. Includes tabbed interface for "My Allocation", "Facts", "How It Works", "Timeline", and "FAQ". Bid placement interface with quick-select amounts ($1K/$5K/$10K/MAX) and wallet integration. Designed for frontend presentation with placeholder data - smart contract integration pending.
*   **Documentation Site (`/docs`):** Comprehensive Docusaurus-powered documentation website featuring:
    - **For Users**: Token claiming guide (message signature & PSBT methods), wallet setup (MetaMask, Trust Wallet, 500+ via WalletConnect), token auction participation guide with lock-up discounts
    - **For Developers**: Network setup (testnet chain ID 324705682), quickstart with Hardhat/Foundry, smart contract development (ERC-20, NFT, DEX examples), RPC endpoints and bridging documentation
    - **Resources**: Detailed FAQ covering token economics, claiming process, technical setup, security best practices, and troubleshooting guides
    - **Branding**: Fully custom Liberty Bitcoin branding with dark teal gradients (#0d3d3b to #1a5c59), Liberty Bitcoin logo in navbar and hero section, teal accent color (#4A9390), styled feature cards, and matching footer. All Docusaurus default templates and logos removed.
    - **Custom Homepage**: Hero section with Liberty logo, gradient background, "Get Started"/"For Users"/"For Developers" CTA buttons, and 6 Liberty-centric feature cards (Token Claiming, Gas-Free Transactions, Build on Liberty, Token Auction, Wallet Integration, Developer Grants)
    - **Deployment**: Served as static files from `docs/build` directory with `baseUrl: '/docs/'`. Built with `cd docs && npm run build` and served via Express static middleware at `/docs` route. No separate workflow needed.

### External Dependencies
*   **PostgreSQL (Neon-backed Replit database):** Primary database for all application data.
*   **Blockstream.info API:** Free blockchain explorer API for instant BTC address balance lookups (no API key required).
*   **Bitcoin Core RPC Node:** Direct connection to user's Bitcoin node at http://37.27.97.175:8332 for PSBT operations. Requires `BITCOIN_RPC_URL`, `BITCOIN_RPC_USER`, and `BITCOIN_RPC_PASS` secrets.
*   **SendGrid:** Email delivery service for notifications.
*   **Replit OAuth:** Authentication provider for production environments.
*   **Reown (WalletConnect):** Provides access to 500+ wallets (Trust Wallet, Binance Wallet featured) through AppKit integration with search functionality.
*   **XVerse, Unisat, OKX Wallets:** Integrated for Bitcoin wallet connectivity and signing.
*   **MetaMask & Phantom:** Direct integration for EVM-compatible wallet connectivity.