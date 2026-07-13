import { useState } from "react";
import {
  Send, 
  Download, 
  User, 
  Briefcase, 
  Calendar, 
  IndianRupee,
  Eye,
  PenTool,
} from "lucide-react";
import { pageTheme } from "../../Themes/PageThems/pageConfig";

export const LetterPage = () => {
  // const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  // Mock Offer Data
  const [offerData] = useState({
    candidateName: "Rithika Sen",
    role: "Senior Product Designer",
    joiningDate: "2026-06-15",
    ctc: "18,00,000",
    location: "Bangalore (Remote)",
    validUntil: "2026-05-10"
  });

  return (
    <div className={pageTheme.layout.mainContainer}>
      {/* HEADER */}
      <div className={pageTheme.header.wrapper}>
        <div className="flex flex-col">
          <div className={pageTheme.header.pill}>
            <Send size={12} />
            <span>Onboarding Stage</span>
          </div>
          <h1 className={pageTheme.header.title}>Offer Release</h1>
          <p className={pageTheme.header.subtitle}>
            Finalize and send the offer letter to <strong>{offerData.candidateName}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 h-11 px-6 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
            <Download size={16} /> Export PDF
          </button>
          <button className="flex items-center gap-2 h-11 px-8 bg-primary text-white rounded-xl text-sm font-bold hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/20">
            <Send size={16} /> Send Offer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details Edit */}
        <div className="lg:col-span-1 space-y-6">
          <div className={pageTheme.section.card}>
            <div className={pageTheme.section.header}>
              <div className={pageTheme.section.title}>
                <span className={pageTheme.section.titleDot} />
                Offer Parameters
              </div>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Candidate Name</label>
                <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                  <User size={16} className="text-slate-400" />
                  <span className="text-[13px] font-bold text-slate-700">{offerData.candidateName}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Role / Designation</label>
                <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                  <Briefcase size={16} className="text-slate-400" />
                  <span className="text-[13px] font-bold text-slate-700">{offerData.role}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Joining Date</label>
                  <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                    <Calendar size={16} className="text-slate-400" />
                    <span className="text-[13px] font-bold text-slate-700">{offerData.joiningDate}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Gross CTC (Yearly)</label>
                  <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                    <IndianRupee size={16} className="text-slate-400" />
                    <span className="text-[13px] font-bold text-slate-700">{offerData.ctc}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-[24px] p-6 text-white shadow-xl shadow-indigo-200">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                   <PenTool size={20} />
                </div>
                <h3 className="text-base font-bold">Smart Templates</h3>
             </div>
             <p className="text-indigo-100 text-[13px] leading-relaxed mb-6">
                All offer letters are generated using legally verified enterprise templates.
             </p>
             <button className="w-full h-11 bg-white text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-all">
                Change Template
             </button>
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-2">
           <div className="bg-white rounded-[32px] border-[1.5px] border-slate-100 overflow-hidden shadow-sm h-full flex flex-col min-h-[600px]">
              <div className="flex items-center justify-between p-6 border-b border-slate-50 bg-slate-50/20">
                 <div className="flex items-center gap-2 font-extrabold text-[12px] tracking-wider uppercase text-slate-600">
                    <Eye size={14} className="text-primary" />
                    Live Preview
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Draft Saved</span>
                 </div>
              </div>

              <div className="flex-1 p-12 overflow-y-auto custom-scrollbar bg-slate-50/30">
                 {/* Mock Letter Paper */}
                 <div className="w-full max-w-2xl mx-auto bg-white shadow-2xl shadow-slate-200 min-h-[800px] p-16 flex flex-col">
                    <div className="flex justify-between items-start mb-16">
                       <div className="flex flex-col gap-1">
                          <h2 className="text-2xl font-black tracking-tighter text-slate-900">ANTIGRAVITY<span className="text-primary">.</span></h2>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Enterprise Systems</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[11px] font-bold text-slate-500">OFFER-2026-882</p>
                          <p className="text-[11px] font-bold text-slate-400">{new Date().toLocaleDateString()}</p>
                       </div>
                    </div>

                    <div className="space-y-8 text-slate-700 leading-relaxed text-[14px]">
                       <p>Dear <strong>{offerData.candidateName}</strong>,</p>
                       
                       <p>
                          We are thrilled to offer you the position of <strong>{offerData.role}</strong> at Antigravity. 
                          Your exceptional skills and experience during our evaluation process convinced us that you are 
                          the right fit for our mission-driven team.
                       </p>

                       <div className="bg-slate-50/80 p-8 rounded-2xl border border-slate-100 space-y-4">
                          <div className="flex justify-between border-b border-slate-100 pb-3">
                             <span className="text-slate-400 font-medium">Position</span>
                             <span className="font-bold text-slate-800">{offerData.role}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-3">
                             <span className="text-slate-400 font-medium">Annual Compensation</span>
                             <span className="font-bold text-slate-800">INR {offerData.ctc}</span>
                          </div>
                          <div className="flex justify-between">
                             <span className="text-slate-400 font-medium">Joining Date</span>
                             <span className="font-bold text-slate-800">{offerData.joiningDate}</span>
                          </div>
                       </div>

                       <p>
                          This offer is contingent upon successful background verification and is valid until 
                          <strong> {offerData.validUntil}</strong>. We look forward to having you join us and 
                          contribute to our success.
                       </p>

                       <div className="mt-16 pt-16 border-t border-slate-100">
                          <p className="font-black text-slate-900">HR Operations</p>
                          <p className="text-slate-400 text-sm">Antigravity Technologies</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};