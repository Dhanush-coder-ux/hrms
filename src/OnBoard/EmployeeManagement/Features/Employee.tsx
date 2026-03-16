import { useEffect, useState, useMemo } from "react";

import SearchBar    from "../Employee/Searchbar";
import FilterBar    from "../Employee/FilterBar";
import EmployeeTable from "../Employee/EmployeeTable";

const API_URL = "http://localhost:3001/employees";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  status: "Active" | "Inactive";
  dateOfJoining: string;
}

/* ── Stat Card ── */
function StatCard({
  icon,
  label,
  value,
  iconBg,
}: {
  icon: string;
  label: string;
  value: number;
  iconBg: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

/* ── Page ── */
export default function Employee() {
  const [employees, setEmployees]     = useState<Employee[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [filterDept, setFilterDept]   = useState("All");

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(API_URL);
        const data = await res.json();
        setEmployees(data);
      } catch {
        console.error("Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const departments = useMemo(
    () => ["All", ...Array.from(new Set(employees.map((e) => e.department)))],
    [employees]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return employees.filter((emp) => {
      if (q && !emp.name.toLowerCase().includes(q) && !emp.id.toLowerCase().includes(q))
        return false;
      if (filterDept !== "All" && emp.department !== filterDept)
        return false;
      return true;
    });
  }, [employees, search, filterDept]);

  const activeCount   = employees.filter((e) => e.status === "Active").length;
  const inactiveCount = employees.filter((e) => e.status === "Inactive").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-sm text-gray-400">Loading employees…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">

      {/* ── Page Header ── */}
      <div className="px-8 pt-8">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Employee Directory</h1>
        <p className="text-sm text-gray-400 mt-1">Manage company workforce</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-8 mt-6">
        <StatCard label="Total Employees" value={employees.length}       icon="👥" iconBg="#EFF6FF" />
        <StatCard label="Active"          value={activeCount}            icon="✅" iconBg="#DCFCE7" />
        <StatCard label="Inactive"        value={inactiveCount}          icon="❌" iconBg="#FEE2E2" />
        <StatCard label="Departments"     value={departments.length - 1} icon="🏢" iconBg="#F0FDF4" />
      </div>

      {/* ── Toolbar: Search + Filter on same line ── */}
      <div className="flex items-center gap-3 px-8 mt-5">
        <SearchBar value={search} onChange={setSearch} />
        <FilterBar departments={departments} value={filterDept} onChange={setFilterDept} />
      </div>

      {/* ── Table ── */}
      <div className="px-8 mt-4">
        <EmployeeTable employees={filtered} />
      </div>

    </div>
  );
}