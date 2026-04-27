import React from "react";
import { 
  UserPlus, 
  Handshake, 
  Briefcase, 
  Sparkles, 
  ChevronRight, 
  Rocket, 
  Calendar, 
  CheckCircle2, 
  Laptop,
  Mail
} from "lucide-react";

export const OnboardingDashboard = () => {
  // Summary Stats
  const stats = [
    { label: "New Hires (MTD)", value: "18", icon: <UserPlus size={20} />, color: "bg-emerald-500", shadow: "shadow-emerald-200" },
    { label: "Joining This Week", value: "05", icon: <Calendar size={20} />, color: "bg-violet-500", shadow: "shadow-violet-200" },
    { label: "Hardware Ready", value: "92%", icon: <Laptop size={20} />, color: "bg-blue-500", shadow: "shadow-blue-200" },
    { label: "Offer Acceptance", value: "85%", icon: <Handshake size={20} />, color: "bg-indigo-500", shadow: "shadow-indigo-200" },
  ];

  const onboardingPipeline = [
    { id: "NH101", name: "Rithika Sen", role: "Product Designer", date: "May 02", stage: "Verification", progress: 75, status: "Ready" },
    { id: "NH102", name: "Karthik Raja", role: "Backend Lead", date: "May 05", stage: "Asset Allocation", progress: 30, status: "Pending" },
    { id: "NH103", name: "Sana Mir", role: "HR Generalist", date: "May 05", stage: "Welcome Kit", progress: 90, status: "Ready" },
    { id: "NH104", name: "David Miller", role: "Sales Executive", date: "May 10", stage: "IT Setup", progress: 15, status: "Waiting" },
  ];

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen text-slate-900">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Onboarding <span className="text-emerald-600">Command</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Tracking the journey of your newest team members.</p>
        </div>
        <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95">
          <Rocket size={18} /> Add New Hire
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
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
        
        {/* Onboarding List */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-800">Joining Pipeline</h3>
            <div className="flex gap-2">
                <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">Next 15 Days</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="text-left px-8 py-4">New Hire</th>
                  <th className="text-left px-8 py-4">Join Date</th>
                  <th className="text-left px-8 py-4">Stage</th>
                  <th className="text-left px-8 py-4">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {onboardingPipeline.map((item) => (
                  <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors cursor-pointer group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                            {item.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{item.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{item.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">{item.date}</span>
                        <span className="text-[9px] text-slate-400 uppercase font-black">2026</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        item.status === 'Ready' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'
                      }`}>
                        {item.stage}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full w-16 overflow-hidden">
                          <div className={`h-full rounded-full ${item.progress > 70 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${item.progress}%` }}></div>
                        </div>
                        <span className="text-[10px] font-black text-slate-400">{item.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Welcome Section Sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
            <Sparkles className="absolute -right-4 -top-4 w-24 h-24 text-white/10 rotate-12" />
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2">
                Day 1 Ready?
            </h4>
            <p className="text-white/70 text-xs mb-6 leading-relaxed">
                Check if the welcome kits and login credentials are ready for Monday's batch.
            </p>
            <div className="space-y-3">
                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/10">
                    <CheckCircle2 size={16} className="text-emerald-300" />
                    <span className="text-xs font-medium">Verify IDs (4/5)</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/10">
                    <Mail size={16} className="text-blue-300" />
                    <span className="text-xs font-medium">Send Welcome Emails</span>
                </div>
            </div>
            <button className="w-full mt-6 py-3 bg-white text-indigo-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-50 transition-all">
                Final Check
            </button>
          </div>

          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Briefcase size={18} className="text-slate-400" /> Quick Actions
            </h4>
            <div className="grid grid-cols-1 gap-2">
                {["Draft Offer Letter", "Assign Buddy", "Setup Assets", "Plan Orientation"].map((act) => (
                    <div key={act} className="group flex items-center justify-between p-3 border border-slate-50 rounded-xl bg-slate-50/50 hover:border-emerald-200 hover:bg-emerald-50 transition-all cursor-pointer">
                        <span className="text-[11px] font-bold text-slate-500 group-hover:text-emerald-600 uppercase tracking-tighter">{act}</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-500" />
                    </div>
                ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};