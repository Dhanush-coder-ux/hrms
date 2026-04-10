import { useEffect, useState, useMemo } from "react";
import StatCard from "../../../Components/Common/StatCard.tsx";

import SearchBar from "../../../Components/Common/Searchbar.tsx";
import FilterBar from "../Employee/FilterBar";
import EmployeeTable from "../Employee/EmployeeTable.tsx";
import { Building, Check, User, X } from "lucide-react";
import type { Employee } from "../../../Types/typesEmployeeManagement.tsx";

// employee get endopint

const BASE_URL = import.meta.env.VITE_API_URL;

export const GET_API_URL = `${BASE_URL}/employee/`;



/* ── Page ── */
export default function Employee() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  console.log({BASE_URL})

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(GET_API_URL);
        const data = await res.json();
        console.log("Full API data:", data);
        
        console.log("First item:", JSON.stringify(data[0], null, 2)); // 👈 paste the output here
        setEmployees(data.map((item: any) => item.Employee));
      } catch {
        console.error("Failed to fetch employees");
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
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-sm text-gray-400">Loading employees…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen  pb-12">
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
