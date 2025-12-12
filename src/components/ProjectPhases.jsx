import { GrayCircle, GreenTickCircle, OrangleClockCircle } from "../assets/images";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const ProjectPhases = () => {
  const titleRef = useRef(null);
  const phase1Ref = useRef(null);
  const phase2Ref = useRef(null);
  const phase3Ref = useRef(null);
  const footerRef = useRef(null);

  const titleInView = useInView(titleRef, { once: true, amount: 0.3 });
  const phase1InView = useInView(phase1Ref, { once: true, margin: "-50px" });
  const phase2InView = useInView(phase2Ref, { once: true, margin: "-50px" });
  const phase3InView = useInView(phase3Ref, { once: true, margin: "-50px" });
  const footerInView = useInView(footerRef, { once: true, margin: "-50px" });

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
        <span className="text-4xl md:text-6xl lg:text-[96px] tracking-tight text-white font-normal small-caps" style={{ lineHeight: '1.3' }}>Liberty</span>
        <span className="text-4xl md:text-6xl lg:text-[96px] bg-linear-to-b from-[#2D5F5D] to-[#4A9390] text-transparent bg-clip-text tracking-tight" style={{ lineHeight: '1.3' }}>
          Phases
        </span>
      </motion.div>
      <div className="text-[#8092AC] text-lg md:text-xl lg:text-[24px] mt-4 px-4">Track our progress from formation to global expansion</div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-12 md:mt-16 gap-6 md:gap-8 w-full max-w-7xl">
        <motion.div
          ref={phase1Ref}
          initial={{ opacity: 0, y: 100 }}
          animate={phase1InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{ scale: 1.02 }}
          className="border group border-[#4A9390]/30 p-5 md:p-6 rounded-3xl flex flex-col relative text-start bg-linear-to-br from-[#2D5F5D]/20 via-[#000000] to-[#3A7875]/10 hover:to-[#3A7875]/20 hover:from-[#2D5F5D]/30 hover:shadow-2xl transition-all duration-300 ease-in-out select-none"
        >
          <div className="absolute top-5 md:top-6 right-5 md:right-6 bg-[#376e6d] text-white text-[10px] md:text-[12px] px-3 py-1 rounded-2xl">
            ACTIVE
          </div>
          <div className="text-[#3A7875] text-6xl md:text-7xl lg:text-[100px]">1</div>
          <div className="text-[#ffffff] text-xl md:text-2xl lg:text-[32px] group-hover:text-[#2D5F5D] transition-all duration-300 ease-in-out">
            Foundation
          </div>
          <div className="flex flex-row items-center gap-3 bg-[#2D5F5D]/8 py-2 px-3 rounded-xl mt-5 hover:bg-amber-50/10 transition-all duration-300 ease-in-out">
            <img src={GreenTickCircle} className="h-4 w-4" />
            <div className="text-white text-sm md:text-[15px]">Testnet deployment</div>
          </div>
          <div className="flex flex-row items-center gap-3 bg-[#2D5F5D]/6 py-2 px-3 rounded-xl mt-2 hover:bg-amber-50/10 transition-all duration-300 ease-in-out">
            <img src={OrangleClockCircle} className="h-4 w-4" />
            <div className="text-white text-sm md:text-[15px]">Mainnet activation</div>
          </div>
          <div className="flex flex-row items-center gap-3 bg-[#2D5F5D]/6 py-2 px-3 rounded-xl mt-2 hover:bg-amber-50/10 transition-all duration-300 ease-in-out">
            <img src={OrangleClockCircle} className="h-4 w-4" />
            <div className="text-white text-sm md:text-[15px]">Explorer release</div>
          </div>
          <div className="flex flex-row items-center gap-3 bg-[#2D5F5D]/6 py-2 px-3 rounded-xl mt-2 hover:bg-amber-50/10 transition-all duration-300 ease-in-out">
            <img src={OrangleClockCircle} className="h-4 w-4" />
            <div className="text-white text-sm md:text-[15px]">Core documentation + SDKs</div>
          </div>
          <div className="flex flex-row items-center gap-3 bg-[#2D5F5D]/6 py-2 px-3 rounded-xl mt-2 hover:bg-amber-50/10 transition-all duration-300 ease-in-out">
            <img src={OrangleClockCircle} className="h-4 w-4" />
            <div className="text-white text-sm md:text-[15px]">Global validator pool</div>
          </div>
        </motion.div>

        <motion.div
          ref={phase2Ref}
          initial={{ opacity: 0, y: 100 }}
          animate={phase2InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="p-5 md:p-6 group rounded-3xl flex flex-col relative text-start bg-white/5 hover:shadow-2xl transition-all duration-300 ease-in-out select-none"
        >
          <div className="text-[#FFFFFF]/10 text-6xl md:text-7xl lg:text-[100px]">2</div>
          <div className="text-[#ffffff] text-xl md:text-2xl lg:text-[32px] group-hover:text-[#2D5F5D] transition-all duration-300 ease-in-out">
            Ecosystem Expansion
          </div>
          <div className="flex flex-row items-center gap-3 bg-[#FFFFFF]/3 py-2 px-3 rounded-xl mt-5 hover:bg-amber-50/10 transition-all duration-300 ease-in-out">
            <img src={GrayCircle} className="h-4 w-4" />
            <div className="text-[#6A7282] text-sm md:text-[15px]">Wallet integrations</div>
          </div>
          <div className="flex flex-row items-center gap-3 bg-[#FFFFFF]/3 py-2 px-3 rounded-xl mt-2 hover:bg-amber-50/10 transition-all duration-300 ease-in-out">
            <img src={GrayCircle} className="h-4 w-4" />
            <div className="text-[#6A7282] text-sm md:text-[15px]">Indexer ecosystem</div>
          </div>
          <div className="flex flex-row items-center gap-3 bg-[#FFFFFF]/3 py-2 px-3 rounded-xl mt-2 hover:bg-amber-50/10 transition-all duration-300 ease-in-out">
            <img src={GrayCircle} className="h-4 w-4" />
            <div className="text-[#6A7282] text-sm md:text-[15px]">Token launch infrastructure</div>
          </div>
          <div className="flex flex-row items-center gap-3 bg-[#FFFFFF]/3 py-2 px-3 rounded-xl mt-2 hover:bg-amber-50/10 transition-all duration-300 ease-in-out">
            <img src={GrayCircle} className="h-4 w-4" />
            <div className="text-[#6A7282] text-sm md:text-[15px]">Developer grants</div>
          </div>
          <div className="flex flex-row items-center gap-3 bg-[#FFFFFF]/3 py-2 px-3 rounded-xl mt-2 hover:bg-amber-50/10 transition-all duration-300 ease-in-out">
            <img src={GrayCircle} className="h-4 w-4" />
            <div className="text-[#6A7282] text-sm md:text-[15px]">Community validator expansion</div>
          </div>
        </motion.div>

        <motion.div
          ref={phase3Ref}
          initial={{ opacity: 0, y: 100 }}
          animate={phase3InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          className="p-5 md:p-6 group rounded-3xl flex flex-col relative text-start bg-white/5 hover:shadow-2xl transition-all duration-300 ease-in-out select-none md:col-span-2 lg:col-span-1"
        >
          <div className="text-[#FFFFFF]/10 text-6xl md:text-7xl lg:text-[100px]">3</div>
          <div className="text-[#ffffff] text-xl md:text-2xl lg:text-[32px] group-hover:text-[#2D5F5D] transition-all duration-300 ease-in-out">
            Mass Adoption
          </div>
          <div className="flex flex-row items-center gap-3 bg-[#FFFFFF]/3 py-2 px-3 rounded-xl mt-5 hover:bg-amber-50/10 transition-all duration-300 ease-in-out">
            <img src={GrayCircle} className="h-4 w-4" />
            <div className="text-[#6A7282] text-sm md:text-[15px]">AI frameworks</div>
          </div>
          <div className="flex flex-row items-center gap-3 bg-[#FFFFFF]/3 py-2 px-3 rounded-xl mt-2 hover:bg-amber-50/10 transition-all duration-300 ease-in-out">
            <img src={GrayCircle} className="h-4 w-4" />
            <div className="text-[#6A7282] text-sm md:text-[15px]">Gaming ecosystems</div>
          </div>
          <div className="flex flex-row items-center gap-3 bg-[#FFFFFF]/3 py-2 px-3 rounded-xl mt-2 hover:bg-amber-50/10 transition-all duration-300 ease-in-out">
            <img src={GrayCircle} className="h-4 w-4" />
            <div className="text-[#6A7282] text-sm md:text-[15px]">Enterprise integrations</div>
          </div>
          <div className="flex flex-row items-center gap-3 bg-[#FFFFFF]/3 py-2 px-3 rounded-xl mt-2 hover:bg-amber-50/10 transition-all duration-300 ease-in-out">
            <img src={GrayCircle} className="h-4 w-4" />
            <div className="text-[#6A7282] text-sm md:text-[15px]">Large-scale consumer apps</div>
          </div>
          <div className="flex flex-row items-center gap-3 bg-[#FFFFFF]/3 py-2 px-3 rounded-xl mt-2 hover:bg-amber-50/10 transition-all duration-300 ease-in-out">
            <img src={GrayCircle} className="h-4 w-4" />
            <div className="text-[#6A7282] text-sm md:text-[15px]">Cross-chain growth</div>
          </div>
        </motion.div>
      </div>

      <motion.div
        ref={footerRef}
        initial={{ opacity: 0, y: 50 }}
        animate={footerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-[#4A5565] text-lg md:text-xl lg:text-[24px] mt-16 md:mt-20 lg:mt-26 leading-6 px-4"
      >
        Follow our journey as we build the future of Bitcoin DeFi. <br />
        <span className="underline cursor-pointer hover:text-[#4A9390]">Join our community</span> to stay updated.
      </motion.div>
    </div>
  );
};

export default ProjectPhases;
