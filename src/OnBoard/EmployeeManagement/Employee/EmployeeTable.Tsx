import EmployeeRow from "./EmployeeRow";

interface Employee {
  Emp_id: string;
  name: string;
  email: string;
  phone: string;
  Department: string;
  designation: string;
  Status: "Active" | "Inactive";
  dateOfJoining: string;
}

const HEADERS = [
  { label: "Name", width: "w-[22%]" },
  { label: "Department", width: "w-[15%]" },
  { label: "designation", width: "w-[17%]" },
  { label: "Email", width: "w-[22%]" },
  { label: "Phone", width: "w-[14%]" },
  { label: "Status", width: "w-[10%]" },
];

export default function EmployeeTable({
  employees,
}: {
  employees: Employee[];
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {HEADERS.map((h) => (
                <th
                  key={h.label}
                  className={`${h.width} px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider`}
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
                  colSpan={6}
                  className="py-16 text-center text-sm text-gray-400"
                >
                  No employees found.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <EmployeeRow key={emp.Emp_id} employee={emp} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
