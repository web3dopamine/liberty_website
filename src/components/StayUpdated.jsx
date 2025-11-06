const StayUpdated = () => {
  return (
    <div className="flex flex-col bg-black py-20 pb-40 text-center items-center">
      <div className="text-[96px] text-white z-2">Stay Updated</div>
      <div className="text-[#99A1AF] text-[24px] mt-8 z-2">
        Get notified about snapshot dates, claim periods, and major announcements.
      </div>

      <div className="bg-white flex flex-row justify-between w-[875px] h-[64px] rounded-4xl mt-20 items-center">
        <input className="outline-none border-none px-15 w-[580px]" placeholder="E - M A I L" />
        <button className="bg-[#2C6468] h-[64px] rounded-4xl px-12 flex text-white items-center text-[20px] cursor-pointer hover:text-black hover:bg-[#2C6468]/50 transition-all duration-300 ease-in-out">
          S U B S C R I B E
        </button>
      </div>
    </div>
  );
};

export default StayUpdated;
