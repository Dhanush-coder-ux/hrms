import { empMangeTheme } from "../../../Themes/EmpMangeTheme/empMangeConfig";

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
    if (s === 'paid') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (s === 'pending') return 'bg-amber-50 text-amber-700 border-amber-100';
    return 'bg-slate-50 text-slate-600 border-slate-100';
  };

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
      <table className="w-full border-separate border-spacing-0">
        <thead className={empMangeTheme.table.headRow}>
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-100 
                ${index === 0 ? "text-left" : "text-right"}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-50">
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex} className={empMangeTheme.table.row}>
              {columns.map((col, colIndex) => {
                const value = row[col.accessor];
                const isEmployee = colIndex === 0;
                const isStatus = col.accessor.toLowerCase() === 'status';
                const isTax = col.accessor.toLowerCase() === 'tax';
                const isNet = col.accessor.toLowerCase() === 'net';

                return (
                  <td 
                    key={colIndex} 
                    className={`px-6 py-4 ${isEmployee ? "text-left font-bold text-slate-800" : "text-right"}`}
                  >
                    {isStatus ? (
                      /* Status Badge UI */
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyles(value)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70"></span>
                        {value}
                      </span>
                    ) : (
                      /* Standard Text UI */
                      <span className={`text-sm tracking-tight
                        ${isTax ? "text-rose-500 font-bold" : ""}
                        ${isNet ? "text-emerald-600 font-extrabold" : ""}
                        ${!isEmployee && !isTax && !isNet ? "text-slate-500 font-medium" : ""}
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
