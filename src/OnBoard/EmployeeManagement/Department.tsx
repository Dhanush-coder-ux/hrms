import { Plus, Edit3, Trash2, Users, MoreVertical } from "lucide-react";
import { SearchQuery } from "../../Components/Common/Search";
import { Button } from "../../Components/Common/Button";
import { useState } from "react";

export const Department = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const departments = [
    { id: 1, name: "IT & Infrastructure", head: "Jane Smith", count: 25, color: "bg-blue-500" },
    { id: 2, name: "Human Resources", head: "Michael Ross", count: 12, color: "bg-purple-500" },
    { id: 3, name: "Marketing", head: "Sarah Chen", count: 18, color: "bg-rose-500" },
  ];

  const filtered = departments.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#f8f9fa] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">Departments</h2>
          <p className="text-xs text-gray-500 mt-1">Manage organizational units and department heads</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="border border-gray-200 rounded-lg bg-white px-1 py-0.5 w-64">
            <SearchQuery S1={searchQuery} S2={setSearchQuery} />
          </div>
          <Button B_name="+ Add Department" ClickToAction={() => {}} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full border-separate border-spacing-0">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">Department</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">Head of Dept.</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">Total Employees</th>
              <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((dept) => (
              <tr key={dept.id} className="group hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${dept.color} rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
                      {dept.name.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{dept.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] font-medium text-gray-600">
                      {dept.head.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <span className="text-sm text-gray-600">{dept.head}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <Users size={14} className="text-gray-400" />
                    {dept.count} Members
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                      <Edit3 size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                      <Trash2 size={16} />
                    </button>
                    <button className="p-2 text-gray-300 hover:text-gray-600">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between px-2">
        <p className="text-xs text-gray-400">Showing {filtered.length} of {departments.length} departments</p>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-xs border border-gray-200 rounded bg-white text-gray-400 cursor-not-allowed">Previous</button>
          <button className="px-3 py-1 text-xs border border-gray-200 rounded bg-white text-gray-600 hover:bg-gray-50 transition-colors">Next</button>
        </div>
      </div>
    </div>
  );
};
