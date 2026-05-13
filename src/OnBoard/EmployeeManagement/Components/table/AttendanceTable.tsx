import { Edit2 } from "lucide-react";

export type Column =
  | { header: string; accessor: string; type?: string }
  | { header: string; type: "action" };

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  present: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500", border: "border-emerald-100" },
  absent:  { bg: "bg-rose-50", text: "text-rose-600", dot: "bg-rose-500", border: "border-rose-100" },
  late:    { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500", border: "border-amber-100" },
  leave:   { bg: "bg-violet-50", text: "text-violet-600", dot: "bg-violet-500", border: "border-violet-100" },
  default: { bg: "bg-slate-50", text: "text-slate-500", dot: "bg-slate-400", border: "border-slate-100" },
};

const getStatusStyle = (val: string) =>
  STATUS_STYLES[val?.toLowerCase()] ?? STATUS_STYLES.default;

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

export const Table = ({
  columns,
  TB,
  onEdit,
}: {
  columns: Column[];
  TB: any[];
  getStatusColor?: (status: string) => string;
  onEdit: (row: any) => void;
}) => {
  return (
    <div className="w-full max-h-[480px] overflow-y-auto overflow-x-auto custom-scrollbar border-b border-slate-100">
      <table className="w-full border-collapse relative">
        <thead className="sticky top-0 z-20">
          <tr className="bg-slate-50 border-b border-slate-100 shadow-sm">
            {columns.map((col, i) => (
              <th
                key={i}
                className={`px-6 py-4 text-[11px] font-bold tracking-widest uppercase text-slate-400 whitespace-nowrap bg-slate-50 ${
                  col.type === "action" ? "text-right" : "text-left"
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-50">
          {TB.length > 0 ? (
            TB.map((row, ri) => (
              <tr
                key={row.id || ri}
                onClick={() => onEdit(row)}
                className="group border-b border-slate-50 cursor-pointer transition-colors hover:bg-indigo-50/30"
              >
                {columns.map((col, ci) => {
                  if (col.type === "action") {
                    return (
                      <td key={ci} className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); onEdit(row); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600 text-[11px] font-bold cursor-pointer transition-all hover:bg-indigo-600 hover:text-white hover:border-indigo-600 active:scale-95"
                        >
                          <Edit2 size={13} /> Edit
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
                              {val}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 tracking-wider m-0 mt-0.5">
                              #{row.Emp_id}
                            </p>
                          </div>
                        </div>
                      </td>
                    );
                  }

                  /* Status badge */
                  if (col.accessor === "status") {
                    const s = getStatusStyle(val);
                    return (
                      <td key={ci} className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide border ${s.bg} ${s.text} ${s.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
                          {val || "Pending"}
                        </span>
                      </td>
                    );
                  }

                  /* Default cell */
                  return (
                    <td key={ci} className="px-6 py-4">
                      <span className="text-[13px] font-semibold text-slate-600 uppercase tracking-tight">
                        {val || "—"}
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
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};