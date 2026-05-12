import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Calendar, MoreVertical, UserPlus, Briefcase, Star, Clock, CheckCircle2, XCircle } from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  role: string;
  email: string;
  stage: "Applied" | "Technical" | "HR Round" | "Selected" | "Rejected";
  score: number;
  date: string;
}
// add some
export const Interview = () => {
  const [candidates] = useState<Candidate[]>([
    { id: "CAN-001", name: "Arjun Mehta", role: "Frontend Developer", email: "arjun.m@example.com", stage: "Technical", score: 88, date: "2026-03-24" },
    { id: "CAN-002", name: "Sanya Malhotra", role: "UI/UX Designer", email: "sanya.design@example.com", stage: "Selected", score: 94, date: "2026-03-22" },
    { id: "CAN-003", name: "Rohan Das", role: "Backend Engineer", email: "rohan.d@example.com", stage: "Applied", score: 72, date: "2026-03-25" },
    { id: "CAN-004", name: "Priya Singh", role: "Full Stack Developer", email: "priya.s@example.com", stage: "HR Round", score: 81, date: "2026-03-23" },
  ]);

  const getStageBadge = (stage: string) => {
    const configs: any = {
      Applied: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", icon: <Clock size={12} /> },
      Technical: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100", icon: <Briefcase size={12} /> },
      "HR Round": { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100", icon: <Star size={12} /> },
      Selected: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", icon: <CheckCircle2 size={12} /> },
      Rejected: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100", icon: <XCircle size={12} /> },
    };
    const config = configs[stage];
    return (
      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-tight ${config.bg} ${config.text} ${config.border}`}>
        {config.icon} {stage}
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="p-4 lg:p-8 h-full overflow-auto"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 leading-none">Interview Pipeline</h1>
            <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.15em] mt-3">Manage and track candidate progress</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
            <UserPlus size={18} /> Add Candidate
          </button>
        </div>

        {/* TOP METRICS ROW (MATCHING YOUR STYLE) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Total Applied</p>
            <p className="text-3xl font-black text-slate-900">124</p>
          </div>
          <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute left-0 top-1/4 bottom-1/4 w-1.5 bg-amber-400 rounded-r-full"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Interviews</p>
            <p className="text-3xl font-black text-slate-900">18</p>
          </div>
          <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute left-0 top-1/4 bottom-1/4 w-1.5 bg-emerald-400 rounded-r-full"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Selected</p>
            <p className="text-3xl font-black text-slate-900">06</p>
          </div>
          <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute left-0 top-1/4 bottom-1/4 w-1.5 bg-rose-400 rounded-r-full"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-rose-600/70">Rejected</p>
            <p className="text-3xl font-black text-slate-900">12</p>
          </div>
        </div>

        {/* FILTERS & SEARCH */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or role..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Filter size={18} /> Advanced Filters
          </button>
        </div>

        {/* CANDIDATE LIST TABLE */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role Applied</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">AI Score</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stage</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {candidates.map((can, idx) => (
                <tr key={idx} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100">
                        {can.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-sm leading-tight">{can.name}</p>
                        <p className="text-[11px] text-slate-400 font-bold mt-1 tracking-tight">{can.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                      <Briefcase size={14} className="text-slate-300" />
                      {can.role}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex flex-col items-center">
                        <span className={`text-sm font-black ${can.score > 85 ? 'text-emerald-600' : 'text-slate-700'}`}>
                            {can.score}%
                        </span>
                        <div className="w-10 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                            <div className={`h-full ${can.score > 85 ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${can.score}%` }}></div>
                        </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">{getStageBadge(can.stage)}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <button title="Schedule" className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                            <Calendar size={18} />
                        </button>
                        <button title="Options" className="p-2.5 text-slate-300 hover:text-slate-600 transition-colors">
                            <MoreVertical size={20} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </motion.div>
  );
};