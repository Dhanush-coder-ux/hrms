import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Check } from "lucide-react";

import { FormFiled } from "../../../Components/Common/FormFiled";
import { Selection } from "../../../Components/Common/Selection";
import { CustomDatePicker } from "../../../Components/Common/CustomDatePicker";

const API_URL = "http://localhost:3001/employees";

const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Marketing",
  "HR",
  "Finance",
];

interface Employee {
  id?: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  status: string;
  dateOfJoining: string;
}

type InputChange =
  | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  | { target: { name: string; value: string } };

export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<Employee>({
    name: "",
    email: "",
    phone: "",
    designation: "",
    department: "Engineering",
    status: "Active",
    dateOfJoining: "",
  });

  const [loading, setLoading] = useState(false);

  // Load employee if editing
  useEffect(() => {
    if (!id) return;

    fetch(`${API_URL}/${id}`)
      .then((res) => res.json())
      .then((data) => setForm(data));
  }, [id]);

  // Handle input change
  const handleChange = (e: InputChange) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save employee
  const handleSave = async () => {
    setLoading(true);

    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/${id}` : API_URL;

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setLoading(false);
    navigate("/employees");
  };

  return (
  <div className="min-h-screen bg-slate-50 p-8">

    {/* Back Button */}
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-gray-500 hover:text-black mb-6"
    >
      <ChevronLeft size={18} />
      Back
    </button>

    {/* Profile Header */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
      <div className="bg-linear-to-r from-indigo-500 to-indigo-600 px-6 py-6 rounded-t-xl">
        <h1 className="text-white text-2xl font-semibold">
          {id ? "Edit Employee Profile" : "Add New Employee"}
        </h1>
        <p className="text-indigo-100 text-sm mt-1">
          Manage employee personal and work information
        </p>
      </div>
    </div>

    {/* Form Card */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">

      {/* Personal Info */}
      <h2 className="text-sm font-semibold text-gray-400 uppercase mb-5">
        Personal Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <FormFiled
          Lable="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          in_PlaceHolder="Enter employee name"
        />

        <FormFiled
          Lable="Email Address"
          name="email"
          value={form.email}
          onChange={handleChange}
          in_PlaceHolder="Enter email"
        />

        <FormFiled
          Lable="Phone Number"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          in_PlaceHolder="Enter phone number"
        />

        <FormFiled
          Lable="designation"
          name="designation"
          value={form.designation}
          onChange={handleChange}
          in_PlaceHolder="Enter designation"
        />
      </div>

      {/* Divider */}
      <hr className="my-6 border-gray-100" />

      {/* Work Info */}
      <h2 className="text-sm font-semibold text-gray-400 uppercase mb-5">
        Work Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Selection
          label="Department"
          name="department"
          value={form.department}
          onChange={handleChange}
          options={DEPARTMENTS.map((d) => ({
            label: d,
            value: d,
          }))}
        />

        <Selection
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          options={[
            { label: "Active", value: "Active" },
            { label: "Inactive", value: "Inactive" },
          ]}
        />

        <CustomDatePicker
          Lable="Date Of Joining"
          name="dateOfJoining"
          value={form.dateOfJoining}
          onChange={handleChange}
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          <Check size={18} />
          {loading ? "Saving..." : "Save Employee"}
        </button>
      </div>

    </div>
  </div>
);
}