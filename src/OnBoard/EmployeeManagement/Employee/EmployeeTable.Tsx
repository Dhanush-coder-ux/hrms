import React from "react"; // Ensure React is imported
import { useNavigate } from "react-router-dom";
import { UserAvatar } from "../../../Components/Common/UserAvatar";
import type { Employee } from "../../../Types/typesEmployeeManagement";

interface TableColumn<T> {
  header: string;
  className?: string;
  render: (data: T) => React.ReactNode;
}

interface EmployeeTableProps {
  employees: Employee[];
  onRowClick: (emp: Employee) => void;
}

// Using React.FC explicitly helps some IDEs resolve prop mismatches faster
const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees, onRowClick }) => {
  const navigate = useNavigate();

  const COLUMNS: TableColumn<Employee>[] = [
    // ... keep your COLUMNS array logic exactly as it is ...
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
    // ... all other columns ...
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
};

export default EmployeeTable; // Ensure default export matches the usage