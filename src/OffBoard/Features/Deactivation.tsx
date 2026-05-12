import { useEffect, useState } from "react";
import { Mail, Globe, Lock, ShieldAlert, ShieldCheck, UserCircle, Layout } from "lucide-react";

type AccessDetail = {
  id: string;
  system: string;
  access_id: string;
  status: "Active" | "Deactivated";
};

type EmployeeAccessGroup = {
  emp_id: string;
  emp_name: string;
  accessList: AccessDetail[];
};

export const AccessDeactivation = () => {
  const [data, setData] = useState<EmployeeAccessGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData([
        {
          emp_id: "EMP001",
          emp_name: "Arun Kumar",
          accessList: [
            { id: "acc1", system: "Corporate Email", access_id: "arun@company.com", status: "Active" },
            { id: "acc2", system: "AWS Console", access_id: "arun_dev_admin", status: "Deactivated" },
            { id: "acc3", system: "Slack Workspace", access_id: "@arunk", status: "Active" },
          ],
        },
        {
          emp_id: "EMP002",
          emp_name: "Priya Sharma",
          accessList: [
            { id: "acc4", system: "VPN Access", access_id: "VPN-7788", status: "Active" },
            { id: "acc5", system: "HRMS Portal", access_id: "PRIYA_HR", status: "Active" },
          ],
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const handleDeactivate = (empId: string, accessId: string) => {
    setData((prev) =>
      prev.map((emp) => {
        if (emp.emp_id === empId) {
          return {
            ...emp,
            accessList: emp.accessList.map((a) =>
              a.id === accessId ? { ...a, status: "Deactivated" } : a
            ),
          };
        }
        return emp;
      })
    );
  };

  const getIcon = (system: string) => {
    const s = system.toLowerCase();
    if (s.includes("email")) return <Mail size={18} />;
    if (s.includes("vpn") || s.includes("aws")) return <Globe size={18} />;
    if (s.includes("slack") || s.includes("portal")) return <Layout size={18} />;
    return <Lock size={18} />;
  };

  return (
    <div className="p-8 bg-[#F1F5F9] h-full overflow-auto text-slate-900">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Access <span className="text-red-600">Deactivation</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">Revoke all system permissions for departing employees.</p>
      </div>

      <div className="space-y-8">
        {loading ? (
          <div className="text-center py-20">
             <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
             <p className="text-slate-400 font-medium">Loading Employee Access Records...</p>
          </div>
        ) : (
          data.map((emp) => (
            <div key={emp.emp_id} className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              {/* Employee Header */}
              <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded-full shadow-sm border border-slate-200">
                    <UserCircle className="text-slate-400" size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{emp.emp_name}</h3>
                    <p className="text-xs font-bold text-red-500 tracking-widest uppercase">{emp.emp_id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black bg-slate-200 text-slate-600 px-3 py-1 rounded-full uppercase">
                    {emp.accessList.filter(a => a.status === 'Deactivated').length} / {emp.accessList.length} Revoked
                  </span>
                </div>
              </div>

              {/* Multiple Access Items */}
              <div className="p-4 space-y-3">
                {emp.accessList.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${item.status === 'Deactivated' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                        {getIcon(item.system)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">{item.system}</p>
                        <p className="text-xs text-slate-400 font-mono">{item.access_id}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {item.status === "Deactivated" ? (
                        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full border border-emerald-100">
                          <ShieldCheck size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Deactivated</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleDeactivate(emp.emp_id, item.id)}
                          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-xl hover:bg-red-600 transition-all text-xs font-bold shadow-md"
                        >
                          <ShieldAlert size={14} />
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};