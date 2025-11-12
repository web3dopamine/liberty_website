import { useState } from 'react';

export type WalletType = 'xverse' | 'unisat' | 'okx' | 'phantom' | 'blockchain' | 'metamask' | 'bitget' | 'trust';

export interface BitcoinWallet {
  address: string;
  balance: number;
  publicKey?: string;
}

export interface WalletProvider {
  name: string;
  type: WalletType;
  detected: boolean;
  connect: () => Promise<BitcoinWallet | null>;
  signPSBT?: (psbtBase64: string) => Promise<string>;
  signMessage?: (message: string, address: string) => Promise<string>;
}

export function useBitcoinWallet() {
  const [connectedWallet, setConnectedWallet] = useState<BitcoinWallet | null>(null);
  const [connectedProvider, setConnectedProvider] = useState<WalletType | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectWallets = (): WalletProvider[] => {
    const providers: WalletProvider[] = [];

    // XVerse
    if ((window as any).XverseProviders?.BitcoinProvider) {
      providers.push({
        name: 'XVerse',
        type: 'xverse',
        detected: true,
        connect: async () => {
          try {
            const xverse = (window as any).XverseProviders.BitcoinProvider;
            const accounts = await xverse.request('getAccounts');
            if (accounts && accounts.length > 0) {
              return {
                address: accounts[0].address,
                balance: 0,
                publicKey: accounts[0].publicKey,
              };
            }
            return null;
          } catch (e) {
            console.error('XVerse connection error:', e);
            return null;
          }
        },
        signPSBT: async (psbtBase64: string) => {
          const xverse = (window as any).XverseProviders.BitcoinProvider;
          const result = await xverse.request('signPsbt', {
            psbt: psbtBase64,
            broadcast: false,
          });
          return result.psbt;
        },
      });
    }

    // Unisat
    if ((window as any).unisat) {
      providers.push({
        name: 'Unisat',
        type: 'unisat',
        detected: true,
        connect: async () => {
          try {
            const unisat = (window as any).unisat;
            const accounts = await unisat.requestAccounts();
            if (accounts && accounts.length > 0) {
              const balance = await unisat.getBalance();
              return {
                address: accounts[0],
                balance: balance.total || 0,
              };
            }
            return null;
          } catch (e) {
            console.error('Unisat connection error:', e);
            return null;
          }
        },
        signPSBT: async (psbtBase64: string) => {
          const unisat = (window as any).unisat;
          const signed = await unisat.signPsbt(psbtBase64);
          return signed;
        },
        signMessage: async (message: string) => {
          const unisat = (window as any).unisat;
          return await unisat.signMessage(message);
        },
      });
    }

    // OKX
    if ((window as any).okxwallet?.bitcoin) {
      providers.push({
        name: 'OKX',
        type: 'okx',
        detected: true,
        connect: async () => {
          try {
            const okx = (window as any).okxwallet.bitcoin;
            const accounts = await okx.requestAccounts();
            if (accounts && accounts.length > 0) {
              return {
                address: accounts[0],
                balance: 0,
              };
            }
            return null;
          } catch (e) {
            console.error('OKX connection error:', e);
            return null;
          }
        },
        signPSBT: async (psbtBase64: string) => {
          const okx = (window as any).okxwallet.bitcoin;
          return await okx.signPsbt(psbtBase64);
        },
      });
    }

    return providers;
  };

  const connectWallet = async (walletType: WalletType): Promise<boolean> => {
    setIsConnecting(true);
    setError(null);

    try {
      const providers = detectWallets();
      const provider = providers.find(p => p.type === walletType);

      if (!provider) {
        setError(`${walletType} wallet not detected. Please install the wallet extension.`);
        setIsConnecting(false);
        return false;
      }

      const wallet = await provider.connect();
      
      if (wallet) {
        setConnectedWallet(wallet);
        setConnectedProvider(walletType);
        setIsConnecting(false);
        return true;
      } else {
        setError('Failed to connect wallet. Please try again.');
        setIsConnecting(false);
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      setIsConnecting(false);
      return false;
    }
  };

  const disconnectWallet = () => {
    setConnectedWallet(null);
    setConnectedProvider(null);
    setError(null);
  };

  const signPSBT = async (psbtBase64: string): Promise<string | null> => {
    if (!connectedProvider) {
      setError('No wallet connected');
      return null;
    }

    try {
      const providers = detectWallets();
      const provider = providers.find(p => p.type === connectedProvider);

      if (!provider || !provider.signPSBT) {
        setError('Wallet does not support PSBT signing');
        return null;
      }

      const signedPSBT = await provider.signPSBT(psbtBase64);
      return signedPSBT;
    } catch (err: any) {
      setError(err.message || 'Failed to sign PSBT');
      return null;
    }
  };

  const signMessage = async (message: string): Promise<string | null> => {
    if (!connectedProvider || !connectedWallet) {
      setError('No wallet connected');
      return null;
    }

    try {
      const providers = detectWallets();
      const provider = providers.find(p => p.type === connectedProvider);

      if (!provider || !provider.signMessage) {
        setError('Wallet does not support message signing');
        return null;
      }

      const signature = await provider.signMessage(message, connectedWallet.address);
      return signature;
    } catch (err: any) {
      setError(err.message || 'Failed to sign message');
      return null;
    }
  };

  return {
    connectedWallet,
    connectedProvider,
    isConnecting,
    error,
    detectWallets,
    connectWallet,
    disconnectWallet,
    signPSBT,
    signMessage,
  };
}
