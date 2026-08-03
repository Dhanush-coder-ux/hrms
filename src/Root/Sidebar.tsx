import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate, Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  UserPlus,
  UserCheck,
  UserMinus,
  LayoutDashboard,
  Shield,
  Lock,
  LogOut,
  Sparkles,
  X,
  ArrowLeft,
  Grid,
} from "lucide-react";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import {
  employeeNavigation,
  onboardNavigation,
  AdminPort,
  OffboardNavigation,
} from "./PanalSidebar";
import { useAuth } from "../auth/AuthContext";
import { UserAvatar } from "../Components/Common/UserAvatar";

interface ModuleConfig {
  key: string;
  label: string;
  path: string;
  icon: any;
  navItems: any[];
}

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar = ({ isMobileOpen = false, onCloseMobile }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, canAccessModule, logout } = useAuth();

  const isMainHub = location.pathname === "/";

  // Close mobile sidebar automatically whenever location changes
  useEffect(() => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  }, [location.pathname]);

  const modules: ModuleConfig[] = [
    {
      key: "overview",
      label: "Main Hub Overview",
      path: "/",
      icon: LayoutDashboard,
      navItems: [
        { label: "Overview Dashboard", path: "/", icon: LayoutDashboard },
      ],
    },
    {
      key: "EmployeeManagement",
      label: "Employee Mgmt",
      path: "/EmployeeManagement/employee",
      icon: UserCheck,
      navItems: employeeNavigation,
    },
    {
      key: "onboard",
      label: "Onboarding",
      path: "/onboard/Candidates",
      icon: UserPlus,
      navItems: onboardNavigation,
    },
    {
      key: "offboard",
      label: "Offboarding",
      path: "/offboard/requests",
      icon: UserMinus,
      navItems: OffboardNavigation,
    },
    {
      key: "Admin",
      label: "Admin Controls",
      path: "/Admin/departmentstacks",
      icon: MdOutlineAdminPanelSettings,
      navItems: AdminPort,
    },
  ];

  // Determine active module based on location pathname
  const currentPath = location.pathname.toLowerCase();
  const activeModule = modules.find((m) => {
    if (m.path === "/") return currentPath === "/";
    const prefix = (
      m.key === "EmployeeManagement" ? "/employeemanagement" :
      m.key === "onboard" ? "/onboard" :
      m.key === "offboard" ? "/offboard" :
      m.key === "Admin" ? "/admin" :
      m.path
    ).toLowerCase();
    return currentPath.startsWith(prefix);
  }) || modules[0];

  const handleModuleClick = (mod: ModuleConfig) => {
    if (!canAccessModule(mod.key)) return;
    navigate(mod.path);
  };

  const displayName = user?.email ? user.email.split("@")[0] : "User";
  const userRole = user?.role || "employee";

  const sidebarContent = (
    <aside
      className={`h-full bg-white border-r border-slate-200 flex flex-col relative overflow-hidden
      transition-all duration-300 ease-in-out z-20 shadow-xs
      ${isCollapsed ? "w-16" : "w-60"}`}
    >
      {/* Desktop Collapse Toggle Button (hidden on mobile) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden md:flex absolute -right-2.5 top-6 bg-white border border-slate-200 rounded-full p-1 shadow-sm hover:bg-primary/5 hover:text-primary transition-all z-30 cursor-pointer"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Brand Logo Header */}
      <div className="h-14 flex items-center px-4 border-b border-slate-100 flex-shrink-0 justify-between">
        <Link to="/" className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white text-xs font-black shadow-md shadow-primary/20 shrink-0">
            HR
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <span className="font-extrabold text-sm text-slate-800 tracking-tight block truncate">
                Apex <span className="text-primary">HRMS</span>
              </span>
            </div>
          )}
        </Link>

        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main Mode 1: When user is on MAIN PAGE ("/") -> Show Module Selector List */}
      {isMainHub ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {!isCollapsed && (
            <div className="px-3 pt-3 pb-1.5 flex items-center justify-between flex-shrink-0">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Modules & System Portals
              </p>
              <Grid size={12} className="text-primary/60" />
            </div>
          )}

          <nav className="flex-1 px-2 py-2 space-y-1.5 overflow-y-auto">
            {modules.map((mod) => {
              const isAccessible = canAccessModule(mod.key);
              const isSelected = activeModule.key === mod.key;

              return (
                <button
                  key={mod.key}
                  onClick={() => handleModuleClick(mod)}
                  disabled={!isAccessible}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer group ${
                    isSelected
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : isAccessible
                      ? "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100"
                      : "bg-slate-50/50 text-slate-400 opacity-50 cursor-not-allowed border border-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <mod.icon size={16} />
                    </div>
                    {!isCollapsed && (
                      <span className="truncate tracking-tight">
                        {mod.label}
                      </span>
                    )}
                  </div>
                  {!isCollapsed && !isAccessible && (
                    <Lock size={13} className="text-slate-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      ) : (
        /* Main Mode 2: When user clicked inside ANY MODULE -> Show ONLY THAT MODULE'S NAV ITEMS */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Back to Main Hub Banner */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/70 flex-shrink-0">
            {!isCollapsed ? (
              <button
                onClick={() => navigate("/")}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-primary/40 hover:text-primary transition-all cursor-pointer group text-xs font-bold text-slate-700"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <ArrowLeft size={14} className="text-primary group-hover:-translate-x-0.5 transition-transform" />
                  <span className="truncate">Main Hub</span>
                </div>
                <span className="text-[10px] font-extrabold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-md">
                  Module
                </span>
              </button>
            ) : (
              <div className="flex justify-center py-1">
                <button
                  onClick={() => navigate("/")}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-primary hover:text-white transition-colors cursor-pointer"
                  title="Return to Main Hub"
                >
                  <ArrowLeft size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Module Nav Items Title */}
          {!isCollapsed && (
            <div className="px-3 pt-3 pb-1 flex-shrink-0 flex items-center justify-between">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                {activeModule.label} Navigation
              </p>
              <Sparkles size={12} className="text-primary/60" />
            </div>
          )}

          {/* Active Module Sub-Items Nav */}
          <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
            {activeModule.navItems.map((item) => {
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center group relative h-10 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-white font-bold shadow-md shadow-primary/20"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
                    } ${isCollapsed ? "justify-center" : "px-3"}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        size={18}
                        className={`transition-all duration-200 group-hover:scale-110 ${
                          isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-slate-700"
                        }`}
                      />

                      {!isCollapsed && (
                        <span className="ml-3 text-xs tracking-tight transition-colors">
                          {item.label}
                        </span>
                      )}

                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl pointer-events-none">
                          {item.label}
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      )}

      {/* User Footer Section */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/70 flex-shrink-0">
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "justify-between gap-2"
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <UserAvatar name={displayName} size="sm" variant="solid" />
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate capitalize">
                  {displayName}
                </p>
                <p className="text-[10px] text-primary font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <Shield size={10} /> {userRole}
                </p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={15} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop View (md and above) */}
      <div className="hidden md:flex h-full">{sidebarContent}</div>

      {/* Mobile Drawer (screens < md) */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Overlay Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Sliding Panel */}
          <div className="relative z-50 h-full flex">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
