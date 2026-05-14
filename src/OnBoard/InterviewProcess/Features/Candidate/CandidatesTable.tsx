import { ExternalLink } from "lucide-react";
import { getUserTheme } from "../../../../Components/Common/UserAvatar";

type Column =
  | { header: string; accessor: string; type?: "text" | "badge" | "date" }
  | { header: string; type: "action" };

type TableProps = {
  columns: Column[];
  data: Record<string, any>[];
  onRowClick?: (row: any) => void;
};

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  selected:  { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
  rejected:  { bg: "bg-rose-50", text: "text-rose-600", dot: "bg-rose-500" },
  interview: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
  applied:   { bg: "bg-slate-50", text: "text-slate-600", dot: "bg-slate-500" },
  default:   { bg: "bg-slate-50", text: "text-slate-500", dot: "bg-slate-400" },
};

const getStatusStyle = (val: string) =>
  STATUS_STYLES[val?.toLowerCase()] ?? STATUS_STYLES.default;


export const CandidateTable = ({ columns, data, onRowClick }: TableProps) => {
  return (
    <div className="w-full max-h-[520px] overflow-y-auto overflow-x-auto custom-scrollbar border-b border-slate-100">
      <table className="w-full border-collapse relative">
        <thead className="sticky top-0 z-20">
          <tr className="bg-primary/5 border-b border-primary/10 shadow-sm">
            {columns.map((col, i) => (
              <th
                key={i}
                className={`px-6 py-4 text-[11px] font-bold tracking-widest uppercase text-primary whitespace-nowrap bg-primary/5 ${
                  col.type === "action" ? "text-right" : "text-left"
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-50">
          {data.length > 0 ? (
            data.map((row, ri) => (
              <tr
                key={row.id || ri}
                onClick={() => onRowClick?.(row)}
                className="group border-b border-slate-50 cursor-pointer transition-colors hover:bg-primary/5"
              >
                {columns.map((col, ci) => {
                  if (col.type === "action") {
                    return (
                      <td key={ci} className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); onRowClick?.(row); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/20 bg-primary/5 text-primary text-[11px] font-bold cursor-pointer transition-all hover:bg-primary hover:text-white hover:border-primary active:scale-95"
                        >
                          <ExternalLink size={13} /> View
                        </button>
                      </td>
                    );
                  }

                  if (!("accessor" in col)) return null;

                  const val = row[col.accessor];

                  /* Status badge */
                  if (col.accessor === "Candidate_status" || col.accessor === "Status") {
                    const s = getStatusStyle(val);
                    return (
                      <td key={ci} className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${s.bg} ${s.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
                          {val || "Applied"}
                        </span>
                      </td>
                    );
                  }

                  /* Candidate name + avatar */
                  if (col.accessor === "Candidate_name" || col.accessor === "name") {
                    const theme = getUserTheme(val);
                    const initials = val
                      ?.split(" ")
                      .slice(0, 2)
                      .map((w: string) => w[0])
                      .join("")
                      .toUpperCase();
                    return (
                      <td key={ci} className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-extrabold flex-shrink-0 tracking-tighter ${theme.tableBg} ${theme.tableText}`}>
                            {initials}
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-slate-800 tracking-tight m-0">
                              {val}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 tracking-wider m-0 mt-0.5">
                              #{row.Candidate_ID}
                            </p>
                          </div>
                        </div>
                      </td>
                    );
                  }

                  /* Default cell */
                  return (
                    <td key={ci} className="px-6 py-4">
                      <span className="text-[13px] font-semibold text-slate-600">
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
                No candidates found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};