import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../../../Components/Common/StatCard";
import StageFilter from "../../../Components/Common/StageFilter";
import SearchBar from "../../../Components/Common/Searchbar";

import { Building, Check, User, X, TrendingUp } from "lucide-react";
import { Api_URL } from "../../../APILINK";
import EmployeeTable from "../Employee/EmployeeTable";
import type { Employee } from "../../../Types/typesEmployeeManagement";

const BASE_URL = Api_URL;
const EMPLOYEE_API = `${BASE_URL}/employee/`;
const DEPARTMENT_API = `${BASE_URL}/departments/`;

export default function EmployeeComponent() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [empRes, deptRes] = await Promise.all([
          fetch(EMPLOYEE_API),
          fetch(DEPARTMENT_API),
        ]);

        if (!empRes.ok || !deptRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const empData = await empRes.json();
        const deptData = await deptRes.json();

        const deptMap = new Map(
          deptData.map((dept: any) => [dept.Dep_name, dept])
        );

        const mergedEmployees: Employee[] = empData.map((item: any) => ({
          Emp_id: item.Employee?.Emp_id || "",
          name: item.Employee?.name || "",
          email: item.Employee?.email || "",
          phone: item.Employee?.phone || "",
          Department: item.Employee?.Department || "",
          designation: item.Employee?.designation || "",
          Status: (item.Employee?.Status || "Inactive") as "Active" | "Inactive",
          dateOfJoining: item.Employee?.dateOfJoining || "",
          departmentData: deptMap.get(item.Employee?.Department) || null,
        }));

        setEmployees(mergedEmployees);
      } catch (error) {
        console.error("Failed to fetch employees", error);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const departments = useMemo(
    () => Array.from(new Set(employees.map((e) => e.Department).filter(Boolean))),
    [employees]
  );

  const deptCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    employees.forEach((emp) => {
      if (emp.Department) {
        counts[emp.Department] = (counts[emp.Department] || 0) + 1;
      }
    });
    return counts;
  }, [employees]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return employees.filter((emp) => {
      if (
        q &&
        !emp.name?.toLowerCase().includes(q) &&
        !emp.Emp_id?.toLowerCase().includes(q)
      )
        return false;
      if (filterDept && emp.Department !== filterDept) return false;
      return true;
    });
  }, [employees, search, filterDept]);

  const activeCount = employees.filter(
    (e) => e.Status?.toLowerCase() === "active"
  ).length;
  const inactiveCount = employees.filter(
    (e) => e.Status?.toLowerCase() === "inactive"
  ).length;

  const handleRowClick = (emp: Employee) => {
    navigate(`/EmployeeManagement/employee/${emp.Emp_id}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-50 gap-4">
        <div className="w-8 h-8 border-[3px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">
          Loading employees…
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-slate-50/50 p-10 font-sans custom-scrollbar">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-6 mb-10 flex-wrap">
        <div className="flex flex-col">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full mb-2.5 w-fit">
            <TrendingUp size={12} />
            <span>Personnel Hub</span>
          </div>
          <h1 className="text-[2rem] font-extrabold text-slate-900 tracking-tight mb-1.5 leading-none">
            Employee Directory
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            Manage and monitor company workforce of {employees.length} members
          </p>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Employees"
          value={employees.length}
          icon={User}
          iconBgClass="bg-blue-50"
          iconColorClass="text-blue-500"
          valueColorClass="text-blue-600"
          subText="Active personnel"
        />
        <StatCard
          label="Active"
          value={activeCount}
          icon={Check}
          iconBgClass="bg-emerald-50"
          iconColorClass="text-emerald-500"
          valueColorClass="text-emerald-600"
          subText="Currently on-duty"
        />
        <StatCard
          label="Inactive"
          value={inactiveCount}
          icon={X}
          iconBgClass="bg-rose-50"
          iconColorClass="text-rose-500"
          valueColorClass="text-rose-600"
          subText="Offboarded/Away"
        />
        <StatCard
          label="Departments"
          value={departments.length > 0 ? departments.length - 1 : 0}
          icon={Building}
          iconBgClass="bg-violet-50"
          iconColorClass="text-violet-500"
          valueColorClass="text-violet-600"
          subText="Functional units"
        />
      </div>

      <div className="flex justify-between gap-4 mb-6 items-center">
        <StageFilter
          stages={departments}
          selectedStage={filterDept}
          onStageChange={setFilterDept}
          counts={deptCounts}
          totalCount={employees.length}
          className=""
        />
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-[20px] border-[1.5px] border-slate-100">
        <div className="flex items-center justify-between p-[18px_24px] border-b border-slate-50">
          <div className="flex items-center gap-2 font-extrabold text-[12px] tracking-wider uppercase text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            Personnel List
          </div>
          <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        <EmployeeTable employees={filtered} onRowClick={handleRowClick} />
      </div>


      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}