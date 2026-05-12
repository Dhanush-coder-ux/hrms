import { ExternalLink } from "lucide-react";

export type Column =
  | { header: string; accessor: string; type?: "text" | "badge" | "date" }
  | { header: string; type: "action" };

type TableProps = {
  columns: Column[];
  data: Record<string, any>[];
  onRowClick?: (row: any) => void;
};

const AVATAR_COLORS = [
  ["bg-purple-100", "text-purple-700"],
  ["bg-blue-100", "text-blue-700"],
  ["bg-emerald-100", "text-emerald-700"],
  ["bg-amber-100", "text-amber-700"],
  ["bg-rose-100", "text-rose-700"],
  ["bg-sky-100", "text-sky-700"],
];

const getAvatarColor = (name: string) => {
  const idx = (name?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

export const EmpLeaveTable = ({ columns, data, onRowClick }: TableProps) => {
  return (
    <div className="w-full overflow-x-auto custom-scrollbar">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            {columns.map((col, i) => (
              <th
                key={i}
                className={`px-6 py-4 text-[11px] font-bold tracking-widest uppercase text-slate-400 whitespace-nowrap ${
                  col.type === "action" ? "text-right" : "text-left"
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
                className="group border-b border-slate-50 cursor-pointer transition-colors hover:bg-indigo-50/30"
              >
                {columns.map((col, ci) => {
                  if (col.type === "action") {
                    return (
                      <td key={ci} className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); onRowClick?.(row); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600 text-[11px] font-bold cursor-pointer transition-all hover:bg-indigo-600 hover:text-white hover:border-indigo-600 active:scale-95"
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
                    const [bgC, fgC] = getAvatarColor(val || "E");
                    const initials = val
                      ?.split(" ")
                      .slice(0, 2)
                      .map((w: string) => w[0])
                      .join("")
                      .toUpperCase();
                    return (
                      <td key={ci} className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-extrabold flex-shrink-0 tracking-tighter ${bgC} ${fgC}`}>
                            {initials || "E"}
                          </div>
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