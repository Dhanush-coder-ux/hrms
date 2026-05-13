import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, CheckCircle, ShieldAlert,  Play
} from "lucide-react";
import type { InterviewRecord } from "../../../../../Types/typesOnboarding";
import { Api_URL } from "../../../../../APILINK";

interface InterviewDrawerProps {
  interview: InterviewRecord | null;
  onClose: () => void;
  onComplete: (i: InterviewRecord) => void;
  onReject: (i: InterviewRecord) => void;
  stages: string[];
  isUpdating: boolean;
}

interface StageProgress {
  Stage_name: string;
  Stage_status: string;
  Remarks: string | null;
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
  onReject,
  stages,
  isUpdating
}: InterviewDrawerProps) => {
  const [stageProgress, setStageProgress] = useState<StageProgress[]>([]);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    if (interview) {
      setScore(interview.Interview_score || 0);
      setFeedback(interview.Interviewer_feedback || "");
    }
  }, [interview]);

  useEffect(() => {
    if (interview?.candidate_id) {
      const fetchProgress = async () => {
        try {
          const res = await fetch(`${Api_URL}/candidates/stages/${interview.candidate_id}`);
          const data = await res.json();
          setStageProgress(data);
        } catch (err) {
          console.error("Failed to fetch stage progress");
        }
      };
      fetchProgress();
    }
  }, [interview?.candidate_id, isUpdating]); 

  if (!interview) return null;

  const theme = getThemeColor(interview.candidate_name || "");
  const initials = interview.candidate_name
    ?.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();

  const getPercentage = (stageName: string) => {
    const mapping: Record<string, number> = {
      "Screening": 20,
      "Technical Round 1": 40,
      "Technical Round 2": 60,
      "HR Round": 80,
      "Final Round": 100
    };
    return mapping[stageName] || 0;
  };

  const progressPercentage = stageProgress
    .filter(s => s.Stage_status === "Completed")
    .reduce((max, s) => Math.max(max, getPercentage(s.Stage_name)), 0);

  const visibleStages = stages;

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
          <div className={`p-7 pb-6 border-b border-slate-100 ${theme.bg} text-white relative shadow-lg`}>
            <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer text-white/80 transition-all hover:bg-white/20">
              <X size={15} />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-xl font-extrabold flex-shrink-0 tracking-tighter border border-white/10">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-extrabold uppercase tracking-tight m-0">{interview.candidate_name}</h2>
                <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mt-1">ID: {interview.Candidate_id} • {interview.candidate_role}</p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide mt-2.5 bg-white/10 text-white border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  {interview.Stage_name} Round
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-7 pt-6 custom-scrollbar">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Progress</span>
                <span className={`text-[12px] font-black ${theme.text}`}>{progressPercentage}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} className={`h-full ${theme.bg}`} />
              </div>
            </div>

            <div className="mb-8">
              <p className="m-0 mb-5 text-[10px] font-extrabold tracking-widest uppercase text-slate-400">Recruitment Pipeline</p>
              <div className="space-y-0 relative pl-4 ml-3">
                <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-slate-100" />
                {visibleStages.map((stage, idx) => {
                  const progress = stageProgress.find(p => p.Stage_name === stage);
                  const isCurrent = interview.Stage_name === stage;
                  const isCompleted = progress?.Stage_status === "Completed";
                  const isRejected = progress?.Stage_status === "Rejected";

                  let statusColor = "bg-slate-100 text-slate-300 border-white";
                  let icon = <div className="w-1.5 h-1.5 rounded-full bg-current" />;
                  
                  if (isRejected) {
                    statusColor = "bg-rose-500 text-white border-rose-100";
                    icon = <ShieldAlert size={10} />;
                  } else if (isCompleted) {
                    statusColor = "bg-emerald-500 text-white border-emerald-100";
                    icon = <CheckCircle size={10} />;
                  } else if (isCurrent) {
                    statusColor = "bg-indigo-600 text-white border-indigo-100 shadow-lg shadow-indigo-100";
                    icon = <Play size={10} />;
                  }

                  return (
                    <div key={stage} className={`relative flex items-center gap-5 pb-6 last:pb-0 ${idx === 0 ? "pt-0" : ""}`}>
                       <div className={`absolute -left-[1.05rem] w-5 h-5 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-500 ${statusColor}`}>
                         {icon}
                       </div>
                       <div className={`flex-1 p-3 px-4 rounded-2xl border transition-all duration-300 ${isCurrent ? "bg-indigo-50/50 border-indigo-100 shadow-sm" : "border-transparent"}`}>
                          <div className="flex items-center justify-between">
                            <p className={`text-[11px] font-bold uppercase tracking-wider ${isRejected ? "text-rose-600" : isCurrent ? "text-indigo-600" : isCompleted ? "text-emerald-600" : "text-slate-400"}`}>
                              {stage}
                            </p>
                          </div>
                       </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <p className="m-0 mb-3 text-[10px] font-extrabold tracking-widest uppercase text-slate-400">Assessment Details</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Interview Score</label>
                    <input 
                      type="number" 
                      className="h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                      value={score || ""}
                      onChange={(e) => setScore(parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Status</label>
                    <div className="h-11 flex items-center px-4 rounded-xl border border-slate-100 bg-slate-50 text-[11px] font-black text-indigo-600 uppercase tracking-tight">
                      {interview.Interview_status}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Interviewer Feedback</label>
                <textarea 
                  className="w-full min-h-[100px] p-4 rounded-2xl border border-slate-200 bg-slate-50 text-[12px] font-medium text-slate-600 outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none leading-relaxed"
                  value={feedback || ""}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="p-6 px-7 border-t border-slate-100 bg-slate-50 flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5">
              {interview.Interview_status !== "Completed" && (
                 <button 
                   disabled={isUpdating}
                   onClick={() => onComplete({ ...interview, Interview_score: score, Interviewer_feedback: feedback })}
                   className={`flex-1 h-12 ${theme.bg} text-white rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50`}
                 >
                   <CheckCircle size={14} /> Complete & Advance
                 </button>
              )}
              <button 
                disabled={isUpdating}
                onClick={() => onReject(interview)}
                className="flex-1 h-12 bg-white text-rose-600 rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-sm border border-rose-100 hover:bg-rose-50 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <ShieldAlert size={14} /> Reject
              </button>
            </div>
            <button onClick={onClose} className="w-full h-11 rounded-xl border border-slate-200 bg-white text-[11px] font-bold text-slate-500 uppercase tracking-widest transition-all hover:bg-slate-100 active:scale-95">Close</button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
