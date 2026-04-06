import { useEffect, useState, useCallback, useMemo } from "react";
import { Table } from "../Components/table/AttendanceTable";
import { Button } from "../../../Components/Common/Button";
import { Selection } from "../../../Components/Common/Selection";
import { CustomDatePicker } from "../../../Components/Common/CustomDatePicker";
import type { AttendanceRecord } from "../../../Types/typesEmployeeManagement";
import {
  Calendar,
  UserCheck,
  UserMinus,
  Clock,
  Download,
  ChevronLeft,
  ChevronRight,
  ClipboardX,
} from "lucide-react";
import StatCard from "../../../Components/Common/StatCard";
import { Api_URL } from "../../../APILINK";

const toDateString = (d: Date) => d.toISOString().split("T")[0];

const formatDisplayDate = (dateStr: string) => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const todayStr = () => toDateString(new Date());

const API_URL =`${Api_URL}/attendance`;

export const Attendance = () => {
  const [showEdit, setShowEdit] = useState(false);
  const [selection, setSelection] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr());
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [stats, setStats] = useState({
    present: 0,
    onLeave: 0,
    late: 0,
  });

  // ─── Fetch Logic (Auto-generates if empty) ──────────────────────────────────
  const fetchAttendance = useCallback(async (date: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/?attendance_date=${date}`);
      if (!response.ok) throw new Error(`Server Error: ${response.status}`);

      const result: AttendanceRecord[] = await response.json();
      setData(result);

      setStats({
        present: result.filter((r) => r.status?.toLowerCase() === "present").length,
        onLeave: result.filter((r) => ["absent", "leave"].includes(r.status?.toLowerCase())).length,
        late: result.filter((r) => r.status?.toLowerCase() === "late").length,
      });
    } catch (error) {
      console.error("Fetch Error:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance(selectedDate);
  }, [selectedDate, fetchAttendance]);

const updateStatus = async () => {
  if (selectedId === null) return;
  try {
    const res = await fetch(`${API_URL}/${selectedId}?attendance_date=${selectedDate}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        status: selection,
        check_in: checkIn,
        check_out: checkOut
      }),
    });

    if (res.ok) {
      await fetchAttendance(selectedDate);
      setShowEdit(false);
    }
  } catch (err) {
    console.error("Update error:", err);
  }
};
  const shiftDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(toDateString(d));
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Employee", "Date", "In", "Out", "Status"];
    const rows = data.map((r) => [
      `"${r.Emp_id}"`, `"${r.employee_name}"`, `"${r.date}"`,
      `"${r.check_in ?? "—"}"`, `"${r.check_out ?? "—"}"`, `"${r.status}"`,
    ]);
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance_${selectedDate}.csv`;
    link.click();
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || "pending";
    const colors: Record<string, string> = {
      present: "text-emerald-700 bg-emerald-50 border-emerald-200",
      late: "text-amber-700 bg-amber-50 border-amber-200",
      pending: "text-sky-700 bg-sky-50 border-sky-200",
      absent: "text-rose-700 bg-rose-50 border-rose-200",
      leave: "text-violet-700 bg-violet-50 border-violet-200",
    };
    return `border ${colors[s] || "text-gray-600 bg-gray-50 border-gray-200"}`;
  };

  const columns = useMemo(() => [
    { header: "Employee", accessor: "employee_name" },
    { header: "Date", accessor: "date" },
    { header: "Check-In", accessor: "check_in" },
    { header: "Check-Out", accessor: "check_out" },
    { header: "Status", accessor: "status" },
    { header: "Action", type: "action" },
  ], []);

  const isToday = selectedDate === todayStr();

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[#f8f9fa] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Attendance Management</h2>
          <p className="text-xs text-gray-500 mt-1">Update and monitor employee logs</p>
        </div>
        <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Present", value: stats.present, icon: UserCheck, iconBg: "#ECFDF5", iconColor: "#10b981" },
          { label: "Absent/Leave", value: stats.onLeave, icon: UserMinus, iconBg: "#fff1f2", iconColor: "#e11d48" },
          { label: "Late", value: stats.late, icon: Clock, iconBg: "#fffbeb", iconColor: "#d97706" },
          { label: "Viewing Date", value: formatDisplayDate(selectedDate).split(",")[1], icon: Calendar, iconBg: "#eff6ff", iconColor: "#2563eb" },
        ].map((item, idx) => (
          <StatCard key={idx} {...item} valueSize="2xl" />
        ))}
      </div>

      {/* Date Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => shiftDate(-1)} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft size={18} /></button>
          <CustomDatePicker name="attendanceDate" value={selectedDate} Lable="" onChange={(e) => setSelectedDate(e.target.value)} />
          <button onClick={() => shiftDate(1)} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight size={18} /></button>
        </div>
        <button onClick={() => setSelectedDate(todayStr())} className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${isToday ? 'bg-blue-50 text-blue-600' : 'bg-blue-600 text-white'}`}>
          {isToday ? "Today" : "Back to Today"}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center"><p className="animate-pulse text-gray-500 text-sm">Syncing with database...</p></div>
        ) : data.length === 0 ? (
          <div className="py-20 text-center text-gray-400"><ClipboardX size={36} className="mx-auto mb-2" /><p>No employees found to generate data</p></div>
        ) : (
          <Table
            columns={columns}
            TB={data}
            getStatusColor={getStatusColor}
            onEdit={(row: AttendanceRecord) => {
  setSelectedId(row.Emp_id);
  setSelection(row.status);
  setCheckIn(row.check_in || ""); // Load existing check-in
  setCheckOut(row.check_out || ""); // Load existing check-out
  setShowEdit(true);
}}

          />
        )}
      </div>

      {/* Edit Modal */}
{showEdit && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Update Attendance</h3>
      
      <div className="space-y-4">
        <Selection
          label="Status"
          value={selection}
          name="status"
          options={[
            { label: "Present", value: "Present" },
            { label: "Absent", value: "Absent" },
            { label: "Late", value: "Late" },
            { label: "Leave", value: "Leave" },
          ]}
          onChange={(e) => setSelection(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-In</label>
            <input 
              type="time" 
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-Out</label>
            <input 
              type="time" 
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <button onClick={() => setShowEdit(false)} className="px-4 py-2 text-sm text-gray-500">Cancel</button>
        <Button B_name="Save Changes" ClickToAction={updateStatus} />
      </div>
    </div>
  </div>
)}
    </div>
  );
};