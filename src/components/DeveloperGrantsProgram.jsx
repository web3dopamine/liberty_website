import { useState } from "react";
import { Calender, GreenTickCircle, Stack } from "../assets/images";
import StackIcon from "./../assets/images/stack_icon.svg?react";
import CodeIcon from "./../assets/images/code_icon.svg?react";
import DBIcon from "./../assets/images/db_icon.svg?react";
import WrenchIcon from "./../assets/images/wrench_icon.svg?react";
import NoteIcon from "./../assets/images/note_icon.svg?react";
import BrainIcon from "./../assets/images/brain_icon.svg?react";
import { GrantsData } from "../utils/GrantsData";

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

  return (
    <div className="text-center py-40 flex flex-col items-center bg-[#f6f8f8]">
      <div className="flex flex-row gap-2 border rounded-3xl border-[#4A9390]/20 bg-[#2D5F5D]/5 px-4 py-2">
        <img src={Stack} className="w-4" />
        <div className="text-[#2D5F5D] text-[14px]">Funding Opportunities</div>
      </div>
      <div className="text-[96px] tracking-tight leading-30 mt-8 bg-linear-to-t from-[#000000] via-[#000000]/90 to-[#000000]/60 text-transparent bg-clip-text">
        Developer Grants <br />
        <span className="bg-linear-to-t from-[#2D5F5D] to-[#4A9390] text-transparent bg-clip-text">Program</span>
      </div>
      <div className="text-[#4A5565] text-[24px] mt-8">
        Build the future of Bitcoin Liberty. Apply for grants to develop protocols,
        <br /> tools, and infrastructure that strengthen the ecosystem.
      </div>
      {/* TABS */}
      <div className="flex flex-row mt-24 gap-4">
        <button
          onClick={() => {
            setCurrentTab(TABS.ALL_GRANTS);
          }}
          className={currentTab == TABS.ALL_GRANTS ? activeTabStyle : inactiveTabStyle}
        >
          <StackIcon className={`w-4 h-4 ${currentTab == TABS.ALL_GRANTS ? "text-white" : "text-[#364153]"}`} />
          <div className={`${currentTab == TABS.ALL_GRANTS ? "text-white" : "text-[#364153]"}`}>{TABS.ALL_GRANTS}</div>
        </button>
        <button
          onClick={() => {
            setCurrentTab(TABS.DEFI_PROJECTS);
          }}
          className={currentTab == TABS.DEFI_PROJECTS ? activeTabStyle : inactiveTabStyle}
        >
          <CodeIcon className={`w-4 h-4 ${currentTab == TABS.DEFI_PROJECTS ? "text-white" : "text-[#364153]"}`} />
          <div className={`${currentTab == TABS.DEFI_PROJECTS ? "text-white" : "text-[#364153]"}`}>
            {TABS.DEFI_PROJECTS}
          </div>
        </button>
        <button
          onClick={() => {
            setCurrentTab(TABS.INFRA);
          }}
          className={currentTab == TABS.INFRA ? activeTabStyle : inactiveTabStyle}
        >
          <DBIcon className={`w-4 h-4 ${currentTab == TABS.INFRA ? "text-white" : "text-[#364153]"}`} />
          <div className={`${currentTab == TABS.INFRA ? "text-white" : "text-[#364153]"}`}>{TABS.INFRA}</div>
        </button>
        <button
          onClick={() => {
            setCurrentTab(TABS.DEVELOPER_TOOLS);
          }}
          className={currentTab == TABS.DEVELOPER_TOOLS ? activeTabStyle : inactiveTabStyle}
        >
          <WrenchIcon className={`w-4 h-4 ${currentTab == TABS.DEVELOPER_TOOLS ? "text-white" : "text-[#364153]"}`} />
          <div className={`${currentTab == TABS.DEVELOPER_TOOLS ? "text-white" : "text-[#364153]"}`}>
            {TABS.DEVELOPER_TOOLS}
          </div>
        </button>
        <button
          onClick={() => {
            setCurrentTab(TABS.TEST_CATEGORY);
          }}
          className={currentTab == TABS.TEST_CATEGORY ? activeTabStyle : inactiveTabStyle}
        >
          <NoteIcon className={`w-4 h-4 ${currentTab == TABS.TEST_CATEGORY ? "text-white" : "text-[#364153]"}`} />
          <div className={`${currentTab == TABS.TEST_CATEGORY ? "text-white" : "text-[#364153]"}`}>
            {TABS.TEST_CATEGORY}
          </div>
        </button>
        <button
          onClick={() => {
            setCurrentTab(TABS.AIML_PROJECTS);
          }}
          className={currentTab == TABS.AIML_PROJECTS ? activeTabStyle : inactiveTabStyle}
        >
          <BrainIcon className={`w-4 h-4 ${currentTab == TABS.AIML_PROJECTS ? "text-white" : "text-[#364153]"}`} />
          <div className={`${currentTab == TABS.AIML_PROJECTS ? "text-white" : "text-[#364153]"}`}>
            {TABS.AIML_PROJECTS}
          </div>
        </button>
      </div>
      <div className="grid grid-cols-2 gap-8 auto-rows-fr mt-15 min-h-[500px]">
        {GrantsData.map((item, index) => {
          if (currentTab == TABS.DEFI_PROJECTS && item.category != TABS.DEFI_PROJECTS) return null;
          if (currentTab == TABS.INFRA && item.category != TABS.INFRA) return null;
          if (currentTab == TABS.DEVELOPER_TOOLS && item.category != TABS.DEVELOPER_TOOLS) return null;
          if (currentTab == TABS.TEST_CATEGORY && item.category != TABS.TEST_CATEGORY) return null;
          if (currentTab == TABS.AIML_PROJECTS && item.category != TABS.AIML_PROJECTS) return null;

          return (
            <div
              key={index}
              className="flex flex-col max-w-[630px] text-start bg-white justify-between rounded-4xl p-9 shadow-lg hover:bg-black/5 hover:shadow-2xl transition-all duration-300 delay-200 ease-in-out select-none hover:-translate-y-2"
            >
              <div>
                <div
                  className={`text-[14px] capitalize ${getTagStyle(item.tag)} w-fit px-4 py-[6px] rounded-lg shadow-lg`}
                >
                  {item.tag.toLocaleLowerCase()}
                </div>
                <div className="text-[30px] mt-4">{item.title}</div>
                <div className="text-[36px] bg-linear-to-t from-[#2D5F5D] to-[#4A9390] text-transparent bg-clip-text">
                  {item.amount}
                </div>
                <div className="text-[#4A5565] text-[16px] mt-4 mb-4">{item.description}</div>
                <div className="text-[#6A7282] text-[14px]">Requirements:</div>
                <div className="flex flex-col mt-2">
                  {item.requirements.map((itm, reqIndex) => {
                    return (
                      <div key={reqIndex} className="flex flex-row items-center gap-2 mb-1">
                        <img src={GreenTickCircle} className="w-[13.33px] h-[13.33px]" />
                        <div className="text-[#364153] text-[14px]">{itm}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col">
                <div className="w-full h-[1px] bg-black/5 mt-6 mb-3" />
                <div className="flex flex-row justify-between">
                  <div className="flex flex-row items-center gap-2">
                    <img src={Calender} className="w-[16px] h-[16px]" />
                    <div className="text-[#4A5565] text-[14px]">{item.deadline}</div>
                  </div>

                  <button
                    className={` ${
                      item.cta == "ACTIVE" ? "bg-linear-to-r from-[#2D5F5D] to-[#3A7875]" : "bg-[#AEAEAE]"
                    }  text-white text-[14px] px-5 py-2 rounded-3xl shadow-xl cursor-pointer`}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeveloperGrantsProgram;
