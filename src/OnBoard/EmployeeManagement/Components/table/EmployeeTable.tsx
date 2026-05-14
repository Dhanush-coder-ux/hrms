import { Mail, Phone, ExternalLink } from "lucide-react";
import { UserAvatar } from "../../../../Components/Common/UserAvatar";
import type { Employee } from "../../../../Types/typesEmployeeManagement";
import { empMangeTheme } from "../../../../Themes/EmpMangeTheme/empMangeConfig";

interface EmployeeTableProps {
  employees: Employee[];
  onRowClick: (emp: Employee) => void;
}

const HEADERS = ["Personnel", "Department", "Designation", "Contact Info", "Status", ""];

export default function EmployeeTable({ employees, onRowClick }: EmployeeTableProps) {
  return (
    <div className={empMangeTheme.table.wrapper + " max-h-[520px]"}>
      <table className="w-full border-collapse relative">
        {/* ── HEADER ── */}
        <thead className={empMangeTheme.table.head}>
          <tr className={empMangeTheme.table.headRow}>
            {HEADERS.map((h, i) => (
              <th
                key={i}
                className={empMangeTheme.table.headCell}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        {/* ── BODY ── */}
        <tbody className="divide-y divide-slate-50">
          {employees.length === 0 ? (
            <tr>
              <td
                colSpan={HEADERS.length}
                className="px-8 py-20 text-center text-slate-300 text-[11px] font-bold uppercase tracking-widest"
              >
                No personnel records found.
              </td>
            </tr>
          ) : (
            employees.map((emp, idx) => {
              const deptBg = emp.departmentData?.bg_color ?? "#f1f5f9";
              const deptText = emp.departmentData?.icon_color ?? "#64748b";
              const isActive = emp.Status?.toLowerCase() === "active";

              return (
                <tr
                  key={emp.Emp_id ?? idx}
                  onClick={() => onRowClick(emp)}
                  className={empMangeTheme.table.row}
                >
                  {/* Personnel */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={emp.name || "E"} variant="table" />
                      <div>
                        <p className="m-0 text-[13px] font-bold text-slate-800 tracking-tight uppercase">
                          {emp.name}
                        </p>
                        <p className="m-0 mt-0.5 text-[10px] font-bold text-slate-400 tracking-wider">
                          #{emp.Emp_id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-tight"
                      style={{ background: deptBg, color: deptText }}
                    >
                      {emp.Department}
                    </span>
                  </td>

                  {/* Designation */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-[13px] font-semibold text-slate-600 uppercase tracking-tight">
                      {emp.designation || "—"}
                    </span>
                  </td>

                  {/* Contact */}
                  <td className="px-6 py-4">
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

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide border ${isActive
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-rose-50 text-rose-600 border-rose-100"
                        }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                      />
                      {emp.Status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); onRowClick(emp); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/20 bg-primary/5 text-primary text-[11px] font-bold cursor-pointer transition-all hover:bg-primary hover:text-white hover:border-primary active:scale-95"
                    >
                      <ExternalLink size={13} /> View
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}