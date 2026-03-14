type Column = {
  header: string;
  accessor: string;
};

type TableProps = {
  data: Record<string, any>[];
  columns: Column[];
};

const PayrollTable = ({ columns, data }: TableProps) => {
  // Helper for Status Badge styling
  const getStatusStyles = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'paid') return 'bg-green-50 text-green-700 border-green-200';
    if (s === 'pending') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-gray-50 text-gray-600 border-gray-200';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full border-separate border-spacing-0">
        <thead className="bg-gray-50/80">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className={`px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200 
                ${index === 0 ? "text-left" : "text-right"}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex} className="group cursor-pointer hover:bg-blue-50/40 transition-all duration-150">
              {columns.map((col, colIndex) => {
                const value = row[col.accessor];
                const isEmployee = colIndex === 0;
                const isStatus = col.accessor.toLowerCase() === 'status';
                const isTax = col.accessor.toLowerCase() === 'tax';
                const isNet = col.accessor.toLowerCase() === 'net';

                return (
                  <td 
                    key={colIndex} 
                    className={`px-6 py-4 ${isEmployee ? "text-left font-medium text-gray-900" : "text-right"}`}
                  >
                    {isStatus ? (
                      /* Status Badge UI */
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusStyles(value)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70"></span>
                        {value}
                      </span>
                    ) : (
                      /* Standard Text UI */
                      <span className={`text-sm
                        ${isTax ? "text-red-500" : ""}
                        ${isNet ? "text-green-600 font-semibold" : ""}
                        ${!isEmployee && !isTax && !isNet ? "text-gray-500" : ""}
                      `}>
                        {typeof value === 'number' ? `₹${value.toLocaleString()}` : (value ?? "—")}
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
