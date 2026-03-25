import {ExternalLink } from "lucide-react";

export const DepTable = ({ columns, TB, getStatusColor, onEdit }: any) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-100">
            {columns.map((col: any, i: number) => (
              <th key={i} className="px-8 py-5 text-left text-[11px] font-black uppercase tracking-widest text-gray-400">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {TB.length > 0 ? (
            TB.map((row: any) => (
              <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                {columns.map((col: any, i: number) => (
                  <td key={i} className="px-8 py-5 whitespace-nowrap">
                    {col.type === "action" ? (
                      <button
                        onClick={() => onEdit(row)}
                        className="flex items-center gap-2 text-xs font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                      >
                        <ExternalLink size={14} /> Profile
                      </button>
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