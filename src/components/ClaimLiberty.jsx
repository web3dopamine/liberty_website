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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full mb-6">
            <div className="w-2 h-2 bg-[#2B5A3F] rounded-full"></div>
            <span className="text-sm text-gray-600 font-medium">Token Claim</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Claim your LBTY.
          </h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2B5A3F] mb-6">
            It's seamless.
          </h3>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Connect your Bitcoin wallet to verify ownership and claim your tokens.
          </p>
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
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gray-50 rounded-3xl p-8 md:p-12 mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
              Select your wallet
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span>0 available</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'XVerse', icon: '✕', bgColor: 'bg-black', textColor: 'text-white' },
              { name: 'Unisat', icon: '$', bgColor: 'bg-orange-500', textColor: 'text-white' },
              { name: 'OKX', icon: '▦', bgColor: 'bg-gray-900', textColor: 'text-white' },
              { name: 'Phantom', icon: '👻', bgColor: 'bg-purple-500', textColor: 'text-white' }
            ].map((wallet, index) => (
              <motion.div
                key={wallet.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                <div className={`w-12 h-12 ${wallet.bgColor} ${wallet.textColor} rounded-xl flex items-center justify-center text-2xl mb-3`}>
                  {wallet.icon}
                </div>
                <div className="font-semibold text-gray-900 mb-1">
                  {wallet.name}
                </div>
                <div className="text-sm text-orange-500 font-medium">
                  Not Detected
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Install one of these Bitcoin wallets to continue with the claim process
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.1 }}
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
