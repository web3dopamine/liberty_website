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
        className="w-[1024px] mt-17"
      >
        {/* Custom Clean Timeline */}
        <div className="relative flex items-start justify-between px-8 py-12">
          {/* Timeline Line - Fades from teal (left) to dark/transparent (right) */}
          <div className="absolute top-[80px] left-0 right-0 h-[2px] bg-gradient-to-r from-[#3A7875] via-[#2D5F5D]/50 to-[#2D5F5D]/10" />
          
          {/* Snapshot at Dec 25, 2025 - ACTIVE */}
          <div className="relative flex flex-col items-center z-10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#2D5F5D] to-[#3A7875] flex items-center justify-center shadow-lg mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
              </svg>
            </div>
            <div className="text-[#99A1AF] text-[14px] mb-1 text-center font-medium">Snapshot at Dec 25, 2025</div>
            <div className="text-[#6A7282] text-[12px] mb-2">Dec 25, 2025</div>
            <div className="bg-[#376e6d] text-white text-[10px] px-3 py-1 rounded-full">LIVE</div>
          </div>
          
          {/* Eligibility Check Open - INACTIVE */}
          <div className="relative flex flex-col items-center z-10 opacity-40">
            <div className="w-16 h-16 rounded-full bg-[#3A7875]/30 flex items-center justify-center shadow-lg mb-4">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"/>
              </svg>
            </div>
            <div className="text-[#6A7282] text-[14px] mb-1 text-center">Eligibility Check Open</div>
            <div className="text-[#6A7282] text-[12px]">Nov 1, 2025</div>
          </div>
          
          {/* Token Launch - INACTIVE */}
          <div className="relative flex flex-col items-center z-10 opacity-40">
            <div className="w-16 h-16 rounded-full bg-[#3A7875]/30 flex items-center justify-center shadow-lg mb-4">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2c0 .74.4 1.39 1 1.73V7h1V3.73c.6-.34 1-.99 1-1.73h-3zM9 7h6v3H9V7zm3 11l-5 3 1.09-6.36L4 10.5l5.5-.8L12 4.5l2.5 5.2 5.5.8-4.09 4.14L17 21l-5-3z"/>
              </svg>
            </div>
            <div className="text-[#6A7282] text-[14px] mb-1 text-center">Token Launch</div>
            <div className="text-[#6A7282] text-[12px]">Jan 15, 2026</div>
          </div>
          
          {/* Claim Period Opens - INACTIVE */}
          <div className="relative flex flex-col items-center z-10 opacity-40">
            <div className="w-16 h-16 rounded-full bg-[#3A7875]/30 flex items-center justify-center shadow-lg mb-4">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 5h-2V3H7v2H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-7 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
              </svg>
            </div>
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
