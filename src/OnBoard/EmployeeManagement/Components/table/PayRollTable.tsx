// src/components/table/PayrollTable.tsx

type Column = {
  header: string;
  accessor: string;
};

type TableProps = {
  data: any[];
  columns: Column[];
  onRowClick?: (row: any) => void;
};

const PayrollTable = ({ columns, data, onRowClick }: TableProps) => {
  const getStatusStyles = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "paid") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (s === "pending") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-gray-50 text-gray-600 border-gray-200";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      
      {/* TABLE */}
      <table className="w-full border-collapse">
        
        {/* HEADER */}
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500
                ${index === 0 ? "text-left" : "text-right"}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="divide-y divide-gray-100">
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              onClick={() => onRowClick?.(row)}
              className="hover:bg-gray-50 transition cursor-pointer"
            >
              {columns.map((col, colIndex) => {
                const value = row[col.accessor];
                const isFirst = colIndex === 0;
                const isStatus = col.accessor.toLowerCase() === "status";
                const isNet = col.accessor.toLowerCase() === "net";

                return (
                  <td
                    key={colIndex}
                    className={`px-4 py-3 whitespace-nowrap ${
                      isFirst
                        ? "text-left font-medium text-gray-900"
                        : "text-right"
                    }`}
                  >
                    {isStatus ? (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${getStatusStyles(
                          value
                        )}`}
                      >
                        {value}
                      </span>
                    ) : (
                      <span
                        className={`text-sm ${
                          isNet
                            ? "text-emerald-600 font-semibold"
                            : "text-gray-600"
                        }`}
                      >
                        {typeof value === "number"
                          ? `₹${value.toLocaleString()}`
                          : value ?? "—"}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PayrollTable;