import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, UserCheck } from "lucide-react";
import { Selection } from "../../../Components/Common/Selection";
import { CustomTimePicker } from "../../../Components/Common/CustomTimePicker";

interface AttendanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedName: string;
  selectedId: string | null;
  selectedDate: string;
  status: string;
  setStatus: (s: string) => void;
  checkIn: string;
  setCheckIn: (s: string) => void;
  checkOut: string;
  setCheckOut: (s: string) => void;
  onSave: () => void;
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

const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
};

export const AttendanceDrawer = ({
  isOpen,
  onClose,
  selectedName,
  selectedId,
  selectedDate,
  status,
  setStatus,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  onSave
}: AttendanceDrawerProps) => {
  const theme = getThemeColor(selectedName);
  const initials = selectedName?.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
          />

          <motion.div 
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} 
            transition={{ type: "spring", damping: 28, stiffness: 300 }} 
            className="relative w-full max-w-[420px] h-[calc(100vh-32px)] bg-white rounded-[24px] flex flex-col overflow-hidden shadow-2xl font-sans"
          >
            {/* Top Strip */}
            <div className={`p-7 pb-6 border-b border-slate-100 ${theme.bg} text-white relative shadow-lg`}>
              <button 
                onClick={onClose} 
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer text-white/80 transition-all hover:bg-white/20"
              >
                <X size={15} />
              </button>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-xl font-extrabold flex-shrink-0 tracking-tighter border border-white/10">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-extrabold uppercase tracking-tight m-0 text-white">{selectedName}</h2>
                  <p className="text-[10px] font-bold text-white uppercase tracking-widest mt-1">ID: {selectedId} • {formatDisplayDate(selectedDate)}</p>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide mt-2.5 bg-white/10 text-white border border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Attendance Log
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-7 pt-8 space-y-8 custom-scrollbar">
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-extrabold tracking-widest uppercase text-slate-400">Current Status</p>
                  <Selection
                    label=""
                    value={status}
                    name="status"
                    options={[
                      { label: "Present", value: "Present" },
                      { label: "Absent", value: "Absent" },
                      { label: "Late", value: "Late" },
                      { label: "Leave", value: "Leave" },
                    ]}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <CustomTimePicker
                    label="Check-In"
                    name="checkIn"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                  <CustomTimePicker
                    label="Check-Out"
                    name="checkOut"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
              </div>

              <div className={`p-6 ${theme.soft} rounded-2xl border ${theme.border} space-y-4`}>
                 <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${theme.bg} text-white flex items-center justify-center`}>
                       <Clock size={16} />
                    </div>
                    <p className={`text-[12px] font-extrabold uppercase tracking-tight ${theme.text}`}>Log Summary</p>
                 </div>
                 <p className="text-[12px] font-medium text-slate-500 leading-relaxed">
                   Updating log for <span className="font-bold text-slate-700">{selectedName}</span> on <span className="font-bold text-slate-700">{selectedDate}</span>. Please ensure times are accurate.
                 </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 px-7 border-t border-slate-100 bg-slate-50 flex flex-col gap-3">
              <button 
                onClick={onSave}
                className={`w-full h-12 ${theme.bg} text-white rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 active:scale-95`}
              >
                <UserCheck size={14} /> Update Log
              </button>
              <button
                onClick={onClose}
                className="w-full h-12 rounded-xl border border-slate-200 bg-white text-[11px] font-bold text-slate-500 uppercase tracking-widest transition-all hover:bg-slate-100 active:scale-95"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
