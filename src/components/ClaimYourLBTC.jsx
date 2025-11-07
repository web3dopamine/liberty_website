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
} from "../assets/images";
import { motion } from "motion/react";

const ClaimYourLBTC = () => {
  return (
    <div className="text-center py-30 flex flex-col items-center bg-[#ffffff]">
      <div className="flex flex-row gap-1 border rounded-3xl border-[#4A9390]/20 bg-[#2D5F5D]/5 px-4 py-2">
        <img src={WalletGreen} className="w-3" />
        <div className="text-[#2D5F5D] text-[14px]">Token Claim</div>
      </div>
      <div className="text-[96px] tracking-tight leading-30 mt-6 bg-linear-to-t from-[#000000] via-[#000000]/90 to-[#000000]/60 text-transparent bg-clip-text">
        Claim your LBTY. <br />
        <span className="bg-linear-to-t from-[#2D5F5D] to-[#4A9390] text-transparent bg-clip-text">It's seamless.</span>
      </div>
      <div className="text-[#4A5565] text-[24px] mt-8">
        Connect your Bitcoin wallet to verify ownership and claim your tokens.
      </div>
      <div className="flex flex-col relative mt-12 bg-linear-to-b from-[#ffffff] via-black/8 to-white pt-10 px-13 rounded-4xl pb-12 shadow-[3px_6px_34px_-4px_rgba(0,0,0,0.1)]">
        <div className="absolute top-10 right-15 flex flex-row items-center gap-2">
          <div className="h-2 w-2 bg-neutral-400 rounded-3xl"></div>
          <div className="text-[#4A5565] text-[14px]">0 available</div>
        </div>
        <div className="text-start text-[36px]">Select your wallet</div>
        <div className="flex flex-row mt-4 gap-6">
          <motion.div
            whileHover={{
              scale: 1.07,
            }}
            whileTap={{
              scale: 1.0,
            }}
            className="flex flex-col bg-white w-[237px] rounded-2xl py-6 cursor-pointer shadow-lg hover:bg-emerald-50"
          >
            <img src={XVerse} className="h-[64px]" />
            <div className="text-[14px] mt-3">XVerse</div>
            <div className="text-[#FF6900] text-[12px] mt-2">Not Detected</div>
          </motion.div>
          <motion.div
            whileHover={{
              scale: 1.07,
            }}
            whileTap={{
              scale: 1.0,
            }}
            className="flex flex-col bg-white w-[237px] rounded-2xl py-6 cursor-pointer shadow-lg hover:bg-emerald-50"
          >
            <img src={Unisat} className="h-[64px]" />
            <div className="text-[14px] mt-3">Unisat</div>
            <div className="text-[#FF6900] text-[12px] mt-2">Not Detected</div>
          </motion.div>
          <motion.div
            whileHover={{
              scale: 1.07,
            }}
            whileTap={{
              scale: 1.0,
            }}
            className="flex flex-col bg-white w-[237px] rounded-2xl py-6 cursor-pointer shadow-lg hover:bg-emerald-50"
          >
            <img src={OKX} className="h-[64px]" />
            <div className="text-[14px] mt-3">OKX</div>
            <div className="text-[#FF6900] text-[12px] mt-2">Not Detected</div>
          </motion.div>
          <motion.div
            whileHover={{
              scale: 1.07,
            }}
            whileTap={{
              scale: 1.0,
            }}
            className="flex flex-col bg-white w-[237px] rounded-2xl py-6 cursor-pointer shadow-lg hover:bg-emerald-50"
          >
            <img src={Phantom} className="h-[64px]" />
            <div className="text-[14px] mt-3">Phantom</div>
            <div className="text-[#FF6900] text-[12px] mt-2">Not Detected</div>
          </motion.div>
        </div>
        <div className="flex flex-row mt-6 gap-6">
          <motion.div
            whileHover={{
              scale: 1.07,
            }}
            whileTap={{
              scale: 1.0,
            }}
            className="flex flex-col bg-white w-[237px] rounded-2xl py-6 cursor-pointer shadow-lg hover:bg-emerald-50"
          >
            <img src={Blockchain} className="h-[64px]" />
            <div className="text-[14px] mt-3">Blockchain</div>
            <div className="text-[#FF6900] text-[12px] mt-2 ">Not Detected</div>
          </motion.div>
          <motion.div
            whileHover={{
              scale: 1.07,
            }}
            whileTap={{
              scale: 1.0,
            }}
            className="flex flex-col bg-white w-[237px] rounded-2xl py-6 cursor-pointer shadow-lg hover:bg-emerald-50"
          >
            <img src={MetaMask} className="h-[64px]" />
            <div className="text-[14px] mt-3">MetaMask</div>
            <div className="text-[#FF6900] text-[12px] mt-2">Not Detected</div>
          </motion.div>
          <motion.div
            whileHover={{
              scale: 1.07,
            }}
            whileTap={{
              scale: 1.0,
            }}
            className="flex flex-col bg-white w-[237px] rounded-2xl py-6 cursor-pointer shadow-lg hover:bg-emerald-50"
          >
            <img src={Bitget} className="h-[64px]" />
            <div className="text-[14px] mt-3">Bitget</div>
            <div className="text-[#FF6900] text-[12px] mt-2">Not Detected</div>
          </motion.div>
          <motion.div
            whileHover={{
              scale: 1.07,
            }}
            whileTap={{
              scale: 1.0,
            }}
            className="flex flex-col bg-white w-[237px] rounded-2xl py-6 cursor-pointer shadow-lg hover:bg-emerald-50"
          >
            <img src={Trust} className="h-[50px] " />
            <div className="text-[14px] mt-6">Trust</div>
            <div className="text-[#FF6900] text-[12px] mt-2">Not Detected</div>
          </motion.div>
        </div>

        <div className="flex flex-row gap-5 mt-20">
          <div className="flex flex-row border border-black/5 pt-6 w-[499px] pb-8 rounded-3xl">
            <img src={Armour} className="h-22 " />
            <div className="flex flex-col">
              <div className="text-start text-[18px]">Secure connection</div>
              <div className="flex flex-row items-center gap-2 mt-2">
                <img src={Lock2} className="w-3" />
                <div className="text-[#4A5565] text-[14px]">Sign a message to prove ownership</div>
              </div>
              <div className="flex flex-row items-center gap-2 mt-2">
                <img src={Lock2} className="w-3" />
                <div className="text-[#4A5565] text-[14px]">Your keys remain private and secure</div>
              </div>
              <div className="flex flex-row items-center gap-2 mt-2">
                <img src={Lock2} className="w-3" />
                <div className="text-[#4A5565] text-[14px]">No access to your funds</div>
              </div>
            </div>
          </div>
          <div className="flex flex-row border border-black/3 pt-6 w-[499px] pb-8 rounded-3xl bg-[#F9FAFB] gap-2">
            <img src={Refresh} className="h-17 ml-2" />
            <div className="flex flex-col">
              <div className="text-start text-[18px]">Need help?</div>
              <div className="text-start text-[14px] pr-3 text-[#4A5565] mt-2">
                Wallet not detected? Try refreshing the page or check that your wallet extension is installed.
              </div>
              <motion.div
                whileHover={{
                  scale: 1.07,
                }}
                whileTap={{
                  scale: 1.0,
                }}
                className="flex flex-row items-center gap-2 px-3 bg-white w-fit shadow-sm mt-4 py-2 rounded-2xl cursor-pointer"
              >
                <img src={Refresh2} className="w-3 h-3" />
                <button className="text-start text-[12px] cursor-pointer">Refresh page</button>
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
