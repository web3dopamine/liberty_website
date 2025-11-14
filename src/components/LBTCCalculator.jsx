import { useState, useEffect, useRef } from "react";
import { Logo } from "../assets/images";
import { motion, useInView } from "motion/react";

const LBTCCalculator = () => {
  const [input, setInput] = useState(1);
  const [displayedOutput, setDisplayedOutput] = useState(10);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const minClaim = 0.0003;
  const calculatedOutput = input * 10;

  const handleQuickSelect = (amount) => {
    setInput(amount);
  };

  // Animated number counter
  useEffect(() => {
    const duration = 500; // milliseconds
    const steps = 30;
    const stepValue = (calculatedOutput - displayedOutput) / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setDisplayedOutput((prev) => prev + stepValue);
      } else {
        setDisplayedOutput(calculatedOutput);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [calculatedOutput]);

  const BitcoinIcon = () => (
    <svg className="w-[24px] h-[24px]" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z" fill="white"/>
    </svg>
  );

  return (
    <div id="calculator" ref={sectionRef} className="text-center py-35 flex flex-col items-center bg-white">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-[96px] bg-linear-to-t from-[#000000] via-[#000000]/90 to-[#000000]/60 text-transparent bg-clip-text"
      >
        LBTY{" "}
        <span className="text-center bg-linear-to-b from-[#2D5F5D] to-[#4A9390] text-transparent bg-clip-text -mt-4 tracking-tight">
          Calculator
        </span>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="text-[#4A5565] text-[24px] mt-4"
      >
        Calculate how many LBTY tokens you'll receive at the 1:10 ratio
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
        className="bg-linear-to-tl from-[#2D5F5D]/10 via-white to-[#2D5F5D]/10 p-10 rounded-4xl mt-16 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
      >
        <div className="text-[14px] text-[#4A5565] text-start tracking-widest">YOU HAVE BTC</div>
        <div className="flex flex-row items-center gap-2 mt-3">
          <input
            value={input}
            onChange={(event) => {
              const value = parseFloat(event.target.value) || 0;
              setInput(value);
            }}
            type="number"
            min={minClaim}
            step="0.0001"
            className="text-[#717182] outline-none border-none px-4 shadow-lg rounded-3xl inset-shadow-sm h-[78px] w-[300px] text-[14px]"
          />
          <div className="text-[12px] shadow-lg rounded-3xl inset-shadow-sm flex flex-row items-center justify-center w-[160px] h-[78px] gap-4">
            <div className="w-[40px] h-[40px] bg-linear-to-b from-[#FF8904] to-[#F54900] rounded-4xl shadow-lg flex items-center justify-center">
              <BitcoinIcon />
            </div>
            <div className="min-w-8 text-[20px]">BTC</div>
          </div>
        </div>
        
        <div className="flex flex-row items-center gap-3 mt-5">
          <div className="text-[12px] text-[#4A5565] tracking-wider">Quick Select:</div>
          <div className="flex flex-row gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickSelect(0.1)}
              className="px-4 py-2 text-[12px] bg-white border border-[#3A7875]/30 rounded-2xl text-[#4A5565] hover:bg-[#3A7875]/10 hover:border-[#3A7875] transition-all"
            >
              0.1 BTC
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickSelect(0.5)}
              className="px-4 py-2 text-[12px] bg-white border border-[#3A7875]/30 rounded-2xl text-[#4A5565] hover:bg-[#3A7875]/10 hover:border-[#3A7875] transition-all"
            >
              0.5 BTC
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickSelect(1)}
              className="px-4 py-2 text-[12px] bg-white border border-[#3A7875]/30 rounded-2xl text-[#4A5565] hover:bg-[#3A7875]/10 hover:border-[#3A7875] transition-all"
            >
              1 BTC
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickSelect(2)}
              className="px-4 py-2 text-[12px] bg-white border border-[#3A7875]/30 rounded-2xl text-[#4A5565] hover:bg-[#3A7875]/10 hover:border-[#3A7875] transition-all"
            >
              2 BTC
            </motion.button>
          </div>
        </div>

        <div className="text-[12px] text-[#4A5565] text-start mt-4 tracking-wider">
          Conversion Rate: 1 BTC = 10 L-BTC • Minimum Claim: {minClaim} BTC
        </div>

        <div className="text-[14px] text-[#4A5565] text-start mt-8 mb-4 tracking-widest">YOU CAN CLAIM LBTY</div>
        <div className="flex flex-row items-center gap-2 ">
          <motion.div 
            key={displayedOutput}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-[#717182] px-4 shadow-lg rounded-3xl inset-shadow-sm h-[78px] w-[300px] text-[14px] flex items-center"
          >
            {displayedOutput.toFixed(2)}
          </motion.div>
          <div className="text-[12px] shadow-lg rounded-3xl inset-shadow-sm flex flex-row items-center justify-center w-[160px] h-[78px] gap-4 border border-[#2D5F5D]/50 bg-[#3A7875]/10">
            <div className="w-[40px] h-[40px] bg-linear-to-b from-[#2D5F5D] to-[#3A7875] rounded-4xl shadow-lg flex items-center justify-center">
              <img src={Logo} className="w-[24px] h-[24px]" alt="Liberty Logo" />
            </div>
            <div className="min-w-8 text-[20px]">LBTY</div>
          </div>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="border border-[#3A7875]/20 rounded-3xl mt-7 p-8 text-[16px] bg-linear-to-b from-[#2D5F5D]/10 to-[#3A7875]/10"
        >
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="flex flex-row justify-between"
          >
            <div className="text-[#4A5565]">Exchange Rate</div>
            <div className="font-medium">1 BTC = 10 LBTY</div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="flex flex-row justify-between mt-3"
          >
            <div className="text-[#4A5565]">Network Fee</div>
            <div className="text-[#3A7875] font-semibold">FREE</div>
          </motion.div>
        </motion.div>
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
      </motion.div>
    </div>
  );
};

export default LBTCCalculator;
