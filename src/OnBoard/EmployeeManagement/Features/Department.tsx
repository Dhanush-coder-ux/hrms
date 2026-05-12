import { Users, LayoutGrid, List, ArrowUpRight } from "lucide-react";

import { Button } from "../../../Components/Common/Button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DepTable } from "../Components/table/DepartmentTable";
import PageLoading from "../../../Components/Common/PageLoading";
import type { Department as IDepartment } from "../Department/types";
import SearchBar from "../../../Components/Common/Searchbar";
import { Api_URL } from "../../../APILINK";


export const Department = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${Api_URL}/departments/`);
        if (!response.ok) throw new Error("Server connection failed");

        const data = await response.json();
        // Since your data is a raw array: [{}, {}]
        setDepartments(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = departments.filter((d) =>
    (d.Dep_name || d.dep_name)?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalEmployees = departments.reduce(
    (acc, curr) => acc + (Number(curr.Total_employees || curr.emp_count) || 0),
    0,
  );
  const avgSize =
    departments.length > 0
      ? Math.round(totalEmployees / departments.length)
      : 0;

  const Column = [
    { header: "Department Name", accessor: "Dep_name" },
    { header: "Head of Dept.", accessor: "Dep_head" },
    { header: "Employees", accessor: "Total_employees" },
    { header: "Profile", type: "action" },
  ];

  if (loading) return <PageLoading />;

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
            Department Hub
          </h2>
          <p className="text-sm text-gray-500">
            Managing {departments.length} functional organizational units.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          <Button
            B_name="+ Create"
            ClickToAction={() => navigate("/Admin/departmentstacks")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: "Total Depts",
            value: departments.length,
            icon: <LayoutGrid size={20} />,
            color: "text-blue-600",
          },
          {
            label: "Total Staff",
            value: totalEmployees,
            icon: <Users size={20} />,
            color: "text-emerald-600",
          },
          {
            label: "Avg. Size",
            value: avgSize,
            icon: <List size={20} />,
            color: "text-violet-600",
          },
          {
            label: "Budget Used",
            value: "72%",
            icon: <ArrowUpRight size={20} />,
            color: "text-amber-600",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {stat.label}
              </p>
              <p className={`text-2xl font-black mt-1 ${stat.color}`}>
                {stat.value}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl text-gray-400">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <DepTable
          columns={Column}
          TB={filtered}
          getStatusColor={(status: string) => {
            switch (status) {
              case "Active":
                return "text-emerald-600 bg-emerald-50 border-emerald-100";
              case "In Progress":
                return "text-blue-600 bg-blue-50 border-blue-100";
              case "On Hold":
                return "text-amber-600 bg-amber-50 border-amber-100";
              case "Completed":
                return "text-violet-600 bg-violet-50 border-violet-100";
              default:
                return "text-gray-400 bg-gray-50 border-gray-100";
            }
          }}
          onEdit={(row: any) =>
            navigate(`/EmployeeManagement/departmentProfile/${row.Dep_id}`)
          }
        />
      </div>
    </div>
  );
};
