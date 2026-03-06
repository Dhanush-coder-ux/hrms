import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../../Components/Common/Button";

interface LeaveHistory {
  apply_date: string;
  from_date: string;
  to_date: string;
  number_of_days: number;
  approve_status: string;
  reason: string;
}

interface Empleaves {
  empid: string;
  name: string;
  total_leave: number;
  used_leave: number;
  available_leaves: number;
  leave_history: LeaveHistory[];
}

export const EmployeeLeaveDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { empid } = useParams();
  const employee = location.state as Empleaves;

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 p-6 text-center">
        <p className="text-xl text-gray-600 mb-4">No data found for Employee ID: <span className="font-mono text-red-500">{empid}</span></p>
        <Button B_name="Return to Dashboard" ClickToAction={() => navigate(-1)}/>
      </div>
    );
  }

  // Helper function for status badges
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800">Leave Details</h2>
          <p className="text-gray-500">Employee ID: <span className="font-medium text-blue-600">{employee.empid}</span></p>
        </div>
        <Button B_name="← Back" ClickToAction={() => navigate(-1)}/>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Employee Name</p>
          <p className="text-xl font-bold text-gray-800 mt-1">{employee.name}</p>
        </div>
        <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
          <p className="text-sm text-blue-600 uppercase tracking-wider font-semibold">Total Quota</p>
          <p className="text-2xl font-black text-blue-800 mt-1">{employee.total_leave}</p>
        </div>
        <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
          <p className="text-sm text-orange-600 uppercase tracking-wider font-semibold">Leaves Used</p>
          <p className="text-2xl font-black text-orange-800 mt-1">{employee.used_leave}</p>
        </div>
        <div className="bg-green-50 p-5 rounded-xl border border-green-100">
          <p className="text-sm text-green-600 uppercase tracking-wider font-semibold">Available</p>
          <p className="text-2xl font-black text-green-800 mt-1">{employee.available_leaves}</p>
        </div>
      </div>

      {/* History Table Container */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h3 className="text-lg font-bold text-gray-700">Detailed History</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
                <th className="px-6 py-4">Applied On</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4 text-center">Days</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employee.leave_history.map((leave, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600">{leave.apply_date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    {leave.from_date} <span className="text-gray-400 mx-2">→</span> {leave.to_date}
                  </td>
                  <td className="px-6 py-4 text-sm text-center font-bold text-gray-700">{leave.number_of_days}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(leave.approve_status)}`}>
                      {leave.approve_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 italic max-w-xs truncate">
                    "{leave.reason}"
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};