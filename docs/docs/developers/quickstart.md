---
sidebar_position: 1
---

# Developer Quickstart

Get started building on Liberty Bitcoin in 5 minutes.

## Prerequisites

- Node.js 18+ or Bun
- A code editor (VS Code recommended)
- Basic knowledge of Ethereum/EVM development

## Network Setup

### Add Liberty to MetaMask

**Testnet (Current):**

```javascript
{
  chainId: "0x135A9D92", // 324705682 in decimal
  chainName: "SKALE Base Sepolia",
  rpcUrls: ["https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha"],
  nativeCurrency: {
    name: "Credits",
    symbol: "Credits",
    decimals: 18
  },
  blockExplorerUrls: ["https://base-sepolia-testnet-explorer.skalenodes.com/"]
}
```

**Mainnet (Coming Feb 2026):**  
Details TBA

## Quick Start Templates

### 1. Basic DApp with React + Ethers.js

```bash
# Clone starter template
git clone https://github.com/liberty-bitcoin/dapp-starter
cd dapp-starter
npm install

# Add your env variables
cp .env.example .env
# Edit .env with your Liberty RPC URL

# Start development server
npm run dev
```

### 2. Smart Contract Deployment

```bash
# Using Hardhat
npm install --save-dev hardhat
npx hardhat init

# Configure hardhat.config.js
```

```javascript
// hardhat.config.js
module.exports = {
  solidity: "0.8.20",
  networks: {
    liberty: {
      url: "https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha",
      chainId: 324705682,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 0 // Zero gas fees!
    }
  }
};
```

```bash
# Deploy your contract
npx hardhat run scripts/deploy.js --network liberty
```

## Hello World Contract

Create `contracts/HelloLiberty.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HelloLiberty {
    string public greeting;
    
    constructor(string memory _greeting) {
        greeting = _greeting;
    }
    
    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
    }
    
    function getGreeting() public view returns (string memory) {
        return greeting;
    }
}
```

## Frontend Integration

### Using Ethers.js v6

```typescript
import { ethers } from 'ethers';

// Connect to Liberty Network
const provider = new ethers.JsonRpcProvider(
  "https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha"
);

// Get signer
const signer = await provider.getSigner();

// Contract interaction
const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  ABI,
  signer
);

// Call contract (gas-free!)
const tx = await contract.setGreeting("Hello Liberty!");
await tx.wait();

// Read data
const greeting = await contract.getGreeting();
console.log(greeting); // "Hello Liberty!"
```

### Using Wagmi + RainbowKit

```typescript
import { configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

const libertyChain = {
  id: 324705682,
  name: 'Liberty Bitcoin',
  network: 'liberty',
  nativeCurrency: {
    decimals: 18,
    name: 'Credits',
    symbol: 'Credits',
  },
  rpcUrls: {
    default: {
      http: ['https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha'],
    },
    public: {
      http: ['https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Explorer',
      url: 'https://base-sepolia-testnet-explorer.skalenodes.com',
    },
  },
  testnet: true,
};

const { chains, publicClient } = configureChains(
  [libertyChain],
  [publicProvider()]
);
```

## Testing Your DApp

1. Get testnet tokens from [faucet](https://base-sepolia-faucet.skale.space)
2. Connect your wallet to Liberty testnet
3. Deploy your contract
4. Interact through your frontend
5. Check transactions on [Explorer](https://base-sepolia-testnet-explorer.skalenodes.com/)

## Key Differences from Ethereum

### 1. Zero Gas Fees
```javascript
// No need to estimate gas!
const tx = await contract.someFunction();
// Transaction cost: FREE ⛽
```

### 2. Instant Finality
```javascript
// Transaction confirmed in <2 seconds
const tx = await contract.mint();
const receipt = await tx.wait();
console.log('Confirmed instantly!');
```

### 3. Higher Limits
- Block gas limit: **268,435,455** (100x higher than Ethereum)
- Contract size: **64kb** (vs 24kb on Ethereum)

## Development Tools

### Block Explorers
- **Testnet**: https://base-sepolia-testnet-explorer.skalenodes.com/
- **Mainnet**: Coming Feb 2026

### RPC Endpoints
- **Testnet**: https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha
- **Mainnet**: TBA

### Faucets
- **Testnet Faucet**: https://base-sepolia-faucet.skale.space

### Supported Tools
- ✅ Hardhat
- ✅ Foundry
- ✅ Remix IDE
- ✅ Truffle
- ✅ Brownie
- ✅ Ethers.js v6
- ✅ Web3.js
- ✅ Wagmi
- ✅ RainbowKit

## Example Projects

### NFT Collection

```solidity
// contracts/LibertyNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LibertyNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    constructor() ERC721("Liberty NFT", "LNFT") Ownable(msg.sender) {}

    function mint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
    }
}
```

### DeFi Token Swap

```solidity
// Simplified Uniswap-style swap
contract LibertySwap {
    mapping(address => uint256) public liquidity;
    
    function swap(uint256 amountIn) public returns (uint256 amountOut) {
        // Swap logic here
        // Gas fee = 0! Perfect for high-frequency trading
    }
}
```

## Next Steps

1. [Network Info](/developers/network-info) - Complete network details
2. [API Reference](/developers/api-reference) - Full API documentation  
3. [Smart Contract Guide](/developers/smart-contracts) - Advanced contract development
4. [Bridge Integration](/developers/bridge) - Cross-chain asset transfers

---

**Join the Builder Community:** [Discord](https://discord.gg/libertybitcoin) | [GitHub](https://github.com/liberty-bitcoin)
