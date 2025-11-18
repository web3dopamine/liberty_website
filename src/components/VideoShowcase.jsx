import { motion, useInView } from "motion/react";
import { useRef } from "react";

const VideoShowcase = () => {
  const videoRef = useRef(null);
  const isInView = useInView(videoRef, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={videoRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="w-full relative overflow-hidden"
      style={{ height: '70vh', minHeight: '400px', maxHeight: '800px' }}
    >
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/attached_assets/lbtc-header-video_1758096820986_1763496619294.MP4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
    </motion.section>
  );
};

export default VideoShowcase;
