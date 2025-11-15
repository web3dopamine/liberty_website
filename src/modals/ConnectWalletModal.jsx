import { useImperativeHandle, useState, forwardRef } from "react";
import { ConnectWallet, Cross, MetaMask, Phantom, Magnify } from "../assets/images";
import { useWallet } from "../contexts/WalletContext";
import { useAppKit } from '@reown/appkit/react';

const ConnectWalletModal = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const { connectMetaMask, connectPhantom, isConnecting } = useWallet();
  const { open } = useAppKit();

  useImperativeHandle(
    ref,
    () => {
      return {
        showModal() {
          setIsOpen(true);
        },
      };
    },
    []
  );

  const handleMetaMaskClick = async () => {
    const success = await connectMetaMask();
    if (success) {
      setIsOpen(false);
    }
  };

  const handlePhantomClick = async () => {
    const success = await connectPhantom();
    if (success) {
      setIsOpen(false);
    }
  };

  const handleWalletConnectClick = () => {
    setIsOpen(false);
    open();
  };

  return (
    <div
      className={`fixed inset-0 bg-[#011817]/96 flex items-center justify-center transition-opacity duration-300 z-50 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={() => setIsOpen(false)}
    >
      {/* Modal Dialog */}
      <div
        className={`relative  border border-white/10 border-b-0 bg-linear-to-b from-[#082A2D] to-[#000000] rounded-2xl shadow-2xl p-7 min-w-[512px] mx-4 transition-all duration-300 text-white ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute cursor-pointer top-0 right-0 p-4" onClick={() => setIsOpen(false)}>
          <img src={Cross} />
        </div>

        <div className="flex flex-col">
          <div className="flex flex-row items-center gap-4">
            <img src={ConnectWallet} className="w-12 h-12" />
            <div className="font-semibold text-[30px]">Connect Wallet</div>
          </div>
          <div className="text-[#99A1AF] text-[16px] mt-3">Choose your preferred wallet to connect to Liberty</div>

          <div 
            className="flex flex-row items-center gap-4 bg-[#FFFFFF]/5 border border-white/5 rounded-2xl px-4 py-4 mt-12 hover:scale-104 transition-all duration-300 ease-in-out cursor-pointer active:scale-99 hover:bg-[#FFFFFF]/10"
            onClick={handleMetaMaskClick}
          >
            <div className="bg-white/10 p-2 rounded-2xl pr-1 pb-1">
              <img src={MetaMask} className="w-[40px] h-[40px] " />
            </div>
            <div className="flex flex-col">
              <div className="text-[18px]">MetaMask</div>
              <div className="text-[#99A1AF] text-[14px] mt-1 mb-1">Connect using MetaMask browser extension</div>
              {typeof window !== 'undefined' && typeof window.ethereum === 'undefined' ? (
                <div className="text-[#FF8904] text-[12px]">Not installed</div>
              ) : isConnecting ? (
                <div className="text-[#4A9390] text-[12px]">Connecting...</div>
              ) : (
                <div className="text-[#4A9390] text-[12px]">Click to connect</div>
              )}
            </div>
          </div>

          <div 
            className="flex flex-row items-center gap-4 bg-[#FFFFFF]/5 border border-white/5 rounded-2xl px-4 py-4 mt-4 hover:scale-104 transition-all duration-300 ease-in-out cursor-pointer active:scale-99 hover:bg-[#FFFFFF]/10"
            onClick={handlePhantomClick}
          >
            <div className="bg-white/10 p-1.5 rounded-2xl ">
              <img src={Phantom} className="w-[40px] h-[40px] p-1" />
            </div>
            <div className="flex flex-col">
              <div className="text-[18px]">Phantom</div>
              <div className="text-[#99A1AF] text-[14px] mt-1 mb-1">Connect using Phantom wallet</div>
              {typeof window !== 'undefined' && typeof window.phantom?.ethereum === 'undefined' ? (
                <div className="text-[#FF8904] text-[12px]">Not installed</div>
              ) : isConnecting ? (
                <div className="text-[#4A9390] text-[12px]">Connecting...</div>
              ) : (
                <div className="text-[#4A9390] text-[12px]">Click to connect</div>
              )}
            </div>
          </div>

          <div 
            className="flex flex-row items-center gap-4 bg-[#FFFFFF]/5 border border-white/5 rounded-2xl px-4 py-4 mt-4 hover:scale-104 transition-all duration-300 ease-in-out cursor-pointer active:scale-99 hover:bg-[#FFFFFF]/10"
            onClick={handleWalletConnectClick}
          >
            <div className="bg-white/10 p-3 rounded-2xl ">
              <img src={Magnify} className="w-[34px] h-[34px]" />
            </div>
            <div className="flex flex-col">
              <div className="text-[18px]">500+ Wallets</div>
              <div className="text-[#99A1AF] text-[14px] mt-1 mb-1">WalletConnect, Binance, Trust Wallet & more</div>
              <div className="text-[#4A9390] text-[12px]">Click to search wallets</div>
            </div>
          </div>
        </div>

        <div className="text-[#6A7282] text-[11px] text-center mt-8">
          By connecting a wallet, you agree to Liberty's Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
});

ConnectWalletModal.displayName = 'ConnectWalletModal';

export default ConnectWalletModal;