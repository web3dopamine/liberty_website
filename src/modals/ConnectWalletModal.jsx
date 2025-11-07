import { useImperativeHandle, useState } from "react";
import { ConnectWallet, Cross, MetaMask, Phantom, WalletConnect } from "../assets/images";

const ConnectWalletModal = ({ ref }) => {
  const [isOpen, setIsOpen] = useState(false);

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

          <div className="flex flex-row items-center gap-4 bg-[#FFFFFF]/5 border border-white/5 rounded-2xl px-4 py-4 mt-12 hover:scale-104 transition-all duration-300 ease-in-out cursor-pointer active:scale-99 hover:bg-[#FFFFFF]/10">
            <div className="bg-white/10 p-2 rounded-2xl pr-1 pb-1">
              <img src={MetaMask} className="w-[40px] h-[40px] " />
            </div>
            <div className="flex flex-col">
              <div className="text-[18px]">MetaMask</div>
              <div className="text-[#99A1AF] text-[14px] mt-1 mb-1">Connect using MetaMask browser extension</div>
              <div className="text-[#FF8904] text-[12px]">Not installed</div>
            </div>
          </div>

          <div className="flex flex-row items-center gap-4 bg-[#FFFFFF]/5 border border-white/5 rounded-2xl px-4 py-4 mt-4 hover:scale-104 transition-all duration-300 ease-in-out cursor-pointer active:scale-99 hover:bg-[#FFFFFF]/10">
            <div className="bg-white/10 p-1.5 rounded-2xl ">
              <img src={Phantom} className="w-[40px] h-[40px] p-1" />
            </div>
            <div className="flex flex-col">
              <div className="text-[18px]">Phantom</div>
              <div className="text-[#99A1AF] text-[14px] mt-1 mb-1">Connect using Phantom wallet</div>
              <div className="text-[#FF8904] text-[12px]">Not installed</div>
            </div>
          </div>

          <div className="flex flex-row items-center gap-4 bg-[#FFFFFF]/5 border border-white/5 rounded-2xl px-4 py-4 mt-4 hover:scale-104 transition-all duration-300 ease-in-out cursor-pointer active:scale-99 hover:bg-[#FFFFFF]/10">
            <div className="bg-white/10 p-1.5 rounded-2xl ">
              <img src={WalletConnect} className="w-[40px] h-[40px] p-1" />
            </div>
            <div className="flex flex-col">
              <div className="text-[18px]">Wallet Connect</div>
              <div className="text-[#99A1AF] text-[14px] mt-1 mb-1">Connect using Wallet Connect</div>
              <div className="text-[#FF8904] text-[12px]">Not installed</div>
            </div>
          </div>
        </div>

        <div className="text-[#6A7282] text-[11px] text-center mt-8">
          By connecting a wallet, you agree to Liberty's Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
};

export default ConnectWalletModal;