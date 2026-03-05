import { useEffect, useState } from 'react';
import { Plus, Users, Search, X, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../../Components/Common/Button';
import { FormFiled } from '../../Components/Common/FormFiled';
import { Selection } from "../../Components/Common/Selection";
import { CustomDatePicker } from '../../Components/Common/CustomDatePicker.tsx';
import { Table } from '../../Components/table/EmployeeTable.tsx';
import PageLoading from '../../Components/Common/PageLoading.tsx';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const departmentOptions = [
    { label: "HR", value: "hr" },
    { label: "IT", value: "it" },
    { label: "Finance", value: "finance" },
  ];
  
  const ActiveStatus = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" } 
  ];

  const [formData, setFormData] = useState<Employee>({
    id: "", name: "", email: "", phone: "", department: "", designation: "", status: "Active", dateOfJoining: ""
  });

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

  const onChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: Employee) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async () => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const saved = await res.json();
      setData(prev => [...prev, saved]);
      setIsModalOpen(false);
      // Reset logic...
    } catch {
      alert("Error saving employee.");
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
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            <Plus size={16} /> Add Staff
          </button>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table columns={columns} data={data} />
      </div>

      {/* Google-Level Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h1 className="text-lg font-bold text-gray-800">New Employee Profile</h1>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Step 1: Personnel Details</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <FormFiled name="id" value={formData.id} Lable="Employee Code" in_PlaceHolder="e.g. EMP-102" onChange={onChange} />
              <FormFiled name="name" value={formData.name} Lable="Full Name" in_PlaceHolder="John Doe" onChange={onChange} />
              <FormFiled name="designation" value={formData.designation} Lable="Designation" in_PlaceHolder="Senior Lead" onChange={onChange} />
              <Selection label="Status" name="status" options={ActiveStatus} value={formData.status} onChange={onChange} />
              <Selection label="Department" name="department" options={departmentOptions} value={formData.department} onChange={onChange} placeholder="Choose Dept" />
              <FormFiled name="email" value={formData.email} Lable="Professional Email" in_PlaceHolder="john@company.com" onChange={onChange} />
              <CustomDatePicker name="dateOfJoining" value={formData.dateOfJoining} Lable="Date of Joining" onChange={onChange} />
              <FormFiled name="phone" value={formData.phone} Lable="Contact Number" in_PlaceHolder="+1 234..." onChange={onChange} />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-3 rounded-b-2xl">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={onSubmit}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-md shadow-blue-100 transition-all"
              >
                Create Profile
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};