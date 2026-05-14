import { ChevronRight } from "lucide-react";
import { empMangeTheme } from "../../../Themes/EmpMangeTheme/empMangeConfig";

export type Column =
  | {
      header: string;
      accessor: string;
      type?: "text" | "badge" | "date";
    }
  | {
      header: string;
      type: "action";
    };

type TableProps = {
  columns: Column[];
  data: Record<string, any>[];
  onRowClick?: (row: any) => void;
};

export const EmpLeaveTable = ({
  columns,
  data,
  onRowClick,
}: TableProps) => {
  return (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
      <table className="w-full border-separate border-spacing-0">
        {/* Header */}
        <thead className={empMangeTheme.table.head}>
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-100"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-slate-50">
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                onClick={() => onRowClick?.(row)}
                className={empMangeTheme.table.row}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    {"accessor" in col ? (
                      <div className="flex items-center">
                        {/* Status Badge */}
                        {col.accessor === "status" ? (
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                              ${
                                row[col.accessor] === "Approved"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                  : row[col.accessor] === "Pending"
                                  ? "bg-amber-50 text-amber-700 border-amber-100"
                                  : "bg-rose-50 text-rose-700 border-rose-100"
                              }`}
                          >
                            {row[col.accessor]}
                          </span>
                        ) : col.accessor === "employee_name" ? (
                          <span className="text-sm font-bold text-slate-800 tracking-tight">
                            {row[col.accessor]}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-600 font-medium">
                            {row[col.accessor] || "—"}
                          </span>
                        )}
                      </div>
                    ) : (
                      /* Action Column */
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-primary hover:bg-primary/5 rounded-xl transition-all">
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
              <td
                colSpan={columns.length}
                className="px-6 py-10 text-center text-slate-400 text-sm italic"
              >
                No leave requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
