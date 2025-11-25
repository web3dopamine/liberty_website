import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Claim Your LBTY Tokens',
    icon: '🪙',
    description: (
      <>
        Bitcoin holders can claim LBTY tokens at a 1:10 ratio. Learn how to verify 
        your BTC ownership and receive your tokens on Liberty's gas-free network.
      </>
    ),
  },
  {
    title: 'Gas-Free Transactions',
    icon: '⚡',
    description: (
      <>
        Built on SKALE technology, Liberty offers zero gas fees for all transactions. 
        Deploy smart contracts and interact with dApps without worrying about costs.
      </>
    ),
  },
  {
    title: 'Build on Liberty',
    icon: '🛠️',
    description: (
      <>
        Full EVM compatibility means you can deploy existing Ethereum smart contracts 
        with no modifications. Get started with familiar tools like Hardhat and Foundry.
      </>
    ),
  },
  {
    title: 'Token Auction',
    icon: '🎯',
    description: (
      <>
        Participate in our fair launch token auction. Learn about the English auction 
        mechanics, lock-up discounts, and how to maximize your allocation.
      </>
    ),
  },
  {
    title: 'Wallet Integration',
    icon: '👛',
    description: (
      <>
        Connect with 500+ wallets including MetaMask, Trust Wallet, and Binance Wallet 
        via WalletConnect. Full Bitcoin wallet support for PSBT signing.
      </>
    ),
  },
  {
    title: 'Developer Grants',
    icon: '💰',
    description: (
      <>
        Apply for funding through our Developer Grants Program. Build DeFi, infrastructure, 
        AI/ML, and developer tools on the Liberty network.
      </>
    ),
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>{icon}</div>
        <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
        <p className={styles.featureDescription}>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            Everything You Need
          </Heading>
          <p className={styles.sectionSubtitle}>
            Comprehensive documentation to help you get started with Liberty Bitcoin
          </p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
