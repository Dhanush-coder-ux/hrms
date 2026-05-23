import { Loader2, AlertCircle, Trash2, Key } from "lucide-react";
import { pageTheme } from "../../../../Themes/PageThems/pageConfig";

export interface EmployeePortalStatus {
  Emp_id: string;
  name: string;
  Department?: string;
  designation?: string;
  has_portal_access: boolean;
  portal_email?: string;
  portal_role?: string;
}

interface PortAccsesTableProps {
  employees: EmployeePortalStatus[];
  loading: boolean;
  onRevoke: (emp: EmployeePortalStatus) => void;
  onGenerateKey: (emp: EmployeePortalStatus) => void;
}

export const PortAccsesTable = ({
  employees,
  loading,
  onRevoke,
  onGenerateKey,
}: PortAccsesTableProps) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 bg-white">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Loading access catalog...</p>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 bg-white text-center p-6">
        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
          <AlertCircle size={20} />
        </div>
        <h3 className="text-sm font-extrabold text-slate-600">No matching employees found</h3>
        <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
          Try adjusting your search criteria, selecting a different department, or altering your portal key status filters.
        </p>
      </div>
    );
  }

  return (
    <div className={pageTheme.table.wrapper}>
      <table className="w-full border-collapse">
        <thead className={pageTheme.table.head}>
          <tr className={pageTheme.table.headRow}>
            <th className={pageTheme.table.headCell}>Employee ID</th>
            <th className={pageTheme.table.headCell}>Name</th>
            <th className={pageTheme.table.headCell}>Department</th>
            <th className={pageTheme.table.headCell}>Designation</th>
            <th className={pageTheme.table.headCell}>Portal Login Email</th>
            <th className={pageTheme.table.headCell}>Key Status</th>
            <th className={pageTheme.table.headCell + " text-center"}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.Emp_id} className={pageTheme.table.row}>
              <td className={pageTheme.table.cell + " font-black text-slate-700 text-xs"}>{emp.Emp_id}</td>
              <td className={pageTheme.table.cell + " font-bold text-slate-800 text-xs flex items-center gap-2"}>
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 border border-slate-200">
                  {emp.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                {emp.name}
              </td>
              <td className={pageTheme.table.cell + " font-bold text-slate-500 text-xs"}>{emp.Department || "—"}</td>
              <td className={pageTheme.table.cell + " font-semibold text-slate-400 text-xs"}>{emp.designation || "—"}</td>
              <td className={pageTheme.table.cell + " text-xs font-semibold text-slate-600"}>
                {emp.has_portal_access ? (
                  <span className="flex items-center gap-1.5">
                    {emp.portal_email}
                    <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">
                      {emp.portal_role}
                    </span>
                  </span>
                ) : (
                  <span className="text-slate-300 italic">Not Registered</span>
                )}
              </td>
              <td className={pageTheme.table.cell}>
                {emp.has_portal_access ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Granted
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-orange-500 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                    No Access
                  </span>
                )}
              </td>
              <td className={pageTheme.table.cell + " text-center"}>
                {emp.has_portal_access ? (
                  <button
                    onClick={() => onRevoke(emp)}
                    className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all active:scale-95"
                    title="Revoke Portal Access"
                  >
                    <Trash2 size={15} />
                  </button>
                ) : (
                  <button
                    onClick={() => onGenerateKey(emp)}
                    className="flex items-center gap-1.5 mx-auto px-3.5 py-1.5 bg-primary/5 hover:bg-primary hover:text-white border border-primary/20 text-primary rounded-lg text-[10px] font-extrabold tracking-wider uppercase transition-all active:scale-95 shadow-sm"
                  >
                    <Key size={10} />
                    Generate Key
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
