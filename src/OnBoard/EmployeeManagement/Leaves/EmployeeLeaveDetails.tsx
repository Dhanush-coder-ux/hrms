import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../Components/Common/Button";
import type{Empleaves} from "../../../Types/typesEmployeeManagement"
import { Backbutton } from "../../../Components/Common/Backbutton";
import { LeaveStateCard } from "./LeaveStateCard";
import { LeaveHistoryTable } from "./LeaveHistoryTable";


export const EmployeeLeaveDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { empid } = useParams();
  const employee = location.state as Empleaves;


  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <p className="text-xl text-gray-600 mb-4">No data found for Employee ID: <span className="font-mono text-red-500">{empid}</span></p>
        <Button B_name="Return to Dashboard" ClickToAction={() => navigate(-1)} />
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved": return "bg-green-100 text-green-700 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "rejected": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="h-full overflow-auto max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <Backbutton/>
          <h2 className="text-3xl font-extrabold text-gray-800">Leave Details</h2>
          <p className="text-gray-500">Employee ID: <span className="font-medium text-blue-600">{employee.Emp_id}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <LeaveStateCard cardName={"Employee Name"} value={employee.employee_name} nameColor="text-gray-500" />
        <LeaveStateCard cardName={"Total Quota"} value={employee.total_leave} nameColor="text-blue-600" valueColor="text-blue-800" bgColor="bg-blue-100" borderColor="border-blue-100" />
        <LeaveStateCard cardName={"Leave Used"} value={employee.Used} nameColor="text-orange-600" valueColor="text-orange-800" bgColor="bg-orange-100" borderColor="border-orange-100" />
         <LeaveStateCard cardName={"Available"} value={employee.available_leaves} nameColor="text-green-600" valueColor="text-green-800" bgColor="bg-green-100" borderColor="border-green-100" />
      </div>

      <LeaveHistoryTable 
        history={employee.leave_history} 
        getStatusStyle={getStatusStyle} 
      />
    </div>
  );
};
