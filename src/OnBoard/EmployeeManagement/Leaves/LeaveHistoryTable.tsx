import { Calendar, Info } from "lucide-react";
import type { Empleaves } from "../../../Types/typesEmployeeManagement";

interface HistoryTableProps {
  history: Empleaves["leave_history"];
  getStatusStyle: (status: string) => string;
}

export const LeaveHistoryTable = ({ history, getStatusStyle }: HistoryTableProps) => {
  return (
    <div className=" rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Table Header Section */}
      <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800">Detailed History</h3>
        <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {history?.length || 0} Records
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 uppercase text-[11px] font-black tracking-widest">
              <th className="px-8 py-4">Applied On</th>
              <th className="px-8 py-4">Duration</th>
              <th className="px-8 py-4 text-center">Days</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4">Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {history && history.length > 0 ? (
              history.map((leave, index) => (
                <LeaveHistoryRow 
                  key={index} 
                  leave={leave} 
                  statusClass={getStatusStyle(leave.status)} 
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-slate-400 italic">
                  No leave history available for this record.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Sub-component for individual rows to keep things tidy
const LeaveHistoryRow = ({ leave, statusClass }: { leave: any; statusClass: string }) => {
  return (
    <tr className="hover:bg-slate-50/80 transition-colors group">
      <td className="px-8 py-5">
        <p className="text-sm font-semibold text-slate-600">{leave.applayDate}</p>
      </td>
      
      <td className="px-8 py-5">
        <div className="flex items-center gap-3 text-sm">
          <div className="p-1.5 bg-blue-50 text-blue-500 rounded-md">
            <Calendar size={14} />
          </div>
          <span className="font-bold text-slate-700">{leave.from_date}</span>
          <span className="text-slate-300">→</span>
          <span className="font-bold text-slate-700">{leave.to_date}</span>
        </div>
      </td>

      <td className="px-8 py-5 text-center">
        <span className="text-sm font-black text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
          {leave.Days}d
        </span>
      </td>

      <td className="px-8 py-5">
        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter border shadow-sm ${statusClass}`}>
          {leave.status}
        </span>
      </td>

      <td className="px-8 py-5">
        <div className="flex items-center gap-2 group/reason">
          <Info size={14} className="text-slate-300 group-hover/reason:text-blue-400 transition-colors" />
          <p className="text-sm text-slate-500 italic max-w-[200px] truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:z-10 bg-transparent transition-all">
            {leave.Reason || "N/A"}
          </p>
        </div>
      </td>
    </tr>
  );
};