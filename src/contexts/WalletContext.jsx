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

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectMetaMask = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask is not installed! Please install MetaMask to connect your wallet.');
      return false;
    }

    setIsConnecting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setProvider(provider);
      setSigner(signer);
      setAccount(address);
      
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletType', 'metamask');
      
      console.log('✅ MetaMask connected:', address);
      return true;
    } catch (error) {
      console.error('❌ MetaMask connection error:', error);
      if (error.code === 4001) {
        alert('Connection request rejected. Please approve the connection request in MetaMask.');
      }
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const connectPhantom = async () => {
    if (typeof window.phantom?.ethereum === 'undefined') {
      alert('Phantom is not installed! Please install Phantom wallet to connect.');
      window.open('https://phantom.app/', '_blank');
      return false;
    }

    setIsConnecting(true);
    try {
      const provider = new ethers.BrowserProvider(window.phantom.ethereum);
      await provider.send("eth_requestAccounts", []);
      
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setProvider(provider);
      setSigner(signer);
      setAccount(address);
      
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletType', 'phantom');
      
      console.log('✅ Phantom connected:', address);
      return true;
    } catch (error) {
      console.error('❌ Phantom connection error:', error);
      if (error.code === 4001) {
        alert('Connection request rejected. Please approve the connection request in Phantom.');
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
    localStorage.removeItem('walletConnected');
    console.log('🔌 Wallet disconnected');
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 5)}...${address.slice(-5)}`;
  };

  useEffect(() => {
    const walletType = localStorage.getItem('walletType');
    const walletProvider = walletType === 'phantom' ? window.phantom?.ethereum : window.ethereum;

    if (walletProvider) {
      walletProvider.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      });

      walletProvider.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (walletProvider) {
        walletProvider.removeAllListeners();
      }
    };
  }, []);

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
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
