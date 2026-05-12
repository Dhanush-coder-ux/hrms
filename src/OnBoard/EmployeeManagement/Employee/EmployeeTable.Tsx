import { useNavigate } from "react-router-dom";
import { ExternalLink, Mail, Phone } from "lucide-react";
import { UserAvatar } from "../../../Components/Common/UserAvatar";
import type { Employee } from "../../../Types/typesEmployeeManagement";

// 1. Define a Generic Column Type
interface TableColumn<T> {
  header: string;
  className?: string;
  render: (data: T) => React.ReactNode;
}

interface EmployeeTableProps {
  employees: Employee[];
  onRowClick: (emp: Employee) => void;
}

export default function EmployeeTable({ employees, onRowClick }: EmployeeTableProps) {
  const navigate = useNavigate();

  // 2. Define your columns logic here
  const COLUMNS: TableColumn<Employee>[] = [
    {
      header: "Personnel",
      className: "w-[25%]",
      render: (emp) => (
        <div className="flex items-center gap-3">
          <UserAvatar name={emp.name || "E"} variant="table" />
          <div>
            <p className="text-[13px] font-bold text-slate-800 uppercase m-0">{emp.name}</p>
            <p className="text-[10px] font-bold text-slate-400 m-0 mt-0.5">#{emp.Emp_id}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Department",
      className: "w-[15%]",
      render: (emp) => (
        <span
          className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase"
          style={{ 
            background: emp.departmentData?.bg_color || "#f1f5f9", 
            color: emp.departmentData?.icon_color || "#64748b" 
          }}
        >
          {emp.Department}
        </span>
      ),
    },
    {
      header: "Designation",
      className: "w-[17%]",
      render: (emp) => (
        <span className="text-[13px] font-semibold text-slate-600 uppercase">
          {emp.designation || "—"}
        </span>
      ),
    },
    {
      header: "Contact Info",
      className: "w-[28%]",
      render: (emp) => (
        <div className="flex flex-col gap-1 text-slate-400">
          <div className="flex items-center gap-1.5">
            <Mail size={12} />
            <span className="text-[12px] font-medium text-slate-600">{emp.email}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone size={12} />
            <span className="text-[12px] font-medium text-slate-600">{emp.phone}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      className: "w-[10%]",
      render: (emp) => {
        const isActive = emp.Status?.toLowerCase() === "active";
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
            isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
            {emp.Status}
          </span>
        );
      },
    },
    {
      header: "",
      className: "w-[5%] text-right",
      render: (emp) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/EmployeeManagement/employee/${emp.Emp_id}`);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600 text-[11px] font-bold hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
        >
          <ExternalLink size={13} /> View
        </button>
      ),
    },
  ];

  return (
    <div className="w-full overflow-x-auto custom-scrollbar">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            {COLUMNS.map((col) => (
              <th key={col.header} className={`${col.className} px-6 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {employees.length === 0 ? (
            <tr>
              <td colSpan={COLUMNS.length} className="px-8 py-20 text-center text-slate-300 text-[11px] font-bold uppercase tracking-widest">
                No personnel records found.
              </td>
            </tr>
          ) : (
            employees.map((emp) => (
              <tr
                key={emp.Emp_id}
                onClick={() => onRowClick(emp)}
                className="group cursor-pointer transition-colors hover:bg-indigo-50/30"
              >
                {COLUMNS.map((col, idx) => (
                  <td key={idx} className="px-6 py-4">
                    {col.render(emp)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}