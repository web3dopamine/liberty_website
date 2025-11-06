import { Handshake, Magnify, Note, NoteGreen, Rocket } from "../assets/images";
import { motion } from "motion/react";

const GrantApplicationProcess = () => {
  return (
    <div className="text-center pb-35 flex flex-col items-center bg-[#f6f8f8]">
      <div className="flex flex-row gap-2 border rounded-3xl border-[#4A9390]/20 bg-[#2D5F5D]/5 px-4 py-2">
        <img src={NoteGreen} className="w-4" />
        <div className="text-[#2D5F5D] text-[14px]">Application Process</div>
      </div>
      <div className="text-[96px] tracking-tight leading-30 mt-8 bg-linear-to-t from-[#000000] via-[#000000]/90 to-[#000000]/60 text-transparent bg-clip-text">
        Grant Application Process
      </div>
      <div className="text-[#4A5565] text-[24px] mt-8">Four simple steps from proposal to funding</div>
      <div className="flex flex-row gap-9 mt-15">
        <div className="bg-linear-to-b shadow-lg from-[#ffffff] via-black/8 to-white p-7 rounded-3xl flex flex-col text-start max-w-[294px] hover:-translate-y-2 hover:via-white hover:bg-none hover:bg-emerald-100/40 hover:shadow-2xl transition-all duration-300 delay-200 ease-in-out hover:text-emerald-900 select-none">
          <img src={Note} className="h-[64px] w-[64px]" />
          <div className="text-[30px] mt-5">Submit Proposal</div>
          <div className="text-[18px] text-[#4A5565] mt-2">Submit your detailed project proposal and timeline</div>
        </div>
        <div className="bg-linear-to-b shadow-lg from-[#ffffff] via-black/8 to-white p-8 rounded-3xl flex flex-col text-start max-w-[294px] hover:-translate-y-2 hover:via-white hover:bg-none hover:bg-emerald-100/40 hover:shadow-2xl transition-all duration-300 delay-200 ease-in-out hover:text-emerald-900 select-none">
          <img src={Magnify} className="h-[64px] w-[64px]" />
          <div className="text-[30px] mt-5">Review Process</div>
          <div className="text-[18px] text-[#4A5565] mt-2">Technical and community review within 2 weeks</div>
        </div>
        <div className="bg-linear-to-b shadow-lg from-[#ffffff] via-black/8 to-white p-8 rounded-3xl flex flex-col text-start max-w-[294px] hover:-translate-y-2 hover:via-white hover:bg-none hover:bg-emerald-100/40 hover:shadow-2xl transition-all duration-300 delay-200 ease-in-out hover:text-emerald-900 select-none">
          <img src={Handshake} className="h-[64px] w-[64px]" />
          <div className="text-[30px] mt-5">Approval & Terms</div>
          <div className="text-[18px] text-[#4A5565] mt-2">Agreement on milestones and payment schedule</div>
        </div>
        <div className="bg-linear-to-b shadow-lg from-[#ffffff] via-black/8 to-white p-8 rounded-3xl flex flex-col text-start max-w-[294px] hover:-translate-y-2 hover:via-white hover:bg-none hover:bg-emerald-100/40 hover:shadow-2xl transition-all duration-300 delay-200 ease-in-out hover:text-emerald-900 select-none">
          <img src={Rocket} className="h-[64px] w-[64px]" />
          <div className="text-[30px] mt-5">Build & Deploy</div>
          <div className="text-[18px] text-[#4A5565] mt-2">Execute your project with ongoing support</div>
        </div>
      </div>

      <div className="flex flex-col bg-linear-to-b from-[#0A1F20] to-[#105359] text-white items-center pt-10 pb-14 mt-23 px-60 rounded-4xl ">
        <div className="text-[60px]">Ready to build with Liberty?</div>
        <div className="text-white/90 text-[24px] mt-2 font-light">
          From proposal to deployment, we support you every step of the way.
        </div>
        <div className="text-white/90 text-[24px] font-light">Average approval time: 2 weeks</div>
        <motion.div
          whileHover={{
            scale: 1.07,
          }}
          whileTap={{
            scale: 1.0,
          }}
          className="flex flex-row cursor-pointer gap-3 items-center justify-center mt-8 bg-white w-fit px-3 py-2.5 rounded-3xl mb-10 shadow-2xl hover:bg-[#dbf1f3]"
        >
          <img src={NoteGreen} className="w-4 h-4" />
          <div className="text-[#2D5F5D] text-[18px] font-medium "> Start Your Application</div>
        </motion.div>
        <div className="flex flex-row gap-8 items-center text-white/80">
          <div className="flex flex-row items-center gap-2">
            <div className="w-1.5 h-1.5 bg-white rounded-2xl" />
            <div>No application fee</div>
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="w-1.5 h-1.5 bg-white rounded-2xl" />
            <div>Rolling applications</div>
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="w-1.5 h-1.5 bg-white rounded-2xl" />
            <div>Transparent process</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrantApplicationProcess;
