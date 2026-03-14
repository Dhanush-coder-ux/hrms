import { ChevronRight} from "lucide-react";

type Column =
  | { header: string; accessor: string; type?: "text" | "badge" | "date" }
  | { header: string; type: "action" };

type TableProps = {
  columns: Column[];
  data: Record<string, any>[];
  onRowClick?: (row: any) => void;
};

export const EmpLeaveTable = ({ columns, data, onRowClick }: TableProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full border-separate border-spacing-0">
        {/* Google-Style Header */}
        <thead className="bg-gray-50/80">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-gray-100">
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                onClick={() => onRowClick?.(row)}
                className="group cursor-pointer hover:bg-blue-50/40 transition-all duration-150"
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    {"accessor" in col ? (
                      <div className="flex items-center">
                        {/* Special styling for specific accessors */}
                        {col.accessor === "status" ? (
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border 
                            ${row[col.accessor] === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                              row[col.accessor] === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                              'bg-rose-50 text-rose-700 border-rose-100'}`}>
                            {row[col.accessor]}
                          </span>
                        ) : col.accessor === "employee_name" ? (
                          <span className="text-sm font-semibold text-gray-800 uppercase tracking-tight">
                            {row[col.accessor]}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-600">
                            {row[col.accessor] || "—"}
                          </span>
                        )}
                      </div>
                    ) : (
                      /* Action Column */
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all">
                            <ChevronRight size={18} />
                         </button>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-10 text-center text-gray-400 text-sm italic">
                No leave requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};