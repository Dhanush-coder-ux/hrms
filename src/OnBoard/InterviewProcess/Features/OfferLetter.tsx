import React, { useState } from "react";
import { 
  FileText, 
  Send, 
  Download, 
  CheckCircle, 
  User, 
  Briefcase, 
  Calendar, 
  IndianRupee,
  Eye,
  PenTool
} from "lucide-react";

export const OfferLetterPage = () => {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  // Mock Offer Data
  const [offerData, setOfferData] = useState({
    candidateName: "Rithika Sen",
    role: "Senior Product Designer",
    joiningDate: "2026-06-15",
    ctc: "18,00,000",
    location: "Bangalore (Remote)",
    validUntil: "2026-05-10"
  });

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen text-slate-900 font-sans">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Offer <span className="text-violet-600">Letter</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Generate and dispatch official employment contracts.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
            <Download size={16} /> Save Draft
          </button>
          <button className="px-6 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-bold shadow-lg shadow-violet-200 hover:bg-violet-700 transition-all flex items-center gap-2">
            <Send size={16} /> Send Offer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form / Editor */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <PenTool className="text-violet-500" size={20} /> Candidate Details
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Candidate Full Name</label>
                <div className="mt-1 relative">
                    <User className="absolute left-4 top-3.5 text-slate-300" size={18} />
                    <input 
                      type="text" 
                      value={offerData.candidateName}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all font-medium"
                    />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Designation</label>
                <div className="mt-1 relative">
                    <Briefcase className="absolute left-4 top-3.5 text-slate-300" size={18} />
                    <input 
                      type="text" 
                      value={offerData.role}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all font-medium"
                    />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Joining Date</label>
                  <div className="mt-1 relative">
                      <Calendar className="absolute left-4 top-3.5 text-slate-300" size={18} />
                      <input 
                        type="date" 
                        value={offerData.joiningDate}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none"
                      />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Annual CTC</label>
                  <div className="mt-1 relative">
                      <IndianRupee className="absolute left-4 top-3.5 text-slate-300" size={18} />
                      <input 
                        type="text" 
                        value={offerData.ctc}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none"
                      />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Letter Template</h4>
                <select className="w-full p-4 bg-violet-50 border border-violet-100 rounded-2xl text-sm font-bold text-violet-700 outline-none appearance-none cursor-pointer">
                    <option>Standard Product Team Template</option>
                    <option>Executive Leadership Template</option>
                    <option>Internship/Trainee Template</option>
                </select>
            </div>
          </div>
        </div>

        {/* Right Column: Live Preview */}
        <div className="lg:col-span-7 bg-white rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden relative">
          {/* Preview Toolbar */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md px-6 py-2 rounded-full flex items-center gap-6 z-10">
            <div className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest">
                <Eye size={14} className="text-violet-400" /> Preview Mode
            </div>
            <div className="w-[1px] h-4 bg-white/20"></div>
            <button className="text-white/60 hover:text-white transition-colors">
                <Download size={14} />
            </button>
          </div>

          {/* Document Content */}
          <div className="p-16 h-full max-h-[800px] overflow-y-auto bg-[#FFFFFF] scrollbar-hide">
            {/* Company Logo Placeholder */}
            <div className="flex justify-between items-start mb-16">
                <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center text-white font-black italic">
                    L
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date of Issue</p>
                    <p className="text-sm font-bold">April 27, 2026</p>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-black text-slate-900">Letter of Appointment</h2>
                
                <p className="text-sm text-slate-600 leading-relaxed">
                    Dear <span className="font-bold text-slate-900 underline decoration-violet-300">{offerData.candidateName}</span>,
                </p>

                <p className="text-sm text-slate-600 leading-relaxed">
                    We are thrilled to formally offer you the position of <span className="font-bold text-slate-900">{offerData.role}</span> at **Leadoptima Web**. Your skills and experience stood out to us, and we are confident you will be a valuable addition to our team.
                </p>

                <div className="py-6 border-y border-slate-100 my-8 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Annual Gross CTC</span>
                        <span className="font-bold text-slate-900">INR {offerData.ctc}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Joining Date</span>
                        <span className="font-bold text-slate-900">{offerData.joiningDate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Job Location</span>
                        <span className="font-bold text-slate-900">{offerData.location}</span>
                    </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed italic">
                    Please review this offer and return a signed copy by **{offerData.validUntil}** to signify your acceptance.
                </p>

                <div className="pt-16 flex justify-between">
                    <div>
                        <div className="w-32 h-[1px] bg-slate-200 mb-2"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized Signatory</p>
                        <p className="text-xs font-bold text-slate-800">HR Director, Leadoptima</p>
                    </div>
                    <div>
                        <div className="w-32 h-[1px] bg-slate-200 mb-2"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate Signature</p>
                    </div>
                </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};