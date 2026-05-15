import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserAvatar } from "../../../../Components/Common/UserAvatar";
import { empMangeTheme } from "../../../../Themes/EmpMangeTheme/empMangeConfig";

export type Column =
  | { header: string; accessor: string; type?: "text" | "badge" | "date" | "currency" }
  | { header: string; type: "action" };

type TableProps = {
  data: any[];
  columns: Column[];
  onRowClick?: (row: any) => void;
};

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  paid:    { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500", border: "border-emerald-100" },
  pending: { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500", border: "border-amber-100" },
  default: { bg: "bg-slate-50", text: "text-slate-500", dot: "bg-slate-400", border: "border-slate-100" },
};

const getStatusStyle = (val: string) =>
  STATUS_STYLES[val?.toLowerCase()] ?? STATUS_STYLES.default;

const PayrollTable = ({ columns, data, onRowClick }: TableProps) => {
  const navigate = useNavigate();
  return (
    <div className={empMangeTheme.table.wrapper + " max-h-[520px]"}>
      <table className="w-full border-collapse relative">
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

        <tbody className="divide-y divide-slate-50">
          {data.length > 0 ? (
            data.map((row, ri) => (
              <tr
                key={row.emp_id || ri}
                onClick={() => onRowClick?.(row)}
                className={empMangeTheme.table.row}
              >
                {columns.map((col, ci) => {
                  if (col.type === "action") {
                    return (
                      <td key={ci} className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            navigate(`/EmployeeManagement/payrollDetails/${row.emp_id}`);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/20 bg-primary/5 text-primary text-[11px] font-bold cursor-pointer transition-all hover:bg-primary hover:text-white hover:border-primary active:scale-95"
                        >
                          <ExternalLink size={13} /> View
                        </button>
                      </td>
                    );
                  }

                  if (!("accessor" in col)) return null;

                  const val = row[col.accessor];

                  /* Employee info with Avatar */
                  if (col.accessor === "employee" || col.header.toLowerCase().includes("employee")) {
                    return (
                      <td key={ci} className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar name={val || "E"} variant="table" />
                          <div>
                            <p className="text-[13px] font-bold text-slate-800 tracking-tight m-0 uppercase">
                              {val}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 tracking-wider m-0 mt-0.5">
                              #{row.emp_id}
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

                  /* Currency / Net Pay */
                  if (col.accessor === "net") {
                    return (
                      <td key={ci} className="px-6 py-4">
                        <span className="text-[13px] font-extrabold text-emerald-600">
                          ₹{Number(val || 0).toLocaleString()}
                        </span>
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
                No payroll records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PayrollTable;
