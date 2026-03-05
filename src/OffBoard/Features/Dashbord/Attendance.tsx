import { useEffect, useState } from 'react';
import { Table } from '../../Components/table/AttendanceTable';
import { Calendar, UserCheck, UserMinus, Clock, Filter, Download } from 'lucide-react';

export const Attendance = () => {
  const [showEdit, setShowEdit] = useState(false);
  const [selection, setSelection] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [data, setData] = useState([]);

  const fetchAttendance = async () => {
    try {
      const response = await fetch("http://localhost:3001/attendance");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  useEffect(() => { fetchAttendance(); }, []);

  const updateStatus = async () => {
    if (!selectedId) return;
    try {
      const response = await fetch(`http://localhost:3001/attendance/${selectedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selection }),
      });
      if (response.ok) {
        await fetchAttendance();
        setShowEdit(false);
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  const onEdit = (row: { id: number; status: string }) => {
    setSelectedId(row.id);
    setSelection(row.status);
    setShowEdit(true);
  };

  const columns = [
    { header: "Employee", accessor: "employee_name" }, // Combined for cleaner look
    { header: "Date", accessor: "attendance_date" },
    { header: "Check-In", accessor: "check_in" },
    { header: "Check-Out", accessor: "check_out" },
    { header: "Status", accessor: "status" },
    { header: "Action", type: "action" }
  ];

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === "present") return "text-emerald-700 bg-emerald-50 border border-emerald-100";
    if (s === "pending") return "text-amber-700 bg-amber-50 border border-amber-100";
    if (s === "absent") return "text-rose-700 bg-rose-50 border border-rose-100";
    return "text-gray-600 bg-gray-50 border border-gray-100";
  };

  return (
    <div className="p-6 bg-[#f8f9fa] min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Attendance Management</h2>
          <p className="text-xs text-gray-500 mt-1">Monitor and manage employee daily logs</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={14} /> Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Present", value: "42", icon: UserCheck, color: "text-emerald-600" },
          { label: "On Leave", value: "05", icon: UserMinus, color: "text-rose-600" },
          { label: "Late Arrivals", value: "12", icon: Clock, color: "text-amber-600" },
          { label: "Work Period", value: "Feb 2026", icon: Calendar, color: "text-blue-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">{stat.label}</p>
              <p className="text-lg font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table
          columns={columns}
          TB={data}
          getStatusColor={getStatusColor}
          onEdit={onEdit}
        />
      </div>

      {/* Google-Style Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <h3 className="text-base font-bold text-gray-800 mb-1">Update Status</h3>
            <p className="text-xs text-gray-500 mb-6">Modify attendance record for this employee.</p>

            <label className="text-[10px] font-bold uppercase text-gray-400 mb-2 block">Select Status</label>
            <select
              value={selection}
              onChange={(e) => setSelection(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all mb-8"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Pending">Pending</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEdit(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={updateStatus}
                className="px-5 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md shadow-blue-100 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};