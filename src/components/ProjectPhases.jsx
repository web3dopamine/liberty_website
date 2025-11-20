import { GrayCircle, GreenTickCircle, OrangleClockCircle, Logo } from "../assets/images";
import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";

const ProjectPhases = () => {
  const titleRef = useRef(null);
  const phase1Ref = useRef(null);
  const phase2Ref = useRef(null);
  const phase3Ref = useRef(null);
  const phase4Ref = useRef(null);
  const footerRef = useRef(null);

  const titleInView = useInView(titleRef, { once: true, amount: 0.3 });
  const phase1InView = useInView(phase1Ref, { once: true, margin: "-50px" });
  const phase2InView = useInView(phase2Ref, { once: true, margin: "-50px" });
  const phase3InView = useInView(phase3Ref, { once: true, margin: "-50px" });
  const phase4InView = useInView(phase4Ref, { once: true, margin: "-50px" });
  const footerInView = useInView(footerRef, { once: true, margin: "-50px" });
  
  const [animateLogo, setAnimateLogo] = useState(0);

  useEffect(() => {
    if (titleInView) {
      setAnimateLogo(prev => prev + 1);
    }
  }, [titleInView]);

  return (
    <div id="phases" className="text-center pt-20 md:pt-30 lg:pt-40 pb-16 md:pb-20 flex flex-col items-center bg-[#000000] bg-radial from-[#3A7875]/30 via-[#3A7875]/5 to-[#000000] px-4">
      <div className="text-[#99A1AF] bg-white/3 tracking-widest border border-gray-400/20 px-3 py-1 rounded-2xl text-xs md:text-sm lg:text-[14px]">
        ROADMAP
      </div>
      <motion.div
        ref={titleRef}
        initial={{ opacity: 0, y: 50 }}
        animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col md:flex-row items-baseline justify-center gap-2 md:gap-4 mt-7 pb-4 overflow-visible"
        style={{ lineHeight: '1.3' }}
      >
        <div className="flex items-baseline gap-0">
          <span className="text-4xl md:text-6xl lg:text-[96px] tracking-tight text-white font-normal small-caps" style={{ lineHeight: '1.3' }}>Li</span>
          <motion.img 
            key={animateLogo}
            src={Logo} 
            alt="Bitcoin" 
            className="h-[42px] md:h-[60px] lg:h-[96px] -mx-1 cursor-pointer"
            style={{ filter: 'brightness(0) invert(1)' }}
            initial={{ rotate: 0 }}
            animate={{ 
              rotate: [0, -30, 30, 0]
            }}
            transition={{ 
              duration: 0.8,
              times: [0, 0.33, 0.66, 1],
              ease: "easeInOut"
            }}
            whileHover={{ 
              rotate: [0, -30, 30, 0],
              transition: { 
                duration: 0.8,
                times: [0, 0.33, 0.66, 1],
                ease: "easeInOut"
              }
            }}
          />
          <span className="text-4xl md:text-6xl lg:text-[96px] tracking-tight text-white font-normal small-caps" style={{ lineHeight: '1.3' }}>erty</span>
        </div>
        <span className="text-4xl md:text-6xl lg:text-[96px] bg-linear-to-b from-[#2D5F5D] to-[#4A9390] text-transparent bg-clip-text tracking-tight" style={{ lineHeight: '1.3' }}>
          Phases
        </span>
      </motion.div>
      <div className="text-[#8092AC] text-lg md:text-xl lg:text-[24px] mt-4 px-4">Track our progress from formation to global expansion</div>

      <div className="flex flex-col lg:flex-row mt-12 md:mt-16 gap-8 md:gap-10 w-full max-w-7xl">
        {/* Awareness & Anticipation */}
        <motion.div
          ref={phase1Ref}
          initial={{ opacity: 0, y: 100 }}
          animate={phase1InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{
            scale: 1.03,
          }}
          className="border group border-[#4A9390]/30 p-6 rounded-3xl flex flex-col relative text-start w-full lg:max-w-[612px] bg-linear-to-br from-[#2D5F5D]/20 via-[#000000] to-[#3A7875]/10 hover:to-[#3A7875]/20 hover:from-[#2D5F5D]/30  hover:shadow-2xl transition-all duration-300  ease-in-out select-none "
        >
          <div className="absolute top-6 right-6 bg-[#376e6d] text-white text-xs md:text-[12px] px-3 md:px-4 py-[4px] rounded-2xl">
            ACTIVE
          </div>
          <div className="text-[#3A7875] text-7xl md:text-8xl lg:text-[128px]">1</div>
          <div className="text-[#ffffff] text-2xl md:text-3xl lg:text-[40px] group-hover:text-[#2D5F5D] transition-all duration-300  ease-in-out">
            Awareness & Anticipation
          </div>
          <div className="text-[#99A1AF] text-base md:text-lg lg:text-[18px] mt-2">
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
            scale: 1.03,
          }}
          className=" p-6 group rounded-3xl flex flex-col relative text-start w-full lg:max-w-[612px] bg-white/5 hover:shadow-2xl transition-all duration-300 ease-in-out select-none"
        >
          <div className="text-[#FFFFFF]/10 text-7xl md:text-8xl lg:text-[128px] ">2</div>
          <div className="text-[#ffffff] text-2xl md:text-3xl lg:text-[40px] group-hover:text-[#2D5F5D] transition-all duration-300  ease-in-out">
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

      <div className="flex flex-col lg:flex-row mt-8 md:mt-10 gap-8 md:gap-10 w-full max-w-7xl">
        {/* Genesis Launch */}
        <motion.div
          ref={phase3Ref}
          initial={{ opacity: 0, y: 100 }}
          animate={phase3InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{
            scale: 1.03,
          }}
          className=" p-6 group rounded-3xl flex flex-col relative text-start w-full lg:max-w-[612px] bg-white/5 hover:shadow-2xl transition-all duration-300 ease-in-out select-none"
        >
          <div className="text-[#FFFFFF]/10 text-7xl md:text-8xl lg:text-[128px] ">3</div>
          <div className="text-[#ffffff] text-2xl md:text-3xl lg:text-[40px] group-hover:text-[#2D5F5D] transition-all duration-300  ease-in-out">
            Genesis Launch
          </div>
          <div className="text-[#99A1AF] text-[18px] mt-2">
            EVM L2 on Celestia goes live. LBTY token launch with full DeFi ecosystem.
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
            scale: 1.03,
          }}
          className=" p-6 group rounded-3xl flex flex-col relative text-start w-full lg:max-w-[612px] bg-white/5 hover:shadow-2xl transition-all duration-300 ease-in-out select-none"
        >
          <div className="text-[#FFFFFF]/10 text-7xl md:text-8xl lg:text-[128px] ">4</div>
          <div className="text-[#ffffff] text-2xl md:text-3xl lg:text-[40px] group-hover:text-[#2D5F5D] transition-all duration-300  ease-in-out">
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
