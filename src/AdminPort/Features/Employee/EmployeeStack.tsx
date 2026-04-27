import { useState } from "react";

import {  User } from "lucide-react";
import { Payrollprovider } from "./Payrollprovider";
import { BasicValues } from "./BasicValues";
import { Backbutton } from "../../../Components/Common/Backbutton";

import EmpidCustom from "./Empid";



export const EmployeeStack = () => {
  const [activeTab, setActiveTab] = useState("Basic Values");


  const menuItems = [
    { id: "Basic Values", icon: "📊" },
    { id: "Payroll Provider", icon: "💸" },
    { id: "Bonus Type", icon: "🎁" },
    {id: "Custom ID", icon: "🛠️" },
  ];


  return (
<div className="flex h-screen text-slate-800 font-sans antialiased">
  
  {/* Sidebar (fixed, no scroll) */}
  <aside className="w-64 h-full border-r border-slate-100 flex flex-col p-4 bg-slate-50/30 overflow-hidden  ">
    <Backbutton/>
    <div className="py-6 px-4">
      <User size={40} className="text-blue-600 bg-indigo-100 rounded-lg mb-4" />
      <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
        Employee Updates
      </h2>
    </div>

    <nav className="space-y-1">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === item.id
              ? "bg-white text-indigo-600 shadow-sm border border-slate-200/50"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <span className="text-lg opacity-80">{item.icon}</span>
          {item.id}
        </button>
      ))}
    </nav>
  </aside>

  {/* Main Content (scrollable) */}
  <main className=" flex-1 h-full overflow-y-auto scrollbar-hide">
    {activeTab === "Basic Values" && <BasicValues />}
    {activeTab === "Payroll Provider" && <Payrollprovider />}
    {activeTab === "Custom Fields" && <EmpidCustom />}
  </main>

</div>
  );
};
