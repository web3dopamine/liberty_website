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
