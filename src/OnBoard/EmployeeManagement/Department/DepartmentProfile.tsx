import { useState, useEffect } from "react";
import { Backbutton } from "../../../Components/Common/Backbutton";
import StatCard from "../../../Components/Common/StatCard";
import {
  ChevronLeftCircle,
  DollarSign,
  DownloadIcon,
  Locate,
  PersonStandingIcon,
} from "lucide-react";

// Updated type based on your API structure
type DepartmentAPI = {
  id: string;
  dep_name: string;
  head_of_dep: string;
  emp_count: number;
  Task_status: string;
  budget_utilization: string;
  location: string;
  extral_info: string;
};

export default function DepartmentProfile() {
  const [departments, setDepartments] = useState<DepartmentAPI[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  // 1. Fetch data from your local API
  useEffect(() => {
    fetch("http://localhost:3001/departments")
      .then((res) => res.json())
      .then((data) => {
        setDepartments(data);
        if (data.length > 0) setSelectedId(data[0].id); // Default to first dept
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching departments:", err));
  }, []);

  // Find the currently selected department data
  const dept = departments.find((d) => d.id === selectedId);

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
      value: dept.emp_count.toString(),
      icon: PersonStandingIcon,
      iconBg: "#E0E7FF", // Light Indigo
      iconColor: "#2786FF", // Unga color (Blue tone)
      valueSize: "xl",
    },
    {
      label: "Status",
      value: dept.Task_status,
      icon: ChevronLeftCircle,
      // Dynamic Hash Colors
      iconBg: dept.Task_status === "Completed" ? "#D1FAE5" : "#FEF3C7",
      iconColor: dept.Task_status === "Completed" ? "#059669" : "#D97706",
      valueSize: "xl",
    },
    {
      label: "Budget Used",
      value: dept.budget_utilization,
      icon: DollarSign,
      iconBg: "#F5F3FF", // Light Purple
      iconColor: "#7C3AED", // Vivid Purple
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
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center rounded-2xl shadow-xl text-2xl font-bold">
                {dept.dep_name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {dept.dep_name}
                  <span className="text-slate-400"> - {dept.id}</span>
                </h1>
                <p className="text-slate-500 font-medium">
                  Led by{" "}
                  <span className="text-slate-900">{dept.head_of_dep}</span>
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
                iconBg={stat.iconBg} // Neenga "" nu kuduthu irundhinga
                iconColor={stat.iconColor} // Neenga "" nu kuduthu irundhinga
                valueSize={stat.valueSize} // Neenga "" nu kuduthu irundhinga
              />
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-8 border-b border-slate-200 mb-6">
            {["overview", "resources", "settings"].map((t) => (
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
            {tab !== "overview" && (
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
                Summary of {dept.dep_name}
              </p>

              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-indigo-800 pb-3">
                  <span className="text-xs font-bold uppercase opacity-60">
                    ID
                  </span>
                  <span className="font-mono text-sm">#{dept.id}</span>
                </div>
                <div className="flex justify-between items-center border-b border-indigo-800 pb-3">
                  <span className="text-xs font-bold uppercase opacity-60">
                    Floor
                  </span>
                  <span className="text-sm font-bold">
                    {dept.location.split(",")[0]}
                  </span>
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
