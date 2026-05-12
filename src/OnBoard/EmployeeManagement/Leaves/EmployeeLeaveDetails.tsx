import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { Empleaves } from "../../../Types/typesEmployeeManagement";
import { Backbutton } from "../../../Components/Common/Backbutton";
import { LeaveHistoryTable } from "./LeaveHistoryTable";
import StatCard from "../../../Components/Common/StatCard";
import { User, Briefcase, CalendarCheck, Clock, TrendingUp } from "lucide-react";

export const EmployeeLeaveDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { empid } = useParams();
  const employee = location.state as Empleaves;

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center bg-slate-50/50">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
           <User size={32} />
        </div>
        <h3 className="text-xl font-extrabold text-slate-800 mb-2">No Data Found</h3>
        <p className="text-slate-500 mb-6 max-w-xs">We couldn't retrieve leave data for Employee ID: <span className="font-mono font-bold text-rose-600">{empid}</span></p>
        <button 
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-slate-50/50 p-10 font-sans custom-scrollbar">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-6 mb-10 flex-wrap">
        <div className="flex flex-col">
          <div className="mb-4">
             <Backbutton />
          </div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full mb-2.5 w-fit">
            <TrendingUp size={12} />
            <span>Employee Profile</span>
          </div>
          <h1 className="text-[2rem] font-extrabold text-slate-900 tracking-tight mb-1.5 leading-none">
            {employee.employee_name}
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            Personal leave insights for ID: <span className="text-indigo-600 font-bold">#{employee.Emp_id}</span>
          </p>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Total Quota"
          value={employee.total_leave}
          icon={Briefcase}
          iconBgClass="bg-blue-50"
          iconColorClass="text-blue-500"
          valueColorClass="text-blue-600"
          subText="Annual allowance"
        />
        <StatCard
          label="Leave Used"
          value={employee.Used}
          icon={CalendarCheck}
          iconBgClass="bg-amber-50"
          iconColorClass="text-amber-500"
          valueColorClass="text-amber-600"
          subText="Taken this year"
        />
        <StatCard
          label="Available"
          value={employee.available_leaves}
          icon={Clock}
          iconBgClass="bg-emerald-50"
          iconColorClass="text-emerald-500"
          valueColorClass="text-emerald-600"
          subText="Remaining days"
        />
        <StatCard
          label="Status"
          value="Active"
          icon={User}
          iconBgClass="bg-indigo-50"
          iconColorClass="text-indigo-500"
          valueColorClass="text-indigo-600"
          subText="Current employment"
        />
      </div>

      {/* HISTORY TABLE */}
      <div className="max-w-6xl">
        <LeaveHistoryTable 
          history={employee.leave_history} 
        />
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

