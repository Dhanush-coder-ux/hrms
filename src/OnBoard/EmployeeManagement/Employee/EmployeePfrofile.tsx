import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Check, 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Building2, 
  Calendar,
  ShieldCheck
} from "lucide-react";

import { FormFiled } from "../../../Components/Common/FormFiled";
import { Selection } from "../../../Components/Common/Selection";
import { CustomDatePicker } from "../../../Components/Common/CustomDatePicker";

const API_URL = "http://localhost:3001/employees";
const DEPARTMENTS = ["Engineering", "Design", "Marketing", "HR", "Finance"];

export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    department: "Engineering",
    status: "Active",
    dateOfJoining: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (id) {
      setFetching(true);
      fetch(`${API_URL}/${id}`)
        .then(res => res.json())
        .then(data => {
          setForm(data);
          setFetching(false);
        })
        .catch(() => setFetching(false));
    }
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      navigate("/employees");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Loader2 className="animate-spin text-indigo-600" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {id ? "Edit Profile" : "New Hire"}
            </h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Employee Management System
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
          {id ? "Update Employee" : "Save Record"}
        </button>
      </div>

      <div className="max-w-6xl mx-auto mt-8 px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
            <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
              <User size={40} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">{form.name || "Employee Name"}</h2>
            <p className="text-sm text-slate-500 mb-6">{form.designation || "Designation"}</p>
            
            <div className="space-y-3">
              <Selection
                label="Employment Status"
                name="status"
                value={form.status}
                onChange={handleChange}
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                ]}
              />
              <CustomDatePicker
                Lable="Joining Date"
                name="dateOfJoining"
                value={form.dateOfJoining}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100">
            <ShieldCheck className="mb-4 opacity-80" />
            <h3 className="font-semibold mb-2">Access Control</h3>
            <p className="text-xs text-indigo-200 leading-relaxed">
              Ensure all information is verified against government-issued ID before saving record.
            </p>
          </div>
        </div>

        {/* Right Column: Information Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Info Group */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <User size={18} className="text-indigo-600" />
              <h3 className="font-bold text-slate-700">Personal Details</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormFiled
                Lable="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                in_PlaceHolder="e.g. John Doe"
              />
              <FormFiled
                Lable="Email Address"
                name="email"
                value={form.email}
                onChange={handleChange}
                in_PlaceHolder="john@company.com"
              />
              <FormFiled
                Lable="Phone Number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                in_PlaceHolder="+1 234 567 890"
              />
            </div>
          </div>

          {/* Work Info Group */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <Building2 size={18} className="text-indigo-600" />
              <h3 className="font-bold text-slate-700">Work Information</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormFiled
                Lable="Official Designation"
                name="designation"
                value={form.designation}
                onChange={handleChange}
                in_PlaceHolder="e.g. Senior Product Designer"
              />
              <Selection
                label="Department"
                name="department"
                value={form.department}
                onChange={handleChange}
                options={DEPARTMENTS.map(d => ({ label: d, value: d }))}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}