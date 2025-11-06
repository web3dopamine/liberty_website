import { useState } from "react";
import { Armour, CodeBlock, Globe, Lightening, Lock, People } from "../assets/images";

const WhyLiberty = () => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);

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
    <div className="text-center pb-35 flex flex-col items-center bg-linear-to-b from-[#000000] via-[#204443] to-[#000000]">
      <div className="text-[96px] text-white mt-7">
        Why{" "}
        <span className="text-center bg-linear-to-b from-[#2D5F5D] to-[#4A9390] text-transparent bg-clip-text -mt-4 tracking-tight">
          Liberty?
        </span>
      </div>
      <div className="text-[#8092AC] text-[24px] mt-4">The most advanced decentralized protocol for Bitcoin</div>
      <div className="flex flex-row mt-10 gap-8">
        <div
          key={"card1"}
          className="bg-white/5 border border-white/5 pt-6 pb-12 rounded-3xl w-[403px] transition-all duration-300 ease-out hover:bg-white/15 select-none"
          style={{
            perspective: "1000px",
            transform:
              hoveredCard === "card1" ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ` : "rotateX(0deg) rotateY(0deg) ",
            transformStyle: "preserve-3d",
          }}
          onMouseMove={(e) => handleMouseMove(e, "card1")}
          onMouseLeave={handleMouseLeave}
        >
          <img src={Armour} className="w-[125px]" />
          <div className="uppercase text-white text-start text-[24px] px-8">Secure & Trustless</div>
          <div className=" text-[#99A1AF] text-start text-[18px] mt-10 px-8">
            Built on Bitcoin's proven security model
          </div>
        </div>
        <div
          key={"card2"}
          className="bg-white/5 border border-white/5 pt-6 pb-8 rounded-xl w-[403px] transition-all duration-300 ease-out hover:bg-white/15 select-none"
          style={{
            perspective: "1000px",
            transform:
              hoveredCard === "card2" ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ` : "rotateX(0deg) rotateY(0deg) ",
            transformStyle: "preserve-3d",
          }}
          onMouseMove={(e) => handleMouseMove(e, "card2")}
          onMouseLeave={handleMouseLeave}
        >
          <img src={Lightening} className="w-[125px]" />
          <div className="uppercase text-white text-start text-[24px] px-8">Gas-Free Transactions</div>
          <div className=" text-[#99A1AF] text-start text-[18px] mt-10 px-8">No transaction fees for token claims</div>
        </div>
        <div
          key={"card3"}
          className="bg-white/5 border border-white/5 pt-6 pb-8 rounded-xl w-[403px] transition-all duration-300 ease-out hover:bg-white/15 select-none"
          style={{
            perspective: "1000px",
            transform:
              hoveredCard === "card3" ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ` : "rotateX(0deg) rotateY(0deg) ",
            transformStyle: "preserve-3d",
          }}
          onMouseMove={(e) => handleMouseMove(e, "card3")}
          onMouseLeave={handleMouseLeave}
        >
          <img src={CodeBlock} className="w-[125px]" />
          <div className="uppercase text-white text-start text-[24px] px-8">Programmable</div>
          <div className=" text-[#99A1AF] text-start text-[18px] mt-10 px-8">
            Smart contract capabilities on Bitcoin
          </div>
        </div>
      </div>
      <div className="flex flex-row mt-8 gap-8">
        <div
          key={"card4"}
          className="bg-white/5 border border-white/5 pt-6 pb-8 rounded-xl w-[403px] transition-all duration-300 ease-out hover:bg-white/15 select-none"
          style={{
            perspective: "1000px",
            transform:
              hoveredCard === "card4" ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ` : "rotateX(0deg) rotateY(0deg) ",
            transformStyle: "preserve-3d",
          }}
          onMouseMove={(e) => handleMouseMove(e, "card4")}
          onMouseLeave={handleMouseLeave}
        >
          <img src={Lock} className="w-[125px]" />
          <div className="uppercase text-white text-start text-[24px] px-8">Self-Custody</div>
          <div className=" text-[#99A1AF] text-start text-[18px] mt-10 px-8">
            You maintain full control of your assets
          </div>
        </div>
        <div
          key={"card5"}
          className="bg-white/5 border border-white/5 pt-6 pb-8 rounded-xl w-[403px] transition-all duration-300 ease-out hover:bg-white/15 select-none"
          style={{
            perspective: "1000px",
            transform:
              hoveredCard === "card5" ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ` : "rotateX(0deg) rotateY(0deg) ",
            transformStyle: "preserve-3d",
          }}
          onMouseMove={(e) => handleMouseMove(e, "card5")}
          onMouseLeave={handleMouseLeave}
        >
          <img src={People} className="w-[125px]" />
          <div className="uppercase text-white text-start text-[24px] px-8">Community Driven</div>
          <div className=" text-[#99A1AF] text-start text-[18px] mt-10 px-8">Governed by token holders</div>
        </div>
        <div
          key={"card6"}
          className="bg-white/5 border border-white/5 pt-6 pb-12 rounded-xl w-[403px] transition-all duration-300 ease-out hover:bg-white/15 select-none"
          style={{
            perspective: "1000px",
            transform:
              hoveredCard === "card6" ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ` : "rotateX(0deg) rotateY(0deg) ",
            transformStyle: "preserve-3d",
          }}
          onMouseMove={(e) => handleMouseMove(e, "card6")}
          onMouseLeave={handleMouseLeave}
        >
          <img src={Globe} className="w-[125px]" />
          <div className="uppercase text-white text-start text-[24px] px-8">Global Access</div>
          <div className=" text-[#99A1AF] text-start text-[18px] mt-10 px-8">Available to eligible users worldwide</div>
        </div>
      </div>
    </div>
  );
};

export default WhyLiberty;
