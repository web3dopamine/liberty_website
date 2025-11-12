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
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
      <video
        src="/videos/logo-overlay.webm"
        className="w-full h-auto"
        style={{ maxWidth: '3600px' }}
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
    <div className="relative flex flex-col min-h-screen">
      <Header />

      <VideoPlayer />
      <LogoOverlay />
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full z-10">
        <div className="flex flex-col">
          <div className="flex flex-row text-white justify-center gap-5 mt-8 text-[18px]">
            <motion.button
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              whileHover={{
                scale: 1.07,
                boxShadow: "0 25px 50px -12px rgba(58, 120, 117, 0.5)",
              }}
              whileTap={{
                scale: 0.98,
              }}
              className="rounded-4xl bg-linear-to-b from-[#2D5F5D] to-[#3A7875] px-8 py-3 cursor-pointer shadow-2xl hover:shadow-[0_20px_60px_rgba(58,120,117,0.4)] transition-all"
            >
              CLAIM YOUR LIBERTY
            </motion.button>
            <motion.button
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              whileHover={{
                scale: 1.07,
                borderColor: "rgba(74, 147, 144, 0.8)",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
              }}
              whileTap={{
                scale: 0.98,
              }}
              className="rounded-4xl border border-white/30 px-8 py-3 shadow-2xl hover:shadow-[0_20px_60px_rgba(255,255,255,0.2)] transition-all"
            >
              READ WHITEPAPER
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
