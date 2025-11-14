import { FullLogo, Wallet } from "../assets/images";
import { motion, AnimatePresence } from "motion/react";
import ConnectWalletModal from "../modals/ConnectWalletModal";
import { useRef, useState, useEffect } from "react";
import { useWallet } from "../contexts/WalletContext";

const Header = () => {
  const connectModalRef = useRef(null);
  const { account, isConnected, truncateAddress, disconnectWallet } = useWallet();
  const [showBackground, setShowBackground] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const firstSectionHeight = window.innerHeight;
      const scrollThreshold = firstSectionHeight * 0.8;
      
      const shouldShowBackground = window.scrollY > scrollThreshold;
      
      setShowBackground(shouldShowBackground);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

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
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <div className={`fixed top-0 w-full flex flex-row items-center justify-between px-6 md:px-20 lg:px-40 xl:px-80 h-[70px] md:h-[89px] z-50 transition-all duration-500 ${
        showBackground ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
      }`}>
        <img src={FullLogo} className="h-[35px] md:h-[45px]" />
        
        <div className="hidden lg:flex flex-row font-bold items-center gap-7 text-[16px] text-white mt-1">
          <button onClick={() => scrollToSection('hero')} className="hover:text-[#3A7875] transition-colors duration-200">About</button>
          <button onClick={() => scrollToSection('calculator')} className="hover:text-[#3A7875] transition-colors duration-200">Calculator</button>
          <button onClick={() => scrollToSection('claim-tokens')} className="hover:text-[#3A7875] transition-colors duration-200">Claim Tokens</button>
          <button onClick={() => scrollToSection('phases')} className="hover:text-[#3A7875] transition-colors duration-200">Phases</button>
          <button onClick={() => scrollToSection('grants')} className="hover:text-[#3A7875] transition-colors duration-200">Grants</button>
          <button onClick={() => scrollToSection('community')} className="hover:text-[#3A7875] transition-colors duration-200">Community</button>
          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 1.0 }}
            className="flex flex-row gap-2 border-[#448986] border px-3 py-1 rounded-2xl cursor-pointer hover:bg-white/10"
            onClick={handleWalletClick}
          >
            <img src={Wallet} />
            <div>{isConnected ? truncateAddress(account) : 'CONNECT WALLET'}</div>
          </motion.button>
        </div>

        <div className="lg:hidden flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 1.0 }}
            className="flex flex-row gap-2 border-[#448986] border px-3 py-1 rounded-2xl cursor-pointer hover:bg-white/10 text-white text-sm"
            onClick={handleWalletClick}
          >
            <img src={Wallet} className="w-4 h-4" />
            <div className="text-xs">{isConnected ? truncateAddress(account) : 'CONNECT'}</div>
          </motion.button>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex flex-col gap-1.5 w-8 h-8 justify-center items-center cursor-pointer z-50"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-white transition-all"
            />
            <motion.span
              animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-6 h-0.5 bg-white transition-all"
            />
            <motion.span
              animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-white transition-all"
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 w-full h-screen bg-black/95 backdrop-blur-lg z-40 lg:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8 text-white text-xl font-bold">
              <button onClick={() => scrollToSection('hero')} className="hover:text-[#3A7875] transition-colors duration-200">About</button>
              <button onClick={() => scrollToSection('calculator')} className="hover:text-[#3A7875] transition-colors duration-200">Calculator</button>
              <button onClick={() => scrollToSection('claim-tokens')} className="hover:text-[#3A7875] transition-colors duration-200">Claim Tokens</button>
              <button onClick={() => scrollToSection('phases')} className="hover:text-[#3A7875] transition-colors duration-200">Phases</button>
              <button onClick={() => scrollToSection('grants')} className="hover:text-[#3A7875] transition-colors duration-200">Grants</button>
              <button onClick={() => scrollToSection('community')} className="hover:text-[#3A7875] transition-colors duration-200">Community</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConnectWalletModal ref={connectModalRef} />
    </>
  );
};

export default Header;
