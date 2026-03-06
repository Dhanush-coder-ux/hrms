import { useEffect, useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';

import { Table } from '../../Components/table/EmployeeTable.tsx';
import PageLoading from '../../../Components/Common/PageLoading.tsx';

const API_URL = "http://localhost:3001/employees";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  status: string;
  dateOfJoining: string;
}

export const Employee = () => {

  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Designation", accessor: "designation" },
    { header: "Department", accessor: "department" },
    { header: "Status", accessor: "status" },
    { header: "Joining Date", accessor: "dateOfJoining" }
  ];

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error();
      const json = await res.json();
      setData(json);
    } catch {
      setError("Unable to connect to the HRMS database.");
    } finally {
      setLoading(false);
    }
  };



  if (loading) return (
    <PageLoading />
  );

  if (error) return (
    <div className="h-96 flex flex-col items-center justify-center text-rose-500 gap-2">
      <AlertCircle size={32} />
      <p className="font-semibold">{error}</p>
      <button onClick={fetchEmployees} className="text-xs underline text-gray-500">Retry</button>
    </div>
  );

  return (
    <div className="p-6 bg-[#f8f9fa] min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800">Employee Directory</h2>
            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              {data.length} Total
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Manage staff profiles and employment status</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input type="text" placeholder="Quick find..." className="w-full md:w-64 pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" />
          </div>

        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table columns={columns} data={data} />
      </div>
    </div>
  );
};