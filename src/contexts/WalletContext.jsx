import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

// Helper to find the real MetaMask provider when multiple wallets compete
function getMetaMaskProvider() {
  // EIP-5749: window.ethereum.providers array when multiple wallets installed
  if (window.ethereum?.providers?.length) {
    return window.ethereum.providers.find((p) => p.isMetaMask && !p.isPhantom) || null;
  }
  // Single provider that is MetaMask (not Phantom pretending to be MetaMask)
  if (window.ethereum?.isMetaMask && !window.ethereum?.isPhantom) {
    return window.ethereum;
  }
  return null;
}

// Helper to find Phantom's EVM provider
function getPhantomProvider() {
  // Phantom always exposes itself at window.phantom.ethereum
  return window.phantom?.ethereum || null;
}

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletType, setWalletType] = useState(null);

  const connectMetaMask = async () => {
    let metamaskProvider = getMetaMaskProvider();

    if (!metamaskProvider) {
      // MetaMask is installed but Phantom has hijacked window.ethereum.
      // Try requesting MetaMask directly via its providerMap or prompt user.
      const hasMetaMaskExtension = document.querySelector('[data-extension-id]') ||
        navigator.userAgent.includes('MetaMask');

      if (!hasMetaMaskExtension) {
        window.open('https://metamask.io/download/', '_blank');
        return false;
      }

      // Fallback: try window.ethereum anyway — MetaMask might respond
      // even if Phantom is default, since clicking "MetaMask" signals intent
      if (window.ethereum) {
        metamaskProvider = window.ethereum;
      } else {
        alert('MetaMask not detected. If installed, try disabling "Default wallet" in Phantom settings, then refresh.');
        return false;
      }
    }

    setIsConnecting(true);
    try {
      // Request MetaMask specifically via wallet_requestPermissions
      // This forces the MetaMask popup even when Phantom intercepts
      await metamaskProvider.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      });

      const provider = new ethers.BrowserProvider(metamaskProvider);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setProvider(provider);
      setSigner(signer);
      setAccount(address);
      setWalletType('metamask');

      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletType', 'metamask');

      return true;
    } catch (error) {
      console.error('MetaMask connection error:', error);
      if (error.code === 4001) {
        // User rejected
      } else {
        alert('Failed to connect MetaMask. Try disabling "Default wallet" in Phantom settings, then refresh.');
      }
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const connectPhantom = async () => {
    const phantomProvider = getPhantomProvider();
    if (!phantomProvider) {
      window.open('https://phantom.app/', '_blank');
      return false;
    }

    setIsConnecting(true);
    try {
      const provider = new ethers.BrowserProvider(phantomProvider);
      await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setProvider(provider);
      setSigner(signer);
      setAccount(address);
      setWalletType('phantom');

      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletType', 'phantom');

      return true;
    } catch (error) {
      console.error('Phantom connection error:', error);
      if (error.code === 4001) {
        // User rejected
      }
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setProvider(null);
    setSigner(null);
    setWalletType(null);
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletType');
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 5)}...${address.slice(-5)}`;
  };

  // Auto-reconnect on page load
  useEffect(() => {
    const savedWalletType = localStorage.getItem('walletType');
    const wasConnected = localStorage.getItem('walletConnected');
    if (!wasConnected || !savedWalletType) return;

    const reconnect = async () => {
      let rawProvider;
      if (savedWalletType === 'phantom') {
        rawProvider = getPhantomProvider();
      } else if (savedWalletType === 'metamask') {
        rawProvider = getMetaMaskProvider() || window.ethereum;
      }
      if (!rawProvider) return;

      try {
        const accounts = await rawProvider.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const provider = new ethers.BrowserProvider(rawProvider);
          const signer = await provider.getSigner();
          setProvider(provider);
          setSigner(signer);
          setAccount(accounts[0]);
          setWalletType(savedWalletType);
        }
      } catch (e) {
        console.error('Auto-reconnect failed:', e);
      }
    };

    reconnect();
  }, []);

  // Listen for account/chain changes
  useEffect(() => {
    let rawProvider;
    if (walletType === 'phantom') {
      rawProvider = getPhantomProvider();
    } else if (walletType === 'metamask') {
      rawProvider = getMetaMaskProvider() || window.ethereum;
    }
    if (!rawProvider) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    rawProvider.on('accountsChanged', handleAccountsChanged);
    rawProvider.on('chainChanged', handleChainChanged);

    return () => {
      rawProvider.removeListener('accountsChanged', handleAccountsChanged);
      rawProvider.removeListener('chainChanged', handleChainChanged);
    };
  }, [walletType]);

  const value = {
    account,
    provider,
    signer,
    isConnecting,
    connectMetaMask,
    connectPhantom,
    disconnectWallet,
    truncateAddress,
    isConnected: !!account,
    walletType,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
