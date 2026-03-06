import { Bell, Settings, HelpCircle, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="border-b border-gray-200 bg-white flex items-center justify-between px-6 mt-1">
      
      {/* Left Section: Contextual Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-semibold text-gray-700 tracking-tight">
         <Link to="/"> HRMS </Link> <span className="text-gray-400 font-normal mx-2">/</span> Admin Panel
        </h1>
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-2">
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
        <button className="flex items-center gap-2 pl-2 hover:bg-gray-50 p-1 rounded-lg transition-colors border border-transparent hover:border-gray-100">
          <div className="flex flex-col text-right">
            <span className="text-xs font-semibold text-gray-700 leading-tight">Admin User</span>
            <span className="text-[10px] text-green-600 font-medium">Online</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
            <UserCircle size={20} />
          </div>
        </button>
      </div>
    </nav>
  );
};