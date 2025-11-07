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
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
              </svg>
            </div>
            <div className="text-[#6A7282] text-[14px] mb-1 text-center">Eligibility Check Open</div>
            <div className="text-[#6A7282] text-[12px]">Nov 1, 2025</div>
          </div>
          
          {/* Token Launch - INACTIVE */}
          <div className="relative flex flex-col items-center z-10 opacity-40">
            <div className="w-16 h-16 rounded-full bg-[#3A7875]/30 flex items-center justify-center shadow-lg mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.81 14.12L5.64 3.49c.28-.86 1.44-.86 1.72 0l1.03 3.09 2.84-6.35c.21-.47.72-.63 1.14-.38.42.25.58.79.38 1.26L9.21 9.59l3.58 1.79c.38.19.58.63.48 1.05l-1 4c-.1.42-.5.72-.94.72H3.47c-.53 0-.97-.43-.97-.96 0-.03.01-.06.01-.09.1-.38.37-.67.75-.76l7.08-1.77-4.43-2.21-2.09 6.25c-.1.28.06.59.34.69.28.1.59-.06.69-.34z"/>
              </svg>
            </div>
            <div className="text-[#6A7282] text-[14px] mb-1 text-center">Token Launch</div>
            <div className="text-[#6A7282] text-[12px]">Jan 15, 2026</div>
          </div>
          
          {/* Claim Period Opens - INACTIVE */}
          <div className="relative flex flex-col items-center z-10 opacity-40">
            <div className="w-16 h-16 rounded-full bg-[#3A7875]/30 flex items-center justify-center shadow-lg mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
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
