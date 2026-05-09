import { 
  Users, 
  PackageCheck, 
  ShieldAlert, 
  FileText, 
  ChevronRight, 
  ArrowUpRight, 
  Clock, 
  AlertCircle 
} from "lucide-react";

export const OffboardingDashboard = () => {
  // Mock Summary Stats
  const stats = [
    { label: "Active Exits", value: "12", icon: <Users size={20} />, color: "bg-blue-500", shadow: "shadow-blue-200" },
    { label: "Pending Assets", value: "08", icon: <PackageCheck size={20} />, color: "bg-amber-500", shadow: "shadow-amber-200" },
    { label: "Access Revokes", value: "15", icon: <ShieldAlert size={20} />, color: "bg-rose-500", shadow: "shadow-rose-200" },
    { label: "Finalized (MTD)", value: "24", icon: <FileText size={20} />, color: "bg-emerald-500", shadow: "shadow-emerald-200" },
  ];

  const exitPipeline = [
    { id: "EMP001", name: "Arun Kumar", dept: "Engineering", stage: "Clearance", progress: 85, status: "On Track" },
    { id: "EMP002", name: "Priya Sharma", dept: "Product", stage: "Asset Return", progress: 40, status: "Delayed" },
    { id: "EMP003", name: "Vijay Raj", dept: "Marketing", stage: "Settlement", progress: 95, status: "Action Required" },
    { id: "EMP004", name: "Sneha Kapoor", dept: "Finance", stage: "KT Handover", progress: 60, status: "On Track" },
  ];

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen text-slate-900 font-sans">
      {/* Header */}
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Offboarding <span className="text-blue-600">Dashboard</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Real-time oversight of employee exit lifecycles.</p>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Status: <span className="text-emerald-500 font-black">Healthy</span></span>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50">
                <Clock size={18} className="text-slate-400" />
            </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h2>
            </div>
            <div className={`${stat.color} ${stat.shadow} p-4 rounded-2xl text-white transition-transform group-hover:scale-110`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Pipeline Table */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-800">Exit Pipeline</h3>
            <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                View Full List <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="text-left px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
                  <th className="text-left px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Stage</th>
                  <th className="text-left px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</th>
                  <th className="text-left px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {exitPipeline.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold">
                            {item.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{item.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium tracking-tight">{item.id} • {item.dept}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Delayed' ? 'bg-amber-500 animate-pulse' : 'bg-blue-500'}`}></div>
                        <span className="text-xs font-bold text-slate-600">{item.stage}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full w-20 overflow-hidden">
                          <div className="bg-blue-500 h-full rounded-full" style={{ width: `${item.progress}%` }}></div>
                        </div>
                        <span className="text-[10px] font-black text-slate-400">{item.progress}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <ChevronRight size={16} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Center Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-200">
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="text-amber-400" size={20} /> Urgent Tasks
            </h4>
            <div className="space-y-4">
                {[
                    { title: "Revoke VPN for EMP002", time: "2 hrs overdue", type: "Access" },
                    { title: "Finalize Arun's F&F", time: "Due today", type: "Finance" }
                ].map((task, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
                        <p className="text-xs font-bold text-white mb-1">{task.title}</p>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">{task.type}</span>
                            <span className="text-[10px] text-slate-400">{task.time}</span>
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-6 py-3 bg-white text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-400 hover:text-white transition-all">
                Resolve All
            </button>
          </div>

          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4">Quick Links</h4>
            <div className="grid grid-cols-2 gap-3">
                {["Assets", "KT", "Access", "Documents"].map((link) => (
                    <div key={link} className="p-3 border border-slate-100 rounded-xl text-[11px] font-black uppercase tracking-tighter text-slate-500 hover:border-blue-200 hover:text-blue-600 cursor-pointer text-center transition-all bg-slate-50/30">
                        {link}
                    </div>
                ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};