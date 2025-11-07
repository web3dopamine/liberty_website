import { FullLogo, Wallet } from "../assets/images";
import { motion } from "motion/react";
import ConnectWalletModal from "../modals/ConnectWalletModal";
import { useRef, useState, useEffect } from "react";
import { useWallet } from "../contexts/WalletContext";

const Header = () => {
  const connectModalRef = useRef(null);
  const { account, isConnected, truncateAddress, disconnectWallet } = useWallet();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
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

  return (
    <>
      <div className={`fixed top-0 w-full flex flex-row items-center justify-between px-80 h-[89px] z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
      }`}>
        <img src={FullLogo} className="h-[45px]" />
        <div className="flex flex-row font-bold items-center gap-7 text-[14px] text-white mt-1 ">
          <button>ELIGIBILITY</button>
          <button>DEVELOPERS</button>
          <button>DEVELOPERS</button>
          <button>COMMUNITY</button>
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
