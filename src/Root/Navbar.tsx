import { Bell, Settings, HelpCircle, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "../Themes/ThemeToggle";

export const Navbar = () => {
  return (
    <nav className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6">

      {/* Left Section: Contextual Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-[13px] font-bold text-slate-700 tracking-tight flex items-center gap-2">
          <Link to="/" className="text-primary hover:opacity-80 transition-opacity"> HRMS </Link> 
          <span className="text-slate-200 font-normal">/</span> 
          <span className="text-slate-400 font-semibold tracking-wider text-[11px] uppercase">Admin Hub</span>
        </h1>
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-4">
        <ThemeToggle />

        {/* Utility Icons */}
        <div className="flex items-center gap-1 border-r border-gray-100 pr-3 mr-1">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
          </button>
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <HelpCircle size={18} />
          </button>
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <Settings size={18} />
          </button>
        </div>

        {/* User Profile Dropdown Toggle */}
        <button className="flex items-center gap-2.5 pl-2 hover:bg-slate-50 p-1.5 rounded-xl transition-all border border-transparent hover:border-slate-100 group">
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold text-slate-700 leading-tight">Admin User</span>
            <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Online</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <UserCircle size={20} />
          </div>
        </button>
      </div>
    </nav>
  );
};