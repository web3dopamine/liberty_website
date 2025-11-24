---
sidebar_position: 2
---

# Wallet Setup Guide

Learn how to set up your wallet to interact with Liberty Bitcoin's gas-free network.

## Supported Wallets

Liberty Bitcoin works with **500+ wallets** through Reown (WalletConnect) integration:

### Popular Choices
- 🦊 **MetaMask** - Most popular, browser extension
- 💎 **Trust Wallet** - Mobile-friendly
- 🔷 **Coinbase Wallet** - Easy for beginners
- 🦅 **Phantom** - Fast and user-friendly
- 🏦 **Binance Wallet** - Built-in exchange features
- 🔒 **Ledger** - Hardware wallet security
- 🛡️ **Trezor** - Hardware wallet security

## MetaMask Setup (Recommended)

### Step 1: Install MetaMask

1. Visit [metamask.io](https://metamask.io)
2. Download for your browser (Chrome, Firefox, Brave, Edge)
3. Create a new wallet or import existing
4. **Save your seed phrase securely!**

### Step 2: Add Liberty Network

#### Automatic (Recommended)
1. Visit [Liberty Bitcoin](https://libertybitcoin.com)
2. Click **"Connect Wallet"**
3. Select **MetaMask**
4. Click **"Add Network"** when prompted

#### Manual Configuration

Click **Networks** → **Add Network** → **Add a network manually**

Enter these details:

```
Network Name: SKALE Base Sepolia (Liberty Testnet)
RPC URL: https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha
Chain ID: 324705682
Currency Symbol: Credits
Block Explorer: https://base-sepolia-testnet-explorer.skalenodes.com/
```

### Step 3: Get Test Tokens

1. Visit [SKALE Faucet](https://base-sepolia-faucet.skale.space)
2. Enter your Liberty wallet address
3. Request Credits (gas-free token for testnet)
4. Wait a few seconds - tokens arrive instantly!

## Trust Wallet Setup

### Mobile Setup

1. Download **Trust Wallet** from App Store or Google Play
2. Create new wallet and backup seed phrase
3. Tap **Settings** → **Networks**
4. Tap **+** to add custom network

Enter Liberty Network details:

```
Network Name: Liberty Bitcoin
RPC URL: https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha
Chain ID: 324705682
Symbol: Credits
Block Explorer: https://base-sepolia-testnet-explorer.skalenodes.com/
```

5. Save and switch to Liberty network

## WalletConnect Integration

For wallets without built-in custom network support, use **WalletConnect**:

1. Visit [Liberty Bitcoin](https://libertybitcoin.com)
2. Click **"Connect Wallet"**
3. Select **"WalletConnect"**
4. Scan QR code with your mobile wallet
5. Liberty network is added automatically!

## Hardware Wallet Setup

### Ledger

1. Connect Ledger to computer
2. Open **Ethereum app** on Ledger
3. In MetaMask: **Connect Hardware Wallet**
4. Follow MetaMask setup steps above
5. Add Liberty network manually

### Trezor

1. Connect Trezor to computer
2. Use with MetaMask: **Connect Hardware Wallet** → **Trezor**
3. Add Liberty network configuration
4. Approve connection on Trezor device

## Verification

### Test Your Setup

1. Switch to Liberty network in wallet
2. Copy your wallet address
3. Visit [Block Explorer](https://base-sepolia-testnet-explorer.skalenodes.com/)
4. Paste your address - you should see 0 balance (or Credits if you used faucet)

### Make a Test Transaction

Send yourself 0 Credits to test:

1. Click **Send** in wallet
2. Enter your own address as recipient
3. Amount: **0 Credits**
4. Send - transaction is **instant and free!**

## Security Best Practices

### ✅ Do This
- Store seed phrase offline (paper, metal backup)
- Use hardware wallet for large amounts
- Enable 2FA on exchanges
- Verify URLs before connecting wallet
- Keep wallet software updated

### ❌ Never Do This
- Share your seed phrase with anyone
- Take screenshots of seed phrase
- Store seed phrase in cloud/email
- Connect to suspicious websites
- Use the same wallet for testing and mainnet funds

## Common Issues

### Can't See Liberty Network
- Make sure Chain ID is exactly: **324705682**
- RPC URL must start with `https://`
- Try removing and re-adding network

### Transaction Stuck/Pending
- Liberty has instant finality - if it's pending, check RPC connection
- Restart wallet
- Check [network status](https://base-sepolia-testnet-explorer.skalenodes.com/)

### Wrong Network Selected
- Click network dropdown in wallet
- Select **SKALE Base Sepolia** or **Liberty Bitcoin**
- Refresh page

## Multiple Wallet Strategy

For best security:

| Wallet Type | Purpose | Amount |
|-------------|---------|--------|
| **Hardware Wallet** | Main holdings | Large amounts |
| **MetaMask (Daily)** | Regular usage | Medium amounts |
| **Mobile Wallet** | Quick access | Small amounts |
| **Testnet Wallet** | Development | Test only |

---

:::tip Zero Gas Fees
All transactions on Liberty are gas-free! You never pay transaction fees. ⛽
:::

**Need help?** Join our [Telegram](https://t.me/libertybitcoin) support group
