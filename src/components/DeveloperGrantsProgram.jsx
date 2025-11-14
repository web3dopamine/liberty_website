import { useState } from "react";
import { Calender, GreenTickCircle, Stack } from "../assets/images";
import StackIcon from "./../assets/images/stack_icon.svg?react";
import CodeIcon from "./../assets/images/code_icon.svg?react";
import DBIcon from "./../assets/images/db_icon.svg?react";
import WrenchIcon from "./../assets/images/wrench_icon.svg?react";
import NoteIcon from "./../assets/images/note_icon.svg?react";
import BrainIcon from "./../assets/images/brain_icon.svg?react";
import { GrantsData } from "../utils/GrantsData";
import { motion, AnimatePresence } from "motion/react";

const TABS = {
  ALL_GRANTS: "All Grants",
  DEFI_PROJECTS: "DeFi Projects",
  INFRA: "Infrastructure",
  DEVELOPER_TOOLS: "Developer Tools",
  TEST_CATEGORY: "Test Category",
  AIML_PROJECTS: "AI/ML Projects",
};

const DeveloperGrantsProgram = () => {
  const [currentTab, setCurrentTab] = useState(TABS.ALL_GRANTS);

  const activeTabStyle =
    "flex flex-row items-center gap-2 bg-linear-to-b from-[#2D5F5D] to-[#3A7875] text-white px-5.5 py-3 rounded-3xl shadow-xl cursor-pointer";
  const inactiveTabStyle =
    "flex flex-row items-center gap-2 bg-white text-white px-5.5 py-3 rounded-3xl border border-black/15 cursor-pointer";

  const getTagStyle = (tag) => {
    switch (tag) {
      case "FEATURED":
        return "bg-linear-to-r from-[#FDC700] to-[#F0B100]";
      case "OPEN":
        return "bg-linear-to-r from-[#05DF72] to-[#00C950]";
      case "HIGH PRIORITY":
        return "bg-linear-to-r from-[#FF6467] to-[#FB2C36]";
      case "CLOSED":
        return "bg-[#999999] text-[#ffffff]";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.3,
      },
    },
  };

  const tabVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <div id="grants" className="text-center py-40 flex flex-col items-center bg-[#f6f8f8]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-row gap-2 border rounded-3xl border-[#4A9390]/20 bg-[#2D5F5D]/5 px-4 py-2"
      >
        <img src={Stack} className="w-4" />
        <div className="text-[#2D5F5D] text-[14px]">Funding Opportunities</div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-[96px] tracking-tight leading-30 mt-8 bg-linear-to-t from-[#000000] via-[#000000]/90 to-[#000000]/60 text-transparent bg-clip-text"
      >
        AI Agent <br />
        <span className="bg-linear-to-t from-[#2D5F5D] to-[#4A9390] text-transparent bg-clip-text">Launchpad</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-[#4A5565] text-[24px] mt-8"
      >
        Launch the next generation of AI agents on Bitcoin Liberty. Get funded to build
        <br /> intelligent, autonomous agents that revolutionize the LBTY ecosystem.
      </motion.div>
      {/* TABS */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="flex flex-row mt-24 gap-4"
      >
        <motion.button
          variants={tabVariants}
          onClick={() => {
            setCurrentTab(TABS.ALL_GRANTS);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className={currentTab == TABS.ALL_GRANTS ? activeTabStyle : inactiveTabStyle}
        >
          <StackIcon className={`w-4 h-4 ${currentTab == TABS.ALL_GRANTS ? "text-white" : "text-[#364153]"}`} />
          <div className={`${currentTab == TABS.ALL_GRANTS ? "text-white" : "text-[#364153]"}`}>{TABS.ALL_GRANTS}</div>
        </motion.button>
        <motion.button
          variants={tabVariants}
          onClick={() => {
            setCurrentTab(TABS.DEFI_PROJECTS);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className={currentTab == TABS.DEFI_PROJECTS ? activeTabStyle : inactiveTabStyle}
        >
          <CodeIcon className={`w-4 h-4 ${currentTab == TABS.DEFI_PROJECTS ? "text-white" : "text-[#364153]"}`} />
          <div className={`${currentTab == TABS.DEFI_PROJECTS ? "text-white" : "text-[#364153]"}`}>
            {TABS.DEFI_PROJECTS}
          </div>
        </motion.button>
        <motion.button
          variants={tabVariants}
          onClick={() => {
            setCurrentTab(TABS.INFRA);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className={currentTab == TABS.INFRA ? activeTabStyle : inactiveTabStyle}
        >
          <DBIcon className={`w-4 h-4 ${currentTab == TABS.INFRA ? "text-white" : "text-[#364153]"}`} />
          <div className={`${currentTab == TABS.INFRA ? "text-white" : "text-[#364153]"}`}>{TABS.INFRA}</div>
        </motion.button>
        <motion.button
          variants={tabVariants}
          onClick={() => {
            setCurrentTab(TABS.DEVELOPER_TOOLS);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className={currentTab == TABS.DEVELOPER_TOOLS ? activeTabStyle : inactiveTabStyle}
        >
          <WrenchIcon className={`w-4 h-4 ${currentTab == TABS.DEVELOPER_TOOLS ? "text-white" : "text-[#364153]"}`} />
          <div className={`${currentTab == TABS.DEVELOPER_TOOLS ? "text-white" : "text-[#364153]"}`}>
            {TABS.DEVELOPER_TOOLS}
          </div>
        </motion.button>
        <motion.button
          variants={tabVariants}
          onClick={() => {
            setCurrentTab(TABS.TEST_CATEGORY);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className={currentTab == TABS.TEST_CATEGORY ? activeTabStyle : inactiveTabStyle}
        >
          <NoteIcon className={`w-4 h-4 ${currentTab == TABS.TEST_CATEGORY ? "text-white" : "text-[#364153]"}`} />
          <div className={`${currentTab == TABS.TEST_CATEGORY ? "text-white" : "text-[#364153]"}`}>
            {TABS.TEST_CATEGORY}
          </div>
        </motion.button>
        <motion.button
          variants={tabVariants}
          onClick={() => {
            setCurrentTab(TABS.AIML_PROJECTS);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className={currentTab == TABS.AIML_PROJECTS ? activeTabStyle : inactiveTabStyle}
        >
          <BrainIcon className={`w-4 h-4 ${currentTab == TABS.AIML_PROJECTS ? "text-white" : "text-[#364153]"}`} />
          <div className={`${currentTab == TABS.AIML_PROJECTS ? "text-white" : "text-[#364153]"}`}>
            {TABS.AIML_PROJECTS}
          </div>
        </motion.button>
      </motion.div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 gap-8 auto-rows-fr mt-15 min-h-[500px]"
      >
        <AnimatePresence mode="wait">
          {GrantsData.map((item, index) => {
            if (currentTab == TABS.DEFI_PROJECTS && item.category != TABS.DEFI_PROJECTS) return null;
            if (currentTab == TABS.INFRA && item.category != TABS.INFRA) return null;
            if (currentTab == TABS.DEVELOPER_TOOLS && item.category != TABS.DEVELOPER_TOOLS) return null;
            if (currentTab == TABS.TEST_CATEGORY && item.category != TABS.TEST_CATEGORY) return null;
            if (currentTab == TABS.AIML_PROJECTS && item.category != TABS.AIML_PROJECTS) return null;

            return (
              <motion.div
                key={`${currentTab}-${index}`}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col max-w-[630px] text-start bg-white justify-between rounded-4xl p-9 shadow-lg hover:shadow-2xl transition-shadow duration-300 select-none"
              >
                <div>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className={`text-[14px] capitalize ${getTagStyle(item.tag)} w-fit px-4 py-[6px] rounded-lg shadow-lg`}
                  >
                    {item.tag.toLocaleLowerCase()}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-[30px] mt-4"
                  >
                    {item.title}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-[36px] bg-linear-to-t from-[#2D5F5D] to-[#4A9390] text-transparent bg-clip-text"
                  >
                    {item.amount}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-[#4A5565] text-[16px] mt-4 mb-4"
                  >
                    {item.description}
                  </motion.div>
                  <div className="text-[#6A7282] text-[14px]">Requirements:</div>
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1,
                          delayChildren: 0.6,
                        },
                      },
                    }}
                    className="flex flex-col mt-2"
                  >
                    {item.requirements.map((itm, reqIndex) => {
                      return (
                        <motion.div
                          key={reqIndex}
                          variants={{
                            hidden: { opacity: 0, x: -10 },
                            visible: { opacity: 1, x: 0 },
                          }}
                          className="flex flex-row items-center gap-2 mb-1"
                        >
                          <img src={GreenTickCircle} className="w-[13.33px] h-[13.33px]" />
                          <div className="text-[#364153] text-[14px]">{itm}</div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>

                <div className="flex flex-col">
                  <div className="w-full h-[1px] bg-black/5 mt-6 mb-3" />
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-row items-center gap-2">
                      <img src={Calender} className="w-[16px] h-[16px]" />
                      <div className="text-[#4A5565] text-[14px]">{item.deadline}</div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={` ${
                        item.cta == "ACTIVE" ? "bg-linear-to-r from-[#2D5F5D] to-[#3A7875]" : "bg-[#AEAEAE]"
                      }  text-white text-[14px] px-5 py-2 rounded-3xl shadow-xl cursor-pointer`}
                    >
                      Apply Now
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default DeveloperGrantsProgram;
