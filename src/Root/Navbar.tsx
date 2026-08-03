import { Bell, Settings, HelpCircle, LogOut, ChevronRight, Menu } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ThemeToggle } from "../Themes/ThemeToggle";
import { useAuth } from "../auth/AuthContext";
import {
  employeeNavigation,
  onboardNavigation,
  AdminPort,
  OffboardNavigation,
} from "./PanalSidebar";

interface NavbarProps {
  onToggleMobile?: () => void;
}

export const Navbar = ({ onToggleMobile }: NavbarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = user?.email ? user.email.split("@")[0] : "User";
  const roleDisplay = user?.role || "Employee";

  // Breadcrumb generator logic based on location.pathname
  const getBreadcrumbs = () => {
    const path = location.pathname;

    if (path === "/") {
      return { module: "Main Hub", page: "Dashboard" };
    }

    if (path.startsWith("/EmployeeManagement")) {
      const match = employeeNavigation.find((item) => item.path === path);
      const pageLabel = match ? match.label : "Dashboard";
      return { module: "Employee Mgmt", page: pageLabel };
    }

    if (path.startsWith("/onboard")) {
      const match = onboardNavigation.find((item) => item.path === path);
      const pageLabel = match ? match.label : "Dashboard";
      return { module: "Onboarding", page: pageLabel };
    }

    if (path.startsWith("/offboard")) {
      const match = OffboardNavigation.find((item) => item.path === path);
      const pageLabel = match ? match.label : "Dashboard";
      return { module: "Offboarding", page: pageLabel };
    }

    if (path.startsWith("/Admin")) {
      const match = AdminPort.find((item) => item.path === path || item.path === path.substring(1));
      const pageLabel = match ? match.label : "Dashboard";
      return { module: "Admin Controls", page: pageLabel };
    }

    return { module: "HRMS Portal", page: "" };
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-3 sm:px-6 z-30 shadow-xs flex-shrink-0">

      {/* Left Section: Mobile Hamburger Toggle + Dynamic Breadcrumbs */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Mobile Hamburger Button (visible on < md screens) */}
        <button
          onClick={onToggleMobile}
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shrink-0"
          title="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        {/* Breadcrumb Path */}
        <div className="flex items-center gap-1.5 text-xs font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
          <Link to="/" className="text-primary font-bold hover:opacity-80 transition-opacity tracking-tight shrink-0">
            HRMS
          </Link>
          
          {breadcrumbs.module && (
            <>
              <ChevronRight size={13} className="text-slate-300 shrink-0" />
              <span className="font-bold text-slate-700 tracking-tight truncate">
                {breadcrumbs.module}
              </span>
            </>
          )}

          {breadcrumbs.page && (
            <>
              <ChevronRight size={13} className="text-slate-300 shrink-0 hidden sm:inline" />
              <span className="font-semibold text-slate-500 tracking-tight truncate hidden sm:inline">
                {breadcrumbs.page}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <ThemeToggle />

        {/* Utility Icons (Hidden on extra small screens for clean mobile layout) */}
        <div className="hidden sm:flex items-center gap-1 border-r border-slate-200 pr-3">
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative cursor-pointer" title="Notifications">
            <Bell size={18} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors cursor-pointer" title="Help">
            <HelpCircle size={18} />
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors cursor-pointer" title="Settings">
            <Settings size={18} />
          </button>
        </div>

        {/* User Profile Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex flex-col text-right max-w-[100px] sm:max-w-none truncate">
            <span className="text-xs font-bold text-slate-800 leading-tight capitalize truncate">
              {displayName}
            </span>
            <span className="text-[9px] sm:text-[10px] text-primary font-extrabold uppercase tracking-wider">
              {roleDisplay}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer border border-slate-200"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
};