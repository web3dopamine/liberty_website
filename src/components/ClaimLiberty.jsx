import { motion, useInView } from "motion/react";
import { useRef } from "react";
import xverseLogo from "../assets/images/xverse.svg";
import unisatLogo from "../assets/images/unisat.svg";
import okxLogo from "../assets/images/okx.svg";
import phantomLogo from "../assets/images/phantom.svg";
import blockchainLogo from "../assets/images/blockchain.svg";
import metamaskLogo from "../assets/images/metamask.svg";
import bitgetLogo from "../assets/images/bitget.svg";
import trustLogo from "../assets/images/trust.svg";

const ClaimLiberty = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const wallets = [
    { name: 'XVerse', logo: xverseLogo },
    { name: 'Unisat', logo: unisatLogo },
    { name: 'OKX', logo: okxLogo },
    { name: 'Phantom', logo: phantomLogo },
    { name: 'Blockchain', logo: blockchainLogo },
    { name: 'MetaMask', logo: metamaskLogo },
    { name: 'Bitget', logo: bitgetLogo },
    { name: 'Trust', logo: trustLogo }
  ];

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-gray-50 rounded-3xl p-8 md:p-12"
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
            {wallets.map((wallet, index) => (
              <motion.div
                key={wallet.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.05 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
              >
                <div className="w-16 h-16 flex items-center justify-center mb-3">
                  <img 
                    src={wallet.logo} 
                    alt={`${wallet.name} logo`} 
                    className="w-full h-full object-contain"
                  />
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
        </motion.div>
      </div>
    </section>
  );
};

export default ClaimLiberty;
