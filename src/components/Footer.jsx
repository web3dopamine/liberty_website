import { Cat, Chat, FullLogo, X2 } from "../assets/images";

const Footer = () => {
  return (
    <div className="bg-linear-to-b from-[#000000] to-[#082A2D] py-12 md:py-16 lg:py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-20">
          <div className="flex flex-col items-center md:items-start">
            <img src={FullLogo} className="w-[100px] md:w-[128px]" />
            <div className="text-[#99A1AF] mt-6 md:mt-10 text-center md:text-left text-sm md:text-base">
              Bringing programmable, gas-free transactions to Bitcoin.
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-start">
            <div className="text-white uppercase text-lg md:text-[20px] font-bold">Resources</div>
            <a 
              href="/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#99A1AF] text-base md:text-[18px] mt-6 md:mt-10 cursor-pointer hover:text-white transition-colors"
            >
              Documentation
            </a>
            <button className="text-[#99A1AF] text-base md:text-[18px] mt-4 md:mt-5 cursor-pointer hover:text-white transition-colors">
              Whitepaper
            </button>
            <button className="text-[#99A1AF] text-base md:text-[18px] mt-4 md:mt-5 cursor-pointer hover:text-white transition-colors">FAQ</button>
            <button className="text-[#99A1AF] text-base md:text-[18px] mt-4 md:mt-5 cursor-pointer hover:text-white transition-colors">Blog</button>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <div className="text-white uppercase text-lg md:text-[20px] font-bold">Community</div>
            <button className="text-[#99A1AF] text-base md:text-[18px] mt-6 md:mt-10 cursor-pointer hover:text-white transition-colors">
              Discord
            </button>
            <button className="text-[#99A1AF] text-base md:text-[18px] mt-4 md:mt-5 cursor-pointer hover:text-white transition-colors">
              Telegram
            </button>
            <button className="text-[#99A1AF] text-base md:text-[18px] mt-4 md:mt-5 cursor-pointer hover:text-white transition-colors">
              Forum
            </button>
            <button className="text-[#99A1AF] text-base md:text-[18px] mt-4 md:mt-5 cursor-pointer hover:text-white transition-colors">
              Governance
            </button>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <div className="text-white uppercase text-lg md:text-[20px] font-bold">Developers</div>
            <button className="text-[#99A1AF] text-base md:text-[18px] mt-6 md:mt-10 cursor-pointer hover:text-white transition-colors">
              API Docs
            </button>
            <button className="text-[#99A1AF] text-base md:text-[18px] mt-4 md:mt-5 cursor-pointer hover:text-white transition-colors">
              GitHub
            </button>
            <button className="text-[#99A1AF] text-base md:text-[18px] mt-4 md:mt-5 cursor-pointer hover:text-white transition-colors">SDK</button>
            <button className="text-[#99A1AF] text-base md:text-[18px] mt-4 md:mt-5 cursor-pointer hover:text-white transition-colors">
              Bug Bounty
            </button>
          </div>
        </div>

        <div className="w-full h-[1px] bg-white/10 mt-12 md:mt-16 lg:mt-20" />

        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-6 md:gap-4">
          <div className="text-[#99A1AF] text-xs md:text-sm lg:text-[16px] text-center md:text-left">
            © 2025 LIBERTY. Built for the Bitcoin community. "Not Your Keys, Not Your Liberty"
          </div>
          <div className="flex flex-row gap-4 md:gap-5">
            <img
              src={X2}
              className="w-5 h-5 md:w-6 md:h-6 hover:scale-110 cursor-pointer transition-transform duration-300 ease-in-out"
            />
            <img
              src={Cat}
              className="w-5 h-5 md:w-6 md:h-6 hover:scale-110 cursor-pointer transition-transform duration-300 ease-in-out"
            />
            <img
              src={Chat}
              className="w-5 h-5 md:w-6 md:h-6 hover:scale-110 cursor-pointer transition-transform duration-300 ease-in-out"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
