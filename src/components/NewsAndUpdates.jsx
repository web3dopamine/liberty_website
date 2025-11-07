import { useState } from "react";
import { CodeBlock2, Github, Logo2, NewsAndUpdatesBg, Tablet } from "../assets/images";
import { motion } from "motion/react";

const NewsAndUpdates = () => {
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
    <div className="relative text-center flex flex-col items-center h-[1750px] overflow-hidden">
      <img src={NewsAndUpdatesBg} className="w-full absolute min-h-[1787px] object-cover" />
      <div className="text-[96px] tracking-tight leading-30 mt-8 text-white z-2 mt-50">
        News <span className="bg-linear-to-t from-[#2D5F5D] to-[#4A9390] text-transparent bg-clip-text">& updates</span>
      </div>
      <div className="text-[#99A1AF] text-[24px] mt-8 z-2">
        Get notified about snapshot dates, claim periods, and major announcements.
      </div>
      <div className="flex flex-row z-2 gap-12 mt-30">
        <div
          key={"card1"}
          className="flex flex-col text-start max-w-[400px] bg-white/5 rounded-4xl border border-white/5 py-5 pb-10 transition-all duration-300 ease-out hover:bg-white/15"
          style={{
            perspective: "1000px",
            transform:
              hoveredCard === "card1" ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ` : "rotateX(0deg) rotateY(0deg) ",
            transformStyle: "preserve-3d",
          }}
          onMouseMove={(e) => handleMouseMove(e, "card1")}
          onMouseLeave={handleMouseLeave}
        >
          <img src={CodeBlock2} className="w-[140px] h-[140px]" />
          <div className="text-[24px] uppercase text-white px-8">API Documentation</div>
          <div className="text-[18px] text-[#99A1AF] px-8 mt-11 mb-13">
            Comprehensive API docs and integration guides
          </div>
          <button className="bg-white mx-10 text-[14px] rounded-3xl py-4 cursor-pointer">VIEW DOCS</button>
        </div>

        <div
          key={"card2"}
          className="flex flex-col text-start max-w-[400px] bg-white/5 rounded-4xl border border-white/5 py-5 pb-10 transition-all duration-300 ease-out hover:bg-white/15"
          style={{
            perspective: "1000px",
            transform:
              hoveredCard === "card2" ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ` : "rotateX(0deg) rotateY(0deg) ",
            transformStyle: "preserve-3d",
          }}
          onMouseMove={(e) => handleMouseMove(e, "card2")}
          onMouseLeave={handleMouseLeave}
        >
          <img src={Tablet} className="w-[140px] h-[140px]" />
          <div className="text-[24px] uppercase text-white px-8">Technical Updates</div>
          <div className="text-[18px] text-[#99A1AF] px-8 mt-11 mb-13">
            Latest improvements, development progress, and technical milestones.
          </div>
          <button className="bg-white mx-10 text-[14px] rounded-3xl py-4 cursor-pointer">LEARN MORE</button>
        </div>

        <div
          key={"card3"}
          className="flex flex-col text-start max-w-[400px] bg-white/5 rounded-4xl border border-white/5 py-5 pb-10 transition-all duration-300 ease-out hover:bg-white/15"
          style={{
            perspective: "1000px",
            transform:
              hoveredCard === "card3" ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ` : "rotateX(0deg) rotateY(0deg) ",
            transformStyle: "preserve-3d",
          }}
          onMouseMove={(e) => handleMouseMove(e, "card3")}
          onMouseLeave={handleMouseLeave}
        >
          <img src={Github} className="w-[140px] h-[140px]" />
          <div className="text-[24px] uppercase text-white px-8">Github</div>
          <div className="text-[18px] text-[#99A1AF] px-8 mt-11 mb-13">
            Open source code and community contributions
          </div>
          <button className="bg-white mx-10 text-[14px] rounded-3xl py-4 cursor-pointer">VIEW REPOS</button>
        </div>
      </div>

      <div className="text-[128px] uppercase tracking-tight leading-30 bg-linear-to-t from-[#2D5F5D] to-[#4A9390] text-transparent bg-clip-text z-2 mt-50">
        Programmable <br /> <span className="text-white">+ </span> Gas Free
      </div>

      <motion.img
        animate={{
          y: [-10, 10],
          transition: {
            duration: 1,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          },
        }}
        src={Logo2}
        className="z-2 mt-30"
      />
    </div>
  );
};

export default NewsAndUpdates;