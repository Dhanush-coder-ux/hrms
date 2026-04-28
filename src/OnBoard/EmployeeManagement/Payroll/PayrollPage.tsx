import { useNavigate } from "react-router-dom";
import PayrollTable from "../Components/table/PayRollTable";
import { useEffect, useState, useMemo } from "react";
import { CreditCard, Users, PieChart } from "lucide-react";
import StatCard from "../../../Components/Common/StatCard";
import SearchBar from "../../../Components/Common/Searchbar";
import type { PayrollData } from "../../../Types/typesEmployeeManagement";
import FilterBar from "../Employee/FilterBar";
import { Api_URL } from "../../../APILINK";

const API_URL = `${Api_URL}/payroll`;

const PayrollComponents = () => {
  const navigate = useNavigate();

  const [payrollData, setPayrollData] = useState<PayrollData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("All");

  // ✅ FETCH ALL EMPLOYEES
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        console.log("PAYROLL LIST:", data);
        setPayrollData(data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ FILTER
  const filteredData = useMemo(() => {
    return payrollData.filter((item) => {
      const matchesSearch = (item.employee || "")
  .toLowerCase()
  .includes(searchTerm.toLowerCase());

      const matchesDept =
        filterDept === "All" || item.department === filterDept;

      return matchesSearch && matchesDept;
    });
  }, [payrollData, searchTerm, filterDept]);

  // ✅ STATS
  const stats = useMemo(() => {
    const totalNet = filteredData.reduce((acc, curr) => acc + curr.net, 0);
    const pendingCount = filteredData.filter(
      (p) => p.status === "Pending"
    ).length;

    return {
      totalNet,
      pendingCount,
      totalEmployees: filteredData.length,
    };
  }, [filteredData]);

  const departments = ["All", ...new Set(payrollData.map((d) => d.department))];

  // ✅ TABLE
  const columns = [
    { header: "Employee", accessor: "employee" },
    {header:"provider", accessor:"provider_name"},
    { header: "Dept.", accessor: "department" },
    {
      header: "Net Pay",
      accessor: "net",
      render: (row: PayrollData) => (
        <span>${row.net.toLocaleString()}</span>
      ),
    },
    { header: "Status", accessor: "status" },
  ];

  // ✅ CLICK ROW
  const ActionToClickRow = (row: PayrollData) => {
    console.log("Clicked:", row.emp_id);
    navigate(`/EmployeeManagement/payrollDetails/${row.emp_id}`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* STATS */}
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

        {/* FILTER */}
        <div className="mb-6 flex gap-4">
          <SearchBar value={searchTerm} onChange={(v) => setSearchTerm(String(v))} />
          <FilterBar
                    departments={departments}
                    value={filterDept}
                    onChange={setFilterDept}
                  />
        </div>

        {/* TABLE */}
        <PayrollTable
          data={filteredData}
          columns={columns}
          onRowClick={ActionToClickRow}
        />
      </div>
    </div>
  );
};

export default PayrollComponents;