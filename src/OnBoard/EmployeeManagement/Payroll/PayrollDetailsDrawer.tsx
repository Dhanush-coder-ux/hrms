import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, TrendingUp, TrendingDown, Download, CheckCircle2, ChevronRight, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Api_URL } from "../../../APILINK";
import { ExportCSVButton } from "../../../Components/Common/ExportButton";
import { getUserTheme, UserAvatar } from "../../../Components/Common/UserAvatar";

interface PayrollDetailsDrawerProps {
  empId: string | null;
  employeeName: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PayrollDetailsDrawer = ({
  empId,
  employeeName,
  isOpen,
  onClose
}: PayrollDetailsDrawerProps) => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [view, setView] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(true);

  // Derive theme from prop name first for instant color application
  const displayName = employeeName || data?.employee_name || "E";
  const theme = getUserTheme(displayName);

  useEffect(() => {
    if (!empId || !isOpen) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${Api_URL}/payroll/details/${empId}`);
        if (!res.ok) {
          setData(null);
          return;
        }
        const result = await res.json();
        const formatted = {
          employee: result.emp_id || empId,
          employee_name: result.employee_name || result.emp_id || "Employee",
          provider: result.provider_name || "N/A",
          salary_type: result.salary_type || "yearly",
          monthly: result.monthly || {},
          yearly: result.yearly || {},
        };
        setData(formatted);
      } catch (err) {
        console.error(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [empId, isOpen]);

  if (!isOpen) return null;

  const current = data?.[view];

  const exportColumns = [
    { header: "Employee", accessor: "employee" },
    { header: "Provider", accessor: "provider" },
    { header: "View", accessor: "view" },
    { header: "Net Salary", accessor: "net_salary" },
  ] as any;

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
          className="relative w-full max-w-[440px] h-[calc(100vh-32px)] bg-white rounded-[24px] flex flex-col overflow-hidden shadow-2xl font-sans"
        >
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-slate-50/50">
              <div className="w-10 h-10 border-[3px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Compiling Payslip...</p>
            </div>
          ) : !data ? (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-slate-50/50">
               <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-4">
                  <X size={32} />
               </div>
               <h3 className="text-lg font-bold text-slate-800">No Record Found</h3>
               <p className="text-sm text-slate-500 mt-2">We couldn't retrieve the payroll breakdown for this employee.</p>
               <button onClick={onClose} className="mt-6 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest">Go Back</button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className={`p-7 pb-6 border-b border-slate-100 ${theme.bg} text-white relative shadow-lg`}>
                <button 
                  onClick={onClose} 
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer text-white/80 transition-all hover:bg-white/20"
                >
                  <X size={15} />
                </button>

                <div className="flex items-start gap-4">
                <UserAvatar name={displayName} variant="solid" size="xl" className="border-white/10" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Financial Statement</p>
                    <h2 className="text-lg font-extrabold uppercase tracking-tight m-0 truncate text-white">{data.employee_name}</h2>
                    <p className="text-[10px] font-bold text-white uppercase tracking-widest mt-1">ID: {data.employee} • {data.provider}</p>
                  </div>
                </div>

                {/* View Switcher */}
                <div className="flex mt-6 bg-white/10 p-1 rounded-xl border border-white/10">
                   {(["monthly", "yearly"] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setView(mode)}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                          view === mode ? "bg-white text-slate-900 shadow-md scale-[1.02]" : "text-white/60 hover:text-white"
                        }`}
                      >
                        {mode}
                      </button>
                   ))}
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-7 pt-6 space-y-8 custom-scrollbar bg-slate-50/30">
                {/* Net Pay Card */}
                <div className={`p-6 rounded-[2rem] ${theme.bg} text-white shadow-xl shadow-indigo-100 relative overflow-hidden`}>
                   <div className="relative z-10">
                      <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-1">Net Payable Amount</p>
                      <h3 className="text-3xl font-black tracking-tight">₹{current?.net_salary?.toLocaleString()}</h3>
                      <div className="mt-4 flex items-center gap-2">
                         <div className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-[9px] font-bold uppercase tracking-widest">
                            {view} Cycle
                         </div>
                         <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-300">
                            <CheckCircle2 size={10} /> Verified
                         </div>
                      </div>
                   </div>
                   <CreditCard size={100} className="absolute -right-6 -bottom-6 text-white/5 rotate-12" />
                </div>

                {/* Earnings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black tracking-widest uppercase text-slate-400">Earnings Breakdown</p>
                    <div className="flex items-center gap-1 text-emerald-600 font-black text-[10px] uppercase">
                       <TrendingUp size={12} /> Positive
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Base Salary</span>
                      <span className="text-[13px] font-black text-slate-800">₹{current?.base_salary?.toLocaleString()}</span>
                    </div>
                    {current?.earnings?.map((e: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-white border border-slate-100 shadow-sm group hover:border-emerald-200 transition-colors">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight group-hover:text-slate-800">{e.name}</span>
                        <span className="text-[13px] font-black text-emerald-600">+₹{e.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deductions */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black tracking-widest uppercase text-slate-400">Total Deductions</p>
                    <div className="flex items-center gap-1 text-rose-500 font-black text-[10px] uppercase">
                       <TrendingDown size={12} /> Negative
                    </div>
                  </div>
                  <div className="space-y-3">
                    {current?.deductions?.length > 0 ? (
                      current.deductions.map((d: any, i: number) => (
                        <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-rose-200 transition-colors">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight group-hover:text-slate-600">{d.name}</span>
                          <span className="text-[13px] font-black text-rose-500">-₹{d.value.toLocaleString()}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 border-2 border-dashed border-slate-100 rounded-2xl text-center">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">No Deductions Applied</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary */}
                <div className="p-6 rounded-[2rem] bg-slate-900 text-white shadow-xl">
                   <div className="flex justify-between items-center mb-6">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Final Summary</p>
                      <User size={14} className="text-slate-500" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Gross Salary</p>
                         <p className="text-lg font-black tracking-tight">₹{current?.gross_salary?.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Tax/Deductions</p>
                         <p className="text-lg font-black tracking-tight text-rose-400">
                           -₹{(current?.gross_salary - current?.net_salary)?.toLocaleString()}
                         </p>
                      </div>
                   </div>
                   <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                      <button 
                        onClick={() => navigate(`/EmployeeManagement/payrollDetails/${data.employee}`)}
                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${theme.text} hover:opacity-80 transition-all active:scale-95`}
                      >
                         View Full Statement <ChevronRight size={14} />
                      </button>
                      <ExportCSVButton
                        data={[{
                          employee: data.employee,
                          provider: data.provider,
                          view,
                          net_salary: current?.net_salary,
                        }]}
                        columns={exportColumns}
                        className="!p-0 !bg-transparent !border-none !shadow-none !text-slate-400 hover:!text-white transition-colors"
                      >
                         <Download size={14} />
                      </ExportCSVButton>
                   </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 px-7 border-t border-slate-100 bg-white">
                <button
                  onClick={onClose}
                  className={`w-full h-12 rounded-xl bg-white ${theme.text} border ${theme.border} text-[11px] font-bold uppercase tracking-widest transition-all hover:bg-slate-50 active:scale-95 shadow-sm`}
                >
                  Close Statement
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
