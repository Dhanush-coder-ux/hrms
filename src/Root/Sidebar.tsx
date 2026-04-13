import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  employeeNavigation,
  onboardNavigation,
  AdminPort,
} from "./PanalSidebar";

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const isEmployeeModule = location.pathname.startsWith("/EmployeeManagement");
  const isOnboardModule = location.pathname.startsWith("/onboard");
  const isAdminModule = location.pathname.startsWith("/Admin");

  let currentNav;
  switch (true) {
    case isEmployeeModule:
      currentNav = employeeNavigation;
      break;
    case isOnboardModule:
      currentNav = onboardNavigation;
      break;
    case isAdminModule:
      currentNav = AdminPort;
      break;
    default:
      currentNav = AdminPort;
      break;
  }

  return (
    <aside
      className={`h-full bg-white border-r border-gray-200 flex flex-col relative overflow-hidden
      transition-all duration-300 ease-in-out
      ${isCollapsed ? "w-16" : "w-56"}`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-2.5 top-6 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:bg-blue-50 hover:text-blue-600 transition-all z-20"
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Logo */}
      <div className="h-14 flex items-center px-4 mb-2">
        <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
          G
        </div>
        {!isCollapsed && (
          <span className="ml-2.5 font-semibold text-sm text-gray-800">
            <span className="text-blue-600">HR</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-1">
        {currentNav.map((item) => {
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `flex items-center group relative h-9 rounded-lg transition-colors
    ${
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
    }
    ${isCollapsed ? "justify-center" : "px-3"}`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={18}
                    className={
                      isActive
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-gray-600"
                    }
                  />

                  {!isCollapsed && (
                    <span className="ml-3 text-xs font-medium">
                      {item.label}
                    </span>
                  )}

                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-gray-50 bg-gray-50/50">
        <div
          className={`flex items-center ${isCollapsed ? "justify-center" : "gap-2"}`}
        >
          <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-[10px] text-blue-700 font-bold">
            AR
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-gray-700 truncate">
                Alex Rivera
              </p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                Admin
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
