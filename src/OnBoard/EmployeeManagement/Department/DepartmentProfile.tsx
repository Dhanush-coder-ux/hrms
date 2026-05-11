import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Api_URL } from "../../../APILINK";

import { Backbutton } from "../../../Components/Common/Backbutton";
import StatCard from "../../../Components/Common/StatCard";
import {
  ChevronLeftCircle,
  DollarSign,
  PersonStandingIcon,
} from "lucide-react";

// Updated type based on your API structure
type DepartmentAPI = {
  Dep_id: string;
  Dep_name: string;
  Dep_head: string;
  Total_employees: number;
  Dep_icon: string;
  bg_color: string;
  icon_color: string;
  Task_status?: string;
  budget_utilization?: string;
  location?: string;
  extral_info?: string;
};

export default function DepartmentProfile() {
  const params = useParams();
  const id = params["*"];
  const [dept, setDept] = useState<DepartmentAPI | null>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    if (!id) return;
    
    // Encode the ID to handle slashes correctly
    const encodedId = encodeURIComponent(id);

    // Fetch Department Info
    fetch(`${Api_URL}/departments/${encodedId}`)
      .then((res) => res.json())
      .then((data) => {
        setDept(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching department:", err);
        setLoading(false);
      });

    // Fetch Department Employees
    fetch(`${Api_URL}/departments/${encodedId}/employees`)
      .then((res) => res.json())
      .then((data) => {
        setEmployees(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Error fetching employees:", err));
  }, [id]);

  if (loading)
    return (
      <div className="p-10 text-center font-sans text-slate-500">
        Loading Departments...
      </div>
    );
  if (!dept)
    return <div className="p-10 text-center">Department not found.</div>;

  const ListoFsTATEcard = [
    {
      label: "Headcount",
      value: (dept.Total_employees || 0).toString(),
      icon: PersonStandingIcon,
      iconBg: "#E0E7FF",
      iconColor: "#2786FF",
      valueSize: "xl",
    },
    {
      label: "Status",
      value: dept.Task_status || "Active",
      icon: ChevronLeftCircle,
      iconBg: dept.Task_status === "Completed" ? "#D1FAE5" : "#FEF3C7",
      iconColor: dept.Task_status === "Completed" ? "#059669" : "#D97706",
      valueSize: "xl",
    },
    {
      label: "Budget Used",
      value: dept.budget_utilization || "0%",
      icon: DollarSign,
      iconBg: "#F5F3FF",
      iconColor: "#7C3AED",
      valueSize: "xl",
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-8 bg-slate-50 min-h-screen font-sans text-slate-900">
      {/* Sidebar/Selector (Optional: to switch between depts) */}
      <div className="flex gap-2 overflow-x-auto">
        <Backbutton />
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-5">
              <div 
                className="w-16 h-16 flex items-center justify-center rounded-2xl shadow-xl text-2xl font-bold"
                style={{ backgroundColor: dept.bg_color, color: dept.icon_color }}
              >
                {dept.Dep_name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {dept.Dep_name}
                  <span className="text-slate-400"> - {dept.Dep_id}</span>
                </h1>
                <p className="text-slate-500 font-medium">
                  Led by{" "}
                  <span className="text-slate-900">{dept.Dep_head}</span>
                </p>
              </div>
            </div>
          </header>

          {/* Stats Grid mapped to your API fields */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {ListoFsTATEcard.map((stat) => (
              <StatCard
                key={stat.label}
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                iconBg={stat.iconBg} 
                iconColor={stat.iconColor} 
                valueSize={stat.valueSize} 
              />
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-8 border-b border-slate-200 mb-6">
            {["team","overview", "settings"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-4 text-sm font-semibold capitalize relative ${
                  tab === t ? "text-indigo-600" : "text-slate-400"
                }`}
              >
                {t}
                {tab === t && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm min-h-[200px]">
           
                       {tab === "team" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="font-bold text-lg">Department Team</h3>
                   <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase">
                      {employees.length} Members
                   </span>
                </div>
                {employees.length === 0 ? (
                   <p className="text-slate-400 text-sm italic py-10 text-center">No employees assigned to this department yet.</p>
                ) : (
                  <div className="grid gap-3">
                    {employees.map((emp) => (
                      <div key={emp.Emp_id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-slate-50 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{emp.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{emp.designation}</p>
                          </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{emp.Emp_id}</p>
                           <p className="text-[10px] font-bold text-indigo-500 mt-0.5">{emp.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
           
            {tab === "overview" && (
              <div>
                <h3 className="font-bold text-lg mb-2">Department Note</h3>
                <p className="text-slate-600 leading-relaxed italic">
                  "{dept.extral_info}"
                </p>

                <div className="mt-8 pt-8 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                    Quick Actions
                  </h4>
                  <div className="flex gap-3">
                    <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">
                      Generate Report
                    </button>
                    <button className="border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
                      Manage Team
                    </button>
                  </div>
                </div>
              </div>
            )}

            {tab !== "overview" && tab !== "team" && (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm italic">
                Information for {tab} will appear here.
              </div>
            )}
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="lg:w-80">
          <div className="bg-indigo-900 text-indigo-100 p-6 rounded-3xl shadow-xl shadow-indigo-200 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-white mb-2">Quick Stats</h3>
              <p className="text-xs text-indigo-300 mb-6 font-medium">
                Summary of {dept.Dep_name}
              </p>

              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-indigo-800 pb-3">
                  <span className="text-xs font-bold uppercase opacity-60">
                    ID
                  </span>
                  <span className="font-mono text-sm">#{dept.Dep_id}</span>
                </div>
              </div>
            </div>
            {/* Background Decorative Circle */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-800 rounded-full opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
}
