import { motion, AnimatePresence } from "framer-motion";
import { 
  X, CheckCircle, ArrowRight, UserCheck, ShieldAlert 
} from "lucide-react";

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

interface InterviewDrawerProps {
  interview: InterviewRecord | null;
  onClose: () => void;
  onComplete: (i: InterviewRecord) => void;
  onMoveToNext: (i: InterviewRecord) => void;
  onRecruit: (i: InterviewRecord) => void;
  onReject: (i: InterviewRecord) => void;
  stages: string[];
  isUpdating: boolean;
}

const AVATAR_COLORS = [
  { bg: "bg-purple-600", lightBg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100", soft: "bg-purple-600/10" },
  { bg: "bg-blue-600", lightBg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", soft: "bg-blue-600/10" },
  { bg: "bg-emerald-600", lightBg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", soft: "bg-emerald-600/10" },
  { bg: "bg-amber-600", lightBg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100", soft: "bg-amber-600/10" },
  { bg: "bg-rose-600", lightBg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100", soft: "bg-rose-600/10" },
  { bg: "bg-sky-600", lightBg: "bg-sky-50", text: "text-sky-600", border: "border-sky-100", soft: "bg-sky-600/10" },
];

const getThemeColor = (name: string) => {
  const idx = (name?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

export const InterviewDrawer = ({
  interview,
  onClose,
  onComplete,
  onMoveToNext,
  onRecruit,
  onReject,
  stages,
  isUpdating
}: InterviewDrawerProps) => {
  if (!interview) return null;

  const theme = getThemeColor(interview.candidate_name || "");
  const initials = interview.candidate_name
    ?.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
          onClick={onClose} 
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
        />

        {/* Drawer */}
        <motion.div 
          initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} 
          transition={{ type: "spring", damping: 28, stiffness: 300 }} 
          className="relative w-full max-w-[420px] h-[calc(100vh-32px)] bg-white rounded-[24px] flex flex-col overflow-hidden shadow-2xl font-sans"
        >
          {/* Top Strip - DYNAMIC COLOR */}
          <div className={`p-7 pb-6 border-b border-slate-100 ${theme.bg} text-white relative shadow-lg`}>
            <button 
              onClick={onClose} 
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer text-white/80 transition-all hover:bg-white/20"
            >
              <X size={15} />
            </button>

            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-xl font-extrabold flex-shrink-0 tracking-tighter border border-white/10">
                {initials}
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-extrabold uppercase tracking-tight m-0">{interview.candidate_name}</h2>
                <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mt-1">ID: {interview.Candidate_id} • {interview.candidate_role}</p>
                
                {/* Status Badge */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide mt-2.5 bg-white/10 text-white border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  {interview.current_candidate_stage} Round
                </span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-7 pt-6 custom-scrollbar">
            {/* Round Details Section */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className={`p-5 ${theme.lightBg} rounded-2xl border ${theme.border} text-center`}>
                <p className={`text-[10px] font-extrabold ${theme.text} uppercase tracking-widest mb-1 opacity-60`}>Score</p>
                <p className={`text-lg font-black ${theme.text}`}>{interview.Interview_score || "—"}</p>
              </div>
              <div className={`p-5 ${theme.lightBg} rounded-2xl border ${theme.border} text-center`}>
                <p className={`text-[10px] font-extrabold ${theme.text} uppercase tracking-widest mb-1 opacity-60`}>Round Status</p>
                <p className={`text-[13px] font-black uppercase tracking-tight ${theme.text}`}>
                  {interview.Stage_status}
                </p>
              </div>
            </div>

            {/* Progress Timeline Section */}
            <div className="mb-8">
              <p className="m-0 mb-5 text-[10px] font-extrabold tracking-widest uppercase text-slate-400">Recruitment Timeline</p>
              <div className="space-y-4 relative pl-4 border-l-2 border-slate-100 ml-3">
                {stages.filter(s => s !== "Recruited" && s !== "Rejected").map((stage, i) => {
                  const currentIndex = stages.indexOf(interview.current_candidate_stage || "Applied");
                  const isActive = currentIndex === i && interview.Stage_status !== "Completed";
                  const isCompleted = currentIndex > i || (currentIndex === i && interview.Stage_status === "Completed");
                  
                  let colorClass = "bg-slate-100 text-slate-400";
                  if (isCompleted) colorClass = `${theme.bg} text-white`;
                  else if (isActive) colorClass = `${theme.bg} text-white scale-110 shadow-lg`;

                  return (
                    <div key={stage} className="relative flex items-center gap-5">
                       <div className={`absolute -left-[1.9rem] w-5 h-5 rounded-lg flex items-center justify-center border-[3px] border-white transition-all duration-300 ${colorClass}`}>
                         {isCompleted ? <CheckCircle size={10} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                       </div>
                       <div className={`flex-1 p-3.5 rounded-xl border transition-all ${isActive ? `${theme.soft} ${theme.border}` : "border-transparent"}`}>
                          <p className={`text-[11px] font-bold uppercase tracking-wide ${isActive ? theme.text : isCompleted ? "text-slate-700" : "text-slate-400"}`}>
                            {stage}
                          </p>
                       </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Feedback Section */}
            <div className={`p-7 ${theme.bg} rounded-[2rem] text-white shadow-xl`}>
              <h3 className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em] mb-5">Interviewer Feedback</h3>
              <div className="bg-white/10 p-5 rounded-xl backdrop-blur-sm border border-white/5 mb-6">
                 <p className="text-xs font-medium italic text-white leading-relaxed m-0">
                   "{interview.Interviewer_feedback || "No feedback recorded yet."}"
                 </p>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center font-bold text-xs">
                    {interview.Interviewer_name?.charAt(0) || "H"}
                 </div>
                 <div>
                    <p className="text-xs font-black uppercase tracking-widest m-0">{interview.Interviewer_name || "HR Team"}</p>
                    <p className="text-[9px] font-bold text-white/60 uppercase tracking-tight mt-0.5">Decision Maker</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-6 px-7 border-t border-slate-100 bg-slate-50 flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5">
              {/* 1. Complete Stage Button */}
              {interview.Stage_status !== "Completed" && (
                 <button 
                   disabled={isUpdating}
                   onClick={() => onComplete(interview)}
                   className={`flex-1 h-12 ${theme.bg} text-white rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
                 >
                   <CheckCircle size={14} /> Complete Round
                 </button>
              )}

              {/* 2. Move Next Stage */}
              {interview.Stage_status === "Completed" && interview.current_candidate_stage !== "Final Round" && (
                 <button 
                   disabled={isUpdating}
                   onClick={() => onMoveToNext(interview)}
                   className={`flex-1 h-12 ${theme.bg} text-white rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
                 >
                   <ArrowRight size={14} /> Next Stage
                 </button>
              )}

              {/* 3. Recruit Button */}
              {interview.current_candidate_stage === "Final Round" && interview.Stage_status === "Completed" && (
                 <button 
                   disabled={isUpdating}
                   onClick={() => onRecruit(interview)}
                   className="flex-1 h-12 bg-emerald-600 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   <UserCheck size={14} /> Finalize
                 </button>
              )}

              <button 
                disabled={isUpdating}
                onClick={() => onReject(interview)}
                className="flex-1 h-12 bg-white text-rose-600 rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-sm border border-rose-100 hover:bg-rose-50 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShieldAlert size={14} /> Reject
              </button>
            </div>
            
            <button
              onClick={onClose}
              className="w-full h-12 rounded-xl border border-slate-200 bg-white text-[11px] font-bold text-slate-500 uppercase tracking-widest transition-all hover:bg-slate-100 active:scale-95"
            >
              Close Detail
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
