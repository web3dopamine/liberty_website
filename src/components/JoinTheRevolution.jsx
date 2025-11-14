import { Community, Discord, FollowArrow, Stack, Telegram, X } from "../assets/images";

const JoinTheRevolution = () => {
  return (
    <div id="community" className="text-center py-20 md:py-30 lg:py-40 pt-20 md:pt-28 flex flex-col items-center bg-[#f6f8f8] px-4">
      <div className="flex flex-row gap-2 border rounded-3xl border-[#4A9390]/20 bg-[#2D5F5D]/5 px-4 py-2">
        <img src={Community} className="w-4" />
        <div className="text-[#2D5F5D] text-[14px]">Community</div>
      </div>
      <div className="text-4xl md:text-6xl lg:text-[96px] tracking-tight leading-tight md:leading-30 mt-6 md:mt-8 bg-linear-to-t from-[#000000] via-[#000000]/90 to-[#000000]/60 text-transparent bg-clip-text">
        Join the Revolution
      </div>
      <div className="text-[#4A5565] text-lg md:text-xl lg:text-[24px] mt-6 md:mt-8 px-4">
        Connect with the Bitcoin Liberty community across all platforms
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-10 md:mt-12 lg:mt-15 gap-6 md:gap-8 lg:gap-10 w-full max-w-7xl">
        <div className="cursor-pointer relative bg-linear-to-b shadow-lg from-[#ffffff] via-black/8 to-white p-6 w-full pt-12 rounded-3xl flex flex-col text-start pb-12 hover:-translate-y-2 hover:via-white hover:bg-none hover:bg-emerald-100/40 transition-all duration-300 ease-in-out">
          <img src={FollowArrow} className="absolute top-8 right-8 w-2.5 h-2.5" />
          <img src={Telegram} className="h-[140px] w-[140px] " />
          <div className="text-[30px] -mt-3 px-5">Telegram</div>
          <div className="text-[20px] text-[#4A5565] mt-2 px-5">Join our community discussions</div>
          <div className="flex flex-row gap-2 items-center bg-white rounded-2xl w-fit py-1 px-5 ml-4.5 mt-4">
            <div className="w-1.5 h-1.5 bg-[#0088CC] rounded-2xl" />
            <div className="text-[#4A5565]">12,543 members</div>
          </div>
        </div>
        <div className="cursor-pointer relative bg-linear-to-b shadow-lg from-[#ffffff] via-black/8 to-white p-6 w-full pt-12 rounded-3xl flex flex-col text-start hover:-translate-y-2 hover:via-white hover:bg-none hover:bg-emerald-100/40 transition-all duration-300 ease-in-out">
          <img src={FollowArrow} className="absolute top-8 right-8 w-2.5 h-2.5" />
          <img src={X} className="h-[140px] w-[140px]" />
          <div className="text-[30px] -mt-3 px-5">X (Twitter)</div>
          <div className="text-[20px] text-[#4A5565] mt-2 px-5">Follow for latest updates</div>
          <div className="flex flex-row gap-2 items-center bg-white rounded-2xl w-fit py-1 px-5 ml-4.5 mt-4">
            <div className="w-1.5 h-1.5 bg-[#000000] rounded-2xl" />
            <div className="text-[#4A5565]">8,921 followers</div>
          </div>
        </div>
        <div className="cursor-pointer relative bg-linear-to-b shadow-lg from-[#ffffff] via-black/8 to-white p-6 w-full pt-12 rounded-3xl flex flex-col text-start hover:-translate-y-2 hover:via-white hover:bg-none hover:bg-emerald-100/40 transition-all duration-300 ease-in-out">
          <img src={FollowArrow} className="absolute top-8 right-8 w-2.5 h-2.5" />
          <img src={Discord} className="h-[140px] w-[140px]" />
          <div className="text-[30px] -mt-3 px-5">Discord</div>
          <div className="text-[20px] text-[#4A5565] mt-2 px-5">Chat with developers</div>
          <div className="flex flex-row gap-2 items-center bg-white rounded-2xl w-fit py-1 px-5 ml-4.5 mt-4">
            <div className="w-1.5 h-1.5 bg-[#5865F2] rounded-2xl" />
            <div className="text-[#4A5565]">5,234 members</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinTheRevolution;
