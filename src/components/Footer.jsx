import { Cat, Chat, FullLogo, X2 } from "../assets/images";

const Footer = () => {
  return (
    <div className="bg-linear-to-b from-[#000000] to-[#082A2D] py-20 flex flex-row justify-center">
      <div className="flex flex-col items-center  w-fit">
        <div className="flex flex-row justify-center gap-80">
          <div className="flex flex-col">
            <img src={FullLogo} className="w-[128px]" />
            <div className="text-[#99A1AF] mt-10">
              Bringing programmable, gas-
              <br />
              free transactions to Bitcoin.
            </div>
          </div>
          <div className="flex flex-col ">
            <div className="text-white uppercase text-[20px]">Resources</div>
            <button className="text-[#99A1AF] text-[18px] mt-10 cursor-pointer text-start hover:text-white">
              Documentation
            </button>
            <button className="text-[#99A1AF] text-[18px] mt-5 cursor-pointer text-start hover:text-white">
              Whitepaper
            </button>
            <button className="text-[#99A1AF] text-[18px] mt-5 cursor-pointer text-start hover:text-white">FAQ</button>
            <button className="text-[#99A1AF] text-[18px] mt-5 cursor-pointer text-start hover:text-white">Blog</button>
          </div>

          <div className="flex flex-col ">
            <div className="text-white uppercase text-[20px]">Community</div>
            <button className="text-[#99A1AF] text-[18px] mt-10 cursor-pointer text-start hover:text-white">
              Discord
            </button>
            <button className="text-[#99A1AF] text-[18px] mt-5 cursor-pointer text-start hover:text-white">
              Telegram
            </button>
            <button className="text-[#99A1AF] text-[18px] mt-5 cursor-pointer text-start hover:text-white">
              Forum
            </button>
            <button className="text-[#99A1AF] text-[18px] mt-5 cursor-pointer text-start hover:text-white">
              Governance
            </button>
          </div>

          <div className="flex flex-col ">
            <div className="text-white uppercase text-[20px]">Developers</div>
            <button className="text-[#99A1AF] text-[18px] mt-10 cursor-pointer text-start hover:text-white">
              API Docs
            </button>
            <button className="text-[#99A1AF] text-[18px] mt-5 cursor-pointe text-start hover:text-white">
              GitHub
            </button>
            <button className="text-[#99A1AF] text-[18px] mt-5 cursor-pointer text-start hover:text-white">SDK</button>
            <button className="text-[#99A1AF] text-[18px] mt-5 cursor-pointer text-start hover:text-white">
              Bug Bounty
            </button>
          </div>
        </div>

        <div className="w-full h-[1px] bg-white/10 mt-20" />

        <div className="flex flex-row justify-between mt-6 w-full">
          <div className="text-[#99A1AF] text-[16px]">
            © 2025 LIBERTY. Built for the Bitcoin community. "Not Your Keys, Not Your Liberty"
          </div>
          <div className="flex flex-row gap-5">
            <img
              src={X2}
              className="w-6 h-6 hover:w-7 hover:h-7 cursor-pointer transition-all duration-300 ease-in-out"
            />
            <img
              src={Cat}
              className="w-6 h-6 hover:w-7 hover:h-7 cursor-pointer transition-all duration-300 ease-in-out"
            />
            <img
              src={Chat}
              className="w-6 h-6 hover:w-7 hover:h-7 cursor-pointer transition-all duration-300 ease-in-out"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
