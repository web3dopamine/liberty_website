import { useCallback, useState } from "react";
import CountdownTimer from "../utils/CountdownTimer";
import CustomTimeline from "./CustomTimeline";
import { motion, AnimatePresence } from "motion/react";

const LaunchCountdown = () => {
  const [countdownData, setCountDownData] = useState({});

  const updateData = useCallback((data) => {
    setCountDownData(data);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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

  const numberVariants = {
    initial: { scale: 1, opacity: 1 },
    animate: { 
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="bg-black text-white text-center pt-16 md:pt-20 lg:pt-25 flex flex-col items-center pb-20 md:pb-30 lg:pb-38 bg-radial from-[#3A7875]/30 via-[#3A7875]/5 to-[#000000] px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-[#99A1AF] text-2xl md:text-3xl lg:text-[36px] pb-2"
      >
        SNAPSHOT IN
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-row items-center justify-center gap-2 md:gap-3 lg:gap-4 overflow-x-auto max-w-full"
      >
        <motion.div variants={itemVariants} className="flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={countdownData.days}
              variants={numberVariants}
              initial="initial"
              animate="animate"
              className="text-5xl md:text-7xl lg:text-[96px] min-w-20 md:min-w-28 lg:min-w-32"
            >
              {countdownData.days ?? "00"}
            </motion.div>
          </AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-xs md:text-sm lg:text-[14px] text-[#99A1AF] -mt-2 md:-mt-3"
          >
            DAYS
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col gap-5"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="bg-[#2D5F5D] w-2 h-2 rounded-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="bg-[#2D5F5D] w-2 h-2 rounded-3xl"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={countdownData.hours}
              variants={numberVariants}
              initial="initial"
              animate="animate"
              className="text-5xl md:text-7xl lg:text-[96px] min-w-20 md:min-w-28 lg:min-w-32"
            >
              {countdownData.hours ?? "00"}
            </motion.div>
          </AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-xs md:text-sm lg:text-[14px] text-[#99A1AF] -mt-2 md:-mt-3"
          >
            HOURS
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col gap-5"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="bg-[#2D5F5D] w-2 h-2 rounded-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="bg-[#2D5F5D] w-2 h-2 rounded-3xl"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={countdownData.minutes}
              variants={numberVariants}
              initial="initial"
              animate="animate"
              className="text-5xl md:text-7xl lg:text-[96px] min-w-20 md:min-w-28 lg:min-w-32"
            >
              {countdownData.minutes ?? "00"}
            </motion.div>
          </AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-xs md:text-sm lg:text-[14px] text-[#99A1AF] -mt-2 md:-mt-3"
          >
            MINUTES
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col gap-5"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="bg-[#2D5F5D] w-2 h-2 rounded-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="bg-[#2D5F5D] w-2 h-2 rounded-3xl"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={countdownData.seconds}
              variants={numberVariants}
              initial="initial"
              animate="animate"
              className="text-5xl md:text-7xl lg:text-[96px] min-w-20 md:min-w-28 lg:min-w-32"
            >
              {countdownData.seconds ?? "00"}
            </motion.div>
          </AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-xs md:text-sm lg:text-[14px] text-[#99A1AF] -mt-2 md:-mt-3"
          >
            SECONDS
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="text-[#8092AC] text-sm md:text-base lg:text-[16px] mt-8 md:mt-10"
      >
        December 8, 2025 — 00:00 UTC
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
        className="mt-12 md:mt-15 lg:mt-17 w-full overflow-x-auto px-4"
      >
        <CustomTimeline />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="text-[#8092AC] text-base md:text-lg lg:text-[18px] mt-6 md:mt-7 px-4"
      >
        Check your eligibility now and be ready for launch day.
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="text-[#3DDED7] text-base md:text-lg lg:text-[18px] mt-3 font-bold px-4"
      >
        Over 50 million addresses are eligible.
      </motion.div>

      <CountdownTimer onTick={updateData} />
    </div>
  );
};

export default LaunchCountdown;
