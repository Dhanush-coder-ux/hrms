// src/pages/Payroll/PayrollComponents.tsx
import { useNavigate } from "react-router-dom";
import PayrollTable from "../Components/table/PayRollTable";
import { useEffect, useState, useMemo } from "react";
import { Download, CreditCard, Users, PieChart } from "lucide-react";
import StatCard from "../../../Components/Common/StatCard";
import SearchBar from "../../../Components/Common/Searchbar";

interface PayrollData {
  id: number;
  employee: string;
  salary: number;
  tax: number;
  net: number;
  status: "Paid" | "Pending" | "Processing";
  department: string;
  date: string;
}

interface PageProps {
  data?: Array<PayrollData>;
}

const API_URL = "http://localhost:3001/Payroll";

const PayrollComponents = ({ data: initialData }: PageProps) => {
  const navigate = useNavigate();
  const [payrollData, setPayrollData] = useState<PayrollData[]>(
    initialData || [],
  );
  const [loading, setLoading] = useState(!initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("All");

  useEffect(() => {
    if (!initialData) {
      const fetchData = async () => {
        try {
          const response = await fetch(API_URL);
          if (!response.ok) throw new Error("Network response was not ok");
          const result: PayrollData[] = await response.json();
          setPayrollData(result);
        } catch (error) {
          console.error("Failed to fetch payroll:", error);
          setPayrollData([]);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [initialData]);

  // --- Logic: Filtering & Calculations ---
  const filteredData = useMemo(() => {
    return payrollData.filter((item) => {
      const matchesSearch = item.employee
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDept =
        filterDept === "All" || item.department === filterDept;
      return matchesSearch && matchesDept;
    });
  }, [payrollData, searchTerm, filterDept]);

  const stats = useMemo(() => {
    const totalNet = filteredData.reduce((acc, curr) => acc + curr.net, 0);
    const pendingCount = filteredData.filter(
      (p) => p.status === "Pending",
    ).length;
    return { totalNet, pendingCount, totalEmployees: filteredData.length };
  }, [filteredData]);

  const departments = ["All", ...new Set(payrollData.map((d) => d.department))];

  const exportToCSV = () => {
    const headers = "Employee,Salary,Tax,Net,Status,Department\n";
    const rows = filteredData
      .map(
        (r) =>
          `${r.employee},${r.salary},${r.tax},${r.net},${r.status},${r.department}`,
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payroll_report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  // --- Table Column Definitions ---
  const columns = [
    { header: "Employee", accessor: "employee" },
    { header: "Dept.", accessor: "department" },
    {
      header: "Net Pay",
      accessor: "net",
      render: (row: PayrollData) => (
        <span className="font-mono font-medium">
          ${row.net.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row: PayrollData) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${
            row.status === "Paid"
              ? "bg-emerald-100 text-emerald-700"
              : row.status === "Processing"
                ? "bg-blue-100 text-blue-700"
                : "bg-amber-100 text-amber-700"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const ActionToClickRow = (row: PayrollData) => {
    navigate(`/EmployeeManagement/payrollDetails/${row.id}`, { state: row });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-indigo-600 font-medium text-lg">
          Loading Payroll Dashboard...
        </div>
      </div>
    );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Payroll Hub
            </h1>
            <p className="text-gray-500 mt-1 text-lg">
              Financial overview for the current billing cycle
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-sm"
            >
              <Download size={18} /> Export CSV
            </button>
            <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 shadow-md transition-all">
              Process All Payments
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            icon={CreditCard}
            label="Total Disbursement"
            value={`$${stats.totalNet.toLocaleString()}`}
            iconBg="#eef2ff"
            iconColor="#4f46e5"
            valueSize="2xl"
          />
          <StatCard
            icon={Users} //"text-emerald-600"
            label="Total Employees"
            iconBg="#ecfdf5"
            iconColor="#059669"
            valueSize="2xl"
            value={stats.totalEmployees.toString()}
          />
          <StatCard
            icon={PieChart} //className="text-amber-600"
            label="Pending Approvals"
            value={stats.pendingCount.toString()}
            iconBg="#fffbeb"
            iconColor="#d97706"
            valueSize="2xl"
          />
        </div>

        {/* Filters Bar */}
        <div className=" mb-6 flex  gap-4">
          <div className="">
            <SearchBar
              value={searchTerm}
              onChange={(value) => setSearchTerm(String(value))}
            />
          </div>
          <select
            className="border border-gray-200 rounded-lg px-4 py-2 bg-white text-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={(e) => setFilterDept(e.target.value)}
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Table Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <PayrollTable
            data={filteredData}
            columns={columns}
            onRowClick={ActionToClickRow}
          />
          {filteredData.length === 0 && (
            <div className="p-20 text-center text-gray-400">
              No records found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayrollComponents;
