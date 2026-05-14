import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, Building, Briefcase, Calendar, ChevronRight, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Employee } from "../../../Types/typesEmployeeManagement";
import { getUserTheme, UserAvatar } from "../../../Components/Common/UserAvatar";

interface EmployeeDetailsDrawerProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EmployeeDetailsDrawer = ({
  employee,
  isOpen,
  onClose
}: EmployeeDetailsDrawerProps) => {
  const navigate = useNavigate();
  if (!employee) return null;

  const theme = getUserTheme(employee.name);

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
                <UserAvatar name={employee.name} variant="solid" size="xl" className="border-white/10" />
                <div className="flex-1 min-w-0 text-white">
                  <h2 className="text-lg font-extrabold uppercase tracking-tight m-0 text-white">{employee.name}</h2>
                  <p className="text-[10px] font-bold text-white uppercase tracking-widest mt-1">ID: {employee.Emp_id}</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide mt-2.5 ${employee.Status === "Active" ? "bg-emerald-500/20 text-emerald-100" : "bg-rose-500/20 text-rose-100"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${employee.Status === "Active" ? "bg-emerald-400" : "bg-rose-400"} animate-pulse`} />
                    {employee.Status}
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-7 space-y-8 custom-scrollbar">
              {/* Core Info */}
              <div className="space-y-4">
                <p className="text-[10px] font-extrabold tracking-widest uppercase text-slate-400">Professional Details</p>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                      <Building size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Department</p>
                      <p className="text-[13px] font-bold text-slate-700">{employee.Department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Designation</p>
                      <p className="text-[13px] font-bold text-slate-700">{employee.designation}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Joined On</p>
                      <p className="text-[13px] font-bold text-slate-700">{employee.dateOfJoining}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <p className="text-[10px] font-extrabold tracking-widest uppercase text-slate-400">Contact Information</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className={`w-10 h-10 rounded-xl ${theme.soft} ${theme.text} flex items-center justify-center`}>
                      <Mail size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Email Address</p>
                      <p className="text-[13px] font-bold text-slate-700 truncate">{employee.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className={`w-10 h-10 rounded-xl ${theme.soft} ${theme.text} flex items-center justify-center`}>
                      <Phone size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Phone Number</p>
                      <p className="text-[13px] font-bold text-slate-700">{employee.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions / Summary */}
              <div className={`p-6 ${theme.soft} rounded-2xl border ${theme.border} space-y-4`}>
                 <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${theme.bg} text-white flex items-center justify-center`}>
                       <User size={16} />
                    </div>
                    <p className={`text-[12px] font-extrabold uppercase tracking-tight ${theme.text}`}>Employee Overview</p>
                 </div>
                 <p className="text-[12px] font-medium text-slate-500 leading-relaxed">
                   Currently working as <span className="font-bold text-slate-700">{employee.designation}</span> in the <span className="font-bold text-slate-700">{employee.Department}</span> department.
                 </p>
                 <button 
                  onClick={() => navigate(`/EmployeeManagement/employee/${employee.Emp_id}`)}
                  className={`w-full py-3 rounded-xl bg-white ${theme.text} border ${theme.border} text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/50 transition-all shadow-sm active:scale-95`}
                 >
                    View Full Profile <ChevronRight size={14} />
                 </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 px-7 border-t border-slate-100 bg-slate-50 flex flex-col gap-3">
              <button
                onClick={onClose}
                className={`w-full h-12 rounded-xl bg-white ${theme.text} border ${theme.border} text-[11px] font-bold uppercase tracking-widest transition-all hover:bg-slate-100 active:scale-95 shadow-sm`}
              >
                Close Details
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

