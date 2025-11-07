import { FullLogo, Wallet } from "../assets/images";
import { motion } from "motion/react";
import ConnectWalletModal from "../modals/ConnectWalletModal";
import { useRef } from "react";

const Header = () => {
  const connectModalRef = useRef(null);

  return (
    <div className=" w-full bg-black flex flex-row items-center justify-between px-80 h-[89px] z-2">
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
          onClick={() => {
            connectModalRef.current.showModal();
          }}
        >
          <img src={Wallet} />
          <div>CONNECT WALLET</div>
        </motion.button>
      </div>
      <ConnectWalletModal ref={connectModalRef} />
    </div>
  );
};

export default Header;