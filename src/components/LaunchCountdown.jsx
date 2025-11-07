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
          {/* Timeline Line - Goes through center of circles */}
          <div className="absolute top-[80px] left-0 right-0 h-[2px] bg-gradient-to-r from-[#2D5F5D] via-[#3A7875] to-[#6A7282]/30" />
          
          {/* Snapshot at Dec 25, 2025 - ACTIVE */}
          <div className="relative flex flex-col items-center z-10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#2D5F5D] to-[#3A7875] flex items-center justify-center shadow-lg mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-[#99A1AF] text-[14px] mb-1 text-center font-medium">Snapshot at Dec 25, 2025</div>
            <div className="text-[#6A7282] text-[12px] mb-2">Dec 25, 2025</div>
            <div className="bg-[#376e6d] text-white text-[10px] px-3 py-1 rounded-full">LIVE</div>
          </div>
          
          {/* Eligibility Check Open - INACTIVE */}
          <div className="relative flex flex-col items-center z-10 opacity-40">
            <div className="w-16 h-16 rounded-full bg-[#3A7875]/30 flex items-center justify-center shadow-lg mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-[#6A7282] text-[14px] mb-1 text-center">Eligibility Check Open</div>
            <div className="text-[#6A7282] text-[12px]">Nov 1, 2025</div>
          </div>
          
          {/* Token Launch - INACTIVE */}
          <div className="relative flex flex-col items-center z-10 opacity-40">
            <div className="w-16 h-16 rounded-full bg-[#3A7875]/30 flex items-center justify-center shadow-lg mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-[#6A7282] text-[14px] mb-1 text-center">Token Launch</div>
            <div className="text-[#6A7282] text-[12px]">Jan 15, 2026</div>
          </div>
          
          {/* Claim Period Opens - INACTIVE */}
          <div className="relative flex flex-col items-center z-10 opacity-40">
            <div className="w-16 h-16 rounded-full bg-[#3A7875]/30 flex items-center justify-center shadow-lg mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
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
