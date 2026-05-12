import { useNavigate } from "react-router-dom";
import type { Employee } from "../../../Types/typesEmployeeManagement";
import { ExternalLink, Mail, Phone } from "lucide-react";
import { UserAvatar } from "../../../Components/Common/UserAvatar";

export default function EmployeeRow({
  employee,
  onRowClick,
}: {
  employee: Employee;
  onRowClick: (emp: Employee) => void;
}) {
  const navigate = useNavigate();

  const deptBg = employee.departmentData?.bg_color || "#f1f5f9";
  const deptText = employee.departmentData?.icon_color || "#64748b";
  const isActive = employee.Status?.toLowerCase() === "active";

  return (
    <tr
      onClick={() => onRowClick(employee)}
      className="group border-b border-slate-50 cursor-pointer transition-colors hover:bg-indigo-50/30"
    >
      {/* Personnel */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <UserAvatar name={employee.name || "E"} variant="table" />
          <div>
            <p className="text-[13px] font-bold text-slate-800 tracking-tight m-0 uppercase">
              {employee.name}
            </p>
            <p className="text-[10px] font-bold text-slate-400 tracking-wider m-0 mt-0.5">
              #{employee.Emp_id}
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
          {employee.Department}
        </span>
      </td>

      {/* Designation */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-[13px] font-semibold text-slate-600 uppercase tracking-tight">
          {employee.designation || "—"}
        </span>
      </td>

      {/* Contact Info */}
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-slate-400">
             <Mail size={12} />
             <span className="text-[12px] font-medium text-slate-600">{employee.email}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
             <Phone size={12} />
             <span className="text-[12px] font-medium text-slate-600">{employee.phone}</span>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide border ${isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          {employee.Status}
        </span>
      </td>

      {/* Action */}
      <td className="px-6 py-4 text-right">
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/EmployeeManagement/employee/${employee.Emp_id}`); }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600 text-[11px] font-bold cursor-pointer transition-all hover:bg-indigo-600 hover:text-white hover:border-indigo-600 active:scale-95"
        >
          <ExternalLink size={13} /> View
        </button>
      </td>
    </tr>
  );
}