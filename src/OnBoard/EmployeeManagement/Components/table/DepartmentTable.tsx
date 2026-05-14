import { ExternalLink } from "lucide-react";
import { empMangeTheme } from "../../../../Themes/EmpMangeTheme/empMangeConfig";
import { 
  FaFireExtinguisher, 
  FaUserTie, 
  FaLaptopCode, 
  FaTools, 
  FaBuilding, 
  FaStethoscope 
} from "react-icons/fa";

const ICON_MAP: any = {
  FaFireExtinguisher: FaFireExtinguisher,
  FaUserTie: FaUserTie,
  FaLaptopCode: FaLaptopCode,
  FaTools: FaTools,
  FaBuilding: FaBuilding,
  FaStethoscope: FaStethoscope,
};

export type Column =
  | { header: string; accessor: string; type?: "text" | "badge" | "date" }
  | { header: string; type: "action" };

export type TableProps = {
  columns: Column[];
  TB: any[];
  onEdit?: (row: any) => void;
};

export const DepTable = ({ columns, TB, onEdit }: TableProps) => {
  return (
    <div className={empMangeTheme.table.wrapper + " max-h-[520px]"}>
      <table className="w-full border-collapse relative">
        <thead className={empMangeTheme.table.head}>
          <tr className={empMangeTheme.table.headRow}>
            {columns.map((col, i) => (
              <th
                key={i}
                className={`${empMangeTheme.table.headCell} ${
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
                key={row.Dep_id || ri}
                onClick={() => onEdit?.(row)}
                className={empMangeTheme.table.row}
              >
                {columns.map((col, ci) => {
                  if (col.type === "action") {
                    return (
                      <td key={ci} className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); onEdit?.(row); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/20 bg-primary/5 text-primary text-[11px] font-bold cursor-pointer transition-all hover:bg-primary hover:text-white hover:border-primary active:scale-95"
                        >
                          <ExternalLink size={13} /> Profile
                        </button>
                      </td>
                    );
                  }

                  if (!("accessor" in col)) return null;

                  const val = row[col.accessor];

                  /* Department name + icon */
                  if (col.accessor === "Dep_name" || col.accessor === "dep_name") {
                    const IconObj = ICON_MAP[row.Dep_icon] || FaBuilding;
                    return (
                      <td key={ci} className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110"
                            style={{ backgroundColor: row.bg_color || "#f1f5f9" }}
                          >
                            <IconObj style={{ color: row.icon_color || "#64748b" }} size={18} />
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-slate-800 tracking-tight m-0">
                              {val}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 tracking-wider m-0 mt-0.5">
                              ID: {row.Dep_id || row.id}
                            </p>
                          </div>
                        </div>
                      </td>
                    );
                  }

                  /* Employees count badge */
                  if (col.accessor === "Total_employees" || col.accessor === "emp_count") {
                    return (
                      <td key={ci} className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-50 text-slate-600 border border-slate-100">
                          {val || 0} Staff
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
                No departments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
