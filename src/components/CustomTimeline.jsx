import { motion } from "motion/react";
import { CalendarIcon, LightningIcon, RocketIcon, TrophyIcon } from "../assets/images";

const CustomTimeline = () => {
  const timelineSteps = [
    {
      icon: CalendarIcon,
      title: "Snapshot On",
      date: "Dec 8, 2025",
      completed: true,
      isLive: true,
    },
    {
      icon: LightningIcon,
      title: "Eligibility Check Open",
      date: "Dec 11, 2025",
      completed: false,
    },
    {
      icon: RocketIcon,
      title: "Token Launch",
      date: "Jan 15, 2026",
      completed: false,
    },
    {
      icon: TrophyIcon,
      title: "Claim Period Opens",
      date: "Feb 1, 2026",
      completed: false,
    },
  ];

  return (
    <div className="w-full max-w-[900px] py-16">
      <div className="relative flex items-start justify-center">
        {/* Background line - full width, dim */}
        <div className="absolute top-8 left-0 right-0 h-[2px] bg-[#2D5F5D]/20" />
        
        {/* Animated progress line - fills from left to right */}
        <motion.div
          initial={{ width: "0%" }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
          className="absolute top-8 left-0 h-[2px] bg-[#2D5F5D]"
        />

        {timelineSteps.map((step, index) => (
          <div key={index} className="relative flex flex-col items-center" style={{ width: '200px' }}>
            <div className="relative w-full flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.4, duration: 0.5 }}
                className={`w-16 h-16 rounded-full flex items-center justify-center relative z-10 ${
                  step.completed || step.isLive
                    ? "bg-[#2D5F5D]"
                    : "bg-[#4A5565]/50"
                }`}
              >
                <img src={step.icon} alt={step.title} className="w-7 h-7" />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 + index * 0.4, duration: 0.5 }}
              className="text-center mt-4 w-full"
            >
              <div className={`text-[14px] font-medium ${
                step.completed || step.isLive ? "text-white" : "text-[#6B7280]"
              }`}>
                {step.title}
              </div>
              <div className="text-[12px] text-[#8092AC] mt-1">{step.date}</div>
              {step.isLive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 + index * 0.4, duration: 0.3 }}
                  className="mt-2 inline-block px-3 py-1 bg-[#2D5F5D] text-white text-[10px] font-bold rounded-full"
                >
                  LIVE
                </motion.div>
              )}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomTimeline;
