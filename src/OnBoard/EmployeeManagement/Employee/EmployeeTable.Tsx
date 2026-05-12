import EmployeeRow from "./EmployeeRow";
import type { Employee } from "../../../Types/typesEmployeeManagement";

const HEADERS = [
  { label: "Personnel", width: "w-[25%]" },
  { label: "Department", width: "w-[15%]" },
  { label: "Designation", width: "w-[17%]" },
  { label: "Contact Info", width: "w-[28%]" },
  { label: "Status", width: "w-[10%]" },
  { label: "", width: "w-[5%]" },
];

export default function EmployeeTable({
  employees,
  onRowClick,
}: {
  employees: Employee[];
  onRowClick: (emp: Employee) => void;
}) {
  return (
    <div className="w-full overflow-x-auto custom-scrollbar">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            {HEADERS.map((h) => (
              <th
                key={h.label}
                className={`${h.width} px-6 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap`}
              >
                {h.label}
              </th>
            ))}
          </tr>
        </thead>

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
            employees.map((emp) => (
              <EmployeeRow key={emp.Emp_id} employee={emp} onRowClick={onRowClick} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

