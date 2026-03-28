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

// ─── Helpers ────────────────────────────────────────────────────────────────

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

const API_URL = "http://localhost:3001/attendance";

// ─── Component ───────────────────────────────────────────────────────────────

export const Attendance = () => {
  const [showEdit, setShowEdit] = useState(false);
  const [selection, setSelection] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr());
  const [stats, setStats] = useState({
    present: 0,
    onLeave: 0,
    late: 0,
  });

  // ── Fetch Logic ────────────────────────────────────────────────────────────
  const fetchAttendance = useCallback(async (date: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?attendance_date=${date}`);
      if (!response.ok) throw new Error("Failed to fetch");

      const result: AttendanceRecord[] = await response.json();
      setData(result);

      // Update Stats
      setStats({
        present: result.filter((r) => r.status.toLowerCase() === "present")
          .length,
        onLeave: result.filter((r) =>
          ["absent", "leave"].includes(r.status.toLowerCase()),
        ).length,
        late: result.filter((r) => r.status.toLowerCase() === "late").length,
      });
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance(selectedDate);
  }, [selectedDate, fetchAttendance]);

  // ── Date Navigation ────────────────────────────────────────────────────────────────

  const shiftDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);

    const newDate = d.toISOString().split("T")[0];

    if (newDate > todayStr()) return;

    setSelectedDate(newDate);
  };

  const updateStatus = async () => {
    if (selectedId === null) return;

    console.log("Updating ID:", selectedId);
    console.log("New Status:", selection);

    try {
      const res = await fetch(`${API_URL}/${selectedId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: selection,
        }),
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        const text = await res.text();
        console.log("Update failed:", text);
        return;
      }

      console.log("Update success");

      await fetchAttendance(selectedDate);
      setShowEdit(false);
    } catch (err) {
      console.error("Update error:", err);
    }
  };
  const handleExportCSV = () => {
    const headers = ["Employee", "Date", "Check-In", "Check-Out", "Status"];
    const rows = data.map((r) => [
      `"${r.employee_name}"`,
      `"${r.attendance_date}"`,
      `"${r.check_in ?? "—"}"`,
      `"${r.check_out ?? "—"}"`,
      `"${r.status}"`,
    ]);
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance_${selectedDate}.csv`);
    link.click();
  };

  // ── Table Config ──────────────────────────────────────────────────────────
  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    const colors: Record<string, string> = {
      present: "text-emerald-700 bg-emerald-50 border-emerald-200",
      late: "text-amber-700 bg-amber-50 border-amber-200",
      pending: "text-sky-700 bg-sky-50 border-sky-200",
      absent: "text-rose-700 bg-rose-50 border-rose-200",
      leave: "text-violet-700 bg-violet-50 border-violet-200",
      holiday: "text-indigo-700 bg-indigo-50 border-indigo-200",
    };
    return `border ${colors[s] || "text-gray-600 bg-gray-50 border-gray-200"}`;
  };

  const columns = useMemo(
    () => [
      { header: "Employee", accessor: "employee_name" },
      { header: "Date", accessor: "attendance_date" },
      { header: "Check-In", accessor: "check_in" },
      { header: "Check-Out", accessor: "check_out" },
      { header: "Status", accessor: "status" },
      { header: "Action", type: "action" },
    ],
    [],
  );

  const isToday = selectedDate === todayStr();

  const STC = [
    {
      label: "Total Present",
      value: stats.present,
      icon: UserCheck,
      iconBg: "#ECFDF5",
      iconColor: "#10b981",
    },
    {
      label: "On Leave / Absent",
      value: stats.onLeave,
      icon: UserMinus,
      iconBg: "#fff1f2",
      iconColor: "#e11d48",
    },
    {
      label: "Late Arrivals",
      value: stats.late,
      icon: Clock,
      iconBg: "#fffbeb",
      iconColor: "#d97706",
    },
    {
      label: "Viewing Date",
      value: formatDisplayDate(selectedDate).split(",")[1],
      icon: Calendar,
      iconBg: "#eff6ff",
      iconColor: "#2563eb",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[#f8f9fa] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Attendance Management
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Monitor daily employee logs
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STC.map((item, index) => (
          <StatCard
            key={index}
            label={item.label}
            value={item.value}
            icon={item.icon}
            iconBg={item.iconBg}
            iconColor={item.iconColor}
            valueSize="2xl"
          />
        ))}
      </div>

      {/* Date Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => shiftDate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="relative flex items-center gap-2">
            <CustomDatePicker
              name="attendanceDate"
              value={selectedDate}
              Lable=""
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <button
            onClick={() => shiftDate(1)}
            disabled={isToday}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500 hidden sm:block">
            {formatDisplayDate(selectedDate)}
          </p>
          {isToday ? (
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
              Today
            </span>
          ) : (
            <button
              onClick={() => setSelectedDate(todayStr())}
              className="text-xs font-semibold text-white bg-blue-600 px-3 py-1.5 rounded-lg"
            >
              Today
            </button>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500">Loading records...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
            <div className="p-4 bg-gray-50 rounded-full">
              <ClipboardX size={36} />
            </div>
            <p className="font-semibold text-gray-500">
              No records found for this date
            </p>
          </div>
        ) : (
          <Table
            columns={columns}
            TB={data}
            getStatusColor={getStatusColor}
            onEdit={(row: AttendanceRecord) => {
              setSelectedId(row.id);
              setSelection(row.status);
              setShowEdit(true);
            }}
          />
        )}
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Update Status
            </h3>
            <Selection
              label="Attendance Status"
              name=""
              value={selection}
              options={[
                { label: "Present", value: "Present" },
                { label: "Absent", value: "Absent" },
                { label: "Late", value: "Late" },
                { label: "Leave", value: "Leave" },
              ]}
              onChange={(e) => setSelection(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEdit(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-500"
              >
                Cancel
              </button>
              <Button B_name="Update" ClickToAction={updateStatus} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
