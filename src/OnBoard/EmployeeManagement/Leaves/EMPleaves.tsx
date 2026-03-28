import { useState, useEffect } from "react";
import { EmpLeaveTable } from "../../Components/table/EmpLeaveTable";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import StatCard from "../../../Components/Common/StatCard";
import { Building, UserCheck, UserMinus, Users } from "lucide-react";
import type { Empleaves } from "../../../Types/typesEmployeeManagement";

export const EMPleaves = () => {
  const [data, setData] = useState<Empleaves[]>([]);
  const navigate = useNavigate();

  const fetchEmpleave = async () => {
    try {
      const response = await fetch("http://localhost:3001/Total_leaves");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  useEffect(() => {
    fetchEmpleave();
  }, []);

  const columns = [
    { header: "ID", accessor: "empid" },
    {
      header: "Employee",
      accessor: "name",
      render: (row: Empleaves) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
            {row.name.charAt(0)}
          </div>
          <span className="font-medium text-slate-700">{row.name}</span>
        </div>
      ),
    },
    { header: "Total", accessor: "total_leave" },
    {
      header: "Used",
      accessor: "used_leave",
      render: (row: Empleaves) => (
        <span className="text-rose-600 font-semibold">{row.used_leave}</span>
      ),
    },
    {
      header: "Available",
      accessor: "available_leaves",
      render: (row: Empleaves) => (
        <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
          {row.available_leaves} Days
        </span>
      ),
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-slate-50 min-h-screen"
    >
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Leave Management
          </h2>
          <p className="text-slate-500 mt-1">
            Track and manage employee leave balances and history.
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm font-medium">
          Export Report
        </button>
      </header>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Employees"
          value={data.length}
          icon={Users}
          iconBg="#f8fafc"
          iconColor="#0ea5e9"
          valueSize="2xl"
        />
        <StatCard
          label="Active"
          value={data.length}
          icon={UserCheck}
          iconBg="#f0fdf4"
          iconColor="#22c55e"
          valueSize="2xl"
        />
        <StatCard
          label="Inactive"
          value="0"
          icon={UserMinus}
          iconBg="#fff1f2"
          iconColor="#f43f5e"
          valueSize="2xl"
        />
        <StatCard
          label="Departments"
          value="5"
          icon={Building}
          iconBg="#eff6ff"
          iconColor="#1e40af"
          valueSize="2xl"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <EmpLeaveTable
          columns={columns}
          data={data}
          onRowClick={(row) =>
            navigate(`/EmployeeManagement/employee-leave/${row.empid}`, {
              state: row,
            })
          }
        />
      </div>
    </motion.section>
  );
};
