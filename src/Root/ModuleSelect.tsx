import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  UserMinus,
  UserCheck,
  Users,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Clock,
  Briefcase,
  AlertCircle,
  Lock,
  Sparkles,
  User,
  Key,
  CheckCircle2,
  Mail,
  ShieldAlert,
} from "lucide-react";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { useAuth } from "../auth/AuthContext";
import StatCard from "../Components/Common/StatCard";
import { UserAvatar } from "../Components/Common/UserAvatar";

export const ModuleSelect = () => {
  const navigate = useNavigate();
  const { user, canAccessModule } = useAuth();

  const displayName = user?.email ? user.email.split("@")[0] : "Team Member";
  const userRole = user?.role || "employee";
  const isAdmin = userRole.toLowerCase() === "admin";

  const modules = [
    {
      key: "EmployeeManagement",
      title: "Employee Management",
      description: "Manage workforce, attendance, leaves, events & payroll.",
      icon: UserCheck,
      path: "/EmployeeManagement/employee",
      color: "bg-blue-500/10 text-blue-600 border-blue-200",
      badge: "Core HR Portal",
    },
    {
      key: "onboard",
      title: "Onboarding Portal",
      description: "Recruitment, candidate interviews, job postings & hiring.",
      icon: UserPlus,
      path: "/onboard/Candidates",
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
      badge: "Talent & Hiring",
    },
    {
      key: "offboard",
      title: "Offboarding Portal",
      description: "Exit requests, asset returns, clearance & KT handovers.",
      icon: UserMinus,
      path: "/offboard/requests",
      color: "bg-amber-500/10 text-amber-600 border-amber-200",
      badge: "Exit Clearance",
    },
    {
      key: "Admin",
      title: "Admin Control Center",
      path: "/Admin/departmentstacks",
      description: "Department stacks, poster configs & interview settings.",
      icon: MdOutlineAdminPanelSettings,
      color: "bg-purple-500/10 text-purple-600 border-purple-200",
      badge: "System Admin Only",
    },
  ];

  return (
    <div className="min-h-full bg-slate-50/70 p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 animate-fade-in">
      {/* Welcome Banner - Fully Governed by Active Theme Color */}
      <div className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 relative overflow-hidden shadow-xl shadow-primary/25 animate-scale-up border border-primary/30">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <UserAvatar name={displayName} size="xl" variant="solid" className="shadow-xl ring-4 ring-white/30" />
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-white mb-2 border border-white/30">
                <Sparkles size={14} className="animate-pulse" /> Active {isAdmin ? "Admin" : "HR Manager"} Profile
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white capitalize">
                Welcome, {displayName}!
              </h1>
              <p className="text-white/90 text-xs sm:text-sm mt-1 max-w-xl">
                Signed in as <span className="font-bold text-white uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-xs border border-white/30">{userRole}</span> • Email: <code className="text-white font-mono">{user?.email || "admin@hrms.com"}</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate("/EmployeeManagement/attendance")}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-white hover:bg-slate-100 text-primary rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
            >
              <Clock size={16} /> Log Attendance
            </button>
            <button
              onClick={() => navigate("/EmployeeManagement/employee")}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-white/30 flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
            >
              <Users size={16} /> Directory
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={Users}
          label="Total Workforce"
          value="142"
          subText="+4 joined this month"
          iconBgClass="bg-indigo-50"
          iconColorClass="text-indigo-600"
        />
        <StatCard
          icon={Briefcase}
          label="Active Candidates"
          value="18"
          subText="6 interviews scheduled"
          iconBgClass="bg-emerald-50"
          iconColorClass="text-emerald-600"
        />
        <StatCard
          icon={Clock}
          label="Pending Leaves"
          value="5"
          subText="Requires manager review"
          iconBgClass="bg-amber-50"
          iconColorClass="text-amber-600"
        />
        <StatCard
          icon={ShieldCheck}
          label="System Health"
          value="99.9%"
          subText="Auth & RBAC Active"
          iconBgClass="bg-primary/10"
          iconColorClass="text-primary"
        />
      </div>

      {/* Module Launchpad Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Module Launchpad
            </h2>
            <p className="text-xs text-slate-500">
              Select a module to view portal features and operations
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            RBAC Enabled
          </span>
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((mod) => {
            const hasAccess = canAccessModule(mod.key);
            const Icon = mod.icon;

            return (
              <div
                key={mod.key}
                onClick={() => hasAccess && navigate(mod.path)}
                className={`bg-white rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
                  hasAccess
                    ? "border-slate-200 hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                    : "border-slate-200/60 opacity-60 bg-slate-50/50 cursor-not-allowed"
                }`}
              >
                <div>
                  {/* Top Badge & Access Indicator */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
                      {mod.badge}
                    </span>
                    {!hasAccess && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Lock size={12} /> Restricted
                      </span>
                    )}
                  </div>

                  {/* Icon */}
                  <div className="mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${mod.color} group-hover:scale-105 transition-transform`}>
                      <Icon size={26} />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-slate-800 mb-1.5 group-hover:text-primary transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {mod.description}
                  </p>
                </div>

                {/* Footer Action Link */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>{hasAccess ? "Open Workspace" : "No Permission"}</span>
                  {hasAccess ? (
                    <ArrowRight size={16} className="text-primary group-hover:translate-x-1 transition-transform" />
                  ) : (
                    <Lock size={14} className="text-slate-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overview Bottom Widget Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick System Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" /> System Highlights & Operations
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">Live Status</span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  ON
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">New Employee Onboarding Batch</p>
                  <p className="text-[11px] text-slate-500">4 engineering candidates moving to stage 2 interviews</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">Today</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                  PAY
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Monthly Payroll Calculations</p>
                  <p className="text-[11px] text-slate-500">Department wise salary slip generation completed</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">Yesterday</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xs">
                  OFF
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Offboarding Clearance Review</p>
                  <p className="text-[11px] text-slate-500">Asset return & KT status pending for 1 employee</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">2 days ago</span>
            </div>
          </div>
        </div>

        {/* LOGGED IN USER PROFILE CARD (WHITE THEME CONTAINER WITH ACCENTS) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-primary/40 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                  <User size={16} />
                </div>
                <h3 className="text-sm font-bold text-slate-800 tracking-tight">User Account Profile</h3>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 size={11} /> Active Session
              </span>
            </div>

            {/* Profile Detail White Card with Theme Primary Accent Border */}
            <div className="flex items-center gap-3.5 p-4 bg-white rounded-2xl border border-primary/30 mb-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none" />
              <UserAvatar name={displayName} size="lg" variant="solid" className="shadow-md ring-2 ring-primary/30" />
              <div className="min-w-0 z-10">
                <h4 className="text-sm font-black text-slate-900 truncate capitalize flex items-center gap-1.5">
                  {displayName}
                  <span className="text-[10px] font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20 uppercase">
                    {userRole}
                  </span>
                </h4>
                <p className="text-[11px] text-slate-600 truncate flex items-center gap-1 mt-1 font-medium">
                  <Mail size={12} className="text-primary shrink-0" /> {user?.email || "N/A"}
                </p>
              </div>
            </div>

            {/* Account Metadata List */}
            <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 space-y-2.5 mb-4 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                  <ShieldCheck size={14} className="text-primary" /> Role Privilege:
                </span>
                <span className="font-extrabold text-primary uppercase bg-primary/10 px-2.5 py-0.5 rounded text-[11px] border border-primary/20">
                  {userRole}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                  <Key size={14} className="text-primary" /> Employee ID:
                </span>
                <span className="font-bold text-slate-800 font-mono text-[11px] bg-white px-2.5 py-0.5 rounded border border-slate-200">
                  {user?.emp_id ? `EMP-${user.emp_id}` : isAdmin ? "ADMIN-001" : "HR-001"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                  <ShieldAlert size={14} className="text-emerald-500" /> Portal Status:
                </span>
                <span className="font-extrabold text-emerald-600 text-[11px] bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  Full Authorized
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <AlertCircle size={13} className="text-primary" /> Active Theme Palette
              </div>
              <p className="text-[10px] leading-relaxed text-slate-400">
                User profile card combines a clean white surface with your active theme primary accents.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/EmployeeManagement/employee")}
            className="w-full mt-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/20 cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.02]"
          >
            <span>Manage Employee Directory</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};