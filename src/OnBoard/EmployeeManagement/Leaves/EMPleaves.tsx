import { useState, useEffect } from "react";
import { EmpLeaveTable, type Column } from "../../Components/table/EmpLeaveTable";
import { useNavigate } from "react-router-dom";
import StatCard from "../../../Components/Common/StatCard";
import { UserCheck, UserMinus, Users, TrendingUp, Download } from "lucide-react";
import type { Empleaves } from "../../../Types/typesEmployeeManagement";
import { Api_URL } from "../../../APILINK";
import { empMangeTheme } from "../../../Themes/EmpMangeTheme/empMangeConfig";

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
    <div className={empMangeTheme.layout.mainContainer}>
      {/* HEADER */}
      <div className={empMangeTheme.header.wrapper}>
        <div className="flex flex-col">
          <div className={empMangeTheme.header.pill}>
            <TrendingUp size={12} />
            <span>Leave Hub</span>
          </div>
          <h1 className={empMangeTheme.header.title}>Leave Management</h1>
          <p className={empMangeTheme.header.subtitle}>
            Track and manage employee leave balances across the organization
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button className="inline-flex items-center gap-2 h-[42px] px-[18px] bg-primary text-white border-none rounded-xl text-sm font-bold tracking-tight cursor-pointer transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-primary/20">
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
      <div className={empMangeTheme.section.card}>
        <div className={empMangeTheme.section.header}>
          <div className={empMangeTheme.section.title}>
            <span className={empMangeTheme.section.titleDot} />
            Leave Balances
          </div>
          <span className={empMangeTheme.section.countBadge}>
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

