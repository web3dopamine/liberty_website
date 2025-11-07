import { motion } from "motion/react";
import { CalendarIcon, LightningIcon, RocketIcon, TrophyIcon } from "../assets/images";

const CustomTimeline = () => {
  const timelineSteps = [
    {
      icon: CalendarIcon,
      title: "Snapshot Completed",
      date: "Oct 1, 2025",
      completed: true,
    },
    {
      icon: LightningIcon,
      title: "Eligibility Check Open",
      date: "Nov 1, 2025",
      completed: true,
    },
    {
      icon: RocketIcon,
      title: "Token Launch",
      date: "Jan 15, 2026",
      isLive: true,
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
    <div className="w-full max-w-[1024px] py-10">
      <div className="relative flex items-center justify-between px-8">
        {timelineSteps.map((step, index) => (
          <div key={index} className="relative flex flex-col items-center z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                step.completed || step.isLive
                  ? "bg-[#2D5F5D]"
                  : "bg-[#4A5565]/50"
              }`}
            >
              <img src={step.icon} alt={step.title} className="w-8 h-8" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
              className="text-center mt-4"
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
                  transition={{ delay: index * 0.2 + 0.5, duration: 0.3 }}
                  className="mt-2 inline-block px-3 py-1 bg-[#2D5F5D] text-white text-[10px] font-bold rounded-full"
                >
                  LIVE
                </motion.div>
              )}
            </motion.div>

            {index < timelineSteps.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 + 0.2, duration: 0.5 }}
                className="absolute top-8 left-[50%] w-full h-[2px] bg-[#2D5F5D]/30 origin-left"
                style={{ 
                  width: index < timelineSteps.length - 1 ? "calc(100% + 8rem)" : "0",
                  transform: "translateX(2rem)"
                }}
              />
            )}
          </div>
        ))}

        <div className="absolute top-8 left-0 right-0 h-[2px] bg-[#2D5F5D]/30 -z-10" />
      </div>
    </div>
  );
};

export default CustomTimeline;
