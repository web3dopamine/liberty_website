import { useState } from "react";
import { motion } from "motion/react";

const CheckYourEligibility = () => {
  const [input, setInput] = useState("");

  return (
    <div className="text-center py-30 flex flex-col items-center bg-[#f6f8f8]">
      <div className="text-[96px] tracking-tight bg-linear-to-t from-[#000000] via-[#000000]/90 to-[#000000]/60 text-transparent bg-clip-text">
        Check Your{" "}
        <span className="bg-linear-to-b from-[#2D5F5D] to-[#4A9390] text-transparent bg-clip-text">Eligibility</span>
      </div>
      <div className="text-[#4A5565] text-[24px] mt-4">
        Enter your Bitcoin address to see if you qualify for Liberty tokens
      </div>
      <div
        className="bg-linear-to-tl from-[#2D5F5D]/10 via-white to-[#2D5F5D]/10 p-8 pt-5 rounded-4xl mt-15 shadow-2xl
       pb-10"
      >
        <div className="flex flex-row items-center gap-4 mt-3">
          <input
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
            className="text-[#717182] outline-none border-none px-5 shadow-lg rounded-4xl inset-shadow-sm h-[64px] w-[570px] text-[14px] placeholder-gray-400"
            placeholder="Enter your Bitcoin address (bc1...)"
          />
          <motion.button
            whileHover={{
              scale: 1.07,
            }}
            whileTap={{
              scale: 1.0,
            }}
            className="bg-linear-to-b w-[204px] text-[18px] from-[#2D5F5D] to-[#3A7875]  text-white tracking-widest h-[64px] rounded-4xl cursor-pointer shadow-2xl hover:to-[#3A7875]/80 hover:shadow-3xl"
          >
            CHECK NOW
          </motion.button>
        </div>
        <div className="grid grid-cols-3 mt-20 gap-8 mx-15">
          <div className="py-5 rounded-2xl transition-all duration-300 ease-in-out hover:bg-[#729291]/10 select-none">
            <div className="text-[60px] text-[#2D5F5D]">50M+</div>
            <div className="text-[#4A5565] text-[14px] tracking-widest">
              ELIGIBLE <br /> ADDRESS
            </div>
          </div>
          <div className="py-5 rounded-2xl transition-all duration-300 ease-in-out hover:bg-[#729291]/10 select-none">
            <div className="text-[60px] text-[#2D5F5D]">1:10</div>
            <div className="text-[#4A5565] text-[14px] tracking-widest">BTC RATIO</div>
          </div>
          <div className="py-5 rounded-2xl transition-all duration-300 ease-in-out hover:bg-[#729291]/10 select-nones">
            <div className="text-[60px] text-[#2D5F5D]">$0</div>
            <div className="text-[#4A5565] text-[14px] tracking-widest">GAS FEES</div>
          </div>
        </div>
      </div>
      <motion.button
        whileHover={{
          scale: 1.07,
        }}
        whileTap={{
          scale: 1.0,
        }}
        className="bg-linear-to-b text-[18px] from-[#2D5F5D] to-[#3A7875] mt-16 text-white tracking-widest py-5 rounded-4xl px-10 cursor-pointer shadow-2xl hover:to-[#3A7875]/80 hover:shadow-2xl"
      >
        CONNECT WALLET TO CLAIM L-BTC
      </motion.button>
    </div>
  );
};

export default CheckYourEligibility;
