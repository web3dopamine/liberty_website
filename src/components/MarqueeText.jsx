export default function MarqueeText() {
  const items = [
    "210M TOTAL LBTY SUPPLY • 1:10 BTC TO LBTY RATIO • ~50M+ ELIGIBLE BTC ADDRESSES • 210M TOTAL LBTY SUPPLY • 1:10 BTC TO LBTY RATIO • ~50M+ ELIGIBLE BTC ADDRESSES • 210M TOTAL LBTY SUPPLY • 1:10 BTC TO LBTY RATIO • ~50M+ ELIGIBLE BTC ADDRESSES • 210M TOTAL LBTY SUPPLY • 1:10 BTC TO LBTY RATIO • ~50M+ ELIGIBLE BTC ADDRESSES • 210M TOTAL LBTY SUPPLY • 1:10 BTC TO LBTY RATIO • ~50M+ ELIGIBLE BTC ADDRESSES • 210M TOTAL LBTY SUPPLY • 1:10 BTC TO LBTY RATIO • ~50M+ ELIGIBLE BTC ADDRESSES •",
  ];

  // Duplicate items enough times to ensure smooth scrolling
  const repeatedItems = [...items];

  return (
    <div className="flex items-center justify-center bg-linear-to-b from-[#2D5F5D] to-[#3A7875] overflow-hidden w-full">
      <div className="w-full max-w-full">
        {/* Marquee Container */}
        <div className="relative overflow-hidden py-3 md:py-[13px]">
          {/* Marquee Content */}
          <div className="flex animate-marquee whitespace-nowrap">
            {/* First set */}
            {repeatedItems.map((item, i) => (
              <div
                key={`first-${i}`}
                className="mx-4 md:mx-8 text-xs md:text-sm lg:text-[14px] font-extralight text-white inline-block tracking-wider md:tracking-widest"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 20s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
