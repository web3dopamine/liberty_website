import { useCallback, useState, useRef } from "react";
import { Timeline } from "../assets/images";
import CountdownTimer from "../utils/CountdownTimer";
import { motion, useInView } from "motion/react";

const LaunchCountdown = () => {
  const [countdownData, setCountDownData] = useState({});
  const titleRef = useRef(null);
  const timelineRef = useRef(null);
  const footerRef = useRef(null);

  const titleInView = useInView(titleRef, { once: true });
  const timelineInView = useInView(timelineRef, { once: true });
  const footerInView = useInView(footerRef, { once: true });

  const updateData = useCallback((data) => {
    setCountDownData(data);
  }, []);

  return (
    <div className="bg-black text-white text-center pt-25 flex flex-col items-center pb-38 bg-radial from-[#3A7875]/30 via-[#3A7875]/5 to-[#000000]">
      <motion.div
        ref={titleRef}
        initial={{ opacity: 0, y: -30 }}
        animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-[#99A1AF] text-[36px] pb-2"
      >
        SNAPSHOT IN
      </motion.div>
      <div className="flex flex-row items-center justify-center gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={titleInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col"
        >
          <motion.div
            key={countdownData.days}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-[96px] min-w-32"
          >
            {countdownData.days ?? "00"}
          </motion.div>
          <div className="text-[14px] text-[#99A1AF] -mt-3">DAYS</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={titleInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-col gap-5"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-[#2D5F5D] w-2 h-2 rounded-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="bg-[#2D5F5D] w-2 h-2 rounded-3xl"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={titleInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col"
        >
          <motion.div
            key={countdownData.hours}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-[96px] min-w-32"
          >
            {countdownData.hours ?? "00"}
          </motion.div>
          <div className="text-[14px] text-[#99A1AF] -mt-3">HOURS</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={titleInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex flex-col gap-5"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-[#2D5F5D] w-2 h-2 rounded-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="bg-[#2D5F5D] w-2 h-2 rounded-3xl"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={titleInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col"
        >
          <motion.div
            key={countdownData.minutes}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-[96px] min-w-32"
          >
            {countdownData.minutes ?? "00"}
          </motion.div>
          <div className="text-[14px] text-[#99A1AF] -mt-3">MINUTES</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={titleInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="flex flex-col gap-5"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-[#2D5F5D] w-2 h-2 rounded-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="bg-[#2D5F5D] w-2 h-2 rounded-3xl"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={titleInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col"
        >
          <motion.div
            key={countdownData.seconds}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-[96px] min-w-32"
          >
            {countdownData.seconds ?? "00"}
          </motion.div>
          <div className="text-[14px] text-[#99A1AF] -mt-3">SECONDS</div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={titleInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="text-[#8092AC] text-[16px] mt-10"
      >
        January 15, 2026 — 00:00 UTC
      </motion.div>

      <motion.div
        ref={timelineRef}
        initial={{ opacity: 0, y: 50 }}
        animate={timelineInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative w-[1024px] mt-17"
      >
        <img src={Timeline} className="w-full" />
        
        {/* Timeline Milestone Overlays */}
        <div className="absolute top-[50%] left-0 right-0 flex items-start justify-between px-[10%] -translate-y-1/2">
          {/* Snapshot at Dec 25, 2025 - ACTIVE */}
          <div className="flex flex-col items-center w-[180px]">
            <div className="text-[#99A1AF] text-[14px] mb-1 text-center font-medium">Snapshot at Dec 25, 2025</div>
            <div className="text-[#6A7282] text-[12px]">Dec 25, 2025</div>
            <div className="bg-[#376e6d] text-white text-[10px] px-3 py-1 rounded-full mt-2">LIVE</div>
          </div>
          
          {/* Eligibility Check Open - INACTIVE */}
          <div className="flex flex-col items-center w-[180px] opacity-40">
            <div className="text-[#6A7282] text-[14px] mb-1 text-center">Eligibility Check Open</div>
            <div className="text-[#6A7282] text-[12px]">Nov 1, 2025</div>
          </div>
          
          {/* Token Launch - INACTIVE */}
          <div className="flex flex-col items-center w-[180px] opacity-40">
            <div className="text-[#6A7282] text-[14px] mb-1 text-center">Token Launch</div>
            <div className="text-[#6A7282] text-[12px]">Jan 15, 2026</div>
          </div>
          
          {/* Claim Period Opens - INACTIVE */}
          <div className="flex flex-col items-center w-[180px] opacity-40">
            <div className="text-[#6A7282] text-[14px] mb-1 text-center">Claim Period Opens</div>
            <div className="text-[#6A7282] text-[12px]">Feb 1, 2026</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        ref={footerRef}
        initial={{ opacity: 0, y: 30 }}
        animate={footerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-[#8092AC] text-[18px] mt-7"
      >
        Check your eligibility now and be ready for launch day.
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={footerInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-[#3DDED7] text-[18px] mt-3 font-bold"
      >
        Over 50 million addresses are eligible.
      </motion.div>

      <CountdownTimer onTick={updateData} />
    </div>
  );
};

export default LaunchCountdown;
