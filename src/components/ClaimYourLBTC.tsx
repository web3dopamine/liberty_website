import {
  Armour,
  Bitget,
  Blockchain,
  Lock2,
  MetaMask,
  OKX,
  Phantom,
  Refresh,
  Refresh2,
  Trust,
  Unisat,
  WalletGreen,
  XVerse,
// @ts-ignore - Image imports have implicit any type
} from "../assets/images";
import { motion } from "motion/react";
import { useBitcoinWallet, type WalletType } from "../hooks/useBitcoinWallet";
import { useState, useEffect } from "react";

const ClaimYourLBTC = () => {
  const {
    connectedWallet,
    connectedProvider,
    error: walletError,
    detectWallets,
    connectWallet,
  } = useBitcoinWallet();

  const [availableWallets, setAvailableWallets] = useState<any[]>([]);
  const [claimStatus, setClaimStatus] = useState<string>("0 available");
  const [eligibilityData, setEligibilityData] = useState<any>(null);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);

  useEffect(() => {
    const wallets = detectWallets();
    setAvailableWallets(wallets);
  }, []);

  useEffect(() => {
    if (connectedWallet && connectedWallet.address) {
      checkEligibility(connectedWallet.address);
    }
  }, [connectedWallet]);

  const checkEligibility = async (address: string) => {
    setIsCheckingEligibility(true);
    try {
      const response = await fetch('/api/check-eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      
      const data = await response.json();
      setEligibilityData(data);
      
      if (data.eligible) {
        setClaimStatus(`${data.lbtcClaimAmount.toFixed(2)} LBTY available`);
      } else {
        setClaimStatus('Not eligible');
      }
    } catch (error) {
      console.error('Eligibility check failed:', error);
      setClaimStatus('Error checking eligibility');
    } finally {
      setIsCheckingEligibility(false);
    }
  };

  const handleWalletConnect = async (walletType: WalletType) => {
    const success = await connectWallet(walletType);
    if (!success && walletError) {
      alert(walletError);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const isWalletDetected = (walletType: WalletType): boolean => {
    return availableWallets.some(w => w.type === walletType);
  };

  const getWalletStatus = (walletType: WalletType): string => {
    if (connectedProvider === walletType) {
      return "Connected";
    }
    return isWalletDetected(walletType) ? "Detected" : "Not Detected";
  };

  const getWalletStatusColor = (walletType: WalletType): string => {
    if (connectedProvider === walletType) {
      return "text-green-600";
    }
    return isWalletDetected(walletType) ? "text-blue-600" : "text-[#FF6900]";
  };

  return (
    <div id="claim-tokens" className="text-center py-16 md:py-24 lg:py-30 flex flex-col items-center bg-[#ffffff] px-4">
      <div className="flex flex-row gap-1 border rounded-3xl border-[#4A9390]/20 bg-[#2D5F5D]/5 px-4 py-2">
        <img src={WalletGreen} className="w-3" />
        <div className="text-[#2D5F5D] text-xs md:text-sm lg:text-[14px]">Token Claim</div>
      </div>
      <div className="text-4xl md:text-6xl lg:text-[96px] tracking-tight leading-tight md:leading-30 mt-6 bg-linear-to-t from-[#000000] via-[#000000]/90 to-[#000000]/60 text-transparent bg-clip-text">
        Claim your LBTY. <br />
        <span className="bg-linear-to-t from-[#2D5F5D] to-[#4A9390] text-transparent bg-clip-text">It's seamless.</span>
      </div>
      <div className="text-[#4A5565] text-lg md:text-xl lg:text-[24px] mt-6 md:mt-8 px-4">
        Connect your Bitcoin wallet to verify ownership and claim your tokens.
      </div>

      {connectedWallet && (
        <div className="mt-6 px-6 py-3 bg-green-50 border border-green-200 rounded-2xl">
          <div className="text-[#2D5F5D] text-[14px]">
            Connected: {connectedWallet.address.slice(0, 8)}...{connectedWallet.address.slice(-8)}
          </div>
        </div>
      )}

      <div className="flex flex-col relative mt-12 bg-linear-to-b from-[#ffffff] via-black/8 to-white pt-10 px-13 rounded-4xl pb-12 shadow-[3px_6px_34px_-4px_rgba(0,0,0,0.1)]">
        <div className="absolute top-10 right-15 flex flex-row items-center gap-2">
          <div className={`h-2 w-2 rounded-3xl ${eligibilityData?.eligible ? 'bg-green-500' : 'bg-neutral-400'}`}></div>
          <div className="text-[#4A5565] text-[14px]">
            {isCheckingEligibility ? 'Checking...' : claimStatus}
          </div>
        </div>
        <div className="text-start text-[36px]">Select your wallet</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4 gap-4 md:gap-6 w-full">
          <motion.div
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 1.0 }}
            onClick={() => handleWalletConnect('xverse')}
            className="flex flex-col bg-white w-full rounded-2xl py-6 cursor-pointer shadow-lg hover:bg-emerald-50"
          >
            <img src={XVerse} className="h-[64px]" />
            <div className="text-[14px] mt-3">XVerse</div>
            <div className={`${getWalletStatusColor('xverse')} text-[12px] mt-2`}>
              {getWalletStatus('xverse')}
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 1.0 }}
            onClick={() => handleWalletConnect('unisat')}
            className="flex flex-col bg-white w-full rounded-2xl py-6 cursor-pointer shadow-lg hover:bg-emerald-50"
          >
            <img src={Unisat} className="h-[64px]" />
            <div className="text-[14px] mt-3">Unisat</div>
            <div className={`${getWalletStatusColor('unisat')} text-[12px] mt-2`}>
              {getWalletStatus('unisat')}
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 1.0 }}
            onClick={() => handleWalletConnect('okx')}
            className="flex flex-col bg-white w-full rounded-2xl py-6 cursor-pointer shadow-lg hover:bg-emerald-50"
          >
            <img src={OKX} className="h-[64px]" />
            <div className="text-[14px] mt-3">OKX</div>
            <div className={`${getWalletStatusColor('okx')} text-[12px] mt-2`}>
              {getWalletStatus('okx')}
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 1.0 }}
            className="flex flex-col bg-white w-full rounded-2xl py-6 cursor-pointer shadow-lg hover:bg-emerald-50 opacity-60"
          >
            <img src={Phantom} className="h-[64px]" />
            <div className="text-[14px] mt-3">Phantom</div>
            <div className="text-[#FF6900] text-[12px] mt-2">Not Detected</div>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-6 gap-4 md:gap-6 w-full">
          <motion.div
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 1.0 }}
            className="flex flex-col bg-white w-full rounded-2xl py-6 cursor-pointer shadow-lg hover:bg-emerald-50 opacity-60"
          >
            <img src={Blockchain} className="h-[64px]" />
            <div className="text-[14px] mt-3">Blockchain</div>
            <div className="text-[#FF6900] text-[12px] mt-2">Not Detected</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 1.0 }}
            className="flex flex-col bg-white w-full rounded-2xl py-6 cursor-pointer shadow-lg hover:bg-emerald-50 opacity-60"
          >
            <img src={MetaMask} className="h-[64px]" />
            <div className="text-[14px] mt-3">MetaMask</div>
            <div className="text-[#FF6900] text-[12px] mt-2">Not Detected</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 1.0 }}
            className="flex flex-col bg-white w-full rounded-2xl py-6 cursor-pointer shadow-lg hover:bg-emerald-50 opacity-60"
          >
            <img src={Bitget} className="h-[64px]" />
            <div className="text-[14px] mt-3">Bitget</div>
            <div className="text-[#FF6900] text-[12px] mt-2">Not Detected</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 1.0 }}
            className="flex flex-col bg-white w-full rounded-2xl py-6 cursor-pointer shadow-lg hover:bg-emerald-50 opacity-60"
          >
            <img src={Trust} className="h-[50px]" />
            <div className="text-[14px] mt-6">Trust</div>
            <div className="text-[#FF6900] text-[12px] mt-2">Not Detected</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mt-12 md:mt-16 lg:mt-20 w-full max-w-7xl">
          <div className="flex flex-col md:flex-row border border-black/5 pt-6 w-full pb-8 rounded-3xl px-4 md:px-0 items-start text-left">
            <img src={Armour} className="h-16 md:h-22 mb-4 md:mb-0" />
            <div className="flex flex-col text-left w-full">
              <div className="text-left text-base md:text-[18px] font-medium">Secure connection</div>
              <div className="flex flex-row items-start gap-2 mt-3 text-left">
                <img src={Lock2} className="w-3 mt-1 flex-shrink-0" />
                <div className="text-[#4A5565] text-sm md:text-[14px] text-left">Sign a message to prove ownership</div>
              </div>
              <div className="flex flex-row items-start gap-2 mt-3 text-left">
                <img src={Lock2} className="w-3 mt-1 flex-shrink-0" />
                <div className="text-[#4A5565] text-sm md:text-[14px] text-left">Your keys remain private and secure</div>
              </div>
              <div className="flex flex-row items-start gap-2 mt-3 text-left">
                <img src={Lock2} className="w-3 mt-1 flex-shrink-0" />
                <div className="text-[#4A5565] text-sm md:text-[14px] text-left">No access to your funds</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row border border-black/3 pt-6 w-full pb-8 rounded-3xl bg-[#F9FAFB] px-4 md:px-2 items-start text-left gap-2 md:gap-2">
            <img src={Refresh} className="h-16 md:h-17 mb-4 md:mb-0 md:ml-2" />
            <div className="flex flex-col text-left w-full">
              <div className="text-left text-base md:text-[18px] font-medium">Need help?</div>
              <div className="text-left text-sm md:text-[14px] pr-3 text-[#4A5565] mt-3">
                Wallet not detected? Try refreshing the page or check that your wallet extension is installed.
              </div>
              <motion.div
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 1.0 }}
                onClick={handleRefresh}
                className="flex flex-row items-center gap-2 px-3 bg-white w-fit shadow-sm mt-4 py-2 rounded-2xl cursor-pointer"
              >
                <img src={Refresh2} className="w-3 h-3" />
                <button className="text-left text-[12px] cursor-pointer">Refresh page</button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-[#6A7282] text-[14px] mt-7">
        By connecting your wallet, you agree to our terms and conditions.
      </div>
    </div>
  );
};

export default ClaimYourLBTC;
