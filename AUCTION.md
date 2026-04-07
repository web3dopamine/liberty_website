# LibertyAuction — Bonding Curve Token Sale

> Multi-chain token sale for **LIBERTY** — the native token of [Liberty Chain](https://libertychain.org), backed by provably inaccessible Bitcoin supply. Inspired by [Ethereum's 2014 token sale](https://blog.ethereum.org/2014/07/22/launching-the-ether-sale).

---

## Overview

A 7-day public token sale using a **linear bonding curve**. Price starts at **$0.10** and rises to **$1.12** as tokens are sold, rewarding early buyers with up to an **11.2x** advantage.

Payments accepted in **BTC, ETH, BNB, POL, SOL, and USDC** across multiple chains.

| Parameter             | Value              |
| --------------------- | ------------------ |
| Total Auction Supply  | 40,950,000 LIBERTY |
| Start Price           | $0.10 USD          |
| End Price             | $1.12 USD          |
| Target Raise          | ~$25,000,000       |
| Duration              | 7 Days             |
| Early Bird Multiplier | 11.2x              |

---

Start with 0.7 USD to 1 to 1.2 USD

## Token Economics

Liberty Chain's total BTC reference supply is **20,000,000 BTC**:

| Category               | BTC        | %     | Status                                                                |
| ---------------------- | ---------- | ----- | --------------------------------------------------------------------- |
| Active Supply          | 13,442,045 | 67.2% | Claimable at [claim.libertychain.org](https://claim.libertychain.org) |
| Dormant 5–10 years     | 2,793,000  | 13.3% | Reserve                                                               |
| Lost BTC (non-Satoshi) | 3,003,000  | 14.3% | **Auctioned**                                                         |
| Satoshi's Coins        | 1,092,000  | 5.2%  | **Auctioned**                                                         |

```
Inaccessible BTC = 3,003,000 + 1,092,000 = 4,095,000 BTC
LIBERTY Supply   = 4,095,000 × 10          = 40,950,000 LIBERTY
```

Only provably inaccessible BTC supply is sold through this auction. Active BTC holders claim their LIBERTY directly via the claim portal.

---

## Bonding Curve Formula

```
price(tokensSold) = BASE_PRICE + (tokensSold / TOTAL_SUPPLY) × (MAX_PRICE - BASE_PRICE)
```

The price increases linearly as tokens are sold. Token amounts for a given USD input are calculated using integral math (quadratic formula) to account for the price movement caused by the purchase itself:

```
USD = BASE_PRICE × T + PRICE_RANGE / (2 × TOTAL_SUPPLY) × ((sold + T)² - sold²)
```

Solving for `T` (tokens received):

```
a = PRICE_RANGE / (2 × TOTAL_SUPPLY)
b = BASE_PRICE + (PRICE_RANGE × tokensSold) / TOTAL_SUPPLY
T = (-b + √(b² + 4a × USD)) / (2a)
```

This ensures buyers get the mathematically exact amount regardless of purchase size.

---

## Accepted Payments

| Currency | Chain                  | Method                          |
| -------- | ---------------------- | ------------------------------- |
| **ETH**  | Ethereum               | On-chain via MetaMask / Phantom |
| **USDC** | Ethereum, Polygon, BSC | On-chain ERC20 transfer         |
| **BNB**  | BNB Chain              | On-chain via MetaMask / Phantom |
| **POL**  | Polygon                | On-chain via MetaMask / Phantom |
| **BTC**  | Bitcoin                | Custodial (multisig deposit)    |
| **SOL**  | Solana                 | Custodial (deposit address)     |

EVM payments (ETH, BNB, POL, USDC) are sent directly from the user's browser wallet to the deposit address. BTC and SOL payments are custodial, similar to how Ethereum's 2014 sale worked.

### USDC Contract Addresses

| Chain    | Address                                      |
| -------- | -------------------------------------------- |
| Ethereum | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` |
| BSC      | `0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d` |
| Polygon  | `0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359` |

---

## Architecture

```
Frontend (React)
├── TokenAuction.jsx          — Auction UI (buy, preview, purchases)
├── WalletContext.jsx          — MetaMask + Phantom wallet state
├── ConnectWalletModal.jsx     — Wallet connection modal
└── ethers.js                  — On-chain transaction signing

Backend (Express + PostgreSQL)
├── routes.ts                  — Auction API endpoints
├── storage.ts                 — Database operations (Drizzle ORM)
└── schema.ts                  — auction_purchases table definition
```

---

## API Endpoints

### Public

| Method | Endpoint                     | Description                                   |
| ------ | ---------------------------- | --------------------------------------------- |
| `GET`  | `/api/auction/state`         | Current price, tokens sold, raised, remaining |
| `GET`  | `/api/auction/preview?usd=X` | Preview tokens for a USD amount               |
| `GET`  | `/api/auction/prices`        | Live crypto prices (CoinGecko)                |
| `GET`  | `/api/auction/recent`        | Recent purchases (masked wallets)             |
| `GET`  | `/api/auction/config`        | Deposit address                               |

### Authenticated

| Method | Endpoint                          | Description                   |
| ------ | --------------------------------- | ----------------------------- |
| `POST` | `/api/auction/buy`                | Record a purchase             |
| `GET`  | `/api/auction/purchases?wallet=X` | Purchase history for a wallet |

### `GET /api/auction/state` Response

```json
{
  "totalSupply": 40950000,
  "totalSold": 1250000,
  "totalRaised": 156250,
  "currentPrice": 0.13112,
  "basePrice": 0.1,
  "maxPrice": 1.12,
  "percentSold": 3.05,
  "remaining": 39700000,
  "durationDays": 7
}
```

### `POST /api/auction/buy` Request

```json
{
  "walletAddress": "0x1234...abcd",
  "chain": "eth",
  "paymentCurrency": "ETH",
  "paymentAmount": "0.5",
  "paymentAmountUsd": "1250.00",
  "txHash": "0xabc123..."
}
```

### `POST /api/auction/buy` Response

```json
{
  "purchase": {
    "id": "uuid",
    "walletAddress": "0x1234...abcd",
    "chain": "eth",
    "paymentCurrency": "ETH",
    "paymentAmount": "0.5",
    "paymentAmountUsd": "1250.00",
    "libertyAmount": "10482.31250000",
    "pricePerLiberty": "0.11924321",
    "txHash": "0xabc123...",
    "status": "confirmed",
    "purchasedAt": "2026-04-06T12:00:00.000Z"
  },
  "newPrice": 0.13374
}
```

---

## Database Schema

### `auction_purchases` Table

| Column               | Type             | Description                          |
| -------------------- | ---------------- | ------------------------------------ |
| `id`                 | `varchar` (UUID) | Primary key                          |
| `wallet_address`     | `text`           | Buyer's wallet address               |
| `chain`              | `text`           | btc, eth, bnb, pol, sol              |
| `payment_currency`   | `text`           | BTC, ETH, USDC, BNB, POL, SOL        |
| `payment_amount`     | `numeric(30,18)` | Raw crypto amount paid               |
| `payment_amount_usd` | `numeric(20,2)`  | USD equivalent at purchase time      |
| `liberty_amount`     | `numeric(20,8)`  | LIBERTY tokens allocated             |
| `price_per_liberty`  | `numeric(10,8)`  | Avg USD price per token              |
| `tx_hash`            | `text`           | On-chain transaction hash (nullable) |
| `status`             | `text`           | pending, confirmed, failed           |
| `purchased_at`       | `timestamp`      | Purchase timestamp                   |

---

## Setup

### Prerequisites

- Node.js >= 18
- PostgreSQL (Neon serverless or local)

### Environment Variables

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
AUCTION_DEPOSIT_ADDRESS=0xYourEVMDepositWallet
```

### Installation

```bash
# Install dependencies
npm install

# Apply database migration
npx drizzle-kit push

# Run dev server
npm run dev
```

Visit `http://localhost:5000/auction` to access the auction page.

---

## Buy Flow

### EVM Chains (ETH, BNB, POL, USDC)

```
User connects MetaMask/Phantom
        ↓
Selects chain + currency, enters amount
        ↓
Frontend calculates USD equivalent (CoinGecko prices)
        ↓
Preview shows exact LIBERTY tokens (bonding curve math)
        ↓
User clicks BUY
        ↓
ethers.js sends transaction to deposit address
  - Native token: signer.sendTransaction()
  - USDC: ERC20 contract.transfer()
        ↓
Waits for 1 block confirmation
        ↓
POST /api/auction/buy with tx hash
        ↓
Server calculates LIBERTY allocation, saves to DB
        ↓
UI shows success + new curve price
```

### BTC / SOL (Custodial)

```
User enters amount
        ↓
POST /api/auction/buy (no tx hash)
        ↓
Server records allocation as "pending"
        ↓
User sends crypto to deposit address manually
        ↓
Admin confirms → updates status to "confirmed"
```

---

## Token Delivery

At Liberty Chain mainnet launch, all auction allocations are baked into the **genesis block** — exactly like Ethereum's 2014 sale. Buyers don't receive tokens immediately; they receive them when the chain goes live.

---

## Security Considerations

- **Deposit address** — use a multisig or hardware wallet for production
- **Price oracle** — CoinGecko API for USD conversion (cached, not used for on-chain logic)
- **No smart contract** — server-side allocation tracking (Ethereum 2014 model)
- **Tx verification** — EVM purchases include on-chain tx hash for auditability
- **Rate limiting** — consider adding rate limits to buy endpoint for production

> This system has not been formally audited. A professional review is recommended before production deployment.

---

## Project Links

|           |                                                                |
| --------- | -------------------------------------------------------------- |
| Website   | [libertychain.org](https://libertychain.org)                   |
| Explorer  | [explorer.libertychain.org](https://explorer.libertychain.org) |
| Claim BTC | [claim.libertychain.org](https://claim.libertychain.org)       |
| Auction   | [libertychain.org/auction](https://libertychain.org/auction)   |
