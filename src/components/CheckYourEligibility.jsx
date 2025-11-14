import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const CheckYourEligibility = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [balanceData, setBalanceData] = useState(null);
  const [error, setError] = useState("");

  const handleCheckNow = async () => {
    if (!input.trim()) {
      setError("Please enter a Bitcoin address");
      return;
    }

    setLoading(true);
    setError("");
    setBalanceData(null);

    try {
      const response = await fetch('/api/check-btc-balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: input.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to check balance");
        return;
      }

      setBalanceData(data);
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Balance check error:", err);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="text-center py-30 flex flex-col items-center bg-[#f6f8f8]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-[96px] tracking-tight bg-linear-to-t from-[#000000] via-[#000000]/90 to-[#000000]/60 text-transparent bg-clip-text"
      >
        Check Your{" "}
        <span className="bg-linear-to-b from-[#2D5F5D] to-[#4A9390] text-transparent bg-clip-text">Eligibility</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-[#4A5565] text-[24px] mt-4"
      >
        Enter your Bitcoin address to see if you qualify for Liberty tokens
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="bg-linear-to-tl from-[#2D5F5D]/10 via-white to-[#2D5F5D]/10 p-8 pt-5 rounded-4xl mt-15 shadow-2xl pb-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-row items-center gap-4 mt-3"
        >
          <motion.input
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
            whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(45, 95, 93, 0.1)" }}
            transition={{ duration: 0.2 }}
            className="text-[#717182] outline-none border-none px-5 shadow-lg rounded-4xl inset-shadow-sm h-[64px] w-[570px] text-[14px] placeholder-gray-400"
            placeholder="Enter your Bitcoin address (bc1...)"
          />
          <motion.button
            onClick={handleCheckNow}
            disabled={loading}
            whileHover={{
              scale: loading ? 1 : 1.07,
            }}
            whileTap={{
              scale: loading ? 1 : 1.0,
            }}
            className={`bg-linear-to-b w-[204px] text-[18px] from-[#2D5F5D] to-[#3A7875] text-white tracking-widest h-[64px] rounded-4xl cursor-pointer shadow-2xl hover:to-[#3A7875]/80 hover:shadow-3xl ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? "CHECKING..." : "CHECK NOW"}
          </motion.button>
        </motion.div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 text-red-500 text-[14px]"
            >
              {error}
            </motion.div>
          )}

          {balanceData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-[#2D5F5D]/20"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="text-left">
                  <div className="text-[#6A7282] text-[12px] uppercase tracking-wider mb-2">BTC Balance</div>
                  <div className="text-[32px] font-bold text-[#2D5F5D]">
                    {balanceData.btcBalance.toFixed(8)}
                  </div>
                  <div className="text-[#4A5565] text-[14px] mt-1">Bitcoin</div>
                </div>
                <div className="text-left">
                  <div className="text-[#6A7282] text-[12px] uppercase tracking-wider mb-2">LBTY Claimable</div>
                  <div className="text-[32px] font-bold bg-linear-to-r from-[#2D5F5D] to-[#4A9390] text-transparent bg-clip-text">
                    {balanceData.lbtyClaimable.toFixed(8)}
                  </div>
                  <div className="text-[#4A5565] text-[14px] mt-1">Liberty Tokens (1:10 ratio)</div>
                </div>
              </div>
              {!balanceData.eligible && (
                <div className="mt-4 text-orange-600 text-[14px] bg-orange-50 p-3 rounded-lg">
                  ⚠️ Minimum 0.003 BTC required for eligibility
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-3 mt-20 gap-8 mx-15"
        >
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
            className="py-5 rounded-2xl bg-gradient-to-b from-transparent to-[#729291]/5 hover:to-[#729291]/15 select-none cursor-pointer shadow-sm hover:shadow-lg"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7, type: "spring", stiffness: 200 }}
              className="text-[60px] text-[#2D5F5D] font-bold"
            >
              50M+
            </motion.div>
            <div className="text-[#4A5565] text-[14px] tracking-widest">
              ELIGIBLE <br /> ADDRESS
            </div>
          </motion.div>
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
            className="py-5 rounded-2xl bg-gradient-to-b from-transparent to-[#729291]/5 hover:to-[#729291]/15 select-none cursor-pointer shadow-sm hover:shadow-lg"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.85, type: "spring", stiffness: 200 }}
              className="text-[60px] text-[#2D5F5D] font-bold"
            >
              1:10
            </motion.div>
            <div className="text-[#4A5565] text-[14px] tracking-widest">BTC RATIO</div>
          </motion.div>
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
            className="py-5 rounded-2xl bg-gradient-to-b from-transparent to-[#729291]/5 hover:to-[#729291]/15 select-none cursor-pointer shadow-sm hover:shadow-lg"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1, type: "spring", stiffness: 200 }}
              className="text-[60px] text-[#2D5F5D] font-bold"
            >
              $0
            </motion.div>
            <div className="text-[#4A5565] text-[14px] tracking-widest">GAS FEES</div>
          </motion.div>
        </motion.div>
      </motion.div>
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        whileHover={{
          scale: 1.07,
        }}
        whileTap={{
          scale: 1.0,
        }}
        className="bg-linear-to-b text-[18px] from-[#2D5F5D] to-[#3A7875] mt-16 text-white tracking-widest py-5 rounded-4xl px-10 cursor-pointer shadow-2xl hover:to-[#3A7875]/80 hover:shadow-2xl"
      >
        PAIR WALLET TO CLAIM LBTY
      </motion.button>
    </div>
  );
};

export default CheckYourEligibility;
