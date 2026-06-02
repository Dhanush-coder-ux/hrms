import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Api_URL } from "../../../APILINK";
import { empMangeTheme } from "../../../Themes/EmpMangeTheme/empMangeConfig";

import { Backbutton } from "../../../Components/Common/Backbutton";
import StatCard from "../../../Components/Common/StatCard";
import { UserAvatar } from "../../../Components/Common/UserAvatar";
import {
  ChevronLeftCircle,
  DollarSign,
  PersonStandingIcon,
} from "lucide-react";
import { 
  FaFireExtinguisher, 
  FaUserTie, 
  FaLaptopCode, 
  FaTools, 
  FaBuilding, 
  FaStethoscope 
} from "react-icons/fa";

const ICON_MAP: any = {
  FaFireExtinguisher: FaFireExtinguisher,
  FaUserTie: FaUserTie,
  FaLaptopCode: FaLaptopCode,
  FaTools: FaTools,
  FaBuilding: FaBuilding,
  FaStethoscope: FaStethoscope,
};

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
  const navigate = useNavigate();
  const [dept, setDept] = useState<DepartmentAPI | null>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    if (!id) return;

    // Fetch Department Info
    fetch(`${Api_URL}/departments/${id}`)
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
    fetch(`${Api_URL}/departments/${id}/employees`)
      .then((res) => res.json())
      .then((data) => {
        console.log("EMP DATA:", data);

        if (Array.isArray(data)) {
          setEmployees(data);
        } else if (data.employees) {
          setEmployees(data.employees);
        } else {
          setEmployees([]);
        }
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
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Status",
      value: dept.Task_status || "Active",
      icon: ChevronLeftCircle,
      iconBg: dept.Task_status === "Completed" ? "bg-emerald-50" : "bg-amber-50",
      iconColor: dept.Task_status === "Completed" ? "text-emerald-600" : "text-amber-600",
    },
    {
      label: "Budget Used",
      value: dept.budget_utilization || "0%",
      icon: DollarSign,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    }
  ];

  return (
    <div className={empMangeTheme.layout.mainContainer}>
      {/* Sidebar/Selector (Optional: to switch between depts) */}
      <div className="flex gap-2 overflow-x-auto">
        <Backbutton />
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-5">
              {(() => {
                const IconObj = ICON_MAP[dept.Dep_icon] || FaBuilding;
                return (
                  <div
                    className="w-16 h-16 flex items-center justify-center rounded-2xl shadow-xl text-2xl font-bold"
                    style={{ backgroundColor: dept.bg_color, color: dept.icon_color }}
                  >
                    <IconObj size={32} />
                  </div>
                );
              })()}
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
                iconBgClass={stat.iconBg}
                iconColorClass={stat.iconColor}
              />
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-8 border-b border-slate-100 mb-8">
            {["team", "overview", "settings"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-4 text-sm font-bold capitalize relative tracking-tight transition-all duration-200 ${tab === t ? "text-primary" : "text-slate-400"
                  }`}
              >
                {t}
                {tab === t && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm min-h-[200px]">

            {tab === "team" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-extrabold text-lg tracking-tight">Department Team</h3>
                  <span className="text-[10px] font-black text-primary bg-primary/5 border border-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">
                    {employees.length} Members
                  </span>
                </div>
                {employees.length === 0 ? (
                  <p className="text-slate-400 text-sm italic py-10 text-center">No employees assigned to this department yet.</p>
                ) : (
                  <div className="grid gap-3">
                    {employees.map((emp, index) => (
                      <div
                        key={emp.Emp_id || index}
                        className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:bg-primary/5 hover:shadow-md transition-all group cursor-pointer"
                        onClick={() => navigate(`/EmployeeManagement/employee/${emp.Emp_id}`)}
                      >
                        <div className="flex items-center gap-4">
                          <UserAvatar 
                            name={emp.name || "Unknown"} 
                            size="md" 
                            variant="table"
                            className="rounded-xl"
                          />

                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {emp.name || "Unknown Employee"}
                            </p>

                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                              {emp.designation || "No Designation"}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {emp.Emp_id}
                          </p>

                          <p className="text-[10px] font-bold text-primary mt-0.5">
                            {emp.email || "No Email"}
                          </p>
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
                    <button className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-95">
                      Generate Report
                    </button>
                    <button 
                      className="border border-slate-200 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all active:scale-95"
                      onClick={() => setTab("team")}
                    >
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
          <div className="bg-primary p-8 rounded-[32px] shadow-xl shadow-primary/10 relative overflow-hidden text-white">
            <div className="relative z-10">
              <h3 className="font-extrabold text-white text-lg mb-1">Quick Stats</h3>
              <p className="text-xs text-white/60 mb-8 font-bold uppercase tracking-widest">
                Summary of {dept.Dep_name}
              </p>

              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-[10px] font-black uppercase opacity-40 tracking-widest">
                    ID
                  </span>
                  <span className="font-mono text-sm font-bold tracking-tight">#{dept.Dep_id}</span>
                </div>
              </div>
            </div>
            {/* Background Decorative Circle */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
