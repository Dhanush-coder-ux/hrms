import { useState, useEffect } from "react";
import { EmpLeaveTable } from "../../../Components/table/EmpLeaveTable";
import { useNavigate } from "react-router-dom";

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

export const EMPleaves = () => {
  const [data, setData] = useState<Empleaves[]>([]);
  const navigate = useNavigate();

  const fetchEmpleave = async () => {
    try {
      const response = await fetch("http://localhost:3001/Total_leaves");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  useEffect(() => {
    fetchEmpleave();
  }, []);

  const columns = [
    { header: "Employee ID", accessor: "empid" },
    { header: "Employee Name", accessor: "name" },
    { header: "Total Days", accessor: "total_leave" },
    { header: "Used Days", accessor: "used_leave" },
    { header: "Available Days", accessor: "available_leaves" },
  ];

  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold mb-4">Leave Management</h2>

      <EmpLeaveTable
        columns={columns}
        data={data}
        onRowClick={(row) =>
          navigate(`/employee-leave/${row.empid}`, { state: row })
        }
      />
    </section>
  );
};