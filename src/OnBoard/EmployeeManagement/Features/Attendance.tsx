import { useEffect, useState, useCallback, useMemo } from "react";
import { Table, type Column } from "../Components/table/AttendanceTable";

import { CustomDatePicker } from "../../../Components/Common/CustomDatePicker";
import { AttendanceDrawer } from "../Attendance/AttendanceDrawer";
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
  TrendingUp,
} from "lucide-react";
import StatCard from "../../../Components/Common/StatCard";
import SearchBar from "../../../Components/Common/Searchbar";
import { Api_URL } from "../../../APILINK";
import { empMangeTheme } from "../../../Themes/EmpMangeTheme/empMangeConfig";

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

const API_URL = `${Api_URL}/attendance`;


export const Attendance = () => {
  const [showEdit, setShowEdit] = useState(false);
  const [selection, setSelection] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState("");
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr());
  const [searchTerm, setSearchTerm] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [stats, setStats] = useState({
    present: 0,
    onLeave: 0,
    late: 0,
  });

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

  const columns: Column[] = useMemo(() => [
    { header: "Employee", accessor: "employee_name" },
    { header: "Date", accessor: "date" },
    { header: "Check-In", accessor: "check_in" },
    { header: "Check-Out", accessor: "check_out" },
    { header: "Status", accessor: "status" },
    { header: "", type: "action" },
  ], []);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    return data.filter((item) =>
      item.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Emp_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const isToday = selectedDate === todayStr();


  return (
    <div className={empMangeTheme.layout.mainContainer + " relative"}>
      {/* HEADER */}
      <div className={empMangeTheme.header.wrapper}>
        <div className="flex flex-col">
          <div className={empMangeTheme.header.pill}>
            <TrendingUp size={12} />
            <span>Attendance Hub</span>
          </div>
          <h1 className={empMangeTheme.header.title}>Employee Logs</h1>
          <p className={empMangeTheme.header.subtitle}>
            Monitoring logs for {formatDisplayDate(selectedDate)}
          </p>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Present"
          value={stats.present}
          icon={UserCheck}
          iconBgClass="bg-emerald-50"
          iconColorClass="text-emerald-500"
          valueColorClass="text-emerald-600"
          subText="On duty"
        />
        <StatCard
          label="Absent/Leave"
          value={stats.onLeave}
          icon={UserMinus}
          iconBgClass="bg-rose-50"
          iconColorClass="text-rose-500"
          valueColorClass="text-rose-600"
          subText="Off duty"
        />
        <StatCard
          label="Late"
          value={stats.late}
          icon={Clock}
          iconBgClass="bg-amber-50"
          iconColorClass="text-amber-500"
          valueColorClass="text-amber-600"
          subText="Needs review"
        />
        <StatCard
          label="Viewing Date"
          value={formatDisplayDate(selectedDate).split(",")[1]}
          icon={Calendar}
          iconBgClass="bg-blue-50"
          iconColorClass="text-blue-500"
          valueColorClass="text-blue-600"
          subText={formatDisplayDate(selectedDate).split(",")[0]}
        />
      </div>


      <div className="w-full mb-4">
        <div className="flex flex-wrap items-center justify-between gap-4">

          {/* Left Actions */}
          <div className="flex flex-wrap items-center gap-3">

            {/* Export Button */}
            <button
              onClick={handleExportCSV}
              className="
          h-[44px]
          px-5
          inline-flex items-center justify-center gap-2
          rounded-2xl
          border border-slate-200
          bg-white
          text-slate-700
          text-sm font-semibold
          shadow-sm
          transition-all duration-200
          hover:bg-slate-50
          hover:border-slate-300
          active:scale-95
        "
            >
              <Download size={16} />
              Export
            </button>

            {/* Date Navigation */}
            <div
              className="
          flex items-center gap-1
          h-[44px]
          px-2
          rounded-2xl
          border border-slate-200
          bg-white
          shadow-sm
        "
            >

              {/* Previous */}
              <button
                onClick={() => shiftDate(-1)}
                className="
            flex items-center justify-center
            w-8 h-8
            rounded-xl
            text-slate-400
            transition-all
            hover:bg-slate-100
            hover:text-slate-700
          "
              >
                <ChevronLeft size={18} />
              </button>

              {/* Date Picker */}
              <div className="flex items-center justify-center min-w-[42px]">
                <CustomDatePicker
                  border={false}
                  name="attendanceDate"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  iconOnly={true}
                />
              </div>

              {/* Next */}
              <button
                onClick={() => shiftDate(1)}
                className="
            flex items-center justify-center
            w-8 h-8
            rounded-xl
            text-slate-400
            transition-all
            hover:bg-slate-100
            hover:text-slate-700
          "
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Today Button */}
            <button
              onClick={() => setSelectedDate(todayStr())}
              className={`
          h-[44px]
          px-5
          rounded-2xl
          text-sm
          font-semibold
          tracking-tight
          transition-all duration-200
          active:scale-95
          shadow-sm
          ${isToday
                  ? `
                bg-primary/10
                text-primary
                border border-primary/20
              `
                  : `
                bg-primary
                text-white
                shadow-lg shadow-primary/20
                hover:opacity-90
              `
                }
        `}
            >
              {isToday ? "Today" : "Back to Today"}
            </button>
          </div>

          {/* Right Actions: Search */}
          <div className="flex items-center gap-3">
             <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Find employee..." className="w-[300px]" />
          </div>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className={empMangeTheme.section.card}>
        <div className={empMangeTheme.section.header}>
          <div className={empMangeTheme.section.title}>
            <span className={empMangeTheme.section.titleDot} />
            Attendance Records
          </div>
          <span className={empMangeTheme.section.countBadge}>
            {filteredData.length} result{filteredData.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3.5 py-20 text-slate-400 text-xs font-semibold uppercase tracking-widest">
            <div className="w-8 h-8 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" />
            <p>Syncing logs...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3.5 py-20 text-slate-300">
            <ClipboardX size={48} strokeWidth={1.5} />
            <p className="text-xs font-bold uppercase tracking-widest">No records found</p>
          </div>
        ) : (
          <Table
            columns={columns}
            TB={filteredData}
            onEdit={(row: AttendanceRecord) => {
              setSelectedId(row.Emp_id);
              setSelectedName(row.employee_name);
              setSelection(row.status);
              setCheckIn(row.check_in || "");
              setCheckOut(row.check_out || "");
              setShowEdit(true);
            }}
          />
        )}
      </div>

      {/* Side Drawer Component */}
      <AttendanceDrawer
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        selectedName={selectedName}
        selectedId={selectedId}
        selectedDate={selectedDate}
        status={selection}
        setStatus={setSelection}
        checkIn={checkIn}
        setCheckIn={setCheckIn}
        checkOut={checkOut}
        setCheckOut={setCheckOut}
        onSave={updateStatus}
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


