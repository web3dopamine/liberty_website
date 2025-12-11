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
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const Treasury = () => {
  const sectionRef = useRef(null);
  const chartRef = useRef(null);
  const titleInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const isInView = useInView(chartRef, { once: true, margin: "-100px" });
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { data: btcData, isLoading } = useQuery({
    queryKey: ['btc-market-data'],
    queryFn: async () => {
      const response = await fetch('/api/btc-market-data');
      if (!response.ok) {
        throw new Error('Failed to fetch Bitcoin market data');
      }
      return response.json();
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });

  const circulatingSupply = btcData?.circulatingSupply || 19500000;
  const currentPrice = btcData?.currentPrice || 95000;
  const activeSupplyBTC = Math.round(circulatingSupply * 0.672);

  const segments = [
    { name: 'Active Supply', percentage: 67.2, color: '#6EB5B1', btc: activeSupplyBTC, id: 'active' },
    { name: 'Lost BTC', percentage: 14.3, color: '#3A7875', btc: 3003000, id: 'lost' },
    { name: 'Dormant 5-10 years', percentage: 13.3, color: '#2D5F5D', btc: 2793000, id: 'dormant' },
    { name: 'Satoshi\'s Coins', percentage: 5.2, color: '#4A9390', btc: 1092000, id: 'satoshi' },
  ];

  return (
    <div ref={sectionRef} className="text-center py-16 md:py-20 lg:py-30 flex flex-col items-center bg-[#f6f8f8] px-4">
      <div className="flex flex-row gap-1 border rounded-3xl border-[#4A9390]/20 bg-[#2D5F5D]/5 px-4 py-2">
        <img src={CoinClock} className="w-4" />
        <div className="text-[#2D5F5D] text-xs md:text-sm lg:text-[14px]">Treasury Breakdown</div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center justify-center gap-2 pb-12 mt-6 md:mt-8"
        style={{ lineHeight: '1.3' }}
      >
        <div className="flex flex-col md:flex-row items-baseline gap-2 md:gap-4">
          <span className="text-4xl md:text-6xl lg:text-[96px] tracking-tight bg-linear-to-t from-[#000000] via-[#000000]/90 to-[#000000]/60 text-transparent bg-clip-text font-normal small-caps" style={{ lineHeight: '1.3' }}>Liberty Bitcoin</span>
        </div>
        <span className="text-4xl md:text-6xl lg:text-[96px] bg-linear-to-t from-[#2D5F5D] to-[#4A9390] text-transparent bg-clip-text tracking-tight" style={{ lineHeight: '1.3' }}>
          Treasury
        </span>
      </motion.div>
      <div className="text-[#4A5565] text-base md:text-lg lg:text-[24px] mt-6 md:mt-8 px-4">
        Conceptual treasury based on dormant BTC (5-10 years) and unclaimed LBTY tokens
      </div>

      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12 mt-12 md:mt-16 lg:mt-20 w-full max-w-6xl">
        <div className="flex flex-col items-center">
          <div 
            ref={chartRef} 
            className="w-[280px] sm:w-[320px] md:w-[360px] aspect-square relative flex flex-col items-center justify-center"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setMousePosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
              });
            }}
          >
            <motion.svg
              className="absolute left-0 top-0 w-full h-full -rotate-90"
              viewBox="0 0 200 200"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              {segments.map((segment, index) => {
                const offset = segments.slice(0, index).reduce((sum, s) => sum + s.percentage, 0);
                const isHovered = hoveredSegment === segment.id;
                
                return (
                  <motion.circle
                    key={segment.id}
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke={segment.color}
                    strokeWidth={isHovered ? "28" : "24"}
                    strokeLinecap="round"
                    strokeDasharray={`${segment.percentage * 5.026} ${(100 - segment.percentage) * 5.026}`}
                    strokeDashoffset={`${-offset * 5.026}`}
                    initial={{ strokeDasharray: `0 ${100 * 5.026}` }}
                    animate={isInView ? { strokeDasharray: `${segment.percentage * 5.026} ${(100 - segment.percentage) * 5.026}` } : { strokeDasharray: `0 ${100 * 5.026}` }}
                    transition={{
                      strokeDasharray: { duration: 1.5, delay: 0.3 + index * 0.2, ease: "easeOut" },
                      strokeWidth: { duration: 0.2, ease: "easeOut" }
                    }}
                    style={{
                      filter: isHovered ? 'drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.25))' : 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))',
                      cursor: 'pointer',
                      transition: 'filter 0.3s ease',
                    }}
                    onMouseEnter={() => setHoveredSegment(segment.id)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  />
                );
              })}
            </motion.svg>

            {hoveredSegment && (() => {
              const segment = segments.find(s => s.id === hoveredSegment);
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute bg-white rounded-2xl shadow-lg px-4 py-3 border border-gray-200 z-20 pointer-events-none"
                  style={{ left: `${mousePosition.x}px`, top: `${mousePosition.y}px`, transform: 'translate(15px, -50%)' }}
                >
                  <div className="text-[#6A7282] text-[11px] text-center whitespace-nowrap">{segment.name}</div>
                  <div className="text-[#000000] text-[24px] font-semibold text-center -mt-0.5">{segment.percentage}%</div>
                  <div className="text-[#6A7282] text-[12px] text-center -mt-0.5">{segment.btc.toLocaleString()} BTC</div>
                </motion.div>
              );
            })()}

            <motion.div
              className="text-[#6A7282] text-[14px]"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Total Supply
            </motion.div>
            <motion.div
              className="text-[#000000] text-[48px] md:text-[56px] font-medium -mt-1"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              {isLoading ? '19.5M' : `${(Math.floor((circulatingSupply / 1000000) * 2) / 2).toFixed(1)}M`}
            </motion.div>
            <motion.div
              className="text-[#6A7282] text-[16px] -mt-2"
              initial={{ opacity: 0, y: -20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              BTC
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-4 mt-8">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[#6EB5B1] rounded-full" />
              <div>
                <div className="text-[#4A5565] text-[12px]">Active Supply</div>
                <div className="text-[#000000] text-[18px] font-semibold">67.2%</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[#2D5F5D] rounded-full" />
              <div>
                <div className="text-[#4A5565] text-[12px]">Dormant 5-10 years</div>
                <div className="text-[#000000] text-[18px] font-semibold">13.3%</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[#3A7875] rounded-full" />
              <div>
                <div className="text-[#4A5565] text-[12px]">Lost BTC</div>
                <div className="text-[#000000] text-[18px] font-semibold">14.3%</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[#4A9390] rounded-full" />
              <div>
                <div className="text-[#4A5565] text-[12px]">Satoshi's Coins</div>
                <div className="text-[#000000] text-[18px] font-semibold">5.2%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-linear-to-b from-[#0A1F20] to-[#105359] pt-10 md:pt-12 pb-10 md:pb-12 px-8 md:px-12 rounded-3xl w-full lg:w-auto lg:flex-1 max-w-md lg:max-w-none shadow-xl">
          <div className="text-[#FFFFFF]/70 text-sm md:text-base">Total Treasury Potential</div>
          <div className="text-4xl md:text-5xl lg:text-6xl text-white font-medium mt-2">68,880,000 LBTY</div>
          <div className="text-lg md:text-xl text-[#FFFFFF]/70 mt-2">6,888,000 BTC</div>
          <div className="w-full h-[1px] bg-white/20 mt-8 mb-6" />
          <div className="flex flex-row justify-center text-[#FFFFFF]/80 text-sm gap-6 items-center">
            <div className="flex flex-row items-center gap-2">
              <div className="h-3 w-3 bg-[#FFFFFF]/80 rounded-full" />
              <div>26.3% of total supply</div>
            </div>
            <div className="flex flex-row items-center gap-2">
              <div className="h-3 w-3 bg-[#FFFFFF]/80 rounded-full" />
              <div>1:10 ratio</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center mt-16 md:mt-20 gap-3 md:gap-4 w-full max-w-6xl">
        <img src={DollarBag} className="h-7 md:h-9" />
        <div className="text-2xl md:text-3xl lg:text-[36px]">Treasury Summary</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-8 w-full max-w-6xl">
        <div className="flex flex-col w-full text-start bg-white shadow-sm rounded-2xl p-6 relative hover:shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <img src={Building} className="w-12 h-12" />
            <div className="text-[#2D5F5D] text-xl font-semibold">13.3%</div>
          </div>
          <div className="text-[#4A5565] mt-4 text-sm">Dormant 5-10 years</div>
          <div className="text-[#99A1AF] text-xs">of total supply</div>
          <div className="text-[#000000] text-3xl font-medium mt-4">2,793,000</div>
          <div className="text-[#6A7282] text-sm">BTC</div>
        </div>
        <div className="flex flex-col w-full text-start bg-white shadow-sm rounded-2xl p-6 relative hover:shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <img src={Lock3} className="w-12 h-12" />
            <div className="text-[#3A7875] text-xl font-semibold">14.3%</div>
          </div>
          <div className="text-[#4A5565] mt-4 text-sm">Lost BTC (non-Satoshi)</div>
          <div className="text-[#99A1AF] text-xs">of total supply</div>
          <div className="text-[#000000] text-3xl font-medium mt-4">3,003,000</div>
          <div className="text-[#6A7282] text-sm">BTC</div>
        </div>
        <div className="flex flex-col w-full text-start bg-white shadow-sm rounded-2xl p-6 relative hover:shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <img src={User} className="w-12 h-12" />
            <div className="text-[#4A9390] text-xl font-semibold">5.2%</div>
          </div>
          <div className="text-[#4A5565] mt-4 text-sm">Satoshi's Coins</div>
          <div className="text-[#99A1AF] text-xs">of total supply</div>
          <div className="text-[#000000] text-3xl font-medium mt-4">1,092,000</div>
          <div className="text-[#6A7282] text-sm">BTC</div>
        </div>
        <div className="flex flex-col w-full text-start bg-white shadow-sm rounded-2xl p-6 relative hover:shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <img src={Lightening3} className="w-12 h-12" />
            <div className="text-[#6EB5B1] text-xl font-semibold">67.2%</div>
          </div>
          <div className="text-[#4A5565] mt-4 text-sm">Active Supply</div>
          <div className="text-[#99A1AF] text-xs">of total supply</div>
          <div className="text-[#000000] text-3xl font-medium mt-4">
            {isLoading ? '13,411,286' : activeSupplyBTC.toLocaleString()}
          </div>
          <div className="text-[#6A7282] text-sm">BTC</div>
        </div>
      </div>

      <div className="flex flex-row mt-10 text-start gap-4 bg-white border border-black/5 p-5 px-6 rounded-2xl w-full max-w-6xl">
        <img src={Info} className="w-4 h-4 mt-1" />
        <div>
          <div className="text-[#6A7282] text-xs">Note</div>
          <div className="text-[#4A5565] text-sm">
            Treasury represents dormant Bitcoin (5-10 years) and potentially unclaimed LBTY tokens that could
            contribute to the Liberty ecosystem development fund.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Treasury;
