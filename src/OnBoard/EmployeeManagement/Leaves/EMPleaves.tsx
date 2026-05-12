import { useState, useEffect } from "react";
import { EmpLeaveTable } from "../../Components/table/EmpLeaveTable";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import StatCard from "../../../Components/Common/StatCard";
import { UserCheck, UserMinus, Users } from "lucide-react";
import type { Empleaves } from "../../../Types/typesEmployeeManagement";
import { Api_URL } from "../../../APILINK";

const LeaveUrl = Api_URL

const LEAVE_API = `${LeaveUrl}/leave/all-balances`
export const EMPleaves = () => {
  const [data, setData] = useState<Empleaves[]>([]);
  const navigate = useNavigate();

const fetchEmpleave = async () => {
  try {
    const response = await fetch(LEAVE_API);
    const result = await response.json();
    // Normalize field names to match detail page expectations
    const normalized = result.map((emp: any) => ({
      ...emp,
      total_leave: emp.Total_Leave,
      available_leaves: emp.Available,
      empid: emp.Emp_id,
    }));
    setData(normalized);
  } catch (error) {
    console.error("Error fetching leaves:", error);
  }
};
  useEffect(() => {
    fetchEmpleave();
  }, []);

const columns = [
  { header: "ID", accessor: "Emp_id" },
  { header: "Employee Name", accessor: "employee_name" },
  { header: "Total", accessor: "Total_Leave" },
  { header: "Used", accessor: "Used" },
  { header: "Available", accessor: "Available" },
];

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full overflow-y-auto custom-scrollbar p-6"
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
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
    </motion.section>
  );
};
