import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check, X, Calendar, Clock, ArrowRight, ClipboardList } from "lucide-react";
import { Api_URL } from "../../../APILINK";

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

export const DashboardLeaveRequests = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${Api_URL}/leave/all-requests`);
      if (response.ok) {
        const data = await response.json();
        // Filter for pending only
        const pending = data.filter((r: LeaveRequest) => r.status.toLowerCase() === "pending");
        setRequests(pending.slice(0, 4)); // Show top 4
      }
    } catch (error) {
      console.error("Error fetching dashboard leave requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id: number, newStatus: "Approved" | "Rejected") => {
    setProcessingId(id);
    try {
      const response = await fetch(
        `${Api_URL}/leave/update-status-admin/${id}?status=${newStatus}`,
        { method: "PUT" }
      );
      if (response.ok) {
        // Refresh requests
        await fetchRequests();
      } else {
        const err = await response.json().catch(() => ({}));
        alert(err.detail || "Failed to update leave status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Network error updating status");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm shadow-slate-100/50 flex flex-col h-full">
      {/* Title Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-50 text-amber-500 rounded-xl">
            <ClipboardList size={18} />
          </div>
          <div>
            <h3 className="font-extrabold text-[13px] uppercase tracking-wider text-slate-700">
              Pending Leave Approvals
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Requires administrative action
            </p>
          </div>
        </div>

        <Link
          to="/EmployeeManagement/employeeleave"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary hover:opacity-85 transition-opacity bg-primary/5 px-3 py-1.5 rounded-xl border border-primary/10"
        >
          View Center <ArrowRight size={12} />
        </Link>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="space-y-3 flex-1 flex flex-col justify-center py-6">
          <div className="h-16 bg-slate-50 rounded-xl animate-pulse" />
          <div className="h-16 bg-slate-50 rounded-xl animate-pulse" />
        </div>
      ) : requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-8 flex-1">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-3">
            <Check size={20} strokeWidth={2.5} />
          </div>
          <h4 className="text-xs font-black text-slate-800">All Cleared!</h4>
          <p className="text-[10px] text-slate-400 font-medium mt-1 max-w-[200px]">
            No pending leave requests from employees are awaiting approval today.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5 flex-1 overflow-y-auto custom-scrollbar pr-1 max-h-[320px]">
          {requests.map((req) => (
            <div
              key={req.id}
              className="p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-4 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                {/* Initial Avatar */}
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-primary/10">
                  {req.employee_name ? req.employee_name[0].toUpperCase() : "E"}
                </div>

                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-black text-slate-800 tracking-tight">
                      {req.employee_name}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      #{req.Emp_id}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 font-semibold flex-wrap">
                    <span className="inline-flex items-center gap-1 bg-white border border-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                      <Calendar size={10} className="text-slate-400" />
                      {req.leave_type}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-white border border-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                      <Clock size={10} className="text-slate-400" />
                      {req.Days}d
                    </span>
                    <span className="text-slate-400 text-[9px]">
                      Applied {req.applayDate}
                    </span>
                  </div>

                  {req.Reason && (
                    <p className="text-[10px] text-slate-400 italic font-medium mt-1.5 leading-snug line-clamp-1">
                      "{req.Reason}"
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  disabled={processingId !== null}
                  onClick={() => handleUpdateStatus(req.id, "Rejected")}
                  className="w-8 h-8 rounded-xl bg-white hover:bg-rose-50 border border-slate-150 hover:border-rose-200 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-all cursor-pointer disabled:opacity-50"
                  title="Reject"
                >
                  <X size={15} strokeWidth={2.5} />
                </button>
                <button
                  disabled={processingId !== null}
                  onClick={() => handleUpdateStatus(req.id, "Approved")}
                  className="w-8 h-8 rounded-xl bg-primary hover:opacity-90 text-white flex items-center justify-center transition-all shadow-md shadow-primary/20 cursor-pointer disabled:opacity-50"
                  title="Approve"
                >
                  <Check size={15} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
