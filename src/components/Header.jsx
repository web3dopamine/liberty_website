import { FullLogo, Wallet } from "../assets/images";
import { motion } from "motion/react";
import ConnectWalletModal from "../modals/ConnectWalletModal";
import { useRef, useState, useEffect } from "react";
import { useWallet } from "../contexts/WalletContext";

const Header = () => {
  const connectModalRef = useRef(null);
  const { account, isConnected, truncateAddress, disconnectWallet } = useWallet();
  const [showBackground, setShowBackground] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const firstSectionHeight = window.innerHeight; // Full viewport height
      const scrollThreshold = firstSectionHeight * 0.8; // 80% of first section
      
      const shouldShowBackground = window.scrollY > scrollThreshold;
      
      setShowBackground(shouldShowBackground);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWalletClick = () => {
    if (isConnected) {
      const confirmDisconnect = window.confirm('Do you want to disconnect your wallet?');
      if (confirmDisconnect) {
        disconnectWallet();
      }
    } else {
      connectModalRef.current.showModal();
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <div className={`fixed top-0 w-full flex flex-row items-center justify-between px-80 h-[89px] z-50 transition-all duration-500 ${
        showBackground ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
      }`}>
        <img src={FullLogo} className="h-[45px]" />
        <div className="flex flex-row font-bold items-center gap-7 text-[16px] text-white mt-1 ">
          <button onClick={() => scrollToSection('hero')} className="hover:text-[#3A7875] transition-colors duration-200">About</button>
          <button onClick={() => scrollToSection('calculator')} className="hover:text-[#3A7875] transition-colors duration-200">Calculator</button>
          <button onClick={() => scrollToSection('claim-tokens')} className="hover:text-[#3A7875] transition-colors duration-200">Claim Tokens</button>
          <button onClick={() => scrollToSection('phases')} className="hover:text-[#3A7875] transition-colors duration-200">Phases</button>
          <button onClick={() => scrollToSection('grants')} className="hover:text-[#3A7875] transition-colors duration-200">Grants</button>
          <button onClick={() => scrollToSection('community')} className="hover:text-[#3A7875] transition-colors duration-200">Community</button>
          <motion.button
            whileHover={{
              scale: 1.07,
            }}
            whileTap={{
              scale: 1.0,
            }}
            className="flex flex-row gap-2 border-[#448986] border px-3 py-1 rounded-2xl cursor-pointer hover:bg-white/10"
            onClick={handleWalletClick}
          >
            <img src={Wallet} />
            <div>{isConnected ? truncateAddress(account) : 'CONNECT WALLET'}</div>
          </motion.button>
        </div>
      </div>
      <ConnectWalletModal ref={connectModalRef} />
    </>
  );
};

export default Header;
