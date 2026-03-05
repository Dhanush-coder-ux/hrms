import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  FileSpreadsheet, 
  Building2,
  ChevronLeft,
  ChevronRight,
  CalendarDays,

  ReceiptIndianRupee
} from "lucide-react"

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navigation = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Employees", path: "/employee", icon: Users },
    { label: "Attendance", path: "/attendance", icon: CalendarCheck },
    { label: "Leaves", path: "/leaves", icon: FileSpreadsheet },
    {label:"Event" , path:"/Events", icon: CalendarDays},
    {label:"Payroll" , path:"/payroll", icon:ReceiptIndianRupee},
    { label: "Department", path: "/department", icon: Building2 }
  ];

  return (
    <aside 
      className={`h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col relative
        ${isCollapsed ? "w-16" : "w-56"}`} 
    >
      {/* Mini Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:bg-blue-50 hover:text-blue-600 transition-all z-20"
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Compact Logo Section */}
      <div className="h-14 flex items-center px-4 mb-2">
        <div className="w-7 h-7 bg-blue-600 rounded shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-sm">
          G
        </div>
        {!isCollapsed && (
          <span className="ml-2.5 font-semibold text-sm text-gray-800 tracking-tight">
          <span className="text-blue-600">HR</span>
          </span>
        )}
      </div>

      {/* Slim Navigation */}
      <nav className="flex-1 px-2 space-y-0.5">
        {navigation.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center group relative h-9 rounded-lg transition-colors 
                ${isActive 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                } ${isCollapsed ? "justify-center" : "px-3"}`}
            >
              <item.icon 
                size={18} 
                className={isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"} 
              />
              
              {!isCollapsed && (
                <span className="ml-3 text-xs font-medium">
                  {item.label}
                </span>
              )}

              {/* Tooltip for Collapsed State */}
              {isCollapsed && (
                <div className="absolute left-14 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Compact User Section */}
      <div className="p-3 border-t border-gray-50 bg-gray-50/50">
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-2"}`}>
          <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-200 shrink-0 flex items-center justify-center text-[10px] text-blue-700 font-bold">
            AR
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-gray-700 truncate line-height-1">Alex Rivera</p>
              <p className="text-[10px] text-gray-400 truncate uppercase tracking-wider">Admin</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};