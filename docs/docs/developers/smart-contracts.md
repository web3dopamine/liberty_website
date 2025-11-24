---
sidebar_position: 3
---

# Smart Contract Development

Learn how to build and deploy smart contracts on Liberty Bitcoin.

## Contract Development

### Supported Solidity Versions

```solidity
// Recommended
pragma solidity ^0.8.20;

// Also supported
pragma solidity >=0.7.0 <0.9.0;
```

### Key Advantages on Liberty

1. **Zero Gas Fees** - Deploy and interact for free
2. **Larger Contracts** - 64kb limit (vs 24kb on Ethereum)
3. **Higher Gas Limit** - 268M per block
4. **Instant Finality** - No need to wait for confirmations

## Deployment Guide

### Using Hardhat

**1. Install Hardhat**

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
```

**2. Configure `hardhat.config.js`**

```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    liberty: {
      url: "https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha",
      chainId: 324705682,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 0 // Zero gas!
    }
  },
  etherscan: {
    apiKey: {
      liberty: "no-api-key-needed"
    },
    customChains: [
      {
        network: "liberty",
        chainId: 324705682,
        urls: {
          apiURL: "https://base-sepolia-testnet-explorer.skalenodes.com/api",
          browserURL: "https://base-sepolia-testnet-explorer.skalenodes.com"
        }
      }
    ]
  }
};
```

**3. Create Deploy Script**

```javascript
// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const MyContract = await hre.ethers.getContractFactory("MyContract");
  const contract = await MyContract.deploy();
  
  await contract.waitForDeployment();
  
  console.log("Contract deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

**4. Deploy**

```bash
npx hardhat run scripts/deploy.js --network liberty
```

### Using Foundry

**1. Initialize Project**

```bash
forge init my-project
cd my-project
```

**2. Configure `foundry.toml`**

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]

[rpc_endpoints]
liberty = "https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha"
```

**3. Deploy with Forge**

```bash
forge create --rpc-url liberty \
  --private-key $PRIVATE_KEY \
  src/MyContract.sol:MyContract
```

## Example Contracts

### ERC-20 Token

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LibertyToken is ERC20, Ownable {
    constructor(uint256 initialSupply) ERC20("Liberty Token", "LBT") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
```

### NFT Collection

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LibertyNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    
    constructor() ERC721("Liberty NFT", "LNFT") Ownable(msg.sender) {}
    
    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
```

### Simple DEX

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SimpleDEX {
    mapping(address => mapping(address => uint256)) public liquidity;
    
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountA,
        uint256 amountB
    ) external {
        IERC20(tokenA).transferFrom(msg.sender, address(this), amountA);
        IERC20(tokenB).transferFrom(msg.sender, address(this), amountB);
        
        liquidity[tokenA][tokenB] += amountA;
        liquidity[tokenB][tokenA] += amountB;
    }
    
    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external returns (uint256 amountOut) {
        require(liquidity[tokenIn][tokenOut] > 0, "No liquidity");
        
        // Simple constant product formula
        uint256 reserveIn = liquidity[tokenIn][tokenOut];
        uint256 reserveOut = liquidity[tokenOut][tokenIn];
        
        amountOut = (amountIn * reserveOut) / (reserveIn + amountIn);
        
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenOut).transfer(msg.sender, amountOut);
        
        liquidity[tokenIn][tokenOut] += amountIn;
        liquidity[tokenOut][tokenIn] -= amountOut;
    }
}
```

## Best Practices

### Gas Optimization (Not Critical but Good Practice)

Even though gas is free on Liberty, optimize for:
- **Storage efficiency** - Reduces state bloat
- **Computation efficiency** - Faster execution
- **Code cleanliness** - Better maintainability

```solidity
// ❌ Bad: Repeated storage reads
function badExample() external {
    uint256 value = storage Var;
    doSomething(storageVar);
    doSomethingElse(storageVar);
}

// ✅ Good: Cache storage read
function goodExample() external {
    uint256 cached = storageVar;
    doSomething(cached);
    doSomethingElse(cached);
}
```

### Security

```solidity
// Use OpenZeppelin contracts
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract SecureContract is ReentrancyGuard, Pausable {
    function withdraw() external nonReentrant whenNotPaused {
        // Safe withdrawal logic
    }
}
```

### Upgradability

```solidity
// Use proxy pattern for upgradable contracts
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

contract MyUpgradeableContract {
    // Implementation logic
}
```

## Verification

### Verify on Block Explorer

```bash
npx hardhat verify --network liberty \
  DEPLOYED_CONTRACT_ADDRESS \
  "Constructor Arg 1" "Constructor Arg 2"
```

## Testing

### Hardhat Tests

```javascript
const { expect } = require("chai");

describe("MyContract", function () {
  it("Should deploy correctly", async function () {
    const MyContract = await ethers.getContractFactory("MyContract");
    const contract = await MyContract.deploy();
    await contract.waitForDeployment();
    
    expect(await contract.name()).to.equal("Expected Name");
  });
  
  it("Should execute functions instantly", async function () {
    const tx = await contract.someFunction();
    await tx.wait();
    // Instant finality - no need to wait multiple blocks!
  });
});
```

### Run Tests

```bash
npx hardhat test --network liberty
```

## Advanced Features

### Native VRF (Random Numbers)

```solidity
contract LotteryGame {
    function drawWinner() public returns (uint256) {
        // Use blockhash for randomness
        return uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender
        )));
    }
}
```

### Oracle Integration

```solidity
interface IPriceOracle {
    function getPrice(string memory symbol) external view returns (uint256);
}

contract PriceConsumer {
    IPriceOracle public oracle;
    
    constructor(address _oracle) {
        oracle = IPriceOracle(_oracle);
    }
    
    function getBTCPrice() public view returns (uint256) {
        return oracle.getPrice("BTC/USD");
    }
}
```

## Common Patterns

### Token Sale

```solidity
contract TokenSale {
    IERC20 public token;
    uint256 public price; // tokens per ETH
    
    constructor(address _token, uint256 _price) {
        token = IERC20(_token);
        price = _price;
    }
    
    receive() external payable {
        uint256 amount = msg.value * price;
        token.transfer(msg.sender, amount);
    }
}
```

### Staking

```solidity
contract Staking {
    IERC20 public stakingToken;
    mapping(address => uint256) public stakes;
    mapping(address => uint256) public rewards;
    
    function stake(uint256 amount) external {
        stakingToken.transferFrom(msg.sender, address(this), amount);
        stakes[msg.sender] += amount;
    }
    
    function withdraw() external {
        uint256 amount = stakes[msg.sender];
        stakes[msg.sender] = 0;
        stakingToken.transfer(msg.sender, amount + rewards[msg.sender]);
        rewards[msg.sender] = 0;
    }
}
```

## Resources

- **OpenZeppelin Contracts**: https://docs.openzeppelin.com/contracts
- **Solidity Docs**: https://docs.soliditylang.org
- **Hardhat**: https://hardhat.org/docs
- **Foundry**: https://book.getfoundry.sh

---

**Need help?** Join the [Developer Discord](https://discord.gg/libertybitcoin)
