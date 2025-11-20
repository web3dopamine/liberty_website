import { motion, useInView } from "motion/react";
import { useRef } from "react";

const ClaimLiberty = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const steps = [
    {
      number: "01",
      title: "Connect Wallet",
      description: "Link your Bitcoin wallet (XVerse, Unisat, or OKX) to verify ownership"
    },
    {
      number: "02",
      title: "Verify Ownership",
      description: "Sign a message to prove you control your Bitcoin address"
    },
    {
      number: "03",
      title: "Link Liberty Address",
      description: "Connect your Liberty wallet address to receive your LBTY tokens"
    },
    {
      number: "04",
      title: "Claim Tokens",
      description: "Receive your LBTY at a 1:10 ratio based on your BTC balance"
    }
  ];

  const handleClaimClick = () => {
    window.history.pushState({}, '', '/ownership');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <section ref={sectionRef} className="w-full py-16 md:py-24 lg:py-32 px-4 md:px-8 bg-gradient-to-b from-white via-gray-50/30 to-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="flex flex-row gap-1 border rounded-3xl border-[#4A9390]/20 bg-[#2D5F5D]/5 px-4 py-2 w-fit mx-auto mb-6">
            <div className="text-[#2D5F5D] text-xs md:text-sm lg:text-[14px]">Token Claim</div>
          </div>
          
          <div className="text-4xl md:text-6xl lg:text-[96px] tracking-tight leading-tight md:leading-30 mt-6">
            <span className="bg-linear-to-t from-[#000000] via-[#000000]/90 to-[#000000]/60 text-transparent bg-clip-text">Claim your </span>
            <span className="bg-linear-to-t from-[#2D5F5D] to-[#4A9390] text-transparent bg-clip-text">Liberty</span>
            <span className="bg-linear-to-t from-[#000000] via-[#000000]/90 to-[#000000]/60 text-transparent bg-clip-text">.</span>
          </div>
          
          <div className="text-[#4A5565] text-lg md:text-xl lg:text-[24px] mt-6 md:mt-8 px-4">
            Connect your Bitcoin wallet to verify ownership and claim your tokens.
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-[#2B5A3F] text-sm font-bold mb-3 opacity-60">
                {step.number}
              </div>
              <h4 className="text-xl font-bold mb-2 text-gray-900">
                {step.title}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center"
        >
          <button
            onClick={handleClaimClick}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#2B5A3F] text-white rounded-full font-semibold text-lg hover:bg-[#234a33] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Start Claiming Now
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 8l4 4m0 0l-4 4m4-4H3" 
              />
            </svg>
          </button>
          
          <p className="text-sm text-gray-500 mt-4">
            Minimum 0.003 BTC required to claim
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ClaimLiberty;
