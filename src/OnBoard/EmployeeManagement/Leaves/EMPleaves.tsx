import { useState, useEffect } from "react";
import { EmpLeaveTable, type Column } from "../../Components/table/EmpLeaveTable";
import { useNavigate } from "react-router-dom";
import StatCard from "../../../Components/Common/StatCard";
import { UserCheck, UserMinus, Users, TrendingUp, Download, Check, X, Calendar, Filter, ClipboardList } from "lucide-react";
import type { Empleaves } from "../../../Types/typesEmployeeManagement";
import { Api_URL } from "../../../APILINK";
import { empMangeTheme } from "../../../Themes/EmpMangeTheme/empMangeConfig";

const LeaveUrl = Api_URL;
const LEAVE_API = `${LeaveUrl}/leave/all-balances`;

interface LeaveRequest {
  id: number;
  Emp_id: string;
  employee_name: string;
  Duration: string;
  Reason: string;
  from_date: string;
  to_date: string;
  Days: number;
  applayDate: string;
  leave_type: string;
  status: string;
}

export const EMPleaves = () => {
  const [data, setData] = useState<Empleaves[]>([]);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"balances" | "requests">("balances");
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");
  const [processingId, setProcessingId] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchEmpleave = async () => {
    try {
      const response = await fetch(LEAVE_API);
      const result = await response.json();
      const normalized = result.map((emp: any) => ({
        ...emp,
        employee_name: emp.employee_name || emp.name || "Unknown",
        Emp_id: emp.Emp_id || emp.empid || emp.id,
        total_leave: emp.Total_Leave,
        available_leaves: emp.Available,
        empid: emp.Emp_id || emp.empid || emp.id,
      }));
      setData(normalized);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${LeaveUrl}/leave/all-requests`);
      if (response.ok) {
        const result = await response.json();
        setRequests(result);
      }
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    }
  };

  const refreshAll = async () => {
    await Promise.all([fetchEmpleave(), fetchRequests()]);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const handleUpdateStatus = async (id: number, newStatus: "Approved" | "Rejected") => {
    setProcessingId(id);
    try {
      const response = await fetch(
        `${LeaveUrl}/leave/update-status-admin/${id}?status=${newStatus}`,
        { method: "PUT" }
      );
      if (response.ok) {
        await refreshAll();
      } else {
        const err = await response.json().catch(() => ({}));
        alert(err.detail || "Failed to update leave request status");
      }
    } catch (error) {
      console.error("Error updating leave request status:", error);
      alert("Network error updating leave request status");
    } finally {
      setProcessingId(null);
    }
  };

  // 1. Calculate live statistics
  // On leave today: approved requests where today's date falls between from_date and to_date
  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const onLeaveTodayCount = requests.filter((r) => {
    if (r.status.toLowerCase() !== "approved" || !r.from_date || !r.to_date) return false;
    return todayStr >= r.from_date && todayStr <= r.to_date;
  }).length;

  const pendingRequestsCount = requests.filter(
    (r) => r.status.toLowerCase() === "pending"
  ).length;

  const columns: Column[] = [
    { header: "Employee", accessor: "employee_name" },
    { header: "Total Quota", accessor: "Total_Leave" },
    { header: "Used", accessor: "Used" },
    { header: "Available", accessor: "Available" },
    { header: "", type: "action" },
  ];

  // Filter requests based on tab & filter selection
  const filteredRequests = requests.filter((r) => {
    if (statusFilter === "All") return true;
    return r.status.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className={empMangeTheme.layout.mainContainer}>
      {/* HEADER */}
      <div className={empMangeTheme.header.wrapper}>
        <div className="flex flex-col">
          <div className={empMangeTheme.header.pill}>
            <TrendingUp size={12} />
            <span>Leave Hub</span>
          </div>
          <h1 className={empMangeTheme.header.title}>Leave Management</h1>
          <p className={empMangeTheme.header.subtitle}>
            Track and manage employee leave balances across the organization
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button className="inline-flex items-center gap-2 h-[42px] px-[18px] bg-primary text-white border-none rounded-xl text-sm font-bold tracking-tight cursor-pointer transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-primary/20">
            <Download size={15} /> Export Report
          </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total Employees"
          value={data.length}
          icon={Users}
          iconBgClass="bg-blue-50"
          iconColorClass="text-blue-500"
          valueColorClass="text-blue-600"
          subText="Across all depts"
        />
        <StatCard
          label="On Leave Today"
          value={onLeaveTodayCount}
          icon={UserMinus}
          iconBgClass="bg-rose-50"
          iconColorClass="text-rose-500"
          valueColorClass="text-rose-600"
          subText="Absences active today"
        />
        <StatCard
          label="Pending Requests"
          value={pendingRequestsCount}
          icon={UserCheck}
          iconBgClass="bg-amber-50"
          iconColorClass="text-amber-500"
          valueColorClass="text-amber-600"
          subText="Needs administrative action"
        />
      </div>

      {/* TABS SELECTOR */}
      <div className="flex items-center gap-6 border-b border-slate-100 pb-3 mb-8">
        <button
          onClick={() => setActiveTab("balances")}
          className={`text-sm font-extrabold pb-3 -mb-[15px] border-b-2 transition-all cursor-pointer ${
            activeTab === "balances"
              ? "border-primary text-primary"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Leave Balances
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`text-sm font-extrabold pb-3 -mb-[15px] border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "requests"
              ? "border-primary text-primary"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Requests & Approvals
          {pendingRequestsCount > 0 && (
            <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              {pendingRequestsCount}
            </span>
          )}
        </button>
      </div>

      {/* ACTIVE VIEW CONTENT */}
      {activeTab === "balances" ? (
        /* TABLE CARD: LEAVE BALANCES */
        <div className={empMangeTheme.section.card}>
          <div className={empMangeTheme.section.header}>
            <div className={empMangeTheme.section.title}>
              <span className={empMangeTheme.section.titleDot} />
              Leave Balances
            </div>
            <span className={empMangeTheme.section.countBadge}>
              {data.length} result{data.length !== 1 ? "s" : ""}
            </span>
          </div>

          <EmpLeaveTable
            columns={columns}
            data={data}
            onRowClick={(row) =>
              navigate(`/EmployeeManagement/employee-leave/${row.Emp_id}`, {
                state: row,
              })
            }
          />
        </div>
      ) : (
        /* TABLE CARD: LEAVE REQUESTS & APPROVALS */
        <div className={empMangeTheme.section.card}>
          {/* Section Header with Filters */}
          <div className={empMangeTheme.section.header + " flex-wrap gap-4 justify-between"}>
            <div className={empMangeTheme.section.title}>
              <span className={empMangeTheme.section.titleDot} />
              Employee Time-Off Logs
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450 flex items-center gap-1.5 mr-2">
                <Filter size={12} /> Filter:
              </span>
              {(["All", "Pending", "Approved", "Rejected"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1 rounded-xl text-[10px] font-bold tracking-tight border transition-all cursor-pointer ${
                    statusFilter === filter
                      ? "bg-primary text-white border-primary shadow-sm shadow-primary/10"
                      : "bg-white text-slate-500 border-slate-100 hover:bg-slate-50/50"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Requests List Grid */}
          <div className="w-full overflow-x-auto custom-scrollbar">
            <table className="w-full border-separate border-spacing-0">
              <thead className={empMangeTheme.table.head}>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-100">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-100">
                    Leave Type
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-100">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-100">
                    Days
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-100">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-100">
                    Reason
                  </th>
                  <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-100">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((req) => (
                    <tr
                      key={req.id}
                      className="hover:bg-slate-50/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/5">
                            {req.employee_name ? req.employee_name[0].toUpperCase() : "E"}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 tracking-tight">
                              {req.employee_name}
                            </p>
                            <p className="text-[9px] text-slate-400 font-extrabold uppercase mt-0.5">
                              ID: #{req.Emp_id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 border border-slate-100 text-slate-650 rounded text-[10px] font-bold">
                          {req.leave_type || "Casual"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-[12px] font-bold text-slate-700">
                          <Calendar size={11} className="text-slate-400" />
                          <span>{req.from_date}</span>
                          <span className="text-slate-350 font-normal">→</span>
                          <span>{req.to_date}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-6 bg-slate-100 border border-slate-200 text-slate-600 rounded text-[11px] font-black">
                          {req.Days}d
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                            req.status.toLowerCase() === "approved"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : req.status.toLowerCase() === "pending"
                              ? "bg-amber-50 text-amber-700 border-amber-100 animate-pulse"
                              : "bg-rose-50 text-rose-700 border-rose-100"
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 max-w-[200px]">
                        <p className="text-xs font-semibold text-slate-500 leading-normal italic line-clamp-2">
                          "{req.Reason || "No reason provided"}"
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {req.status.toLowerCase() === "pending" ? (
                            <>
                              <button
                                disabled={processingId !== null}
                                onClick={() => handleUpdateStatus(req.id, "Rejected")}
                                className="w-8 h-8 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 shadow-sm"
                                title="Reject"
                              >
                                <X size={14} strokeWidth={2.5} />
                              </button>
                              <button
                                disabled={processingId !== null}
                                onClick={() => handleUpdateStatus(req.id, "Approved")}
                                className="w-8 h-8 rounded-xl bg-primary hover:opacity-90 text-white flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-primary/10"
                                title="Approve"
                              >
                                <Check size={14} strokeWidth={2.5} />
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              Closed
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center opacity-30 gap-2">
                        <ClipboardList size={36} />
                        <p className="text-[11px] font-black uppercase tracking-widest">
                          No leave requests match this filter
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};
