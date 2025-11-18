import {
  Building,
  CoinClock,
  DollarBag,
  Info,
  Lightening,
  Lightening2,
  Lightening3,
  Lock3,
  RoundSegment,
  User,
  WalletGreen,
} from "../assets/images";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const Treasury = () => {
  const chartRef = useRef(null);
  const isInView = useInView(chartRef, { once: true, margin: "-100px" });
  return (
    <div className="text-center py-16 md:py-20 lg:py-30 flex flex-col items-center bg-[#ffffff] px-4">
      <div className="flex flex-row gap-1 border rounded-3xl border-[#4A9390]/20 bg-[#2D5F5D]/5 px-4 py-2">
        <img src={CoinClock} className="w-4" />
        <div className="text-[#2D5F5D] text-xs md:text-sm lg:text-[14px]">Treasury Breakdown</div>
      </div>
      <div className="text-4xl md:text-6xl lg:text-[96px] tracking-tight leading-tight md:leading-30 mt-6 md:mt-8 bg-linear-to-t from-[#000000] via-[#000000]/90 to-[#000000]/60 text-transparent bg-clip-text">
        Liberty Bitcoin <br />
        <span className="bg-linear-to-t from-[#2D5F5D] to-[#4A9390] text-transparent bg-clip-text">Treasury</span>
      </div>
      <div className="text-[#4A5565] text-base md:text-lg lg:text-[24px] mt-6 md:mt-8 px-4">
        Conceptual treasury based on dormant BTC (5-10 years) and unclaimed LBTY tokens
      </div>
      <div className="flex flex-col relative mt-12 md:mt-20 lg:mt-25 bg-linear-to-b from-[#ffffff] via-black/8 to-white pt-8 md:pt-16 lg:pt-20 px-4 md:px-8 lg:px-13 rounded-3xl md:rounded-4xl pb-8 md:pb-12 lg:pb-15 shadow-[3px_6px_34px_-4px_rgba(0,0,0,0.1)] w-full max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-20 lg:gap-25 justify-center w-full">
          <div className="flex flex-col">
            <div ref={chartRef} className="w-full max-w-[220px] sm:max-w-[280px] md:max-w-[380px] lg:max-w-[448px] aspect-square relative flex flex-col items-center justify-center mb-16 md:mb-8">
              <motion.img
                src={RoundSegment}
                className="absolute left-0 top-0 w-full"
                initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1, rotate: 0 }
                    : { opacity: 0, scale: 0.8, rotate: -180 }
                }
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <motion.div
                className="text-[#6A7282] text-[14px]"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                Total Supply
              </motion.div>
              <motion.div
                className="text-[#000000] text-[48px] -mt-1"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                210M
              </motion.div>
              <motion.div
                className="text-[#6A7282] text-[14px] -mt-2"
                initial={{ opacity: 0, y: -20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                LBTY
              </motion.div>
            </div>

            <div className="flex flex-col md:flex-row mt-12 md:mt-8 gap-6 md:gap-18 lg:gap-30 ml-0 md:ml-3 items-start">
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-[16px_auto] gap-x-3 gap-y-1">
                  <div className="w-[16px] h-[16px] shadow-sm bg-[#6EB5B1] rounded-3xl row-span-2" />
                  <div className="text-[#4A5565] text-[12px] whitespace-nowrap">Active Supply</div>
                  <div className="text-[#000000] text-[18px] font-medium">73.7</div>
                </div>
                <div className="grid grid-cols-[16px_auto] gap-x-3 gap-y-1">
                  <div className="w-[16px] h-[16px] shadow-sm bg-[#3A7875] rounded-3xl row-span-2" />
                  <div className="text-[#4A5565] text-[12px] whitespace-nowrap">Lost BTC</div>
                  <div className="text-[#000000] text-[18px] font-medium">8.6</div>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-[16px_auto] gap-x-3 gap-y-1">
                  <div className="w-[16px] h-[16px] shadow-sm bg-[#2D5F5D] rounded-3xl row-span-2" />
                  <div className="text-[#4A5565] text-[12px] whitespace-nowrap">Dormant 5-10 years</div>
                  <div className="text-[#000000] text-[18px] font-medium">12.5</div>
                </div>
                <div className="grid grid-cols-[16px_auto] gap-x-3 gap-y-1">
                  <div className="w-[16px] h-[16px] shadow-sm bg-[#6EB5B1] rounded-3xl row-span-2" />
                  <div className="text-[#4A5565] text-[12px] whitespace-nowrap">Satoshi's Coins</div>
                  <div className="text-[#000000] text-[18px] font-medium">5.2</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col text-start bg-linear-to-br from-[#6EB5B1]/5 to-[#6EB5B1]/5 p-6 md:p-10 lg:p-14 border border-[#6EB5B1]/20 rounded-3xl md:rounded-4xl hover:bg-gray-200 hover:shadow-2xl transition-all duration-300 delay-200 ease-in-out select-none w-full">
            <div className="flex flex-row items-center gap-3">
              <img src={Lightening2} className="h-16 w-16 md:h-20 md:w-20 lg:h-[100px] lg:w-[100px]" />
              <div className="flex flex-col mb-2 md:mb-4">
                <div className="text-xs md:text-sm lg:text-[14px] text-start text-[#4A5565]">Active Supply</div>
                <div className="text-lg md:text-xl lg:text-[24px] text-start text-[#000000]">73.7% of Total Supply</div>
              </div>
            </div>
            <div className="px-2 md:px-3 text-4xl md:text-5xl lg:text-[72px] -mt-2 md:-mt-3">15,470,000</div>
            <div className="px-2 md:px-3 text-base md:text-lg lg:text-[20px] text-[#4A5565] -mt-1 md:-mt-2">LBTY</div>

            <div className="px-2 md:px-3 text-xs md:text-sm lg:text-[14px] text-[#6A7282] mt-6 md:mt-8 lg:mt-10">Estimated USD Value</div>
            <div>
              <span className="px-2 md:px-3 bg-linear-to-t from-[#2D5F5D] to-[#4A9390] text-transparent bg-clip-text text-2xl md:text-3xl lg:text-[36px]">
                $696,150,000,000
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-row items-center mt-8 md:mt-12 lg:mt-16 gap-3 md:gap-4">
          <img src={DollarBag} className="h-6 md:h-8 lg:h-[36px]" />
          <div className="text-2xl md:text-3xl lg:text-[36px]">Treasury Summary</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-8 w-full max-w-7xl">
          <div className="flex flex-col w-full text-start bg-white shadow-sm rounded-3xl p-7 pb-6 relative hover:bg-gray-200 hover:shadow-2xl transition-all duration-300 delay-200 ease-in-out select-none hover:-translate-y-2">
            <div className="text-[#2D5F5D] absolute top-8 right-6 text-[24px]">12.5%</div>
            <img src={Building} className="w-[48px] h-[48px]" />
            <div className="text-[#4A5565] mt-3 text-[14px]">Dormant 5-10 years</div>
            <div className="text-[#99A1AF] mt-1 text-[12px]">of total supply</div>
            <div className="bg-[#99A1AF]/15 w-full h-[1px] mt-3" />
            <div className="text-[#000000] text-[30px] mt-2">2,630,000</div>
            <div className="text-[#6A7282] text-[14px]">BTC</div>
          </div>
          <div className="flex flex-col w-full text-start bg-white shadow-sm rounded-3xl p-7 pb-6 relative hover:bg-gray-200 hover:shadow-2xl transition-all duration-300 delay-200 ease-in-out select-none hover:-translate-y-2">
            <div className="text-[#3A7875] absolute top-8 right-6 text-[24px]">8.6%</div>
            <img src={Lock3} className="w-[48px] h-[48px]" />
            <div className="text-[#4A5565] mt-3 text-[14px]">Lost BTC (non-Satoshi)</div>
            <div className="text-[#99A1AF] mt-1 text-[12px]">of total supply</div>
            <div className="bg-[#99A1AF]/15 w-full h-[1px] mt-3" />
            <div className="text-[#000000] text-[30px] mt-2">1,800,000</div>
            <div className="text-[#6A7282] text-[14px]">BTC</div>
          </div>
          <div className="flex flex-col w-full text-start bg-white shadow-sm rounded-3xl p-7 pb-6 relative hover:bg-gray-200 hover:shadow-2xl transition-all duration-300 delay-200 ease-in-out select-none hover:-translate-y-2">
            <div className="text-[#4A9390] absolute top-8 right-6 text-[24px]">5.2%</div>
            <img src={User} className="w-[48px] h-[48px]" />
            <div className="text-[#4A5565] mt-3 text-[14px]">Satoshi's Coins</div>
            <div className="text-[#99A1AF] mt-1 text-[12px]">of total supply</div>
            <div className="bg-[#99A1AF]/15 w-full h-[1px] mt-3" />
            <div className="text-[#000000] text-[30px] mt-2">1,100,000</div>
            <div className="text-[#6A7282] text-[14px]">BTC</div>
          </div>
          <div className="flex flex-col w-full text-start bg-white shadow-sm rounded-3xl p-7 pb-6 relative hover:bg-gray-200 hover:shadow-2xl transition-all duration-300 delay-200 ease-in-out select-none hover:-translate-y-2">
            <div className="text-[#6EB5B1] absolute top-8 right-6 text-[24px]">73.7%</div>
            <img src={Lightening3} className="w-[48px] h-[48px]" />
            <div className="text-[#4A5565] mt-3 text-[14px]">Active Supply</div>
            <div className="text-[#99A1AF] mt-1 text-[12px]">of total supply</div>
            <div className="bg-[#99A1AF]/15 w-full h-[1px] mt-3" />
            <div className="text-[#000000] text-[30px] mt-2">15,470,000</div>
            <div className="text-[#6A7282] text-[14px]">BTC</div>
          </div>
        </div>

        <div className="bg-linear-to-b from-[#0A1F20] to-[#105359] pt-8 md:pt-12 lg:pt-15 pb-8 md:pb-12 lg:pb-16 px-6 md:px-10 lg:px-15 rounded-3xl md:rounded-4xl mt-8 md:mt-10 lg:mt-12">
          <div className="text-[#FFFFFF]/80 text-sm md:text-lg lg:text-[20px]">Total Treasury Potential</div>
          <div className="text-4xl md:text-5xl lg:text-[72px] text-white">5,530,000 LBTY</div>
          <div className="text-base md:text-lg lg:text-[20px] text-[#FFFFFF]/80">55,300,000 LBTY</div>
          <div className="w-full h-[1.4px] bg-white/20 mt-6 md:mt-8 lg:mt-10 mb-4 md:mb-5 lg:mb-6" />
          <div className="flex flex-col md:flex-row justify-center text-[#FFFFFF]/90 text-sm md:text-base lg:text-[16px] gap-3 md:gap-4 items-center">
            <div className="flex flex-row items-center gap-2">
              <div className="h-[12px] w-[12px] bg-[#FFFFFF]/90 rounded-3xl" />
              <div>26.3% of total supply</div>
            </div>
            <div className="hidden md:block h-[25px] w-[1.2px] bg-[#FFFFFF]/20" />
            <div className="flex flex-row items-center gap-2">
              <div className="h-[12px] w-[12px] bg-[#FFFFFF]/90 rounded-3xl" />
              <div>1:10 ratio</div>
            </div>
          </div>
        </div>

        <div className="flex flex-row mt-8 md:mt-10 lg:mt-14 text-start gap-3 md:gap-4 lg:gap-5 bg-white border border-black/6 p-4 md:p-6 px-4 md:px-6 lg:px-9 rounded-2xl md:rounded-3xl py-6 md:py-8 lg:py-10">
          <img src={Info} className="w-[16px] h-[16px] mt-1" />
          <div>
            <div className="text-[#6A7282] text-[12px]">Note</div>
            <div className="text-[#4A5565] text-[14px]">
              Treasury represents dormant Bitcoin (5-10 years) and potentially unclaimed LBTY tokens that could
              contribute to the Liberty ecosystem development fund.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Treasury;
