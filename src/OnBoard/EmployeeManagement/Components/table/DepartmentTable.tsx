import {ExternalLink } from "lucide-react";
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

export const DepTable = ({ columns, TB, getStatusColor, onEdit }: any) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-100">
            {columns.map((col: any, i: number) => (
              <th 
                key={i} 
                className={`px-8 py-5 text-[11px] font-black uppercase tracking-widest text-gray-400 
                  ${col.type === "action" ? "text-right" : 
                    col.accessor === "Total_employees" ? "text-center" : "text-left"}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {TB.length > 0 ? (
            TB.map((row: any) => (
              <tr 
                key={row.Dep_id || row.id} 
                onClick={() => onEdit(row)}
                className="hover:bg-indigo-50/50 transition-all cursor-pointer group"
              >
                {columns.map((col: any, i: number) => (
                  <td 
                    key={i} 
                    className={`px-8 py-5 whitespace-nowrap 
                      ${col.accessor === "Total_employees" ? "text-center" : ""}`}
                  >
                    {col.accessor === "Dep_name" || col.accessor === "dep_name" ? (
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110"
                          style={{ backgroundColor: row.bg_color || "#f8fafc" }}
                        >
                          {(() => {
                            const IconObj = ICON_MAP[row.Dep_icon] || FaBuilding;
                            return <IconObj style={{ color: row.icon_color || "#64748b" }} size={18} />;
                          })()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-800 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                            {row.Dep_name || row.dep_name}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                            ID: {row.Dep_id || row.id}
                          </p>
                        </div>
                      </div>
                    ) : col.type === "action" ? (
                      <div className="flex justify-end">
                        <button
                          onClick={(e) => { e.stopPropagation(); onEdit(row); }}
                          className="flex items-center gap-2 text-xs font-black text-indigo-600 bg-indigo-50 px-5 py-2.5 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95 border border-indigo-100"
                        >
                          <ExternalLink size={14} /> Profile
                        </button>
                      </div>
                    ) : col.accessor === "Task_status" ? (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusColor(row.Task_status)}`}>
                        {row.Task_status}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-700 font-bold">
                        {row[col.accessor] || "—"}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr><td colSpan={columns.length} className="py-20 text-center text-gray-400 font-bold">No Records Found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};