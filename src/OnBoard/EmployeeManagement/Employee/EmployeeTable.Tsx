import React from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, Mail, Phone } from "lucide-react";
import { UserAvatar } from "../../../Components/Common/UserAvatar";
import type { Employee } from "../../../Types/typesEmployeeManagement";

export type Column =
  | { header: string; accessor: keyof Employee | "contact" | "actions"; type?: string }
  | { header: string; type: "action" };

interface EmployeeTableProps {
  employees: Employee[];
  onRowClick: (emp: Employee) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees, onRowClick }) => {
  const navigate = useNavigate();

  const columns: Column[] = [
    { header: "Personnel", accessor: "name" },
    { header: "Department", accessor: "Department" },
    { header: "Designation", accessor: "designation" },
    { header: "Contact Info", accessor: "contact" },
    { header: "Status", accessor: "Status" },
    { header: "Action", type: "action" },
  ];

  return (
    <div className="w-full overflow-x-auto custom-scrollbar">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            {columns.map((col, i) => (
              <th
                key={i}
                className={`px-6 py-4 text-[11px] font-bold tracking-widest uppercase text-slate-400 whitespace-nowrap ${
                  col.type === "action" ? "text-right" : "text-left"
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {employees.length > 0 ? (
            employees.map((emp, ri) => (
              <tr
                key={emp.Emp_id || ri}
                onClick={() => onRowClick(emp)}
                className="group border-b border-slate-50 cursor-pointer transition-colors hover:bg-indigo-50/30"
              >
                {columns.map((col, ci) => {
                  /* Action Column */
                  if (col.type === "action") {
                    return (
                      <td key={ci} className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/EmployeeManagement/employee/${emp.Emp_id}`);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600 text-[11px] font-bold cursor-pointer transition-all hover:bg-indigo-600 hover:text-white hover:border-indigo-600 active:scale-95"
                        >
                          <ExternalLink size={13} /> View
                        </button>
                      </td>
                    );
                  }

                  if (!("accessor" in col)) return null;

                  /* Personnel Column */
                  if (col.accessor === "name") {
                    return (
                      <td key={ci} className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar name={emp.name || "E"} variant="table" />
                          <div>
                            <p className="text-[13px] font-bold text-slate-800 tracking-tight m-0 uppercase">
                              {emp.name}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 tracking-wider m-0 mt-0.5">
                              #{emp.Emp_id}
                            </p>
                          </div>
                        </div>
                      </td>
                    );
                  }

                  /* Department Column */
                  if (col.accessor === "Department") {
                    const deptBg = emp.departmentData?.bg_color || "#f1f5f9";
                    const deptText = emp.departmentData?.icon_color || "#64748b";
                    return (
                      <td key={ci} className="px-6 py-4">
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-tight"
                          style={{ background: deptBg, color: deptText }}
                        >
                          {emp.Department}
                        </span>
                      </td>
                    );
                  }

                  /* Contact Info Column */
                  if (col.accessor === "contact") {
                    return (
                      <td key={ci} className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Mail size={12} />
                            <span className="text-[12px] font-medium text-slate-600">{emp.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Phone size={12} />
                            <span className="text-[12px] font-medium text-slate-600">{emp.phone}</span>
                          </div>
                        </div>
                      </td>
                    );
                  }

                  /* Status Column */
                  if (col.accessor === "Status") {
                    const isActive = emp.Status?.toLowerCase() === "active";
                    return (
                      <td key={ci} className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide border ${
                            isActive
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : "bg-rose-50 text-rose-600 border-rose-100"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                              isActive ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          />
                          {emp.Status}
                        </span>
                      </td>
                    );
                  }

                  /* Default cell (Designation etc) */
                  const val = emp[col.accessor as keyof Employee];
                  return (
                    <td key={ci} className="px-6 py-4 whitespace-nowrap">
                      <span className="text-[13px] font-semibold text-slate-600 uppercase tracking-tight">
                        {typeof val === "string" ? val : "—"}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-8 py-20 text-center text-slate-300 text-[11px] font-bold uppercase tracking-widest"
              >
                No personnel records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
