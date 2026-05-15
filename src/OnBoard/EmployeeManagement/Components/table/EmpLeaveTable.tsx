import { ExternalLink } from "lucide-react";
import { empMangeTheme } from "../../../../Themes/EmpMangeTheme/empMangeConfig";

export type Column =
  | { header: string; accessor: string; type?: "text" | "badge" | "date" }
  | { header: string; type: "action" };

type TableProps = {
  columns: Column[];
  data: Record<string, any>[];
  onRowClick?: (row: any) => void;
};

import { UserAvatar } from "../../../../Components/Common/UserAvatar";

export const EmpLeaveTable = ({ columns, data, onRowClick }: TableProps) => {
  return (
    <div className={empMangeTheme.table.wrapper}>
      <table className="w-full border-collapse">
        <thead className={empMangeTheme.table.head}>
          <tr className={empMangeTheme.table.headRow}>
            {columns.map((col, i) => (
              <th
                key={i}
                className={`${empMangeTheme.table.headCell} ${
                  col.type === "action" ? "!text-right" : ""
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((row, ri) => (
              <tr
                key={row.Emp_id || ri}
                onClick={() => onRowClick?.(row)}
                className={empMangeTheme.table.row}
              >
                {columns.map((col, ci) => {
                  if (col.type === "action") {
                    return (
                      <td key={ci} className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); onRowClick?.(row); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/20 bg-primary/5 text-primary text-[11px] font-bold cursor-pointer transition-all hover:bg-primary hover:text-white hover:border-primary active:scale-95"
                        >
                          <ExternalLink size={13} /> Details
                        </button>
                      </td>
                    );
                  }

                  if (!("accessor" in col)) return null;

                  const val = row[col.accessor];

                  /* Employee info with Avatar */
                  if (col.accessor === "employee_name" || col.header.toLowerCase().includes("employee")) {
                    return (
                      <td key={ci} className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar name={val || "E"} variant="table" />
                          <div>
                            <p className="text-[13px] font-bold text-slate-800 tracking-tight m-0 uppercase">
                              {val || "Unknown"}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 tracking-wider m-0 mt-0.5">
                              #{row.Emp_id || row.empid || row.id || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                    );
                  }

                  /* Available leaves badge */
                  if (col.accessor === "Available" || col.accessor === "available_leaves") {
                    return (
                      <td key={ci} className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                          {val || 0} Days
                        </span>
                      </td>
                    );
                  }

                  /* Default cell */
                  return (
                    <td key={ci} className="px-6 py-4">
                      <span className="text-[13px] font-semibold text-slate-600">
                        {val || "0"}
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
                No leave records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};