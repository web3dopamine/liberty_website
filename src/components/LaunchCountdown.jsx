import { useCallback, useState } from "react";
import TimelineComponent from "./TimelineComponent";
import CountdownTimer from "../utils/CountdownTimer";

const LaunchCountdown = () => {
  const [countdownData, setCountDownData] = useState({});

  const updateData = useCallback((data) => {
    setCountDownData(data);
  }, []);

  return (
    <div className="bg-black text-white text-center pt-25 flex flex-col items-center pb-38 bg-radial from-[#3A7875]/30 via-[#3A7875]/5 to-[#000000]">
      <div className="text-[#99A1AF] text-[36px] pb-2">SNAPSHOT IN</div>
      <div className="flex flex-row items-center justify-center gap-4">
        <div className="flex flex-col">
          <div className="text-[96px] min-w-32">{countdownData.days ?? "00"}</div>
          <div className="text-[14px] text-[#99A1AF] -mt-3">DAYS</div>
        </div>
        <div className="flex flex-col gap-5 ">
          <div className="bg-[#2D5F5D] w-2 h-2 rounded-3xl" />
          <div className="bg-[#2D5F5D] w-2 h-2 rounded-3xl" />
        </div>
        <div className="flex flex-col">
          <div className="text-[96px] min-w-32">{countdownData.hours ?? "00"}</div>
          <div className="text-[14px] text-[#99A1AF] -mt-3">HOURS</div>
        </div>
        <div className="flex flex-col gap-5 ">
          <div className="bg-[#2D5F5D] w-2 h-2 rounded-3xl" />
          <div className="bg-[#2D5F5D] w-2 h-2 rounded-3xl" />
        </div>
        <div className="flex flex-col">
          <div className="text-[96px] min-w-32">{countdownData.minutes ?? "00"}</div>
          <div className="text-[14px] text-[#99A1AF] -mt-3">MINUTES</div>
        </div>
        <div className="flex flex-col gap-5 ">
          <div className="bg-[#2D5F5D] w-2 h-2 rounded-3xl" />
          <div className="bg-[#2D5F5D] w-2 h-2 rounded-3xl" />
        </div>
        <div className="flex flex-col">
          <div className="text-[96px] min-w-32">{countdownData.seconds ?? "00"}</div>
          <div className="text-[14px] text-[#99A1AF] -mt-3">SECONDS</div>
        </div>
      </div>
      <div className="text-[#8092AC] text-[16px] mt-10">January 15, 2026 — 00:00 UTC</div>

      <TimelineComponent />

      <div className="text-[#8092AC] text-[18px] mt-7">Check your eligibility now and be ready for launch day.</div>
      <div className="text-[#3DDED7] text-[18px] mt-3 font-bold">Over 50 million addresses are eligible.</div>

      <CountdownTimer onTick={updateData} />
    </div>
  );
};

export default LaunchCountdown;
