import { Edit3, Trash2, Users, LayoutGrid, List, ArrowUpRight } from "lucide-react";
import { SearchQuery } from "../../../Components/Common/Search";
import { Button } from "../../../Components/Common/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Department = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const departments = [
    { id: 1, name: "IT & Infrastructure", head: "Jane Smith", count: 25, color: "bg-blue-500", status: "Active", budget: "85%" },
    { id: 2, name: "Human Resources", head: "Michael Ross", count: 12, color: "bg-purple-500", status: "Active", budget: "40%" },
    { id: 3, name: "Marketing", head: "Sarah Chen", count: 18, color: "bg-rose-500", status: "On Leave", budget: "65%" },
  ];

  const filtered = departments.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Total workforce calculation
  const totalEmployees = departments.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen font-sans">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Department Directory</h2>
          <p className="text-sm text-gray-500 mt-1">Overview of {departments.length} functional units within the organization.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-2 py-1 w-72 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <SearchQuery S1={searchQuery} S2={setSearchQuery} />
          </div>
          <Button B_name="+ Create New" ClickToAction={() => alert("Open Modal")} />
        </div>
      </div>

      {/* 2. Stats Cards (New Feature) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Depts", value: departments.length, icon: <LayoutGrid size={18}/>, color: "text-blue-600" },
          { label: "Total Staff", value: totalEmployees, icon: <Users size={18}/>, color: "text-green-600" },
          { label: "Avg. Size", value: Math.round(totalEmployees/departments.length), icon: <List size={18}/>, color: "text-purple-600" },
          { label: "Budget Utilization", value: "72%", icon: <ArrowUpRight size={18}/>, color: "text-orange-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl text-gray-400">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* 3. Table Container */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full border-separate border-spacing-0">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-400 border-b border-gray-100">Department</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-400 border-b border-gray-100">Head of Dept</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-400 border-b border-gray-100">Workforce</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-400 border-b border-gray-100">Status</th>
              <th className="px-6 py-4 text-right text-xs font-bold uppercase text-gray-400 border-b border-gray-100">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((dept) => (
              <tr 
                key={dept.id} 
                onClick={() => navigate(`/departments/${dept.id}`)}
                className="group hover:bg-blue-50/30 transition-all cursor-pointer"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 ${dept.color} rounded-xl flex items-center justify-center text-white font-bold shadow-md transform group-hover:scale-110 transition-transform`}>
                      {dept.name.charAt(0)}
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-gray-800">{dept.name}</span>
                      <span className="text-[11px] text-gray-400 font-medium">ID: DEPT-0{dept.id}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold border-2 border-white ring-1 ring-gray-100">
                      {dept.head.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{dept.head}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="w-full max-w-[100px]">
                    <div className="flex justify-between text-[10px] mb-1 font-bold text-gray-500">
                      <span>{dept.count} members</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full ${dept.color}`} style={{ width: dept.budget }}></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                   <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                     dept.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                   }`}>
                     {dept.status}
                   </span>
                </td>
                <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white shadow-sm border border-transparent hover:border-gray-100 rounded-lg transition-all">
                      <Edit3 size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-white shadow-sm border border-transparent hover:border-gray-100 rounded-lg transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <div className="inline-flex p-4 bg-gray-50 rounded-full mb-4">
               <SearchQuery S1="hi" S2={() => {}} />
            </div>
            <h3 className="text-gray-800 font-bold">No results found</h3>
            <p className="text-gray-400 text-sm">We couldn't find any department matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
};