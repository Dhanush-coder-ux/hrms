import { useEffect, useState, useMemo } from "react";
import StatCard from "../../../Components/Common/StatCard.tsx";

import SearchBar from "../../../Components/Common/Searchbar.tsx";
import FilterBar from "../Employee/FilterBar";
import EmployeeTable from "../Employee/EmployeeTable.tsx";
import { Building, Check, User, X } from "lucide-react";
import type { Employee } from "../../../Types/typesEmployeeManagement.tsx";
import { Api_URL } from "../../../APILINK.tsx";

// employee get endopint

const BASE_URL = Api_URL

const EMPLOYEE_API = `${BASE_URL}/employee/`;
const DEPARTMENT_API = `${BASE_URL}/departments/`;



export default function Employee() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  console.log({BASE_URL})


 useEffect(() => {
  (async () => {
    try {
      const [empRes, deptRes] = await Promise.all([
        fetch(EMPLOYEE_API),
        fetch(DEPARTMENT_API),
      ]);

      const empData = await empRes.json();
      const deptData = await deptRes.json();

      console.log("EMP:", empData);
      console.log("DEPT:", deptData);

      /* Create Department Map */
      const deptMap = new Map(
        deptData.map((dept: any) => [
          dept.Dep_name,
          dept,
        ])
      );

      /* Merge Employee + Department */
     const mergedEmployees = empData.map((item: any) => ({
  ...item.Employee,
  departmentData:
    deptMap.get(item.Employee.Department) || null,
}));

      console.log("Merged:", mergedEmployees);

      setEmployees(mergedEmployees);
    } catch (error) {
      console.error("Failed to fetch employees", error);
    } finally {
      setLoading(false);
    }
  })();
}, []);

  const departments = useMemo(
    () => ["All", ...Array.from(new Set(employees.map((e) => e.Department)))],
    [employees],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return employees.filter((emp) => {
      if (
        q &&
        !emp.name.toLowerCase().includes(q) &&
        !emp.Emp_id.toLowerCase().includes(q)
      )
        return false;
      if (filterDept !== "All" && emp.Department !== filterDept) return false;
      return true;
    });
  }, [employees, search, filterDept]);

  const activeCount = employees.filter((e) => e.Status === "Active").length;
  const inactiveCount = employees.filter((e) => e.Status === "Inactive").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-50">
        <p className="text-sm text-gray-400">Loading employees…</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar pb-12">
      {/* ── Page Header ── */}
      <div className="px-8 pt-8">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
          Employee Directory
        </h1>
        <p className="text-sm text-gray-400 mt-1">Manage company workforce</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-8 mt-6">
        <StatCard
          label="Total Employees"
          value={employees.length}
          icon={User}
          iconBg="#EFF6FF"
          iconColor="#23a1a1"
          valueSize="2xl"
        />
        <StatCard
          label="Active"
          value={activeCount}
          icon={Check}
          iconBg="#DCFCE7"
          iconColor="#2dc24d"
          valueSize="2xl"
        />
        <StatCard
          label="Inactive"
          value={inactiveCount}
          icon={X}
          iconBg="#FEE2E2"
          iconColor="#f51625"
          valueSize="2xl"
        />
        <StatCard
          label="Departments"
          value={departments.length - 1}
          icon={Building}
          iconBg="#F0FDF4"
          iconColor="#04498a"
          valueSize="2xl"
        />
      </div>

      {/* ── Toolbar: Search + Filter on same line ── */}
      <div className="flex items-center gap-3 px-8 mt-5">
        <SearchBar value={search} onChange={setSearch} />
        <FilterBar
          departments={departments}
          value={filterDept}
          onChange={setFilterDept}
        />
      </div>

      {/* ── Table ── */}
      <div className="px-8 mt-4">
        <EmployeeTable employees={filtered} />
      </div>
    </div>
  );
}
