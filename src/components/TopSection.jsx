import { Logo } from "../assets/images";
import Header from "./Header";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

const VideoPlayer = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <video
        src="/videos/hero-video.webm"
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        onCanPlay={(e) => e.currentTarget.play()}
      />
    </div>
  );
};

const LogoOverlay = () => {
  return (
    <div className="absolute top-[40%] md:top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-[85%] md:w-[80%] lg:w-[70%] max-w-[1200px]">
      <video
        src="/videos/logo-overlay.webm"
        className="w-full h-auto"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        onCanPlay={(e) => e.currentTarget.play()}
      />
    </div>
  );
};

const Typewriter = ({ text, delay = 100, className }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;

    if (!isDeleting && currentIndex < text.length) {
      timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);
    } else if (!isDeleting && currentIndex === text.length) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
    } else if (isDeleting && currentIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayedText((prev) => prev.slice(0, -1));
        setCurrentIndex((prev) => prev - 1);
      }, delay / 2);
    } else if (isDeleting && currentIndex === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false);
      }, 500);
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, text, delay]);

  return (
    <div className={className}>
      {displayedText}
      <span className="animate-pulse">|</span>
    </div>
  );
};

const MainBanner = () => {
  return (
    <div id="hero" className="relative flex flex-col min-h-[80vh] md:min-h-screen">
      <Header />

      <VideoPlayer />
      <LogoOverlay />
      <div className="absolute bottom-8 md:bottom-32 lg:bottom-48 left-1/2 -translate-x-1/2 z-10 w-full px-6 flex justify-center">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row text-white items-center gap-3 md:gap-4 text-sm md:text-base w-full md:w-auto"
        >
            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(45, 95, 93, 0.2)",
                borderColor: "rgba(58, 120, 117, 1)",
              }}
              whileTap={{
                scale: 0.98,
              }}
              transition={{ duration: 0.3 }}
              className="rounded-4xl border-2 border-[#3A7875]/70 bg-transparent px-6 py-2.5 md:px-8 md:py-3 cursor-pointer tracking-widest font-medium w-full md:w-auto whitespace-nowrap"
            >
              CLAIM YOUR LIBERTY
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderColor: "rgba(255, 255, 255, 0.6)",
              }}
              whileTap={{
                scale: 0.98,
              }}
              transition={{ duration: 0.3 }}
              className="rounded-4xl border-2 border-white/40 bg-transparent px-6 py-2.5 md:px-8 md:py-3 tracking-widest font-medium w-full md:w-auto whitespace-nowrap"
            >
              READ WHITEPAPER
            </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default MainBanner;
