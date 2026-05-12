import { ExternalLink, User, ArrowRight, Play, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface InterviewRecord {
  id: number;
  Interview_id: string;
  Candidate_id: string;
  Interview_date: string;
  Interview_time: string;
  Interview_status: string;
  Stage_status: string;
  Interviewer_name: string | null;
  Interview_score: number | null;
  Interviewer_feedback: string | null;
  Final_decision: string | null;
  Rejection_reason: string | null;
  Selected_date: string | null;
  created_at: string;
  candidate_name?: string;
  candidate_role?: string;
  current_candidate_stage?: string;
}

interface InterviewTableProps {
  data: InterviewRecord[];
  loading: boolean;
  onRowClick: (row: InterviewRecord) => void | Promise<void>;
  onMoveToNext: (row: InterviewRecord) => void | Promise<void>;
  getProgressPercentage: (stage: string) => number;
}

const AVATAR_COLORS = [
  ["bg-purple-100", "text-purple-700"],
  ["bg-blue-100", "text-blue-700"],
  ["bg-emerald-100", "text-emerald-700"],
  ["bg-amber-100", "text-amber-700"],
  ["bg-rose-100", "text-rose-700"],
  ["bg-sky-100", "text-sky-700"],
];

const getAvatarColor = (name: string) => {
  const idx = (name?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

export const InterviewTable = ({ 
  data, 
  loading, 
  onRowClick, 
  onMoveToNext,
  getProgressPercentage
}: InterviewTableProps) => {

  const getStatusBadge = (status: string) => {
    const configs: any = {
      Completed: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", dot: "bg-emerald-500", icon: <CheckCircle size={10} /> },
      "In Progress": { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", dot: "bg-blue-500", icon: <Play size={10} /> },
      Pending: { bg: "bg-slate-50", text: "text-slate-400", border: "border-slate-100", dot: "bg-slate-400", icon: <Clock size={10} /> },
    };
    const config = configs[status] || configs.Pending;
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold tracking-tight ${config.bg} ${config.text} ${config.border}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {status}
      </div>
    );
  };

  return (
    <div className="w-full overflow-x-auto custom-scrollbar">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="px-6 py-4 text-left text-[11px] font-bold tracking-widest uppercase text-slate-400 whitespace-nowrap">Candidate</th>
            <th className="px-6 py-4 text-left text-[11px] font-bold tracking-widest uppercase text-slate-400 whitespace-nowrap">Round & Date</th>
            <th className="px-6 py-4 text-left text-[11px] font-bold tracking-widest uppercase text-slate-400 whitespace-nowrap">Stage & Progress</th>
            <th className="px-6 py-4 text-left text-[11px] font-bold tracking-widest uppercase text-slate-400 whitespace-nowrap">Interviewer</th>
            <th className="px-6 py-4 text-left text-[11px] font-bold tracking-widest uppercase text-slate-400 whitespace-nowrap">Status</th>
            <th className="px-6 py-4 text-right text-[11px] font-bold tracking-widest uppercase text-slate-400 whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="px-6 py-20 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-[3px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                  <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Syncing Pipeline...</p>
                </div>
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((int) => {
              const [bgC, fgC] = getAvatarColor(int.candidate_name || "");
              const initials = int.candidate_name
                ?.split(" ")
                .slice(0, 2)
                .map((w: string) => w[0])
                .join("")
                .toUpperCase();

              return (
                <tr 
                  key={int.Interview_id} 
                  onClick={() => onRowClick(int)}
                  className="group border-b border-slate-50 cursor-pointer transition-colors hover:bg-indigo-50/30"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-extrabold flex-shrink-0 tracking-tighter ${bgC} ${fgC}`}>
                        {initials}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-slate-800 tracking-tight m-0">{int.candidate_name}</p>
                        <p className="text-[10px] font-bold text-slate-400 tracking-wider m-0 mt-0.5">ID: {int.Candidate_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                       <p className="text-[13px] font-bold text-slate-700 m-0">{int.Interview_status}</p>
                       <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">
                         {new Date(int.Interview_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {int.Interview_time}
                       </p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5 w-36">
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{int.current_candidate_stage}</span>
                          <span className="text-[10px] font-extrabold text-indigo-500">{getProgressPercentage(int.current_candidate_stage || "")}%</span>
                       </div>
                       <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${getProgressPercentage(int.current_candidate_stage || "")}%` }}
                            className="h-full bg-indigo-600 rounded-full"
                          />
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                          <User size={12} />
                       </div>
                       <span className="text-[11px] font-bold text-slate-600">{int.Interviewer_name || "Unassigned"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">{getStatusBadge(int.Stage_status)}</td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onMoveToNext(int); }}
                        className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100 active:scale-90"
                        title="Move to Next Stage"
                      >
                        <ArrowRight size={14} />
                      </button>
                      <button 
                        className="p-2 bg-white text-slate-400 rounded-lg hover:text-indigo-600 hover:border-indigo-200 transition-all border border-slate-100 active:scale-90"
                      >
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-20 text-center text-slate-300 text-[11px] font-bold uppercase tracking-widest">
                No active rounds found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
