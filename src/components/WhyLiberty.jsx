import { useState, useRef } from "react";
import { Armour, CodeBlock, Globe, Lightening, Lock, People } from "../assets/images";
import { motion, useInView } from "motion/react";

const WhyLiberty = () => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);
  
  const sectionRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const card4Ref = useRef(null);
  const card5Ref = useRef(null);
  const card6Ref = useRef(null);

  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const card1InView = useInView(card1Ref, { once: true, margin: "-50px" });
  const card2InView = useInView(card2Ref, { once: true, margin: "-50px" });
  const card3InView = useInView(card3Ref, { once: true, margin: "-50px" });
  const card4InView = useInView(card4Ref, { once: true, margin: "-50px" });
  const card5InView = useInView(card5Ref, { once: true, margin: "-50px" });
  const card6InView = useInView(card6Ref, { once: true, margin: "-50px" });

  const handleMouseMove = (e, cardId) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 20;

    setTilt({ x: rotateX, y: rotateY });
    setHoveredCard(cardId);
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHoveredCard(null);
  };

  return (
    <div ref={sectionRef} className="text-center pb-20 md:pb-28 lg:pb-35 flex flex-col items-center bg-linear-to-b from-[#000000] via-[#204443] to-[#000000] px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row items-baseline justify-center gap-2 md:gap-4 pb-12 mt-7 overflow-visible"
        style={{ lineHeight: '1.8' }}
      >
        <span className="text-4xl md:text-6xl lg:text-[96px] text-white tracking-tight" style={{ lineHeight: '1.8' }}>Why </span>
        <span className="text-4xl md:text-6xl lg:text-[96px] tracking-tight bg-linear-to-t from-[#2D5F5D] to-[#4A9390] text-transparent bg-clip-text font-normal small-caps" style={{ lineHeight: '1.8' }}>Liberty?</span>
      </motion.div>
      <div className="text-[#8092AC] text-lg md:text-xl lg:text-[24px] mt-4 px-4">The most advanced decentralized protocol for Bitcoin</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-10 gap-6 md:gap-8 w-full max-w-7xl">
        <motion.div
          ref={card1Ref}
          initial={{ opacity: 0, y: 100 }}
          animate={card1InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          key={"card1"}
          className="bg-white/5 border border-white/5 pt-6 pb-12 rounded-3xl w-full transition-all duration-300 ease-out hover:bg-white/15 select-none"
          style={{
            perspective: "1000px",
            transform:
              hoveredCard === "card1" ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ` : "rotateX(0deg) rotateY(0deg) ",
            transformStyle: "preserve-3d",
          }}
          onMouseMove={(e) => handleMouseMove(e, "card1")}
          onMouseLeave={handleMouseLeave}
        >
          <img src={Armour} className="w-20 md:w-24 lg:w-[125px]" />
          <div className="uppercase text-white text-start text-lg md:text-xl lg:text-[24px] px-6 md:px-8">Secure & Trustless</div>
          <div className=" text-[#99A1AF] text-start text-base md:text-lg lg:text-[18px] mt-8 md:mt-10 px-6 md:px-8">
            Built on Bitcoin's proven security model
          </div>
        </motion.div>
        <motion.div
          ref={card2Ref}
          initial={{ opacity: 0, y: 100 }}
          animate={card2InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          key={"card2"}
          className="bg-white/5 border border-white/5 pt-6 pb-8 rounded-xl w-full transition-all duration-300 ease-out hover:bg-white/15 select-none"
          style={{
            perspective: "1000px",
            transform:
              hoveredCard === "card2" ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ` : "rotateX(0deg) rotateY(0deg) ",
            transformStyle: "preserve-3d",
          }}
          onMouseMove={(e) => handleMouseMove(e, "card2")}
          onMouseLeave={handleMouseLeave}
        >
          <img src={Lightening} className="w-20 md:w-24 lg:w-[125px]" />
          <div className="uppercase text-white text-start text-lg md:text-xl lg:text-[24px] px-6 md:px-8">Gas-Free Transactions</div>
          <div className=" text-[#99A1AF] text-start text-base md:text-lg lg:text-[18px] mt-8 md:mt-10 px-6 md:px-8">No transaction fees for token claims</div>
        </motion.div>
        <motion.div
          ref={card3Ref}
          initial={{ opacity: 0, y: 100 }}
          animate={card3InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          key={"card3"}
          className="bg-white/5 border border-white/5 pt-6 pb-8 rounded-xl w-full transition-all duration-300 ease-out hover:bg-white/15 select-none"
          style={{
            perspective: "1000px",
            transform:
              hoveredCard === "card3" ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ` : "rotateX(0deg) rotateY(0deg) ",
            transformStyle: "preserve-3d",
          }}
          onMouseMove={(e) => handleMouseMove(e, "card3")}
          onMouseLeave={handleMouseLeave}
        >
          <img src={CodeBlock} className="w-20 md:w-24 lg:w-[125px]" />
          <div className="uppercase text-white text-start text-lg md:text-xl lg:text-[24px] px-6 md:px-8">Programmable</div>
          <div className=" text-[#99A1AF] text-start text-base md:text-lg lg:text-[18px] mt-8 md:mt-10 px-6 md:px-8">
            Smart contract capabilities on Bitcoin
          </div>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6 md:mt-8 gap-6 md:gap-8 w-full max-w-7xl">
        <motion.div
          ref={card4Ref}
          initial={{ opacity: 0, y: 100 }}
          animate={card4InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          key={"card4"}
          className="bg-white/5 border border-white/5 pt-6 pb-8 rounded-xl w-full transition-all duration-300 ease-out hover:bg-white/15 select-none"
          style={{
            perspective: "1000px",
            transform:
              hoveredCard === "card4" ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ` : "rotateX(0deg) rotateY(0deg) ",
            transformStyle: "preserve-3d",
          }}
          onMouseMove={(e) => handleMouseMove(e, "card4")}
          onMouseLeave={handleMouseLeave}
        >
          <img src={Lock} className="w-20 md:w-24 lg:w-[125px]" />
          <div className="uppercase text-white text-start text-lg md:text-xl lg:text-[24px] px-6 md:px-8">Self-Custody</div>
          <div className=" text-[#99A1AF] text-start text-base md:text-lg lg:text-[18px] mt-8 md:mt-10 px-6 md:px-8">
            You maintain full control of your assets
          </div>
        </motion.div>
        <motion.div
          ref={card5Ref}
          initial={{ opacity: 0, y: 100 }}
          animate={card5InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          key={"card5"}
          className="bg-white/5 border border-white/5 pt-6 pb-8 rounded-xl w-full transition-all duration-300 ease-out hover:bg-white/15 select-none"
          style={{
            perspective: "1000px",
            transform:
              hoveredCard === "card5" ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ` : "rotateX(0deg) rotateY(0deg) ",
            transformStyle: "preserve-3d",
          }}
          onMouseMove={(e) => handleMouseMove(e, "card5")}
          onMouseLeave={handleMouseLeave}
        >
          <img src={People} className="w-20 md:w-24 lg:w-[125px]" />
          <div className="uppercase text-white text-start text-lg md:text-xl lg:text-[24px] px-6 md:px-8">Community Driven</div>
          <div className=" text-[#99A1AF] text-start text-base md:text-lg lg:text-[18px] mt-8 md:mt-10 px-6 md:px-8">Governed by token holders</div>
        </motion.div>
        <motion.div
          ref={card6Ref}
          initial={{ opacity: 0, y: 100 }}
          animate={card6InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          key={"card6"}
          className="bg-white/5 border border-white/5 pt-6 pb-12 rounded-xl w-full transition-all duration-300 ease-out hover:bg-white/15 select-none"
          style={{
            perspective: "1000px",
            transform:
              hoveredCard === "card6" ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ` : "rotateX(0deg) rotateY(0deg) ",
            transformStyle: "preserve-3d",
          }}
          onMouseMove={(e) => handleMouseMove(e, "card6")}
          onMouseLeave={handleMouseLeave}
        >
          <img src={Globe} className="w-20 md:w-24 lg:w-[125px]" />
          <div className="uppercase text-white text-start text-lg md:text-xl lg:text-[24px] px-6 md:px-8">Global Access</div>
          <div className=" text-[#99A1AF] text-start text-base md:text-lg lg:text-[18px] mt-8 md:mt-10 px-6 md:px-8">Available to eligible users worldwide</div>
        </motion.div>
      </div>
    </div>
  );
};

export default WhyLiberty;
