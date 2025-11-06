import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const ParallaxSection = ({ children, offset = 50 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5]);

  return (
    <motion.div ref={ref} style={{ y, opacity }}>
      {children}
    </motion.div>
  );
};

export default ParallaxSection;
