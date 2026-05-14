import { ExternalLink, User} from "lucide-react";
import { motion } from "framer-motion";

import type { InterviewRecord } from "../../../../../Types/typesOnboarding";



interface InterviewTableProps {
  data: InterviewRecord[];
  loading: boolean;
  onRowClick: (row: InterviewRecord) => void | Promise<void>;
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

import { pageTheme } from "../../../../../Themes/PageThems/pageConfig";

export const InterviewTable = ({ 
  data, 
  loading, 
  onRowClick
}: InterviewTableProps) => {

  const getStatusBadge = (status: string) => {
const configs: any = {

  Completed: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-100",
    dot: "bg-emerald-500"
  },

  "In Progress": {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
    dot: "bg-blue-500"
  },

  Pending: {
    bg: "bg-slate-50",
    text: "text-slate-500",
    border: "border-slate-100",
    dot: "bg-slate-400"
  },

  Rejected: {
    bg: "bg-rose-50",
    text: "text-rose-600",
    border: "border-rose-100",
    dot: "bg-rose-500"
  }
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
    <div className={pageTheme.table.wrapper}>
      <table className="w-full border-collapse relative">
        <thead className={pageTheme.table.head}>
          <tr className={pageTheme.table.headRow}>
            <th className={pageTheme.table.headCell}>Candidate</th>
            <th className={pageTheme.table.headCell}>Round & Date</th>
            <th className={pageTheme.table.headCell}>Stage & Progress</th>
            <th className={pageTheme.table.headCell}>Interviewer</th>
            <th className={pageTheme.table.headCell}>Status</th>
            <th className={`${pageTheme.table.headCell} text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="px-6 py-20 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin"></div>
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
                  key={int.id} 
                  onClick={() => onRowClick(int)}
                  className={pageTheme.table.row}
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
                       <p className="text-[13px] font-bold text-slate-700 m-0">{int.Stage_name}</p>
                       <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">
                         {new Date(int.Interview_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {int.Interview_time}
                       </p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5 w-36">
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{int.current_candidate_stage}</span>
                          <span className="text-[10px] font-extrabold text-primary">
                            {int.total_stages_count ? Math.round(((int.completed_stages_count || 0) / int.total_stages_count) * 100) : 0}%
                          </span>
                       </div>
                       <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${int.total_stages_count ? ((int.completed_stages_count || 0) / int.total_stages_count) * 100 : 0}%` }}
                            className="h-full bg-primary rounded-full"
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
                        className="p-2 bg-white text-slate-400 rounded-lg hover:text-primary hover:border-primary/20 transition-all border border-slate-100 active:scale-90"
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
