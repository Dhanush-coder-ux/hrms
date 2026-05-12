import { Mail, Phone } from "lucide-react";
import { UserAvatar } from "../../../Components/Common/UserAvatar";
import type { Employee } from "../../../Types/typesEmployeeManagement";

interface EmployeeTableProps {
  employees: Employee[];
  onRowClick: (emp: Employee) => void;
}

const HEADERS = ["Personnel", "Department", "Designation", "Contact Info", "Status"];

export default function EmployeeTable({ employees, onRowClick }: EmployeeTableProps) {
  return (
    <div className="w-full overflow-x-auto custom-scrollbar">
      <table className="w-full border-collapse">
        {/* ── HEADER ── */}
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            {HEADERS.map((h) => (
              <th
                key={h}
                className="px-6 py-4 text-left text-[11px] font-bold tracking-widest uppercase text-slate-400 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        {/* ── BODY ── */}
        <tbody>
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
              const deptBg   = emp.departmentData?.bg_color   ?? "#f1f5f9";
              const deptText = emp.departmentData?.icon_color ?? "#64748b";
              const isActive = emp.Status?.toLowerCase() === "active";

              return (
                <tr
                  key={emp.Emp_id ?? idx}
                  onClick={() => onRowClick(emp)}
                  className="border-b border-slate-50 cursor-pointer transition-colors hover:bg-indigo-50/30"
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
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}