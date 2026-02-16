import { MoreVertical } from "lucide-react";

type Column = {
  header: string;
  accessor: string;
};

type TableProps = {
  columns: Column[];
  data: Record<string, any>[];
};

const getStatusColor = (status: string) => {
  const s = status?.toLowerCase();
  switch (s) {
    case "active":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "inactive":
      return "bg-rose-50 text-rose-700 border-rose-100";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
};

export const Table = ({ columns, data }: TableProps) => {
  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-gray-50/50">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-6 py-3 border-b border-gray-200 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500"
                >
                  {col.header}
                </th>
              ))}
              {/* Extra header for the menu icon */}
              <th className="px-6 py-3 border-b border-gray-200"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className="group hover:bg-blue-50/30 transition-colors duration-150"
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-3.5 whitespace-nowrap">
                    {col.accessor === "status" ? (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-tight border ${getStatusColor(
                          row[col.accessor]
                        )}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70"></span>
                        {row[col.accessor]}
                      </span>
                    ) : (
                      <span className={`text-sm ${colIndex === 0 ? "font-semibold text-gray-900" : "text-gray-600"}`}>
                        {row[col.accessor] || "—"}
                      </span>
                    )}
                  </td>
                ))}
                
                {/* Modern "Action" cell that stays clean */}
                <td className="px-6 py-3.5 text-right">
                  <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-all opacity-0 group-hover:opacity-100">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};