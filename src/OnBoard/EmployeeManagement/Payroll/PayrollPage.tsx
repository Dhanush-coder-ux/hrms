import { useEffect, useState, useMemo } from "react";
import { CreditCard, Users, PieChart, TrendingUp } from "lucide-react";
import PayrollTable, { type Column } from "../Components/table/PayRollTable";
import StatCard from "../../../Components/Common/StatCard";
import StageFilter from "../../../Components/Common/StageFilter";
import SearchBar from "../../../Components/Common/Searchbar";
import { PayrollDetailsDrawer } from "./PayrollDetailsDrawer";
import type { PayrollData } from "../../../Types/typesEmployeeManagement";
import { Api_URL } from "../../../APILINK";
import PageLoading from "../../../Components/Common/PageLoading";
import { MdPayment } from "react-icons/md";

const API_URL = `${Api_URL}/payroll/`;

const PayrollComponents = () => {
  const [payrollData, setPayrollData] = useState<PayrollData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("");
  
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
  const [selectedEmpName, setSelectedEmpName] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setPayrollData(data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return payrollData.filter((item) => {
      const matchesSearch = (item.employee || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDept =
        !filterDept || item.department === filterDept;
      return matchesSearch && matchesDept;
    });
  }, [payrollData, searchTerm, filterDept]);

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

  const departments = Array.from(new Set(payrollData.map((d) => d.department)));

  const deptCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    payrollData.forEach(item => {
      if (item.department) {
        counts[item.department] = (counts[item.department] || 0) + 1;
      }
    });
    return counts;
  }, [payrollData]);

  const columns: Column[] = [
    { header: "Employee", accessor: "employee" },
    { header: "Provider", accessor: "provider_name" },
    { header: "Dept.", accessor: "department" },
    { header: "Net Pay", accessor: "net" },
    { header: "Status", accessor: "status" },
    { header: "", type: "action" },
  ];

  const ActionToClickRow = (row: PayrollData) => {
    setSelectedEmpId(row.emp_id);
    setSelectedEmpName(row.employee);
    setShowDetails(true);
  };

  if (loading) return <PageLoading />;

  return (
    <div className="h-full overflow-y-auto bg-slate-50/50 p-10 pb-24 font-sans custom-scrollbar">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-6 mb-8 flex-wrap">
        <div className="flex flex-col">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full mb-2.5 w-fit">
            <TrendingUp size={12} />
            <span>Finance Hub</span>
          </div>
          <h1 className="text-[2rem] font-extrabold text-slate-900 tracking-tight mb-1.5 leading-none flex items-center gap-3">
            <MdPayment className="w-8 h-8 text-indigo-600" />
            Payroll Management
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            Real-time salary breakdown and disbursement tracking
          </p>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total Disbursement"
          value={`₹${stats.totalNet.toLocaleString()}`}
          icon={CreditCard}
          iconBgClass="bg-indigo-50"
          iconColorClass="text-indigo-500"
          valueColorClass="text-indigo-600"
          subText="Current month"
        />
        <StatCard
          label="Total Employees"
          value={stats.totalEmployees}
          icon={Users}
          iconBgClass="bg-emerald-50"
          iconColorClass="text-emerald-500"
          valueColorClass="text-emerald-600"
          subText="On payroll"
        />
        <StatCard
          label="Pending Approvals"
          value={stats.pendingCount}
          icon={PieChart}
          iconBgClass="bg-amber-50"
          iconColorClass="text-amber-500"
          valueColorClass="text-amber-600"
          subText="Needs review"
        />
      </div>

      <div className="flex justify-between gap-4 mb-6 items-center">
        <StageFilter
          stages={departments}
          selectedStage={filterDept}
          onStageChange={setFilterDept}
          counts={deptCounts}
          totalCount={payrollData.length}
          className=""
        />
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search employee..." />
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-[20px] border-[1.5px] border-slate-100 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-[18px_24px] border-b border-slate-50">
          <div className="flex items-center gap-2 font-extrabold text-[12px] tracking-wider uppercase text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            Salary Roll
          </div>
          <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
            {filteredData.length} result{filteredData.length !== 1 ? "s" : ""}
          </span>
        </div>

        <PayrollTable
          data={filteredData}
          columns={columns}
          onRowClick={ActionToClickRow}
        />
      </div>

      <PayrollDetailsDrawer
        empId={selectedEmpId}
        employeeName={selectedEmpName}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default PayrollComponents;