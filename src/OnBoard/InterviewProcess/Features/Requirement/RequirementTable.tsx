import { useState, useEffect } from "react";
import { Loader2, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { pageTheme } from "../../../../Themes/PageThems/pageConfig";
import { getUserTheme } from "../../../../Components/Common/UserAvatar";
import { Api_URL } from "../../../../APILINK";

interface RequirementData {
  id: number;
  Temp_Id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  marks_sheets: Array<{
    doc_type: string;
    status: string;
  }>;
  assets: any[];
}

interface RequirementTableProps {
  onRowClick: (data: RequirementData) => void;
  onDataUpdate?: (data: RequirementData[]) => void;
}


export const RequirementTable = ({ onRowClick, onDataUpdate }: RequirementTableProps) => {
  const [data, setData] = useState<RequirementData[]>([]);
  const [loading, setLoading] = useState(true);

  const Api_url = `${Api_URL}/requirement`;

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const res = await fetch(Api_url);
        const result = await res.json();
        if (Array.isArray(result)) {
          setData(result);
          if (onDataUpdate) onDataUpdate(result);
        } else {
          setData([]);
          if (onDataUpdate) onDataUpdate([]);
        }
      } catch (error) {
        console.error("Failed to fetch requirements", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRequirements();
  }, [Api_url]);

  const getStatusBadge = (status: string) => {
    const config: any = {
      Verified: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", dot: "bg-emerald-500" },
      Pending: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100", dot: "bg-amber-500" },
      Missing: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100", dot: "bg-rose-500" },
    };
    const c = config[status] || config.Pending;
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold tracking-tight ${c.bg} ${c.text} ${c.border}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
        {status}
      </div>
    );
  };

  const calculateProgress = (row: RequirementData) => {
    const docs = row.marks_sheets || [];
    const total = docs.length;
    if (total === 0) return 0;
    const received = docs.filter((d: any) => d.status === "Received").length;
    return Math.round((received / total) * 100);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Syncing Registry...</p>
      </div>
    );
  }

  return (
    <div className={pageTheme.table.wrapper}>
      <table className="w-full border-collapse relative">
        <thead className={pageTheme.table.head}>
          <tr className={pageTheme.table.headRow}>
            <th className={pageTheme.table.headCell}>Candidate</th>
            <th className={pageTheme.table.headCell}>Role & Dept</th>
            <th className={pageTheme.table.headCell}>Registry Progress</th>
            <th className={pageTheme.table.headCell}>Contact</th>
            <th className={pageTheme.table.headCell}>Verification</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row) => {
              const theme = getUserTheme(row.name);
              const initials = row.name
                ?.split(" ")
                .slice(0, 2)
                .map((w: string) => w[0])
                .join("")
                .toUpperCase();
              
              const progress = calculateProgress(row);
              const status = progress === 100 ? "Verified" : progress > 0 ? "Pending" : "Missing";

              return (
                <tr
                  key={row.id}
                  onClick={() => onRowClick(row)}
                  className={pageTheme.table.row}
                >
                  {/* Candidate */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-extrabold flex-shrink-0 tracking-tighter ${theme.tableBg} ${theme.tableText}`}>
                        {initials}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-slate-800 tracking-tight m-0">{row.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 tracking-wider m-0 mt-0.5">REQ-{row.Temp_Id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role & Dept */}
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                       <p className="text-[13px] font-bold text-slate-700 m-0">{row.position}</p>
                       <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">
                         {row.department}
                       </p>
                    </div>
                  </td>

                  {/* Progress Bar */}
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5 w-36">
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Documents</span>
                          <span className="text-[10px] font-extrabold text-primary">{progress}%</span>
                       </div>
                       <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-primary rounded-full"
                          />
                       </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                          <Mail size={12} />
                       </div>
                       <span className="text-[11px] font-bold text-slate-600 truncate max-w-[120px]">{row.email}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-5">{getStatusBadge(status)}</td>

                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-20 text-center text-slate-300 text-[11px] font-bold uppercase tracking-widest">
                No requirement records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};