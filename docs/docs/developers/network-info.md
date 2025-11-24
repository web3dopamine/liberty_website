---
sidebar_position: 2
---

# Network Information

Complete technical details for connecting to and building on Liberty Bitcoin.

## Testnet (Current)

### Network Parameters

| Parameter | Value |
|-----------|-------|
| **Network Name** | SKALE Base Sepolia |
| **Chain ID** | 324705682 |
| **Chain ID (Hex)** | 0x135A9D92 |
| **RPC URL** | https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha |
| **WebSocket URL** | wss://base-sepolia-testnet.skalenodes.com/v1/ws/jubilant-horrible-ancha |
| **Explorer** | https://base-sepolia-testnet-explorer.skalenodes.com/ |
| **Native Token** | Credits |
| **Token Decimals** | 18 |
| **Gas Price** | 0 (FREE) |
| **Block Time** | < 2 seconds |
| **Finality** | Instant (Single Slot) |

### Faucet
- **URL**: https://base-sepolia-faucet.skale.space
- **Limit**: 1 request per address per day
- **Amount**: 0.1 Credits

## Mainnet (Launching Feb 10, 2026)

**Network details will be announced closer to launch date.**

Expected parameters:
- Chain ID: TBA
- RPC URL: TBA
- Explorer: TBA
- Native Token: LBTY

## Network Limits

### Block & Transaction Limits

| Parameter | Value | Comparison to Ethereum |
|-----------|-------|----------------------|
| **Block Gas Limit** | 268,435,455 | ~100x higher |
| **Contract Size Limit** | 64kb | ~2.7x higher |
| **Transaction Throughput** | 1000+ TPS | ~70x higher |
| **Block Time** | &lt;2 seconds | ~6x faster |

### Smart Contract Limits

```
Max Contract Size: 64kb (65,536 bytes)
Max Function Parameters: 16
Max Stack Depth: 1024
Max Memory: Unlimited (gas-free!)
```

## Supported Tokens (Testnet)

Bridged tokens from Base Sepolia:

| Token | Symbol | Decimals | Base Sepolia Address | SKALE Address |
|-------|--------|----------|---------------------|---------------|
| **SKALE** | SKL | 18 | 0xC20...2cF | 0xaf2...57b |
| **USD Coin** | USDC.e | 6 | 0x036...F7e | 0x2e0...0bD |
| **Tether USD** | USDT | 6 | 0x0ed...4a8 | 0x3ca...0bf |
| **Wrapped BTC** | WBTC | 8 | 0xC38...8Bc | 0x451...e87 |
| **Wrapped Ether** | WETH | 6 | 0x420...006 | 0xf94...fc0 |
| **ETH (ERC-20)** | ETHC | 6 | Native ETH | 0xD2A...000 |

:::info ETH vs ETHC
When bridging native ETH from Base to Liberty, it becomes ETHC (ERC-20). Display as "ETH" in your UI for better UX.
:::

## Contract Addresses

### Core Contracts

| Contract | Address | Purpose |
|----------|---------|---------|
| **Multicall3** | 0xcA11bde05977b3631167028862bE2a173976CA11 | Batch calls |
| **CREATE2 Factory** | 0x4e59b44847b379578588920cA78FbF26c0B4956C | Deterministic deploys |
| **Singleton Factory** | 0xce0042B868300000d44A59004Da54A005ffdcf9f | EIP-2470 |

### Liberty Contracts (Mainnet Only)

| Contract | Address | Purpose |
|----------|---------|---------|
| **LBTY Token** | TBA | Native Liberty token |
| **Token Auction** | TBA | Auction smart contract |
| **Ownership Registry** | TBA | BTC address linking |
| **Bridge** | TBA | Cross-chain transfers |

## RPC Methods

### Standard JSON-RPC Methods

Liberty supports all standard Ethereum JSON-RPC methods:

```javascript
// Get latest block
eth_blockNumber

// Get balance
eth_getBalance

// Send transaction
eth_sendTransaction

// Call contract
eth_call

// Get transaction receipt
eth_getTransactionReceipt

// Estimate gas (always returns 0!)
eth_estimateGas
```

### SKALE-Specific Methods

```javascript
// Get node info
skale_getInfo

// Get consensus state
skale_getConsensusState

// Get file storage info (if enabled)
skale_getFileStorageInfo
```

## Network Features

### 1. Zero Gas Fees

```javascript
// No gas estimation needed!
const tx = await contract.transfer(recipient, amount);
// Cost: FREE ⛽
```

### 2. Native VRF (Randomness)

```solidity
// Built-in verifiable random numbers
contract LotteryGame {
    function getRandomNumber() public view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.difficulty,
            msg.sender
        )));
    }
}
```

### 3. Native Oracle

```solidity
// Access price feeds natively
interface IOracle {
    function getPrice(string memory symbol) external view returns (uint256);
}
```

### 4. File Storage

```javascript
// Store files on-chain (coming soon)
await skale.uploadFile(fileData, metadata);
```

## Bridge Integration

### Supported Bridges

| Bridge | From/To | Assets |
|--------|---------|--------|
| **SKALE Native Bridge** | Base Sepolia ↔ Liberty | ETH, SKL, USDC, USDT, WBTC |
| **Liberty Bridge** | Bitcoin ↔ Liberty | BTC → LBTY (mainnet only) |

### Bridging Assets

```javascript
// Example: Bridge USDC from Base to Liberty
import { bridgeToken } from '@skale/bridge';

const tx = await bridgeToken({
  from: 'base-sepolia',
  to: 'liberty',
  token: 'USDC',
  amount: ethers.parseUnits('100', 6),
  recipient: '0x...'
});
```

## Network Status

### Health Check

```bash
# Check if network is operational
curl https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

Expected response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x..." // Latest block number in hex
}
```

### Monitor Performance

- **Block Explorer**: https://base-sepolia-testnet-explorer.skalenodes.com/
- **RPC Status**: Check response time with `eth_blockNumber`
- **Transaction Speed**: Monitor confirmation times

## Development vs Production

| Environment | Network | Purpose |
|-------------|---------|---------|
| **Development** | SKALE Base Sepolia (Testnet) | Testing, development |
| **Staging** | SKALE Base Sepolia (Testnet) | Pre-production testing |
| **Production** | Liberty Mainnet | Live applications |

:::warning Testnet Limitations
- Testnet can be reset
- Testnet tokens have no value
- Use mainnet for production apps after Feb 10, 2026
:::

## Community Resources

- **Discord**: https://discord.gg/libertybitcoin
- **Telegram**: https://t.me/libertybitcoin
- **GitHub**: https://github.com/liberty-bitcoin
- **Twitter**: https://twitter.com/libertybitcoin

---

**Need help?** Join our [Developer Discord](https://discord.gg/libertybitcoin)
