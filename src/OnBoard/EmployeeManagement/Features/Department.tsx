import { Users, LayoutGrid, List, ArrowUpRight, TrendingUp, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DepTable, type Column } from "../Components/table/DepartmentTable";
import PageLoading from "../../../Components/Common/PageLoading";
import type { Department as IDepartment } from "../Department/types";
import { Api_URL } from "../../../APILINK";
import StatCard from "../../../Components/Common/StatCard";
import { empMangeTheme } from "../../../Themes/EmpMangeTheme/empMangeConfig";


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

  const columns: Column[] = [
    { header: "Department Name", accessor: "Dep_name" },
    { header: "Head of Dept.", accessor: "Dep_head" },
    { header: "Employees", accessor: "Total_employees" },
    { header: "", type: "action" },
  ];

  if (loading) return <PageLoading />;

  return (
    <div className={empMangeTheme.layout.mainContainer}>
      {/* HEADER */}
      <div className={empMangeTheme.header.wrapper}>
        <div className="flex flex-col">
          <div className={empMangeTheme.header.pill}>
            <TrendingUp size={12} />
            <span>Organization Hub</span>
          </div>
          <h1 className={empMangeTheme.header.title}>Departments</h1>
          <p className={empMangeTheme.header.subtitle}>
            Managing {departments.length} functional organizational units
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              className="h-[42px] w-[240px] pl-10 pr-3.5 rounded-xl border-[1.5px] border-slate-200 bg-white text-sm font-medium text-slate-900 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-slate-300"
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            className="inline-flex items-center gap-2 h-[42px] px-[18px] bg-primary text-white border-none rounded-xl text-sm font-bold tracking-tight cursor-pointer transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-primary/20"
            onClick={() => navigate("/Admin/departmentstacks")}
          >
            + Create Dept
          </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Depts"
          value={departments.length}
          icon={LayoutGrid}
          iconBgClass="bg-blue-50"
          iconColorClass="text-blue-500"
          valueColorClass="text-blue-600"
          subText="Active units"
        />
        <StatCard
          label="Total Staff"
          value={totalEmployees}
          icon={Users}
          iconBgClass="bg-emerald-50"
          iconColorClass="text-emerald-500"
          valueColorClass="text-emerald-600"
          subText="Across all depts"
        />
        <StatCard
          label="Avg. Size"
          value={avgSize}
          icon={List}
          iconBgClass="bg-violet-50"
          iconColorClass="text-violet-500"
          valueColorClass="text-violet-600"
          subText="Staff per dept"
        />
        <StatCard
          label="Growth"
          value="12%"
          icon={ArrowUpRight}
          iconBgClass="bg-amber-50"
          iconColorClass="text-amber-500"
          valueColorClass="text-amber-600"
          subText="Vs last quarter"
        />
      </div>

      {/* TABLE CARD */}
      <div className={empMangeTheme.section.card}>
        <div className={empMangeTheme.section.header}>
          <div className={empMangeTheme.section.title}>
            <span className={empMangeTheme.section.titleDot} />
            All Departments
          </div>
          <span className={empMangeTheme.section.countBadge}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        <DepTable
          columns={columns}
          TB={filtered}
          onEdit={(row: any) =>
            navigate(`/EmployeeManagement/departmentProfile/${row.Dep_id}`)
          }
        />
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

