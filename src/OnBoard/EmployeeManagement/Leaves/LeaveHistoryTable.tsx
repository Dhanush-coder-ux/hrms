import { Calendar, Info, History, CalendarCheck } from "lucide-react";
import type { Empleaves } from "../../../Types/typesEmployeeManagement";
import { empMangeTheme } from "../../../Themes/EmpMangeTheme/empMangeConfig";

interface HistoryTableProps {
  history: Empleaves["leave_history"];
}

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  approved: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500", border: "border-emerald-100" },
  pending:  { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500", border: "border-amber-100" },
  rejected: { bg: "bg-rose-50", text: "text-rose-600", dot: "bg-rose-500", border: "border-rose-100" },
  cancelled:{ bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400", border: "border-slate-200" },
  default:  { bg: "bg-slate-50", text: "text-slate-500", dot: "bg-slate-400", border: "border-slate-100" },
};

const getStatusStyle = (val: string) =>
  STATUS_STYLES[val?.toLowerCase()] ?? STATUS_STYLES.default;

export const LeaveHistoryTable = ({ history }: HistoryTableProps) => {
  return (
    <div className={empMangeTheme.section.card}>
      {/* Table Header Section */}
      <div className={empMangeTheme.section.header}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
             <History size={18} />
          </div>
          <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">Leave History</h3>
        </div>
        <span className={empMangeTheme.section.countBadge}>
          {history?.length || 0} Records
        </span>
      </div>

      <div className={empMangeTheme.table.wrapper + " max-h-[480px]"}>
        <table className="w-full text-left border-collapse relative">
          <thead className={empMangeTheme.table.head}>
            <tr className={empMangeTheme.table.headRow}>
              <th className={empMangeTheme.table.headCell + " px-8"}>Applied On</th>
              <th className={empMangeTheme.table.headCell + " px-8"}>Duration</th>
              <th className={empMangeTheme.table.headCell + " px-8 text-center"}>Days</th>
              <th className={empMangeTheme.table.headCell + " px-8"}>Status</th>
              <th className={empMangeTheme.table.headCell + " px-8"}>Reason</th>
              <th className={empMangeTheme.table.headCell + " px-8"}>Leave Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {history && history.length > 0 ? (
              history.map((leave, index) => (
                <LeaveHistoryRow 
                  key={index} 
                  leave={leave} 
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center">
                   <div className="flex flex-col items-center gap-2 opacity-30">
                      <History size={40} />
                      <p className="text-[11px] font-bold uppercase tracking-widest">No history records</p>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const LeaveHistoryRow = ({ leave }: { leave: any }) => {
  const s = getStatusStyle(leave.status);
  
  return (
    <tr className={empMangeTheme.table.row}>
      <td className="px-8 py-5">
        <p className="text-[13px] font-bold text-slate-600 tracking-tight">{leave.applayDate}</p>
      </td>
      
      <td className="px-8 py-5">
        <div className="flex items-center gap-2.5 text-[13px]">
          <div className="w-7 h-7 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center shrink-0">
            <Calendar size={14} />
          </div>
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <span>{leave.from_date}</span>
            <span className="text-slate-300 font-normal">→</span>
            <span>{leave.to_date}</span>
          </div>
        </div>
      </td>

      <td className="px-8 py-5 text-center">
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-slate-100 text-slate-600 border border-slate-200">
          {leave.Days}d
        </span>
      </td>

      <td className="px-8 py-5">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide border ${s.bg} ${s.text} ${s.border}`}>
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
          {leave.status}
        </span>
      </td>

      <td className="px-8 py-5">
        <div className="flex items-start gap-2.5">
          <Info size={14} className="text-slate-300 mt-0.5 shrink-0" />
          <p className="text-[12px] font-medium text-slate-500 leading-relaxed max-w-[250px]">
            {leave.Reason || "No reason provided"}
          </p>
        </div>
      </td>
      
      <td className="px-8 py-5">
        <div className="flex items-start gap-2.5">
          <CalendarCheck size={14} className="text-slate-300 mt-0.5 shrink-0" />
          <p className="text-[12px] font-medium text-slate-500 leading-relaxed max-w-[250px]">
            {leave.leave_type || "No reason provided"}
          </p>
        </div>
      </td>
    </tr>
  );
};
