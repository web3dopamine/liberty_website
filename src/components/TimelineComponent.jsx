import { useInView } from "motion/react";
import { useRef } from "react";
import { motion } from "motion/react";

const TimelineComponent = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const milestones = [
    {
      icon: "📅",
      title: "Snapshot Completed",
      date: "Dec 25, 2025",
      status: "completed",
    },
    {
      icon: "⚡",
      title: "Eligibility Check Open",
      date: "Jan 1, 2026",
      status: "active",
    },
    {
      icon: "🚀",
      title: "Token Launch",
      date: "Jan 15, 2026",
      status: "live",
    },
    {
      icon: "⏳",
      title: "Claim Period Opens",
      date: "Feb 1, 2026",
      status: "upcoming",
    },
  ];

  return (
    <div ref={ref} className="w-full max-w-[1024px] mx-auto py-8">
      <div className="relative flex items-center justify-between">
        {/* Progress Line */}
        <div className="absolute top-[60px] left-0 right-0 h-[2px] bg-[#2D5F5D]/30 z-0" />
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: "33%" } : { width: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-[60px] left-0 h-[2px] bg-[#3A7875] z-0"
        />

        {/* Milestones */}
        {milestones.map((milestone, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="flex flex-col items-center z-10 flex-1"
          >
            {/* Icon Circle */}
            <div
              className={`w-[60px] h-[60px] rounded-full flex items-center justify-center text-2xl mb-4 transition-all duration-300 ${
                milestone.status === "completed"
                  ? "bg-[#3A7875] shadow-lg shadow-[#3A7875]/50"
                  : milestone.status === "active"
                  ? "bg-[#3A7875] shadow-lg shadow-[#3A7875]/50"
                  : milestone.status === "live"
                  ? "bg-[#3A7875] shadow-lg shadow-[#3A7875]/50 animate-pulse"
                  : "bg-[#2D5F5D]/30"
              }`}
            >
              {milestone.icon}
            </div>

            {/* Title */}
            <div className="text-[#FFFFFF] text-[14px] font-medium mb-1 text-center px-2">
              {milestone.title}
            </div>

            {/* Date */}
            <div
              className={`text-[12px] font-medium ${
                milestone.status === "completed" || milestone.status === "active"
                  ? "text-[#3A7875]"
                  : "text-[#8092AC]"
              }`}
            >
              {milestone.date}
            </div>

            {/* Live Badge */}
            {milestone.status === "live" && (
              <div className="mt-2 bg-[#3DDED7] text-black text-[10px] font-bold px-3 py-1 rounded-full">
                LIVE
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TimelineComponent;
