import { GrayCircle, GreenTickCircle, OrangleClockCircle } from "../assets/images";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const ProjectPhases = () => {
  const phase1Ref = useRef(null);
  const phase2Ref = useRef(null);
  const phase3Ref = useRef(null);
  const phase4Ref = useRef(null);
  const footerRef = useRef(null);

  const phase1InView = useInView(phase1Ref, { once: true, margin: "-50px" });
  const phase2InView = useInView(phase2Ref, { once: true, margin: "-50px" });
  const phase3InView = useInView(phase3Ref, { once: true, margin: "-50px" });
  const phase4InView = useInView(phase4Ref, { once: true, margin: "-50px" });
  const footerInView = useInView(footerRef, { once: true, margin: "-50px" });

  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <div className="text-center pt-40 pb-20 flex flex-col items-center bg-[#000000] bg-radial from-[#3A7875]/30 via-[#3A7875]/5 to-[#000000]">
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={headerInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.6 }}
        className="text-[#99A1AF] bg-white/3 tracking-widest border border-gray-400/20 px-3 py-1 rounded-2xl text-[14px]"
      >
        ROADMAP
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-[96px] text-white mt-7"
      >
        Project{" "}
        <span className="text-center bg-linear-to-b from-[#2D5F5D] to-[#4A9390] text-transparent bg-clip-text -mt-4 tracking-tight">
          Phases
        </span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={headerInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-[#8092AC] text-[24px] mt-4"
      >
        Track our progress from formation to global expansion
      </motion.div>

      <div className="flex flex-row mt-16 gap-10">
        {/* Awareness & Anticipation */}
        <motion.div
          ref={phase1Ref}
          initial={{ opacity: 0, y: 100 }}
          animate={phase1InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 25px 50px -12px rgba(74, 147, 144, 0.3)",
          }}
          className="border group border-[#4A9390]/30 p-6 rounded-3xl flex flex-col relative text-start max-w-[612px] bg-linear-to-br from-[#2D5F5D]/20 via-[#000000] to-[#3A7875]/10 hover:to-[#3A7875]/20 hover:from-[#2D5F5D]/30  hover:shadow-2xl transition-all duration-300  ease-in-out select-none "
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={phase1InView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="absolute top-6 right-6 bg-[#376e6d] text-white text-[12px] px-4 py-[4px] rounded-2xl"
          >
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ACTIVE
            </motion.div>
          </motion.div>
          <div className="text-[#3A7875] text-[128px]">1</div>
          <div className="text-[#ffffff] text-[40px] group-hover:text-[#2D5F5D] transition-all duration-300  ease-in-out">
            Awareness & Anticipation
          </div>
          <div className="text-[#99A1AF] text-[18px] mt-2">
            Build community, ignite buzz, and set the tone of revolution. Launch campaign and prepare global snapshot
            hype.
          </div>
          <div className="flex flex-row items-center gap-3 bg-[#2D5F5D]/8 py-2 px-3 rounded-xl mt-6 hover:bg-amber-50/10 transition-all duration-300  ease-in-out">
            <img src={GreenTickCircle} className="h-[16px] w-[16px]" />
            <div className="text-white text-[16px]">Landing Page Live</div>
          </div>
          <div className="flex flex-row items-center gap-3 bg-[#2D5F5D]/6 py-2 px-3 rounded-xl mt-2 hover:bg-amber-50/10 transition-all duration-300  ease-in-out">
            <img src={GreenTickCircle} className="h-[16px] w-[16px]" />
            <div className="text-white text-[16px]">Community Setup</div>
          </div>
          <div className="flex flex-row items-center gap-3 bg-[#2D5F5D]/6 py-2 px-3 rounded-xl mt-2 hover:bg-amber-50/10 transition-all duration-300  ease-in-out">
            <img src={OrangleClockCircle} className="h-[16px] w-[16px]" />
            <div className="text-white text-[16px]">Influencer Partnerships</div>
          </div>
        </motion.div>

        {/* Snapshot + Claim */}
        <motion.div
          ref={phase2Ref}
          initial={{ opacity: 0, y: 100 }}
          animate={phase2InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 25px 50px -12px rgba(74, 147, 144, 0.2)",
          }}
          className=" p-6 group rounded-3xl flex flex-col relative text-start max-w-[612px] bg-white/5 hover:shadow-2xl transition-all duration-300 ease-in-out select-none"
        >
          <div className="text-[#FFFFFF]/10 text-[128px] ">2</div>
          <div className="text-[#ffffff] text-[40px] group-hover:text-[#2D5F5D] transition-all duration-300  ease-in-out">
            Snapshot + Claim
          </div>
          <div className="text-[#99A1AF] text-[18px] mt-2">
            Capture and verify Bitcoin holders at the block snapshot. Provide seamless, secure claim experience.
          </div>
          <div className="flex flex-row items-center gap-3 bg-[#FFFFFF]/3 py-2 px-3 rounded-xl mt-6 hover:bg-amber-50/10 transition-all duration-300  ease-in-out">
            <img src={GrayCircle} className="h-[16px] w-[16px]" />
            <div className="text-[#6A7282] text-[16px]">Snapshot Taken</div>
          </div>
          <div className="flex flex-row items-center gap-3 bg-[#FFFFFF]/3 py-2 px-3 rounded-xl mt-2 hover:bg-amber-50/10 transition-all duration-300  ease-in-out">
            <img src={GrayCircle} className="h-[16px] w-[16px]" />
            <div className="text-[#6A7282] text-[16px]">Claim Portal Live</div>
          </div>
          <div className="flex flex-row items-center gap-3 bg-[#FFFFFF]/3 py-2 px-3 rounded-xl mt-2 hover:bg-amber-50/10 transition-all duration-300  ease-in-out">
            <img src={GrayCircle} className="h-[16px] w-[16px]" />
            <div className="text-[#6A7282] text-[16px]">3-Month Window</div>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-row mt-10 gap-10">
        {/* Genesis Launch */}
        <motion.div
          ref={phase3Ref}
          initial={{ opacity: 0, y: 100 }}
          animate={phase3InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 25px 50px -12px rgba(74, 147, 144, 0.2)",
          }}
          className=" p-6 group rounded-3xl flex flex-col relative text-start max-w-[612px] bg-white/5 hover:shadow-2xl transition-all duration-300 ease-in-out select-none"
        >
          <div className="text-[#FFFFFF]/10 text-[128px] ">3</div>
          <div className="text-[#ffffff] text-[40px] group-hover:text-[#2D5F5D] transition-all duration-300  ease-in-out">
            Genesis Launch
          </div>
          <div className="text-[#99A1AF] text-[18px] mt-2">
            EVM L2 on Celestia goes live. L-BTC token launch with full DeFi ecosystem.
          </div>
          <div className="flex flex-row items-center gap-3 bg-[#FFFFFF]/3 py-2 px-3 rounded-xl mt-6 hover:bg-amber-50/10 transition-all duration-300  ease-in-out">
            <img src={GrayCircle} className="h-[16px] w-[16px]" />
            <div className="text-[#6A7282] text-[16px]">L2 Network Live</div>
          </div>
          <div className="flex flex-row items-center gap-3 bg-[#FFFFFF]/3 py-2 px-3 rounded-xl mt-2 hover:bg-amber-50/10 transition-all duration-300  ease-in-out">
            <img src={GrayCircle} className="h-[16px] w-[16px]" />
            <div className="text-[#6A7282] text-[16px]">Liberty DAO Active</div>
          </div>
          <div className="flex flex-row items-center gap-3 bg-[#FFFFFF]/3 py-2 px-3 rounded-xl mt-2 hover:bg-amber-50/10 transition-all duration-300  ease-in-out">
            <img src={GrayCircle} className="h-[16px] w-[16px]" />
            <div className="text-[#6A7282] text-[16px]">DeFi Ecosystem</div>
          </div>
        </motion.div>

        {/* Expansion */}
        <motion.div
          ref={phase4Ref}
          initial={{ opacity: 0, y: 100 }}
          animate={phase4InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 25px 50px -12px rgba(74, 147, 144, 0.2)",
          }}
          className=" p-6 group rounded-3xl flex flex-col relative text-start max-w-[612px] bg-white/5 hover:shadow-2xl transition-all duration-300 ease-in-out select-none"
        >
          <div className="text-[#FFFFFF]/10 text-[128px] ">4</div>
          <div className="text-[#ffffff] text-[40px] group-hover:text-[#2D5F5D] transition-all duration-300  ease-in-out">
            Expansion
          </div>
          <div className="text-[#99A1AF] text-[18px] mt-2">
            Global campaign, cross-chain integration, and mobile wallet launch.
          </div>
          <div className="flex flex-row items-center gap-3 bg-[#FFFFFF]/3 py-2 px-3 rounded-xl mt-6 hover:bg-amber-50/10 transition-all duration-300  ease-in-out">
            <img src={GrayCircle} className="h-[16px] w-[16px]" />
            <div className="text-[#6A7282] text-[16px]">Cross-Chain Bridge</div>
          </div>
          <div className="flex flex-row items-center gap-3 bg-[#FFFFFF]/3 py-2 px-3 rounded-xl mt-2 hover:bg-amber-50/10 transition-all duration-300  ease-in-out">
            <img src={GrayCircle} className="h-[16px] w-[16px]" />
            <div className="text-[#6A7282] text-[16px]">Mobile Wallet</div>
          </div>
          <div className="flex flex-row items-center gap-3 bg-[#FFFFFF]/3 py-2 px-3 rounded-xl mt-2 hover:bg-amber-50/10 transition-all duration-300  ease-in-out">
            <img src={GrayCircle} className="h-[16px] w-[16px]" />
            <div className="text-[#6A7282] text-[16px]">Global Campaign</div>
          </div>
        </motion.div>
      </div>

      <motion.div
        ref={footerRef}
        initial={{ opacity: 0, y: 50 }}
        animate={footerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-[#4A5565] text-[24px] mt-26 leading-6"
      >
        Follow our journey as we build the future of Bitcoin DeFi. <br />
        <span className="underline cursor-pointer hover:text-[#4A9390]">Join our community</span> to stay updated.
      </motion.div>
    </div>
  );
};

export default ProjectPhases;
