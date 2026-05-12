import { motion, AnimatePresence } from "framer-motion";
import {
  X, Mail, Phone, Paperclip, ExternalLink,
  CheckCircle, XCircle, Calendar, ChevronRight, User,
} from "lucide-react";
import type { Candidate } from "../../../../../Types/typesOnboarding";

interface CandidateDrawerProps {
  candidate: Candidate | null;
  onClose: () => void;
  isSaving: boolean;
  onUpdateStatus: (id: string, status: string) => void;
  onInvite: (c: Candidate) => void;
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

const STATUS_CONFIG: Record<string, { label: string; dot: string; badge: string; text: string }> = {
  selected:  { label: "Selected",  dot: "bg-white", badge: "bg-white/10", text: "text-white" },
  rejected:  { label: "Rejected",  dot: "bg-rose-500", badge: "bg-rose-50", text: "text-rose-600" },
  interview: { label: "Interview", dot: "bg-blue-500", badge: "bg-blue-50", text: "text-blue-600" },
  default:   { label: "Applied",   dot: "bg-slate-400", badge: "bg-slate-50", text: "text-slate-600" },
};

export const CandidateDrawer = ({
  candidate, onClose, isSaving, onUpdateStatus, onInvite,
}: CandidateDrawerProps) => {
  if (!candidate) return null;

  const currentStatus = candidate.Status?.toLowerCase() || "";
  const isProcessed = ["interview", "selected", "rejected"].includes(currentStatus);
  const sc = STATUS_CONFIG[currentStatus] ?? STATUS_CONFIG.default;
  const theme = getThemeColor(candidate.Candidate_name || "");
  const initials = candidate.Candidate_name
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
          {/* Top strip */}
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
                <p className="text-lg font-extrabold tracking-tight m-0 uppercase">
                  {candidate.Candidate_name}
                </p>
                <p className="text-[10px] font-bold text-white/80 m-0 mt-1 uppercase tracking-widest">
                  {candidate.Job_title}
                </p>
                {/* Status badge */}
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide mt-2.5 ${sc.badge} ${sc.text} border border-white/10`}>
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sc.dot}`} />
                  {candidate.Status || "Applied"}
                </span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-7 pt-6 custom-scrollbar">
            {/* Contact */}
            <Section label="Contact Info">
              <InfoRow icon={<Mail size={14} />} value={candidate.Candidate_Email} />
              <InfoRow icon={<Phone size={14} />} value={candidate.Candidate_Phone} />
            </Section>

            {/* Resume */}
            <Section label="Resume">
              <div className={`flex items-center justify-between p-3.5 px-4 rounded-2xl border transition-all ${
                candidate.Resume_path ? "bg-emerald-50/50 border-emerald-100" : "bg-rose-50/50 border-rose-100"
              }`}>
                <div className="flex items-center gap-2.5">
                  <Paperclip size={16} className={candidate.Resume_path ? "text-emerald-500" : "text-rose-500"} />
                  <span className={`text-[13px] font-bold ${candidate.Resume_path ? "text-emerald-700" : "text-rose-700"}`}>
                    {candidate.Resume_path ? "Resume Attached" : "No Resume Found"}
                  </span>
                </div>
                {candidate.Resume_path && (
                  <button
                    onClick={() => window.open(candidate.Resume_path, "_blank")}
                    className="px-2.5 py-1.5 rounded-lg border border-emerald-100 bg-white cursor-pointer flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 transition-all hover:bg-emerald-600 hover:text-white hover:border-emerald-600 active:scale-95"
                  >
                    <ExternalLink size={12} /> Open
                  </button>
                )}
              </div>
            </Section>

            {/* Actions */}
            {!isProcessed ? (
              <Section label="Decision">
                <div className="grid grid-cols-2 gap-2.5 mb-2.5">
                  <ActionButton
                    disabled={isSaving}
                    onClick={() => onUpdateStatus(candidate.Candidate_id, "Selected")}
                    className="bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white"
                    icon={<CheckCircle size={15} />} label="Select"
                  />
                  <ActionButton
                    disabled={isSaving}
                    onClick={() => onUpdateStatus(candidate.Candidate_id, "Rejected")}
                    className="bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-600 hover:text-white"
                    icon={<XCircle size={15} />} label="Reject"
                  />
                </div>

                {/* Invite button */}
                <button
                  disabled={isSaving}
                  onClick={() => onInvite(candidate)}
                  className={`w-full flex items-center justify-between p-4 px-5 rounded-2xl border-none ${theme.bg} text-white cursor-pointer text-[13px] font-bold transition-all hover:brightness-110 active:scale-[0.98] shadow-lg shadow-indigo-100 disabled:opacity-50`}
                >
                  <span className="flex items-center gap-2.5">
                    <Calendar size={18} />
                    Invite to Interview
                  </span>
                  <ChevronRight size={18} />
                </button>
              </Section>
            ) : (
              <div className="p-4 px-5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <User size={18} className="text-slate-300 mx-auto mb-2" />
                <p className="m-0 text-[13px] font-semibold text-slate-500">
                  Candidate is in the{" "}
                  <span className="text-indigo-600 font-extrabold">{candidate.Status}</span>{" "}
                  stage.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-5 px-7 border-t border-slate-100 bg-white">
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl border border-slate-200 bg-white text-[13px] font-bold text-slate-500 cursor-pointer transition-all hover:bg-slate-50 active:scale-95"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/* Helpers */
const Section = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="mb-6">
    <p className="m-0 mb-3 text-[10px] font-extrabold tracking-widest uppercase text-slate-400">
      {label}
    </p>
    {children}
  </div>
);

const InfoRow = ({ icon, value }: { icon: React.ReactNode; value: string }) => (
  <div className="flex items-center gap-2.5 padding-2.5 px-3.5 rounded-xl bg-slate-50 border border-slate-100 mb-2 text-[13px] font-bold text-slate-700 py-2.5">
    <span className="text-slate-400 flex">{icon}</span>
    {value}
  </div>
);

const ActionButton = ({ disabled, onClick, className, icon, label }: { disabled: boolean; onClick: () => void; className: string; icon: React.ReactNode; label: string }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border text-[13px] font-bold cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50 ${className}`}
  >
    {icon} {label}
  </button>
);