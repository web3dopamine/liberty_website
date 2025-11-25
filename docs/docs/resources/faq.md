---
sidebar_position: 1
---

# Frequently Asked Questions

Find answers to common questions about Liberty.

## General

### What is Liberty?

Liberty is a gas-free EVM-compatible Layer 2 blockchain built on SKALE's BASE infrastructure. It offers:
- Zero gas fees for all transactions
- Instant finality (< 2 seconds)
- 1:10 token claim ratio for BTC holders
- Full Ethereum compatibility

### When is the mainnet launch?

**February 10, 2026 at 12:00 AM UTC**

### What makes Liberty different from other L2s?

1. **Zero Gas Fees** - Every transaction is completely free
2. **Bitcoin Integration** - 1:10 token claim for BTC holders
3. **Instant Finality** - Sub-2-second transaction confirmation
4. **High Performance** - 1000+ TPS with 268M gas limit per block

## Token Economics

### What is the total supply of LBTY?

Total supply details will be announced before mainnet launch. Current allocation:
- 5-10% available in public auction
- Portion reserved for BTC holders (1:10 ratio)
- Team & development fund
- Community & ecosystem grants

### What is the 1:10 claim ratio?

For every 1 BTC you hold, you can claim 10 LBTY tokens.

**Example:**
- You hold 0.5 BTC → Claim 5 LBTY
- You hold 2 BTC → Claim 20 LBTY

### What's the minimum BTC needed to claim?

**0.003 BTC minimum**

This equals 0.03 LBTY tokens at the 1:10 ratio.

### When can I claim my LBTY tokens?

**February 10, 2026 at 12:00 AM UTC**

You must link your Bitcoin address to your Liberty wallet before the launch date.

## Token Claiming

### How do I prove I own Bitcoin?

Two methods:

**Method 1: Message Signature** (Recommended)
1. Sign a message with your Bitcoin wallet
2. No transaction required
3. Works with most wallets

**Method 2: PSBT (Partially Signed Bitcoin Transaction)**
1. Create a self-send transaction
2. Sign it (don't broadcast!)
3. Submit for verification

### Do I need to send my Bitcoin anywhere?

**NO!** You only prove ownership through signing. Your Bitcoin stays in your wallet.

### Can I claim from multiple Bitcoin addresses?

Yes! Link each Bitcoin address separately to the same Liberty wallet. Each address can claim based on its balance.

### What if my BTC is on an exchange?

You **cannot claim** if your BTC is on an exchange. You must:
1. Withdraw BTC to a personal wallet
2. Control the private keys
3. Then verify ownership

## Token Auction

### Who can participate in the auction?

Anyone with:
- EVM-compatible wallet (MetaMask, Trust Wallet, etc.)
- USDT on Ethereum mainnet
- Completed KYC verification

### What are the bid limits?

- **Minimum**: $1,000 USDT
- **Maximum**: $100,000 USDT per wallet

### Do verified BTC holders get priority?

Yes! There are 3 priority tiers:
1. **Tier 1**: Verified BTC holders (highest priority)
2. **Tier 2**: Newsletter subscribers
3. **Tier 3**: General public

### What if the auction is oversubscribed?

Tokens are allocated proportionally:
```
Your Allocation = (Your Bid / Total Bids) × Available Tokens
```

Excess USDT is automatically refunded.

### Are there lock-up discounts?

Yes:
- 6 months lock → 5% discount
- 12 months lock → 10% discount
- 24 months lock → 15% discount

## Technical

### What is the chain ID?

**Testnet**: 324705682 (0x135A9D92 in hex)  
**Mainnet**: TBA

### What are the RPC endpoints?

**Testnet**:
```
https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha
```

**Mainnet**: TBA (Feb 2026)

### Is Liberty EVM-compatible?

**100% Yes!** Deploy your existing Solidity contracts without modification.

### What wallets are supported?

500+ wallets including:
- MetaMask
- Trust Wallet
- Coinbase Wallet
- Phantom
- Binance Wallet
- Ledger
- Trezor
- Any WalletConnect-compatible wallet

### How do I get testnet tokens?

Visit the [SKALE Faucet](https://base-sepolia-faucet.skale.space) and request Credits.

### Are transactions really free?

**YES!** Zero gas fees. Every transaction is free.

Example:
```
Ethereum: 0.01 ETH gas fee (~$30)
Liberty: 0 gas fee ($0)
```

## Development

### Can I deploy my existing Ethereum contracts?

Yes! Liberty is fully EVM-compatible. Your Solidity contracts work without modification.

### What development tools are supported?

- Hardhat ✅
- Foundry ✅
- Remix IDE ✅
- Truffle ✅
- Ethers.js ✅
- Web3.js ✅
- Wagmi ✅

### What's the block gas limit?

**268,435,455** - About 100x higher than Ethereum's ~30M limit.

### What's the contract size limit?

**64kb** - Larger than Ethereum's 24kb limit.

### How fast are transactions?

**< 2 seconds** - Instant finality with single-slot finality.

## Security

### Is my Bitcoin at risk when claiming?

**NO!** You only prove ownership through signatures. Your Bitcoin never leaves your wallet.

### What if I lose access to my Liberty wallet?

If you lose access after linking but before claiming:
- Contact support BEFORE launch date
- Provide proof of ownership
- Re-link to a new wallet

After claiming, your LBTY tokens are on-chain. Use standard wallet recovery methods.

### Is the smart contract audited?

Yes! All Liberty smart contracts will be audited by reputable firms before mainnet launch. Reports will be published publicly.

### Can transactions be reversed?

No. Liberty has instant finality - confirmed transactions are final.

## Troubleshooting

### "Signature Invalid" error

- Copy the EXACT message (including capitalization)
- Sign with the correct Bitcoin address
- Try a different Bitcoin wallet

### Can't add Liberty network to MetaMask

- Verify Chain ID is **exactly** 324705682
- RPC URL must start with `https://`
- Try removing and re-adding the network

### Transaction stuck/pending

Liberty has instant finality. If a transaction is stuck:
- Check RPC connection
- Restart wallet
- Verify network status on explorer

### Wallet won't connect

- Clear browser cache
- Try incognito/private mode
- Use a different browser
- Update wallet extension

## Ecosystem

### What can I build on Liberty?

Anything you can build on Ethereum:
- DeFi protocols (DEXs, lending, etc.)
- NFT marketplaces
- Gaming platforms
- Social media dApps
- DAO governance tools
- And more!

**Advantage**: Zero gas fees mean micro-transactions and high-frequency operations are viable.

### Are there grants for developers?

Yes! Visit the [Grant Program](https://libertybitcoin.com/#developers) to apply for:
- DeFi projects
- Infrastructure tools
- Developer tooling
- AI/ML integrations

### How do I get listed on Liberty?

For tokens:
1. Deploy your ERC-20 contract
2. Add liquidity on DEXs
3. Submit to aggregators (CoinGecko, CoinMarketCap)

For dApps:
1. Build and deploy
2. Submit to Liberty dApp directory (coming soon)
3. Share with community

## Support

### Where can I get help?

- **Discord**: https://discord.gg/libertybitcoin
- **Telegram**: https://t.me/libertybitcoin
- **Twitter**: https://twitter.com/libertybitcoin
- **Email**: support@libertybitcoin.com

### How do I report a bug?

1. **Security bugs**: Email security@libertybitcoin.com
2. **Other bugs**: Create issue on [GitHub](https://github.com/liberty-bitcoin)
3. **Questions**: Ask in Discord/Telegram

### Is there a bug bounty program?

Yes! Details will be announced before mainnet launch. Rewards for:
- Critical vulnerabilities
- Smart contract bugs
- Protocol exploits

---

**Still have questions?** Join our [Discord](https://discord.gg/libertybitcoin) or [Telegram](https://t.me/libertybitcoin)
