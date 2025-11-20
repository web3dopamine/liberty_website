import { Handshake, Magnify, Note, NoteGreen, Rocket, Logo } from "../assets/images";
import { motion, useInView } from "motion/react";
import GrantApplicationModal from "../modals/GrantApplicationModal";
import { useRef, useState, useEffect } from "react";

const GrantApplicationProcess = () => {
  const grantModalRef = useRef(null);
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 });
  const [animateLogo, setAnimateLogo] = useState(0);

  useEffect(() => {
    if (ctaInView) {
      setAnimateLogo(prev => prev + 1);
    }
  }, [ctaInView]);

  return (
    <div className="text-center pb-20 md:pb-28 lg:pb-35 flex flex-col items-center bg-[#f6f8f8] px-4">
      <div className="flex flex-row gap-2 border rounded-3xl border-[#4A9390]/20 bg-[#2D5F5D]/5 px-4 py-2">
        <img src={NoteGreen} className="w-4" />
        <div className="text-[#2D5F5D] text-xs md:text-sm lg:text-[14px]">Application Process</div>
      </div>
      <div className="text-4xl md:text-6xl lg:text-[96px] tracking-tight leading-tight md:leading-30 mt-6 md:mt-8 bg-linear-to-t from-[#000000] via-[#000000]/90 to-[#000000]/60 text-transparent bg-clip-text">
        Grant Application Process
      </div>
      <div className="text-[#4A5565] text-lg md:text-xl lg:text-[24px] mt-6 md:mt-8 px-4">Four simple steps from proposal to funding</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-9 mt-10 md:mt-12 lg:mt-15 w-full max-w-7xl">
        <div className="bg-linear-to-b shadow-lg from-[#ffffff] via-black/8 to-white p-6 md:p-7 rounded-3xl flex flex-col text-start w-full hover:-translate-y-2 hover:via-white hover:bg-none hover:bg-emerald-100/40 hover:shadow-2xl transition-all duration-300 delay-200 ease-in-out hover:text-emerald-900 select-none">
          <img src={Note} className="h-[64px] w-[64px]" />
          <div className="text-[30px] mt-5">Submit Proposal</div>
          <div className="text-[18px] text-[#4A5565] mt-2">Submit your detailed project proposal and timeline</div>
        </div>
        <div className="bg-linear-to-b shadow-lg from-[#ffffff] via-black/8 to-white p-8 rounded-3xl flex flex-col text-start w-full hover:-translate-y-2 hover:via-white hover:bg-none hover:bg-emerald-100/40 hover:shadow-2xl transition-all duration-300 delay-200 ease-in-out hover:text-emerald-900 select-none">
          <img src={Magnify} className="h-[64px] w-[64px]" />
          <div className="text-[30px] mt-5">Review Process</div>
          <div className="text-[18px] text-[#4A5565] mt-2">Technical and community review within 2 weeks</div>
        </div>
        <div className="bg-linear-to-b shadow-lg from-[#ffffff] via-black/8 to-white p-8 rounded-3xl flex flex-col text-start w-full hover:-translate-y-2 hover:via-white hover:bg-none hover:bg-emerald-100/40 hover:shadow-2xl transition-all duration-300 delay-200 ease-in-out hover:text-emerald-900 select-none">
          <img src={Handshake} className="h-[64px] w-[64px]" />
          <div className="text-[30px] mt-5">Approval & Terms</div>
          <div className="text-[18px] text-[#4A5565] mt-2">Agreement on milestones and payment schedule</div>
        </div>
        <div className="bg-linear-to-b shadow-lg from-[#ffffff] via-black/8 to-white p-8 rounded-3xl flex flex-col text-start w-full hover:-translate-y-2 hover:via-white hover:bg-none hover:bg-emerald-100/40 hover:shadow-2xl transition-all duration-300 delay-200 ease-in-out hover:text-emerald-900 select-none">
          <img src={Rocket} className="h-[64px] w-[64px]" />
          <div className="text-[30px] mt-5">Build & Deploy</div>
          <div className="text-[18px] text-[#4A5565] mt-2">Execute your project with ongoing support</div>
        </div>
      </div>

      <div ref={ctaRef} className="flex flex-col bg-linear-to-b from-[#0A1F20] to-[#105359] text-white items-center pt-8 md:pt-10 pb-12 md:pb-14 mt-16 md:mt-20 lg:mt-23 px-6 md:px-20 lg:px-60 rounded-4xl w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-wrap items-baseline justify-center gap-2 md:gap-3 pb-4"
          style={{ lineHeight: '1.4' }}
        >
          <span className="text-3xl md:text-5xl lg:text-[60px] tracking-tight text-white font-normal small-caps whitespace-nowrap" style={{ lineHeight: '1.4' }}>Ready to build</span>
          <div className="flex items-baseline gap-2 md:gap-3 whitespace-nowrap">
            <span className="text-3xl md:text-5xl lg:text-[60px] tracking-tight text-white font-normal small-caps" style={{ lineHeight: '1.4' }}>with</span>
            <div className="flex items-baseline gap-0">
              <span className="text-3xl md:text-5xl lg:text-[60px] tracking-tight text-white font-normal small-caps" style={{ lineHeight: '1.4' }}>Li</span>
              <motion.img 
                key={animateLogo}
                src={Logo} 
                alt="Bitcoin" 
                className="h-[32px] md:h-[50px] lg:h-[60px] -mx-1 cursor-pointer"
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
              <span className="text-3xl md:text-5xl lg:text-[60px] tracking-tight text-white font-normal small-caps" style={{ lineHeight: '1.4' }}>erty?</span>
            </div>
          </div>
        </motion.div>
        <div className="text-white/90 text-base md:text-xl lg:text-[24px] mt-2 font-light">
          From proposal to deployment, we support you every step of the way.
        </div>
        <div className="text-white/90 text-base md:text-xl lg:text-[24px] font-light">Average approval time: 2 weeks</div>
        <motion.div
          whileHover={{
            scale: 1.07,
          }}
          whileTap={{
            scale: 1.0,
          }}
          onClick={() => grantModalRef.current.showModal()}
          className="flex flex-row cursor-pointer gap-3 items-center justify-center mt-8 bg-white w-fit px-3 py-2.5 rounded-3xl mb-10 shadow-2xl hover:bg-[#dbf1f3]"
        >
          <img src={NoteGreen} className="w-4 h-4" />
          <div className="text-[#2D5F5D] text-[18px] font-medium "> Start Your Application</div>
        </motion.div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center text-white/80 text-sm md:text-base">
          <div className="flex flex-row items-center gap-2">
            <div className="w-1.5 h-1.5 bg-white rounded-2xl" />
            <div>No application fee</div>
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="w-1.5 h-1.5 bg-white rounded-2xl" />
            <div>Rolling applications</div>
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="w-1.5 h-1.5 bg-white rounded-2xl" />
            <div>Transparent process</div>
          </div>
        </div>
      </div>
      
      <GrantApplicationModal ref={grantModalRef} />
    </div>
  );
};

export default GrantApplicationProcess;
