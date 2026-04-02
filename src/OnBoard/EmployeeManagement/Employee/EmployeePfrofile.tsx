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
  Edit3,
  Building,
  GraduationCap,
  Calendar,
} from "lucide-react";
import { FaMapPin } from "react-icons/fa";
import { FormFiled } from "../../../Components/Common/FormFiled";
import { Selection } from "../../../Components/Common/Selection";
import { CustomDatePicker } from "../../../Components/Common/CustomDatePicker";

// --- API CONFIGURATION ---
const BASE_URL = "http://127.0.0.1:8000/employee";
const Edu_Get_URL           = (id: string) => `${BASE_URL}/EmployeeEducation/${id}`;
const Edu_UPDATE_URL        = (id: string) => `${BASE_URL}/EmployeeEducationUpdate/${id}`; // FIX: was EmployeeUpdate
const DEPENDENTS_Get_URL    = (id: string) => `${BASE_URL}/EmployeeDependents/${id}`;
const DEPENDENTS_UPDATE_URL = (id: string) => `${BASE_URL}/EmployeeDependentsUpdate/${id}`;

const DEPARTMENTS = ["Engineering", "Design", "Marketing", "HR", "Finance"];

// FIX: backend raises HTTP 404 (not empty array) when no records exist.
// Treating 404 as empty result prevents the .catch(() => []) from hiding real errors.
async function fetchOrEmpty(url: string): Promise<any[]> {
  try {
    const res = await fetch(url);
    if (res.status === 404) return [];       // no records — not a real error
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn("fetchOrEmpty failed:", url, err);
    return [];
  }
}

export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(!id);
  const [loading, setLoading]     = useState(false);
  const [fetching, setFetching]   = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    Department: "",
    Status: "",
    DateOfJoining: "",
    Street: "",
    City: "",
    State: "",
    Pin_Code: "",
    // Education — backend schema: degree, institution, graduationYear
    // degree: "",
    // institution: "",
    // graduation_year: "",
    education: [
  {
    degree: "",
    institution: "",
    graduation_year: "",
  },
],

    // Dependents — backend schema: person_name, relationship_type, contact, person_dob
    Dependents:[
      {
        dep_name: "",
        dep_relationship: "",
        dep_contact: "",
        dep_dob: "",
      }
    ]
  });
 

  useEffect(() => {
    if (!id) return;
    setFetching(true);

    Promise.all([
      fetch(`${BASE_URL}/${id}`).then((res) => {
        if (!res.ok) throw new Error("Employee not found");
        return res.json();
      }),
      fetchOrEmpty(Edu_Get_URL(id)),
      fetchOrEmpty(DEPENDENTS_Get_URL(id)),
    ])
      .then(([empData, eduData, depData]) => {
        setForm((prev) => ({
          ...prev,
          ...empData,
          // Backend returns: { degree, institution, graduationYear }
          education: eduData.length
  ? eduData.map((edu: any) => ({
      degree: edu.degree,
      institution: edu.institution,
      graduation_year: edu.graduationYear,
    }))
  : [{ degree: "", institution: "", graduation_year: "" }],

          // Backend returns: { person_name, relationship_type, contact, person_dob }
          Dependents: depData.length? depData.map((dep: any) => ({
            dep_name: dep.person_name,
            dep_relationship: dep.relationship_type,
            dep_contact: dep.contact,
            dep_dob: dep.person_dob,
          })) : [{ dep_name: "", dep_relationship: "", dep_contact: "", dep_dob: "" }],

        }));
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setFetching(false));
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (!id) {
        const res = await fetch(`${BASE_URL}/Register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Create failed");
        navigate("/employees");
        return;
      }

      const [empRes, eduRes, depRes] = await Promise.all([
        // 1. Employee basic info
        fetch(`${BASE_URL}/EmployeeUpdate/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }),
        // 2. Education — keys must match backend EducationCreate schema
        fetch(Edu_UPDATE_URL(id), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
  form.education.map((edu) => ({
    degree: edu.degree,
    institution: edu.institution,
    graduationYear: edu.graduation_year || null,
  }))
)
,
        }),
        // 3. Dependents — keys must match backend DependentCreate schema
        fetch(DEPENDENTS_UPDATE_URL(id), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(

  form.Dependents.map((dep) => ({  
    person_name: dep.dep_name,      
    relationship_type: dep.dep_relationship,      
    contact: dep.dep_contact,      
    person_dob: dep.dep_dob || null,   }))
   ),
        }), 
      ]);

      // Check each response individually for clearer error messages
      if (!empRes.ok) throw new Error(`Employee update failed (${empRes.status})`);
      if (!eduRes.ok) throw new Error(`Education update failed (${eduRes.status})`);
      if (!depRes.ok) throw new Error(`Dependents update failed (${depRes.status})`);

      setIsEditing(false);
      alert("Employee updated successfully!");
    } catch (error: any) {
      console.error("Save error:", error);
      alert(`Something went wrong: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Top Nav */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <h1 className="text-xl font-bold text-slate-900">
            {!id ? "New Hire" : isEditing ? "Edit Profile" : "Employee Details"}
          </h1>
        </div>

        <div className="flex gap-3">
          {id && !isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-50 transition-all shadow-sm"
            >
              <Edit3 size={18} /> Edit Profile
            </button>
          ) : (
            <>
              {id && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 text-slate-600 font-medium hover:text-slate-800"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 shadow-lg transition-all disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                {id ? "Update Employee" : "Save Record"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 gap-4 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6  gap-2 text-center">
<div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
    <User size={40} />
  </div>

  {/* Added mb-1 for a small gap below the name */}
  <h2 className="text-lg font-bold mt-1 mb-1 text-slate-800">
    {form.name || "New Employee"}
  </h2>

  {/* Added mb-3 to create space before the status badge */}
  <p className="text-sm text-slate-500 mb-3">
    {form.designation || "No Designation Set"}
  </p>

  {/* Reduced mb-8 to mb-6 to pull the "Joined" section slightly closer */}
  <div className="mb-6">
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
        form.Status === "Active"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-500"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          form.Status === "Active" ? "bg-green-500" : "bg-red-400"
        }`}
      />
      {form.Status || "—"}
    </span>
  </div>

            <div className="space-y-4 text-left">
              {isEditing ? (
                <>
                  <Selection
                    label="Employment Status"
                    name="Status"
                    value={form.Status}
                    onChange={handleChange}
                    options={[
                      { label: "Active",   value: "Active" },
                      { label: "Inactive", value: "Inactive" },
                    ]}
                  />
                  <CustomDatePicker
                    Lable="Joining Date"
                    name="DateOfJoining"
                    value={form.DateOfJoining}
                    onChange={handleChange}
                  />
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Joined</span>
                    <span className="font-semibold text-slate-700">
                      {form.DateOfJoining || "—"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal & Work Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <User size={18} className="text-indigo-600" />
              <h3 className="font-bold text-slate-700">Personal & Work Details</h3>
            </div>
            <div className="p-6">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormFiled Lable="Full Name"   name="name"        value={form.name}        onChange={handleChange} in_PlaceHolder="Enter full name" />
                  <FormFiled Lable="Email"       name="email"       value={form.email}       onChange={handleChange} in_PlaceHolder="Enter email address" />
                  <FormFiled Lable="Phone"       name="phone"       value={form.phone}       onChange={handleChange} in_PlaceHolder="Enter phone number" />
                  <FormFiled Lable="Designation" name="designation" value={form.designation} onChange={handleChange} in_PlaceHolder="Enter designation" />
                  <Selection
                    label="Department"
                    name="Department"
                    value={form.Department}
                    onChange={handleChange}
                    options={DEPARTMENTS.map((d) => ({ label: d, value: d }))}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                  <DetailItem icon={<User size={16} />}      label="Full Name"   value={form.name} />
                  <DetailItem icon={<Mail size={16} />}      label="Email"       value={form.email} />
                  <DetailItem icon={<Phone size={16} />}     label="Phone"       value={form.phone} />
                  <DetailItem icon={<Briefcase size={16} />} label="Designation" value={form.designation} />
                  <DetailItem icon={<Building2 size={16} />} label="Department"  value={form.Department} />
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <Building size={18} className="text-indigo-600" />
              <h3 className="font-bold text-slate-700">Address</h3>
            </div>
            <div className="p-6">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormFiled Lable="Street"   name="Street"   value={form.Street}   onChange={handleChange} in_PlaceHolder="" />
                  <FormFiled Lable="City"     name="City"     value={form.City}     onChange={handleChange} in_PlaceHolder="" />
                  <FormFiled Lable="State"    name="State"    value={form.State}    onChange={handleChange} in_PlaceHolder="" />
                  <FormFiled Lable="Pin Code" name="Pin_Code" value={form.Pin_Code} onChange={handleChange} in_PlaceHolder="" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                  <DetailItem icon={<Building size={16} />}  label="Street"   value={form.Street} />
                  <DetailItem icon={<Building2 size={16} />} label="City"     value={form.City} />
                  <DetailItem icon={<Building2 size={16} />} label="State"    value={form.State} />
                  <DetailItem icon={<FaMapPin size={16} />}  label="Pin Code" value={form.Pin_Code} />
                </div>
              )}
            </div>
          </div>

          {/* Education */}
<div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
  <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
    <GraduationCap size={18} className="text-indigo-600" />
    <h3 className="font-bold text-slate-700">Education</h3>
  </div>
  
  <div className="p-6">
    {isEditing ? (
      <div className="flex flex-col gap-8">
        {form.education.map((edu, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
            <FormFiled Lable="Degree" name={`education[${index}].degree`} value={edu.degree} onChange={handleChange} in_PlaceHolder="Enter degree" />
            <FormFiled Lable="Institution" name={`education[${index}].institution`} value={edu.institution} onChange={handleChange} in_PlaceHolder="Enter institution" />
            <FormFiled Lable="Year of Graduation" name={`education[${index}].graduation_year`} value={edu.graduation_year} onChange={handleChange} in_PlaceHolder="Enter year" />
          </div>
        ))}
        
        <button
          type="button"
          onClick={() => setForm({
            ...form,
            education: [...form.education, { degree: "", institution: "", graduation_year: "" }],
          })}
          className="w-fit text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          + Add Education
        </button>
      </div>
    ) : (
      /* VIEW MODE: One row per education entry */
      <div className="flex flex-col gap-6">
        {form.education.map((edu, index) => (
          <div 
            key={index} 
            className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-slate-100 last:border-0 last:pb-0"
          >
            <DetailItem label="DEGREE" value={edu.degree} />
            <DetailItem label="INSTITUTION" value={edu.institution} />
            <DetailItem label="YEAR" value={edu.graduation_year} />
          </div>
        ))}
      </div>
    )}
  </div>
</div>

          {/* Dependents */}
<div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
  <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
    <User size={18} className="text-indigo-600" />
    <h3 className="font-bold text-slate-700">Dependents</h3>
  </div>

  <div className="p-6">
    {isEditing ? (
      /* EDIT MODE: Changed to grid-cols-1 for vertical stacking */
      <div className="space-y-6">
        {form.Dependents.map((dep, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-slate-100 last:border-0">
            <FormFiled Lable="Name" name={`Dependents[${index}].dep_name`} value={dep.dep_name} onChange={handleChange} in_PlaceHolder="Enter dependent's name" />
            <FormFiled Lable="Relationship" name={`Dependents[${index}].dep_relationship`} value={dep.dep_relationship} onChange={handleChange} in_PlaceHolder="Enter relationship" />
            <FormFiled Lable="Contact" name={`Dependents[${index}].dep_contact`} value={dep.dep_contact} onChange={handleChange} in_PlaceHolder="Enter contact" />
            <FormFiled Lable="Date of Birth" name={`Dependents[${index}].dep_dob`} value={dep.dep_dob} onChange={handleChange} in_PlaceHolder="YYYY-MM-DD" />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setForm({
            ...form,
            Dependents: [...form.Dependents, { dep_name: "", dep_relationship: "", dep_contact: "", dep_dob: "" }],
          })}
          className="mt-2 text-indigo-600 font-medium hover:underline"
        >
          + Add Dependent
        </button>
      </div>
    ) : (
      /* VIEW MODE: Changed to grid-cols-1 to ensure row-wise display */
      <div className="grid grid-cols-1 gap-y-8">
        {form.Dependents.map((dep, index) => (
          <div 
            key={index} 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-slate-100 last:border-0 last:pb-0"
          >
            <DetailItem label="NAME" value={dep.dep_name} />
            <DetailItem label="RELATIONSHIP" value={dep.dep_relationship} />
            <DetailItem label="CONTACT" value={dep.dep_contact} />
            <DetailItem label="DATE OF BIRTH" value={dep.dep_dob} />
          </div>
        ))}
      </div>
    )}
  </div>
</div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-slate-400">{icon}</div>
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-slate-800 font-medium">{value || "—"}</p>
      </div>
    </div>
  );
}