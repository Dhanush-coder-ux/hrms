import { useEffect, useState, useCallback, useMemo, type SetStateAction } from "react";
import { Table, type Column } from "../../EmployeeManagement/Components/table/AttendanceTable";
import { Button } from "../../../Components/Common/Button";
import { Selection } from "../../../Components/Common/Selection";
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
import { empMangeTheme } from "../../../Themes/EmpMangeTheme/empMangeConfig";

/* ---------------- Helpers ---------------- */

const toDateString = (d: Date) => d.toISOString().split("T")[0];

const todayStr = () => toDateString(new Date());

const formatDisplayDate = (dateStr: string) => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/* ---------------- Types ---------------- */

interface AttendanceRecord {
  id: number;
  employee_name: string;
  attendance_date: string;
  check_in: string | null;
  check_out: string | null;
  status: string;
}

/* ---------------- Component ---------------- */

export const Attendance = () => {
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(todayStr());

  const [showEdit, setShowEdit] = useState(false);
  const [selection, setSelection] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [stats, setStats] = useState({
    present: 0,
    onLeave: 0,
    late: 0,
  });

  /* ---------------- Fetch Attendance ---------------- */

  const fetchAttendance = useCallback(async (date: string) => {
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:3001/attendance?attendance_date=${date}`
      );

      const result: AttendanceRecord[] = await res.json();

      setData(result);

      setStats({
        present: result.filter((r) =>
          ["present", "late"].includes(r.status.toLowerCase())
        ).length,

        onLeave: result.filter((r) =>
          ["absent", "leave"].includes(r.status.toLowerCase())
        ).length,

        late: result.filter(
          (r) => r.status.toLowerCase() === "late"
        ).length,
      });
    } catch (err) {
      console.error("Fetch error:", err);
      setData([]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAttendance(selectedDate);
  }, [selectedDate, fetchAttendance]);

  /* ---------------- Date Navigation ---------------- */

  const shiftDate = (days: number) => {
    const d = new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() + days);
    setSelectedDate(toDateString(d));
  };

  /* ---------------- Update Status ---------------- */

  const updateStatus = async () => {
    if (selectedId === null) return;

    try {
      console.log("Updating ID:", selectedId);

      const res = await fetch(
        `http://localhost:3001/attendance/${selectedId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: selection,
          }),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      await fetchAttendance(selectedDate);
      setShowEdit(false);

    } catch (err) {
      console.error("Update error:", err);
    }
  };

  /* ---------------- CSV Export ---------------- */

  const handleExportCSV = () => {
    const headers = ["Employee", "Date", "Check-In", "Check-Out", "Status"];

    const rows = data.map((r) => [
      `"${r.employee_name}"`,
      `"${r.attendance_date}"`,
      `"${r.check_in ?? "—"}"`,
      `"${r.check_out ?? "—"}"`,
      `"${r.status}"`,
    ]);

    const csv = [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `attendance_${selectedDate}.csv`;

    link.click();
  };

  /* ---------------- Table Columns ---------------- */

  const columns: Column[] = useMemo(
    () => [
      { header: "Employee", accessor: "employee_name" },
      { header: "Date", accessor: "attendance_date" },
      { header: "Check-In", accessor: "check_in" },
      { header: "Check-Out", accessor: "check_out" },
      { header: "Status", accessor: "status" },
      { header: "Action", type: "action" },
    ],
    []
  );

  /* ---------------- Status Color ---------------- */

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();

    const colors: Record<string, string> = {
      present: "text-emerald-700 bg-emerald-50 border-emerald-200",
      late: "text-amber-700 bg-amber-50 border-amber-200",
      absent: "text-rose-700 bg-rose-50 border-rose-200",
      leave: "text-violet-700 bg-violet-50 border-violet-200",
    };

    return `border ${
      colors[s] || "text-gray-600 bg-gray-50 border-gray-200"
    }`;
  };

  const isToday = selectedDate === todayStr();

  /* ---------------- UI ---------------- */

  return (
    <div className={empMangeTheme.layout.mainContainer}>

      {/* Header */}
      <div className="flex justify-between mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Attendance Management</h2>
          <p className="text-sm text-slate-500 font-medium">
            Monitor daily employee logs and statuses
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-4 gap-4 mb-6">

        <StatCard
          label="Total Present"
          value={stats.present}
          icon={<UserCheck size={18} />}
        />

        <StatCard
          label="On Leave"
          value={stats.onLeave}
          icon={<UserMinus size={18} />}
        />

        <StatCard
          label="Late"
          value={stats.late}
          icon={<Clock size={18} />}
        />

        <StatCard
          label="Viewing Date"
          value={selectedDate}
          icon={<Calendar size={18} />}
        />

      </div>

      {/* Date Navigation */}

      <div className="flex items-center justify-between bg-white p-3 rounded-lg mb-4">

        <div className="flex items-center gap-2">

          <button onClick={() => shiftDate(-1)}>
            <ChevronLeft />
          </button>

          <input
            type="date"
            value={selectedDate}
            max={todayStr()}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded px-2 py-1"
          />

          <button onClick={() => shiftDate(+1)} disabled={isToday}>
            <ChevronRight />
          </button>

        </div>

        <p className="text-sm text-gray-500">
          {formatDisplayDate(selectedDate)}
        </p>

      </div>

      {/* Table */}
      <div className={empMangeTheme.section.card}>
        {loading ? (
          <div className="py-20 text-center">Loading...</div>
        ) : data.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <ClipboardX size={30} className="mx-auto mb-2 opacity-20" />
            No records found
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-80">

            <h3 className="text-lg font-bold mb-3">
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
              onChange={(e: { target: { value: SetStateAction<string>; }; }) => setSelection(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-4">

              <button
                onClick={() => setShowEdit(false)}
                className="text-gray-500"
              >
                Cancel
              </button>

              <Button
                B_name="Update"
                ClickToAction={updateStatus}
              />

            </div>

          </div>

        </div>
      )}
    </div>
  );
};

/* ---------------- Stat Card ---------------- */

const StatCard = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon: any;
}) => {
  return (
    <div className="bg-white p-4 rounded-lg flex items-center gap-3 shadow">
      {icon}
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
};
export { Table, Column };

