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
  ArrowRightIcon,
  Banknote
} from "lucide-react";
import { FaMapPin, FaRegBuilding } from "react-icons/fa";
import { FormFiled } from "../../../Components/Common/FormFiled";
import { Selection } from "../../../Components/Common/Selection";
import { CustomDatePicker } from "../../../Components/Common/CustomDatePicker";
import { Api_URL } from "../../../APILINK";
import { useListOptions } from "../../../Hooks/ListOption";

const BASE_URL = Api_URL;

const Edu_GET_URL        = (id: string) => `${BASE_URL}/employee/EmployeeEducation/${id}`;
const Edu_UPDATE_URL     = (id: string) => `${BASE_URL}/employee/EmployeeEducationUpdate/${id}`;
const Edu_CREATE_URL     = (id: string) => `${BASE_URL}/employee/EmployeeEducationCreate/${id}`;
const FamilyS_GET_URL    = (id: string) => `${BASE_URL}/employee/EmployeeFamilys/${id}`;
const FamilyS_UPDATE_URL = (id: string) => `${BASE_URL}/employee/EmployeeFamilysUpdate/${id}`;
const FamilyS_CREATE_URL = (id: string) => `${BASE_URL}/employee/EmployeeFamilysCreate/${id}`;

const Work_GET_URL        = (id: string) => `${BASE_URL}/employee/EmployeeWorkExp/${id}`;
const Work_UPDATE_URL     = (id: string) => `${BASE_URL}/employee/EmployeeWorkExpUpdate/${id}`;
const Work_CREATE_URL     = (id: string) => `${BASE_URL}/employee/EmployeeWorkExpCreate/${id}`;

// ─── Helpers ────────────────────────────────────────────────────────────────

async function fetchOrEmpty(url: string): Promise<any[]> {
  try {
    const res = await fetch(url);
    if (res.status === 404) return [];
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn("fetchOrEmpty failed:", url, err);
    return [];
  }
}

/**
 * Try PUT first. If 404 (no record yet) fall back to POST to create.
 */
async function upsertData(
  updateUrl: string,
  createUrl: string,
  body: any
): Promise<void> {
  const putRes = await fetch(updateUrl, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (putRes.status === 404) {
    // No existing record → create
    console.warn(`PUT 404 on ${updateUrl} → falling back to POST ${createUrl}`);
    const postRes = await fetch(createUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!postRes.ok) {
      throw new Error(`Create failed (${postRes.status}) on ${createUrl}`);
    }
  } else if (!putRes.ok) {
    throw new Error(`Update failed (${putRes.status}) on ${updateUrl}`);
  }
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const providerOptions = useListOptions(`${Api_URL}/payroll/providers`);
  const departmentOptions = useListOptions(`${Api_URL}/departments/`);

  const [isEditing, setIsEditing] = useState(!id);
  const [loading, setLoading]     = useState(false);
  const [fetching, setFetching]   = useState(false);

  const [form, setForm] = useState({
    name: "",
    f_name: "",
    l_name: "",
    gender: "",
    dob: "",
    email: "",
    phone: "",
    designation: "",
    Department: "",
    Status: "",
    DateOfJoining: "",

    // Address
    Street: "",
    City: "",
    State: "",
    Pin_Code: "",
    p_Street: "",
    p_City: "",
    p_State: "",
    p_Pin_Code: "",

    // Insurance / PF
    apply_esi: "",
    uan_number: "",
    pf_id: "",
    insurance_no: "",
    aadhar_no: "",
    esi_no: "",
    esi_name: "",
    insurance_provider: "",

    // Salary / Payroll
    provider: "",
    emp_type: "",
    payType: "",
    currency: "",
    base_salary: 0,
    gross_salary: 0,
    total_earnings: 0,
    total_deductions: 0,
    net_salary: 0,
    earnings_breakdown: [] as any[],
    deductions_breakdown: [] as any[],

    annualSalary: 0,
    bonus_Type: "",
    bonus_CalculationMode: "",
    bonus_Value: 0,

    // Bank
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    panNumber: "",
    payFrequency: "",

    education: [
      { degree: "", institution: "", graduationYear: "" },
    ],

    WorkExp: [
      { company_name: "", position: "", FromDate: "", ToDate: "" },
    ],

    Familys: [
      { 
        person_name: "", 
        relationship_type: "", 
        contact: "", 
        person_dob: "",
        nominees: [{ nominee_name: "", nominee_aadhar: "" }] 
      },
    ],
  });

  // ─── Fetch on mount ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!id) return;
    setFetching(true);

    Promise.all([
      fetch(`${BASE_URL}/employee/${id}`).then((res) => {
        if (!res.ok) throw new Error("Employee not found");
        return res.json();
      }),
      fetchOrEmpty(Edu_GET_URL(id)),
      fetchOrEmpty(FamilyS_GET_URL(id)),
      fetchOrEmpty(Work_GET_URL(id)),
    ])
      .then(([empData, eduData, depData, workData]) => {
        // FIX: empData.Employee contains all employee fields (name, email, bankName, etc.)
        // empData top-level has computed fields: monthly_salary, PF, EPF, EPS
        const empInfo = empData.Employee || {};

        console.log("empData:", empData);
        console.log("empInfo:", empInfo);
        console.log("eduData:", eduData);
        console.log("depData:", depData);

        setForm((prev) => ({
          ...prev,

          // FIX: spread empInfo (Employee object) NOT empData
          // This correctly loads: name, email, phone, bankName, accountNumber, etc.
          ...empInfo,

          // Computed salary fields live at the top level of empData
          // Dynamic payroll results from new calculation system
          base_salary:          empData.base_salary ?? 0,
          gross_salary:         empData.gross_salary ?? 0,
          total_earnings:       empData.total_earnings ?? 0,
          total_deductions:     empData.total_deductions ?? 0,
          net_salary:           empData.net_salary ?? 0,
          earnings_breakdown:   empData.earnings_breakdown ?? [],
          deductions_breakdown: empData.deductions_breakdown ?? [],

          education: eduData.length
            ? eduData.map((edu: any) => ({
                degree:          edu.degree,
                institution:     edu.institution,
                graduationYear:  edu.graduationYear,
              }))
            : [{ degree: "", institution: "", graduationYear: "" }],

          WorkExp: workData.length
            ? workData.map((w: any) => ({
                company_name: w.company_name,
                position:     w.position,
                FromDate:     w.FromDate,
                ToDate:       w.ToDate,
              }))
            : [{ company_name: "", position: "", FromDate: "", ToDate: "" }],

          Familys: depData.length
            ? depData.map((dep: any) => ({
                person_name:       dep.person_name,
                relationship_type: dep.relationship_type,
                contact:           dep.contact,
                person_dob:        dep.person_dob,
                nominees:          dep.nominees && dep.nominees.length 
                  ? dep.nominees.map((n: any) => ({ nominee_name: n.nominee_name, nominee_aadhar: n.nominee_aadhar }))
                  : [{ nominee_name: "", nominee_aadhar: "" }]
              }))
            : [{ person_name: "", relationship_type: "", contact: "", person_dob: "", nominees: [{ nominee_name: "", nominee_aadhar: "" }] }],
        }));
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setFetching(false));
  }, [id]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    // Match "arrayName[index].fieldName" OR "arrayName[index].subArray[subIndex].fieldName"
    const deepMatch = name.match(/(\w+)\[(\d+)\]\.(\w+)\[(\d+)\]\.(\w+)/);
    const arrayMatch = name.match(/(\w+)\[(\d+)\]\.(\w+)/);

    if (deepMatch) {
      const [_, arrayName, index, subArrayName, subIndex, fieldName] = deepMatch;
      const idx = parseInt(index);
      const subIdx = parseInt(subIndex);
      setForm((prev: any) => {
        const updatedArray = [...prev[arrayName]];
        const updatedSubArray = [...updatedArray[idx][subArrayName]];
        updatedSubArray[subIdx] = { ...updatedSubArray[subIdx], [fieldName]: value };
        updatedArray[idx] = { ...updatedArray[idx], [subArrayName]: updatedSubArray };
        return { ...prev, [arrayName]: updatedArray };
      });
    } else if (arrayMatch) {
      const [_, arrayName, index, fieldName] = arrayMatch;
      const idx = parseInt(index);
      setForm((prev: any) => {
        const updatedArray = [...prev[arrayName]];
        updatedArray[idx] = { ...updatedArray[idx], [fieldName]: value };
        return { ...prev, [arrayName]: updatedArray };
      });
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      // ── CREATE ──────────────────────────────────────────────────────────
      if (!id) {
        const res = await fetch(`${BASE_URL}/employee/Register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error(`Create failed (${res.status})`);
        alert("Employee created successfully!");
        navigate("/employees");
        return;
      }

      // ── UPDATE EMPLOYEE ─────────────────────────────────────────────────
      console.log("EMP URL:", `${BASE_URL}/employee/EmployeeUpdate/${id}`);
      const empRes = await fetch(`${BASE_URL}/employee/EmployeeUpdate/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      console.log("EMP STATUS:", empRes.status);
      if (!empRes.ok) throw new Error(`Employee update failed (${empRes.status})`);

      // ── UPSERT EDUCATION ────────────────────────────────────────────────
      if (form.education && form.education.length > 0) {
        const hasData = form.education.some(
          (e) => e.degree || e.institution || e.graduationYear
        );
        if (hasData) {
          await upsertData(
            Edu_UPDATE_URL(id),
            Edu_CREATE_URL(id),
            form.education.map((edu) => ({
              degree:         edu.degree,
              institution:    edu.institution,
              graduationYear: edu.graduationYear || null,
            }))
          );
          console.log("Education upserted ✅");
        }
      }

      // ── UPSERT WORK EXP ──────────────────────────────────────────────────
      if (form.WorkExp && form.WorkExp.length > 0) {
        const hasData = form.WorkExp.some(
          (w) => w.company_name || w.position
        );
        if (hasData) {
          await upsertData(
            Work_UPDATE_URL(id),
            Work_CREATE_URL(id),
            form.WorkExp.map((w) => ({
              company_name: w.company_name,
              position:     w.position,
              FromDate:     w.FromDate || null,
              ToDate:       w.ToDate || null,
            }))
          );
          console.log("Work experience upserted ✅");
        }
      }

      // ── UPSERT FAMILY ───────────────────────────────────────────────────
      if (form.Familys && form.Familys.length > 0) {
        const hasData = form.Familys.some(
          (d) => d.person_name || d.relationship_type || d.contact
        );
        if (hasData) {
          await upsertData(
            FamilyS_UPDATE_URL(id),
            FamilyS_CREATE_URL(id),
            form.Familys.map((dep) => ({
              person_name:       dep.person_name,
              relationship_type: dep.relationship_type,
              contact:           dep.contact,
              person_dob:        dep.person_dob || null,
              nominees:          dep.nominees.filter(n => n.nominee_name || n.nominee_aadhar)
            }))
          );
          console.log("Family upserted ✅");
        }
      }

      setIsEditing(false);
      alert("✅ Employee updated successfully!");
    } catch (error: any) {
      console.error("🔥 Save error:", error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ─── Loading ───────────────────────────────────────────────────────────────

  if (fetching)
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="h-full overflow-y-auto custom-scrollbar pb-20">
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

        {/* ── Profile Card (left column) ─────────────────────────────────── */}
        <div className="lg:col-span-1 gap-4 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 gap-2 text-center">
            <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
              <User size={40} />
            </div>

            <h2 className="text-lg font-bold mt-1 mb-1 text-slate-800">
              {form.name || "New Employee"}
            </h2>

            <p className="text-sm text-slate-500 mb-1">
              {form.designation || "No Designation Set"}
            </p>
            <p className="text-sm text-slate-500 mb-3">
              {form.emp_type || ""}
            </p>

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
                  <Selection
                    label="Payroll Provider"
                    name="provider"
                    value={form.provider}
                    options={providerOptions}
                    onChange={handleChange}
                    placeholder="Select Provider"
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

              {/* Leave & Attendance */}
              <div className="flex flex-col justify-between text-sm mt-3">
                <h1 className="text-blue-700 font-medium mt-1 border-b border-slate-200 pb-2">
                  Leave and attendance
                </h1>
                <div className="flex justify-between text-sm mt-3">
                  <span className="text-slate-500 font-medium">Leave History</span>
                  <span className="text-slate-500 inline-flex items-center gap-1 cursor-pointer hover:translate-x-1 transition-transform">
                    See details
                    <ArrowRightIcon size={14} className="text-blue-500" />
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-3">
                  <span className="text-slate-500 font-medium">Attendance</span>
                  <span className="text-slate-500 inline-flex items-center gap-1 cursor-pointer hover:translate-x-1 transition-transform">
                    See details
                    <ArrowRightIcon size={14} className="text-blue-500" />
                  </span>
                </div>
              </div>

              {/* Payroll Details */}
              <div className="flex flex-col justify-between text-sm mt-3">
                <h1 className="text-blue-700 font-medium mt-1 border-b border-slate-200 pb-2">
                  PayRoll Details
                </h1>

                <div className="flex justify-between text-sm mt-3">
                  <span className="text-slate-500 font-medium">Payroll Provider</span>
                  <span className="font-semibold text-slate-700">
                    {providerOptions.find(p => p.value === form.provider)?.label || form.provider || "—"}
                  </span>
                </div>

                <div className="flex justify-between text-sm mt-3">
                  <span className="text-slate-500 font-medium">{form.payType || "Pay Type"}</span>
                  <span className="font-semibold text-slate-700">
                    {form.currency || "—"}
                  </span>
                </div>

                <div className="flex justify-between text-sm mt-3">
                  <span className="text-slate-500 font-medium">Annual Salary</span>
                  <span className="font-semibold text-slate-700">
                    {form.annualSalary || "—"} {form.annualSalary ? (form.currency || "") : ""}
                  </span>
                </div>

                <div className="flex justify-between text-sm mt-3">
                  <span className="text-slate-500 font-medium">Pay Frequency</span>
                  <span className="font-semibold text-slate-700">
                    {form.payFrequency || "—"}
                  </span>
                </div>

                <div className="flex justify-between text-sm mt-3">
                  <span className="text-slate-500 font-medium">Monthly Base</span>
                  <span className="font-semibold text-slate-700">
                    {form.base_salary || "—"} {form.currency || ""}
                  </span>
                </div>

                <div className="flex justify-between text-sm mt-3">
                  <span className="text-slate-500 font-medium">Gross Salary</span>
                  <span className="font-semibold text-indigo-600">
                    {form.gross_salary || "—"} {form.currency || ""}
                  </span>
                </div>

                <div className="flex justify-between text-sm mt-3">
                  <span className="text-slate-500 font-medium">Net Salary</span>
                  <span className="font-bold text-green-600 text-base">
                    {form.net_salary || "—"} {form.currency || ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column ───────────────────────────────────────────────── */}
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
                  <FormFiled Lable="First Name"   name="f_name"      value={form.f_name}      onChange={handleChange} in_PlaceHolder="Enter first name" />
                  <FormFiled Lable="Last Name"    name="l_name"      value={form.l_name}      onChange={handleChange} in_PlaceHolder="Enter last name" />
                  <FormFiled Lable="Email"        name="email"       value={form.email}       onChange={handleChange} in_PlaceHolder="Enter email address" />
                  <FormFiled Lable="Phone"        name="phone"       value={form.phone}       onChange={handleChange} in_PlaceHolder="Enter phone number" />
                  <Selection
                    label="Gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    options={[
                      { label: "Male",   value: "Male" },
                      { label: "Female", value: "Female" },
                      { label: "Other",  value: "Other" },
                    ]}
                  />
                  <CustomDatePicker
                    Lable="Date of Birth"
                    name="dob"
                    value={form.dob}
                    onChange={handleChange}
                  />
                  <FormFiled Lable="Designation" name="designation" value={form.designation} onChange={handleChange} in_PlaceHolder="Enter designation" />
                  <Selection
                    label="Department"
                    name="Department"
                    value={form.Department}
                    onChange={handleChange}
                    options={departmentOptions}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                  <DetailItem icon={<User size={16} />}      label="Full Name"   value={form.name} />
                  <DetailItem icon={<User size={16} />}      label="Gender"      value={form.gender} />
                  <DetailItem icon={<User size={16} />}      label="Date of Birth" value={form.dob} />
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
              <h3 className="font-bold text-slate-700">Address Details</h3>
            </div>
            <div className="p-6">
              {isEditing ? (
                <div className="space-y-8">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Current Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormFiled Lable="Street"   name="Street"   value={form.Street}   onChange={handleChange} in_PlaceHolder="" />
                      <FormFiled Lable="City"     name="City"     value={form.City}     onChange={handleChange} in_PlaceHolder="" />
                      <FormFiled Lable="State"    name="State"    value={form.State}    onChange={handleChange} in_PlaceHolder="" />
                      <FormFiled Lable="Pin Code" name="Pin_Code" value={form.Pin_Code} onChange={handleChange} in_PlaceHolder="" />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Permanent Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormFiled Lable="Street"   name="p_Street"   value={form.p_Street}   onChange={handleChange} in_PlaceHolder="" />
                      <FormFiled Lable="City"     name="p_City"     value={form.p_City}     onChange={handleChange} in_PlaceHolder="" />
                      <FormFiled Lable="State"    name="p_State"    value={form.p_State}    onChange={handleChange} in_PlaceHolder="" />
                      <FormFiled Lable="Pin Code" name="p_Pin_Code" value={form.p_Pin_Code} onChange={handleChange} in_PlaceHolder="" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Current</h4>
                    <DetailItem icon={<Building size={16} />}  label="Street"   value={form.Street} />
                    <DetailItem icon={<Building2 size={16} />} label="City"     value={form.City} />
                    <DetailItem icon={<Building2 size={16} />} label="State"    value={form.State} />
                    <DetailItem icon={<FaMapPin size={16} />}  label="Pin Code" value={form.Pin_Code} />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Permanent</h4>
                    <DetailItem icon={<Building size={16} />}  label="Street"   value={form.p_Street} />
                    <DetailItem icon={<Building2 size={16} />} label="City"     value={form.p_City} />
                    <DetailItem icon={<Building2 size={16} />} label="State"    value={form.p_State} />
                    <DetailItem icon={<FaMapPin size={16} />}  label="Pin Code" value={form.p_Pin_Code} />
                  </div>
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
                      <FormFiled Lable="Degree"             name={`education[${index}].degree`}          value={edu.degree}          onChange={handleChange} in_PlaceHolder="Enter degree" />
                      <FormFiled Lable="Institution"        name={`education[${index}].institution`}     value={edu.institution}     onChange={handleChange} in_PlaceHolder="Enter institution" />
                      <FormFiled Lable="Year of Graduation" name={`education[${index}].graduationYear`} value={edu.graduationYear} onChange={handleChange} in_PlaceHolder="Enter year" />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        education: [
                          ...form.education,
                          { degree: "", institution: "", graduationYear: "" },
                        ],
                      })
                    }
                    className="w-fit text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    + Add Education
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {form.education.map((edu, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-slate-100 last:border-0 last:pb-0"
                    >
                      <DetailItem label="DEGREE"      value={edu.degree} />
                      <DetailItem label="INSTITUTION" value={edu.institution} />
                      <DetailItem label="YEAR"        value={edu.graduationYear} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Work Experience */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <Briefcase size={18} className="text-indigo-600" />
              <h3 className="font-bold text-slate-700">Work Experience</h3>
            </div>
            <div className="p-6">
              {isEditing ? (
                <div className="flex flex-col gap-8">
                  {form.WorkExp.map((work, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                      <FormFiled Lable="Company"    name={`WorkExp[${index}].company_name`} value={work.company_name} onChange={handleChange} in_PlaceHolder="Company" />
                      <FormFiled Lable="Position"   name={`WorkExp[${index}].position`}     value={work.position}     onChange={handleChange} in_PlaceHolder="Position" />
                      <CustomDatePicker Lable="From" name={`WorkExp[${index}].FromDate`}     value={work.FromDate}     onChange={handleChange} />
                      <CustomDatePicker Lable="To"   name={`WorkExp[${index}].ToDate`}       value={work.ToDate}       onChange={handleChange} />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        WorkExp: [
                          ...form.WorkExp,
                          { company_name: "", position: "", FromDate: "", ToDate: "" },
                        ],
                      })
                    }
                    className="w-fit text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    + Add Experience
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {form.WorkExp.map((work, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b border-slate-100 last:border-0 last:pb-0"
                    >
                      <DetailItem label="COMPANY"  value={work.company_name} />
                      <DetailItem label="POSITION" value={work.position} />
                      <DetailItem label="FROM"     value={work.FromDate} />
                      <DetailItem label="TO"       value={work.ToDate} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Familys */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <User size={18} className="text-indigo-600" />
              <h3 className="font-bold text-slate-700">Family Details</h3>
            </div>
            <div className="p-6">
              {isEditing ? (
                <div className="space-y-10">
                  {form.Familys.map((dep, index) => (
                    <div key={index} className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <FormFiled Lable="Name"         name={`Familys[${index}].person_name`}       value={dep.person_name}       onChange={handleChange} in_PlaceHolder="Name" />
                        <FormFiled Lable="Relationship" name={`Familys[${index}].relationship_type`} value={dep.relationship_type} onChange={handleChange} in_PlaceHolder="Relationship" />
                        <FormFiled Lable="Contact"      name={`Familys[${index}].contact`}           value={dep.contact}           onChange={handleChange} in_PlaceHolder="Contact" />
                        <CustomDatePicker Lable="DOB"   name={`Familys[${index}].person_dob`}        value={dep.person_dob}        onChange={handleChange} />
                      </div>

                      {/* Nominees nested under each family member */}
                      <div className="ml-4 pl-4 border-l-2 border-indigo-100">
                        <h4 className="text-xs font-bold text-indigo-600 uppercase mb-4">Nominees for {dep.person_name || "this member"}</h4>
                        {dep.nominees.map((nom, nIdx) => (
                          <div key={nIdx} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 last:mb-0">
                            <FormFiled Lable="Nominee Name"   name={`Familys[${index}].nominees[${nIdx}].nominee_name`}   value={nom.nominee_name}   onChange={handleChange} in_PlaceHolder="Nominee Name" />
                            <FormFiled Lable="Nominee Aadhar" name={`Familys[${index}].nominees[${nIdx}].nominee_aadhar`} value={nom.nominee_aadhar} onChange={handleChange} in_PlaceHolder="Aadhar Number" />
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...form.Familys];
                            updated[index].nominees.push({ nominee_name: "", nominee_aadhar: "" });
                            setForm({ ...form, Familys: updated });
                          }}
                          className="text-xs font-semibold text-indigo-500 hover:text-indigo-700"
                        >
                          + Add Nominee
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        Familys: [
                          ...form.Familys,
                          { person_name: "", relationship_type: "", contact: "", person_dob: "", nominees: [{ nominee_name: "", nominee_aadhar: "" }] },
                        ],
                      })
                    }
                    className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
                  >
                    + Add Family Member
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {form.Familys.map((dep, index) => (
                    <div key={index} className="pb-8 border-b border-slate-100 last:border-0 last:pb-0">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <DetailItem label="NAME"          value={dep.person_name} />
                        <DetailItem label="RELATIONSHIP"  value={dep.relationship_type} />
                        <DetailItem label="CONTACT"       value={dep.contact} />
                        <DetailItem label="DATE OF BIRTH" value={dep.person_dob} />
                      </div>
                      
                      {dep.nominees && dep.nominees.length > 0 && dep.nominees.some(n => n.nominee_name) && (
                        <div className="ml-6 p-4 bg-indigo-50/50 rounded-lg">
                          <h5 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3">NOMINEES</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dep.nominees.map((nom, nIdx) => (
                              nom.nominee_name && (
                                <div key={nIdx} className="flex gap-6">
                                  <div className="text-sm font-semibold text-slate-700">{nom.nominee_name}</div>
                                  <div className="text-sm text-slate-500">{nom.nominee_aadhar}</div>
                                </div>
                              )
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Insurance & PF */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <FaRegBuilding size={18} className="text-indigo-600" />
              <h3 className="font-bold text-slate-700">Insurance & Provident Fund</h3>
            </div>
            <div className="p-6">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormFiled Lable="UAN Number"     name="uan_number"    value={form.uan_number}    onChange={handleChange} in_PlaceHolder="12-digit UAN" />
                  <FormFiled Lable="PF Member ID"   name="pf_id"         value={form.pf_id}         onChange={handleChange} in_PlaceHolder="PF ID" />
                  <FormFiled Lable="ESI Number"     name="esi_no"        value={form.esi_no}        onChange={handleChange} in_PlaceHolder="ESI Number" />
                  <FormFiled Lable="Name in ESI"    name="esi_name"      value={form.esi_name}      onChange={handleChange} in_PlaceHolder="Name as per ESI" />
                  <FormFiled Lable="Insurance No"   name="insurance_no"  value={form.insurance_no}  onChange={handleChange} in_PlaceHolder="Policy Number" />
                  <FormFiled Lable="Aadhar Number"  name="aadhar_no"     value={form.aadhar_no}     onChange={handleChange} in_PlaceHolder="Aadhar for PF" />
                  <Selection
                    label="Insurance Provider"
                    name="insurance_provider"
                    value={form.insurance_provider}
                    onChange={handleChange}
                    options={[
                      { label: "Tata",     value: "Tata" },
                      { label: "MuthuFIN", value: "MuthuFIN" },
                      { label: "Bajaj",    value: "Bajaj" },
                    ]}
                  />
                  <FormFiled Lable="ESI Application Status" name="apply_esi" value={form.apply_esi} onChange={handleChange} in_PlaceHolder="" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                  <DetailItem icon={<Check size={16} />} label="UAN Number"     value={form.uan_number} />
                  <DetailItem icon={<Check size={16} />} label="PF Member ID"   value={form.pf_id} />
                  <DetailItem icon={<Check size={16} />} label="ESI Number"     value={form.esi_no} />
                  <DetailItem icon={<Check size={16} />} label="Name in ESI"    value={form.esi_name} />
                  <DetailItem icon={<Check size={16} />} label="Policy Number"  value={form.insurance_no} />
                  <DetailItem icon={<Check size={16} />} label="Aadhar (PF)"    value={form.aadhar_no} />
                  <DetailItem icon={<Building size={16} />} label="Provider"       value={form.insurance_provider} />
                  <DetailItem icon={<Check size={16} />} label="ESI Apply Status" value={form.apply_esi} />
                </div>
              )}
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <Banknote size={18} className="text-indigo-600" />
              <h3 className="font-bold text-slate-700">Account Details</h3>
            </div>
            <div className="p-6">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormFiled Lable="Bank Name"      name="bankName"      value={form.bankName}      onChange={handleChange} in_PlaceHolder="Bank Name" />
                  <FormFiled Lable="Account Number" name="accountNumber" value={form.accountNumber} onChange={handleChange} in_PlaceHolder="Account Number" />
                  <FormFiled Lable="IFSC Code"      name="ifscCode"      value={form.ifscCode}      onChange={handleChange} in_PlaceHolder="IFSC Code" />
                  <FormFiled Lable="PAN Number"     name="panNumber"     value={form.panNumber}     onChange={handleChange} in_PlaceHolder="PAN Number" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                  <DetailItem icon={<FaRegBuilding size={16} />} label="Bank Name"      value={form.bankName} />
                  <DetailItem icon={<Banknote size={16} />}      label="Account Number" value={form.accountNumber} />
                  <DetailItem icon={<Phone size={16} />}         label="IFSC Code"      value={form.ifscCode} />
                  <DetailItem icon={<Briefcase size={16} />}     label="PAN Number"     value={form.panNumber} />
                </div>
              )}
            </div>
          </div>

          {/* Payroll Breakdown */}
          {!isEditing && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Banknote size={18} className="text-indigo-600" />
                  <h3 className="font-bold text-slate-700">Detailed Payroll Breakdown</h3>
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase">Dynamic Components</div>
              </div>
              <div className="p-6 space-y-8">
                {/* Earnings Table */}
                <div>
                  <h4 className="text-sm font-bold text-green-600 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Earnings (Credits)
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                        <tr>
                          <th className="px-4 py-2 font-semibold">Component</th>
                          <th className="px-4 py-2 font-semibold">Type</th>
                          <th className="px-4 py-2 font-semibold">Value</th>
                          <th className="px-4 py-2 font-semibold text-right">Calculated Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {form.earnings_breakdown.map((item: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 font-medium text-slate-700">{item.name}</td>
                            <td className="px-4 py-3 text-slate-500 italic">{item.type}</td>
                            <td className="px-4 py-3 text-slate-600">
                              {item.type === "percentage" ? `${item.value}%` : `${item.value} ${form.currency}`}
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-slate-800">
                              {item.amount.toLocaleString()} {form.currency}
                            </td>
                          </tr>
                        ))}
                        {form.earnings_breakdown.length === 0 && (
                          <tr><td colSpan={4} className="px-4 py-4 text-center text-slate-400 italic">No earnings configured</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Deductions Table */}
                <div>
                  <h4 className="text-sm font-bold text-red-500 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Deductions (Debits)
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                        <tr>
                          <th className="px-4 py-2 font-semibold">Component</th>
                          <th className="px-4 py-2 font-semibold">Type</th>
                          <th className="px-4 py-2 font-semibold">Value</th>
                          <th className="px-4 py-2 font-semibold text-right">Calculated Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {form.deductions_breakdown.map((item: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 font-medium text-slate-700">{item.name}</td>
                            <td className="px-4 py-3 text-slate-500 italic">{item.type}</td>
                            <td className="px-4 py-3 text-slate-600">
                              {item.type === "percentage" ? `${item.value}%` : `${item.value} ${form.currency}`}
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-red-600">
                              - {item.amount.toLocaleString()} {form.currency}
                            </td>
                          </tr>
                        ))}
                        {form.deductions_breakdown.length === 0 && (
                          <tr><td colSpan={4} className="px-4 py-4 text-center text-slate-400 italic">No deductions configured</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Summary Row */}
                <div className="pt-6 border-t border-slate-100 flex flex-col items-end gap-2">
                   <div className="flex justify-between w-full max-w-xs text-sm">
                      <span className="text-slate-500">Total Earnings:</span>
                      <span className="font-bold text-slate-800">{form.total_earnings.toLocaleString()} {form.currency}</span>
                   </div>
                   <div className="flex justify-between w-full max-w-xs text-sm">
                      <span className="text-slate-500">Total Deductions:</span>
                      <span className="font-bold text-red-500">- {form.total_deductions.toLocaleString()} {form.currency}</span>
                   </div>
                   <div className="flex justify-between w-full max-w-xs text-lg mt-2 pt-2 border-t border-slate-200">
                      <span className="font-bold text-slate-900">Net Pay:</span>
                      <span className="font-black text-green-600 underline decoration-green-200 underline-offset-4">
                        {form.net_salary.toLocaleString()} {form.currency}
                      </span>
                   </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── DetailItem ─────────────────────────────────────────────────────────────

function DetailItem({ icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3">
      {icon && <div className="mt-1 text-slate-400">{icon}</div>}
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-slate-800 font-medium">{value || "—"}</p>
      </div>
    </div>
  );
}