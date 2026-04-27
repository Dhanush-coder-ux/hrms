import { useEffect, useState } from "react";
import { CheckCircle2, Clock, UserCircle, AlertCircle } from "lucide-react";

type DeptClearance = {
  dept: string;
  status: "Cleared" | "Pending" | "Action Required";
  clearedBy: string;
};

type EmployeeClearance = {
  emp_id: string;
  emp_name: string;
  department: string;
  clearanceList: DeptClearance[];
};

export const Clearance = () => {
  const [data, setData] = useState<EmployeeClearance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData([
        {
          emp_id: "EMP007",
          emp_name: "Arun Kumar",
          department: "Engineering",
          clearanceList: [
            { dept: "IT & Assets", status: "Cleared", clearedBy: "Admin_Rahul" },
            { dept: "Knowledge Transfer", status: "Pending", clearedBy: "—" },
            { dept: "Finance / Accounts", status: "Action Required", clearedBy: "—" },
            { dept: "Human Resources", status: "Pending", clearedBy: "—" },
          ],
        },
        {
          emp_id: "EMP002",
          emp_name: "Priya Sharma",
          department: "Marketing",
          clearanceList: [
            { dept: "IT & Assets", status: "Cleared", clearedBy: "Admin_Rahul" },
            { dept: "Knowledge Transfer", status: "Cleared", clearedBy: "Manager_Sita" },
            { dept: "Finance / Accounts", status: "Cleared", clearedBy: "Fin_Vijay" },
            { dept: "Human Resources", status: "Pending", clearedBy: "—" },
          ],
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Cleared": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Action Required": return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-slate-50 text-slate-500 border-slate-100";
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === "Cleared") return <CheckCircle2 size={16} />;
    if (status === "Action Required") return <AlertCircle size={16} />;
    return <Clock size={16} />;
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen text-slate-900 font-sans">
      {/* Header */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Final <span className="text-emerald-600">Clearance</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Consolidated departmental sign-offs for exit finalization.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-slate-600 uppercase tracking-widest text-nowrap">Live Sync Active</span>
        </div>
      </div>

      <div className="space-y-8">
        {loading ? (
          <div className="text-center py-20 font-bold text-slate-300 animate-pulse tracking-widest uppercase text-xs">
            Aggregating Clearance Data...
          </div>
        ) : (
          data.map((emp) => {
            const clearedCount = emp.clearanceList.filter(c => c.status === 'Cleared').length;
            const totalDepts = emp.clearanceList.length;
            const isFullyCleared = clearedCount === totalDepts;

            return (
              <div key={emp.emp_id} className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
                {/* Employee Top Bar */}
                <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50 border-b border-slate-100">
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <UserCircle className="text-slate-300" size={48} />
                      {isFullyCleared && (
                        <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-white">
                          <CheckCircle2 size={14} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 leading-tight">{emp.emp_name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 uppercase tracking-widest">{emp.emp_id}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">• {emp.department}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Stats */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Overall Progress</p>
                      <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-1000" 
                          style={{ width: `${(clearedCount / totalDepts) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className={`px-5 py-2 rounded-2xl border ${isFullyCleared ? 'bg-emerald-600 text-white' : 'bg-white border-slate-200 text-slate-600'}`}>
                       <span className="text-xs font-black uppercase tracking-tighter italic">
                         {isFullyCleared ? 'Ready for F&F' : `${clearedCount} / ${totalDepts} Cleared`}
                       </span>
                    </div>
                  </div>
                </div>

                {/* Clearance Grid */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {emp.clearanceList.map((item, idx) => (
                    <div key={idx} className={`p-4 rounded-2xl border transition-all hover:shadow-md ${getStatusStyle(item.status)}`}>
                      <div className="flex justify-between items-start mb-3">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{item.dept}</p>
                        {getStatusIcon(item.status)}
                      </div>
                      <h4 className="font-bold text-sm mb-1">{item.status}</h4>
                      <p className="text-[10px] font-medium opacity-70 italic">
                        {item.status === 'Cleared' ? `Approved by ${item.clearedBy}` : 'Waiting for Sign-off'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};