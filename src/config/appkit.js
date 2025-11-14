import { createAppKit } from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { mainnet, arbitrum, polygon, base, optimism } from '@reown/appkit/networks';

const projectId = process.env.REOWN_PROJECT_ID;

if (!projectId) {
  console.warn('REOWN_PROJECT_ID is not set. WalletConnect functionality will be limited.');
}

const metadata = {
  name: 'Liberty Bitcoin',
  description: 'The next chapter of Bitcoin - Scalable, programmable, and gas-free L2 solution',
  url: 'https://libertybitcoin.com',
  icons: ['https://libertybitcoin.com/logo.png']
};

const networks = [mainnet, arbitrum, polygon, base, optimism];

const ethersAdapter = new EthersAdapter();

if (projectId) {
  createAppKit({
    adapters: [ethersAdapter],
    networks,
    projectId,
    metadata,
    featuredWalletIds: [
      'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
      'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393', // Phantom
      '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trust Wallet
      'c03dfee351b6fcc421b4494ea33b9d4b92a984f87aa76d1663bb28705e95034a'  // Binance Wallet (WalletConnect)
    ],
    features: {
      analytics: true,
      email: false,
      socials: false
    },
    themeMode: 'dark',
    themeVariables: {
      '--w3m-accent': '#2D5F5D',
      '--w3m-border-radius-master': '2px'
    }
  });
}

export { projectId };
