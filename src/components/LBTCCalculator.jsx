import { useState } from "react";
import { UpDownArrow } from "../assets/images";
import { motion } from "motion/react";

const LBTCCalculator = () => {
  const [input, setInput] = useState(1);

  return (
    <div className="text-center py-35 flex flex-col items-center bg-white">
      <div className="text-[96px] bg-linear-to-t from-[#000000] via-[#000000]/90 to-[#000000]/60 text-transparent bg-clip-text">
        L-BTC{" "}
        <span className="text-center bg-linear-to-b from-[#2D5F5D] to-[#4A9390] text-transparent bg-clip-text -mt-4 tracking-tight">
          Calculator
        </span>
      </div>
      <div className="text-[#4A5565] text-[24px] mt-4">
        Calculate how many L-BTC tokens you'll receive at the 1:10 ratio
      </div>
      <div className="bg-linear-to-tl from-[#2D5F5D]/10 via-white to-[#2D5F5D]/10 p-10 rounded-4xl mt-16 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="text-[14px] text-[#4A5565] text-start tracking-widest">YOU SEND</div>
        <div className="flex flex-row items-center gap-2 mt-3">
          <input
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
            type="number"
            className="text-[#717182] outline-none border-none px-4 shadow-lg rounded-3xl inset-shadow-sm h-[78px] w-[300px] text-[14px]"
          />
          <div className="text-[12px] shadow-lg rounded-3xl inset-shadow-sm  flex flex-row items-center justify-center w-[160px] h-[78px] gap-4">
            <div className="w-[40px] h-[40px] bg-linear-to-b from-[#FF8904] to-[#F54900] rounded-4xl shadow-lg" />
            <div className="min-w-8 text-[20px]">BTC</div>
          </div>
        </div>
        <div className="bg-green-300 justify-self-center bg-linear-to-b from-[#2D5F5D] to-[#3A7875] w-[55px] h-[55px] mt-9 rounded-xl shadow-lg flex items-center justify-center">
          <img src={UpDownArrow} className="w-[24px] h-[24px]"></img>
        </div>
        <div className="text-[14px] text-[#4A5565] text-start mt-8 mb-4 tracking-widest">YOU RECEIVE</div>
        <div className="flex flex-row items-center gap-2 ">
          <div className="text-[#717182] px-4 shadow-lg rounded-3xl inset-shadow-sm h-[78px] w-[300px] text-[14px] flex items-center">
            {input * 10}
          </div>
          <div className="text-[12px] shadow-lg rounded-3xl inset-shadow-sm flex flex-row items-center justify-center w-[160px] h-[78px] gap-4 border border-[#2D5F5D]/50 bg-[#3A7875]/10">
            <div className="w-[40px] h-[40px] bg-linear-to-b from-[#2D5F5D] to-[#3A7875] rounded-4xl shadow-lg" />
            <div className="min-w-8 text-[20px]">LBTY</div>
          </div>
        </div>
        <div className="border border-[#3A7875]/20 rounded-3xl mt-7 p-8 text-[16px] bg-linear-to-b from-[#2D5F5D]/10 to-[#3A7875]/10">
          <div className="flex flex-row justify-between">
            <div className="text-[#4A5565]">Exchange Rate</div>
            <div className="font-medium">1 BTC = 10 LBTY</div>
          </div>
          <div className="flex flex-row justify-between mt-3">
            <div className="text-[#4A5565]">Network Fee</div>
            <div className="text-[#3A7875] font-semibold">FREE</div>
          </div>
        </div>
        <motion.button
          whileHover={{
            scale: 1.07,
          }}
          whileTap={{
            scale: 1.0,
          }}
          transition={{
            duration: 0.3,
          }}
          className="bg-linear-to-b text-[18px] from-[#2D5F5D] to-[#3A7875] mt-8 text-white tracking-widest py-5 w-full rounded-4xl shadow-xl cursor-pointer hover:to-[#3A7875]/80 hover:shadow-2xl"
        >
          CALCULATE ELIGIBILITY
        </motion.button>
      </div>
    </div>
  );
};

export default LBTCCalculator;
