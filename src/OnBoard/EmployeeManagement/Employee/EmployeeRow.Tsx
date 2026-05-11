import { useNavigate } from "react-router-dom";
import type { Employee } from "../../../Types/typesEmployeeManagement";

function getInitials(name?: string) {
  if (!name) return "NA";

  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function EmployeeRow({
  employee,
}: {
  employee: Employee;
}) {
  const navigate = useNavigate();

  const deptBg =
    employee.departmentData?.bg_color || "#F3F4F6";

  const deptText =
    employee.departmentData?.icon_color || "#374151";

  const isActive = employee.Status === "Active";

  return (
    <tr
      onClick={() =>
        navigate(`/EmployeeManagement/employee/${employee.Emp_id}`)
      }
      className="border-b border-gray-100 hover:bg-indigo-50/40 cursor-pointer transition-colors"
    >
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
            {getInitials(employee.name)}
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {employee.name}
            </p>

            <p className="text-xs text-gray-400 mt-0.5">
              {employee.Emp_id}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-3.5">
        <span
          className="px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{
            background: deptBg,
            color: deptText,
          }}
        >
          {employee.Department}
        </span>
      </td>

      <td className="px-5 py-3.5 text-sm text-gray-600">
        {employee.designation}
      </td>

      <td className="px-5 py-3.5 text-sm text-gray-500">
        {employee.email}
      </td>

      <td className="px-5 py-3.5 text-sm text-gray-500">
        {employee.phone}
      </td>

      <td className="px-5 py-3.5">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-500"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isActive
                ? "bg-green-500"
                : "bg-red-400"
            }`}
          />

          {employee.Status}
        </span>
      </td>
    </tr>
  );
}