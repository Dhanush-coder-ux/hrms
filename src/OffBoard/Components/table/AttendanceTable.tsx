import { Edit2, MoreVertical } from "lucide-react";

interface Column {
  header: string;
  accessor?: string;
  type?: string;
}

export const Table = ({
  columns,
  TB,
  getStatusColor,
  onEdit,
}: {
  columns: Column[];
  TB: any[];
  getStatusColor: (status: string) => string;
  onEdit: (row: any) => void;
}) => {
  return (
    <div className="w-full overflow-hidden">
      <table className="w-full border-collapse">
        {/* Table Header */}
        <thead className="bg-gray-50/50 border-b border-gray-200">
          <tr>
            {columns.map((col, index) => (
              <th 
                key={index} 
                className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-100 bg-white">
          {TB.length > 0 ? (
            TB.map((row) => (
              <tr 
                key={row.id} 
                className="group hover:bg-blue-50/30 transition-colors duration-150"
              >
                {columns.map((col, index) => (
                  <td key={index} className="px-6 py-4 whitespace-nowrap">
                    {col.type === "action" ? (
                      <div className="flex items-center gap-2">
                        <button
                          className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg  hover:bg-blue-100 transition-all duration-200"
                          onClick={() => onEdit(row)}
                        >
                          <Edit2 size={12} />
                          Edit
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    ) : col.accessor === "status" ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide border ${getStatusColor(row.status)}`}>
                        {row.status}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-600 font-medium">
                        {col.accessor ? row[col.accessor] : "—"}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400 text-sm">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};