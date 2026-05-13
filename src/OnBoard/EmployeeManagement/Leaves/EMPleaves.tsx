import { useState, useEffect } from "react";
import { EmpLeaveTable, type Column } from "../../Components/table/EmpLeaveTable";
import { useNavigate } from "react-router-dom";
import StatCard from "../../../Components/Common/StatCard";
import { UserCheck, UserMinus, Users, TrendingUp, Download } from "lucide-react";
import type { Empleaves } from "../../../Types/typesEmployeeManagement";
import { Api_URL } from "../../../APILINK";

const LeaveUrl = Api_URL;
const LEAVE_API = `${LeaveUrl}/leave/all-balances`;

export const EMPleaves = () => {
  const [data, setData] = useState<Empleaves[]>([]);
  const navigate = useNavigate();

  const fetchEmpleave = async () => {
    try {
      const response = await fetch(LEAVE_API);
      const result = await response.json();
      const normalized = result.map((emp: any) => ({
        ...emp,
        employee_name: emp.employee_name || emp.name || "Unknown",
        Emp_id: emp.Emp_id || emp.empid || emp.id,
        total_leave: emp.Total_Leave,
        available_leaves: emp.Available,
        empid: emp.Emp_id || emp.empid || emp.id,
      }));
      setData(normalized);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  useEffect(() => {
    fetchEmpleave();
  }, []);

  const columns: Column[] = [
    { header: "Employee", accessor: "employee_name" },
    { header: "Total Quota", accessor: "Total_Leave" },
    { header: "Used", accessor: "Used" },
    { header: "Available", accessor: "Available" },
    { header: "", type: "action" },
  ];

  return (
    <div className="h-full bg-slate-50/50 p-10 font-sans custom-scrollbar">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-6 mb-8 flex-wrap">
        <div className="flex flex-col">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full mb-2.5 w-fit">
            <TrendingUp size={12} />
            <span>Leave Hub</span>
          </div>
          <h1 className="text-[2rem] font-extrabold text-slate-900 tracking-tight mb-1.5 leading-none">Leave Management</h1>
          <p className="text-sm text-slate-400 font-medium">
            Track and manage employee leave balances across the organization
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button className="inline-flex items-center gap-2 h-[42px] px-[18px] bg-indigo-600 text-white border-none rounded-xl text-sm font-bold tracking-tight cursor-pointer transition-all hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-100">
            <Download size={15} /> Export Report
          </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total Employees"
          value={data.length}
          icon={Users}
          iconBgClass="bg-blue-50"
          iconColorClass="text-blue-500"
          valueColorClass="text-blue-600"
          subText="Across all depts"
        />
        <StatCard
          label="On Leave Today"
          value="0"
          icon={UserMinus}
          iconBgClass="bg-rose-50"
          iconColorClass="text-rose-500"
          valueColorClass="text-rose-600"
          subText="Awaiting return"
        />
        <StatCard
          label="Pending Requests"
          value="0"
          icon={UserCheck}
          iconBgClass="bg-amber-50"
          iconColorClass="text-amber-500"
          valueColorClass="text-amber-600"
          subText="Needs approval"
        />
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-[20px] border-[1.5px] border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between p-[18px_24px] border-b border-slate-50">
          <div className="flex items-center gap-2 font-extrabold text-[12px] tracking-wider uppercase text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            Leave Balances
          </div>
          <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
            {data.length} result{data.length !== 1 ? "s" : ""}
          </span>
        </div>

        <EmpLeaveTable
          columns={columns}
          data={data}
          onRowClick={(row) =>
            navigate(`/EmployeeManagement/employee-leave/${row.Emp_id}`, {
              state: row,
            })
          }
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

