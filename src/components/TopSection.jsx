import { Logo } from "../assets/images";
import Header from "./Header";
import { motion } from "motion/react";

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

const MainBanner = () => {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Header />

      <VideoPlayer />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full z-10">
        <div className="flex flex-col mt-64">
          <div className="text-[103px] text-white font-light text-center">BITCOIN IS EVOLVING</div>
          <div className="text-[103px]  text-center bg-linear-to-b from-[#348783] to-[#3FD1CB] text-transparent bg-clip-text -mt-4">
            TIME CLAIM YOUR LIBERTY
          </div>
          <div className="text-[#D1D5DC] text-center leading-[48px] mt-5 px-5 text-[24px]">
            The next chapter of Bitcoin - L2, scalable, programmable, gas free and <br />
            community-first. 1:10 ratio claim for all BTC holders at snapshot.
          </div>
          <div className="flex flex-row text-white justify-center gap-5 mt-14 text-[20px]">
            <motion.button
              whileHover={{
                scale: 1.07,
              }}
              whileTap={{
                scale: 1.0,
              }}
              transition={{ duration: 0.2 }}
              className="rounded-4xl bg-linear-to-b from-[#2D5F5D] to-[#3A7875] hover:to-[#94bbb9]/50 px-10 py-4 cursor-pointer shadow-2xl"
            >
              CLAIM YOUR LIBERTY
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.07,
              }}
              whileTap={{
                scale: 1.0,
              }}
              className="rounded-4xl border border-white/30 px-10 py-4 shadow-2xl hover:bg-white/10"
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
