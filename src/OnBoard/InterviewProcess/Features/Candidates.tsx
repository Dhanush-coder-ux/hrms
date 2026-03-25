import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MoreVertical, UserPlus, Briefcase } from "lucide-react";
import SearchBar from "../../../Components/Common/Searchbar";

// Types for your Candidate Data
interface Candidate {
  id: string;
  name: string;
  role: string;
  email: string;
  stage: "Applied" | "Technical" | "HR Round" | "Selected" | "Rejected";
  appliedDate: string;
  score: number;
}

export const Candidates = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const candidates: Candidate[] = [
    { id: "C101", name: "Rahul Sharma", role: "React Developer", email: "rahul@example.com", stage: "Technical", appliedDate: "2026-03-20", score: 85 },
    { id: "C102", name: "Sneha Patel", role: "UI/UX Designer", email: "sneha@example.com", stage: "Selected", appliedDate: "2026-03-18", score: 92 },
    { id: "C103", name: "Vikram Singh", role: "Backend Lead", email: "vikram@example.com", stage: "Applied", appliedDate: "2026-03-22", score: 78 },
    { id: "C104", name: "Ananya Iyer", role: "DevOps Engineer", email: "ananya@example.com", stage: "HR Round", appliedDate: "2026-03-21", score: 88 },
  ];

  const getStageStyles = (stage: string) => {
    switch (stage) {
      case "Selected": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Rejected": return "bg-rose-50 text-rose-600 border-rose-100";
      case "Applied": return "bg-blue-50 text-blue-600 border-blue-100";
      default: return "bg-amber-50 text-amber-600 border-amber-100";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-6 lg:p-10 bg-[#f8fafc] min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Interview Candidates</h1>
            <p className="text-slate-400 text-sm font-medium mt-1">Review and manage the recruitment pipeline</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
            <UserPlus size={18} /> Add New Candidate
          </button>
        </div>

        {/* RECRUITMENT STATS (Integrated Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <SummaryWidget label="Total Applicants" value={42} color="indigo" />
          <SummaryWidget label="In Interviews" value={12} color="amber" />
          <SummaryWidget label="Shortlisted" value={8} color="emerald" />
          <SummaryWidget label="Rejected" value={5} color="rose" />
        </div>

        {/* FILTERS & SEARCH */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <SearchBar  value={searchTerm} onChange={(value) => setSearchTerm(value)} />
          </div>
        </div>

        {/* CANDIDATE LIST */}
        <div className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-20">Score</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Applied Role</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stage</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {candidates.map((person) => (
                <tr key={person.id} className="group hover:bg-slate-50/50 transition-all cursor-default">
                  <td className="px-8 py-6">
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-black text-slate-700">{person.score}</span>
                        <div className="w-8 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-indigo-500" style={{ width: `${person.score}%` }}></div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-sm">
                        {person.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{person.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium">{person.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                        <Briefcase size={14} className="text-slate-300" />
                        <span className="text-sm font-bold text-slate-600">{person.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight border ${getStageStyles(person.stage)}`}>
                      {person.stage}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-400 hover:text-indigo-600">
                            <Calendar size={18} />
                        </button>
                        <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-400 hover:text-slate-900">
                            <MoreVertical size={18} />
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

// Internal Widget Component (Integrated design)
const SummaryWidget = ({ label, value, color }: { label: string, value: number, color: string }) => {
    const colors: any = {
        indigo: "text-indigo-600 bg-indigo-50/50",
        amber: "text-amber-600 bg-amber-50/50",
        emerald: "text-emerald-600 bg-emerald-50/50",
        rose: "text-rose-600 bg-rose-50/50"
    };
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
            <div className="flex items-end justify-between">
                <span className="text-3xl font-black text-slate-900 leading-none">{value}</span>
                <span className={`px-2 py-1 rounded-lg text-[10px] font-black ${colors[color]}`}>+12%</span>
            </div>
        </div>
    );
};