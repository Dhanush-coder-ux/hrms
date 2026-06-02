import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
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
  Banknote,
  Calendar,
  MapPin,
  Globe,
  ArrowLeft,
  TrendingUp
} from "lucide-react";
import { FaRegBuilding } from "react-icons/fa";
import { FormFiled } from "../../../Components/Common/FormFiled";
import { Selection } from "../../../Components/Common/Selection";
import { CustomDatePicker } from "../../../Components/Common/CustomDatePicker";
import { Api_URL } from "../../../APILINK";
import { useListOptions } from "../../../Hooks/ListOption";
import { pageTheme } from "../../../Themes/PageThems/pageConfig";
import { getUserTheme } from "../../../Components/Common/UserAvatar";

const BASE_URL = Api_URL;

const Edu_GET_URL = (id: string) => `${BASE_URL}/employee/EmployeeEducation/${id}`;
const Edu_UPDATE_URL = (id: string) => `${BASE_URL}/employee/EmployeeEducationUpdate/${id}`;
const Edu_CREATE_URL = (id: string) => `${BASE_URL}/employee/EmployeeEducationCreate/${id}`;
const FamilyS_GET_URL = (id: string) => `${BASE_URL}/employee/EmployeeFamilys/${id}`;
const FamilyS_UPDATE_URL = (id: string) => `${BASE_URL}/employee/EmployeeFamilysUpdate/${id}`;
const FamilyS_CREATE_URL = (id: string) => `${BASE_URL}/employee/EmployeeFamilysCreate/${id}`;

const Work_GET_URL = (id: string) => `${BASE_URL}/employee/EmployeeWorkExp/${id}`;
const Work_UPDATE_URL = (id: string) => `${BASE_URL}/employee/EmployeeWorkExpUpdate/${id}`;
const Work_CREATE_URL = (id: string) => `${BASE_URL}/employee/EmployeeWorkExpCreate/${id}`;

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
  const params = useParams();
  const id = params["*"];
  const navigate = useNavigate();

  const providerOptions = useListOptions(`${Api_URL}/payroll/providers`);
  const departmentOptions = useListOptions(`${Api_URL}/departments/`);

  const [isEditing, setIsEditing] = useState(!id);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

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

    education: [] as any[],
    WorkExp: [] as any[],

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
        const empInfo = empData.Employee || {};
        setForm((prev) => ({
          ...prev,
          ...empInfo,
          base_salary: empData.base_salary ?? 0,
          gross_salary: empData.gross_salary ?? 0,
          total_earnings: empData.total_earnings ?? 0,
          total_deductions: empData.total_deductions ?? 0,
          net_salary: empData.net_salary ?? 0,
          earnings_breakdown: empData.earnings_breakdown ?? [],
          deductions_breakdown: empData.deductions_breakdown ?? [],

          education: eduData.length
            ? eduData.map((edu: any) => ({
              degree: edu.degree,
              institution: edu.institution,
              graduationYear: edu.graduationYear,
            }))
            : [],

          WorkExp: workData.length
            ? workData.map((w: any) => ({
              company_name: w.company_name,
              position: w.position,
              FromDate: w.FromDate,
              ToDate: w.ToDate,
            }))
            : [],

          Familys: depData.length
            ? depData.map((dep: any) => ({
              person_name: dep.person_name,
              relationship_type: dep.relationship_type,
              contact: dep.contact,
              person_dob: dep.person_dob,
              nominees: dep.nominees && dep.nominees.length
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

  const handleDeleteArrayItem = (arrayName: string, index: number) => {
    setForm((prev: any) => {
      const updatedArray = [...prev[arrayName]];
      updatedArray.splice(index, 1);
      return { ...prev, [arrayName]: updatedArray };
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
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

      const empRes = await fetch(`${BASE_URL}/employee/EmployeeUpdate/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!empRes.ok) throw new Error(`Employee update failed (${empRes.status})`);

      try {
        if (form.education && form.education.length > 0) {
          const hasData = form.education.some((e) => e.degree || e.institution || e.graduationYear);
          if (hasData) {
            await upsertData(Edu_UPDATE_URL(id), Edu_CREATE_URL(id), form.education.map((edu) => ({
              degree: edu.degree,
              institution: edu.institution,
              graduationYear: edu.graduationYear || null,
            })));
          }
        }
      } catch (err) {
        console.error("Education update failed:", err);
      }

      try {
        if (form.WorkExp && form.WorkExp.length > 0) {
          const hasData = form.WorkExp.some((w) => w.company_name || w.position);
          if (hasData) {
            await upsertData(Work_UPDATE_URL(id), Work_CREATE_URL(id), form.WorkExp.map((w) => ({
              company_name: w.company_name,
              position: w.position,
              FromDate: w.FromDate || null,
              ToDate: w.ToDate || null,
            })));
          }
        }
      } catch (err) {
        console.error("Work experience update failed:", err);
      }

      try {
        if (form.Familys && form.Familys.length > 0) {
          const hasData = form.Familys.some((d) => d.person_name || d.relationship_type || d.contact);
          if (hasData) {
            await upsertData(FamilyS_UPDATE_URL(id), FamilyS_CREATE_URL(id), form.Familys.map((dep) => ({
              person_name: dep.person_name,
              relationship_type: dep.relationship_type,
              contact: dep.contact,
              person_dob: dep.person_dob || null,
              nominees: dep.nominees.filter(n => n.nominee_name || n.nominee_aadhar)
            })));
          }
        }
      } catch (err) {
        console.error("Family update failed:", err);
      }

      setIsEditing(false);
      alert("✅ Employee updated successfully!");
    } catch (error: any) {
      console.error("Save error:", error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  const theme = getUserTheme(form.name || "");
  const initials = form.name?.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <div className={pageTheme.layout.mainContainer}>
      {/* Top Navigation & Actions */}
      <div className="flex items-center justify-between mb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
        >
          <ArrowLeft size={14} /> Back to Directory
        </button>

        <div className="flex items-center gap-3">
          {id && !isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="h-12 px-8 rounded-2xl border border-slate-200 bg-white text-slate-700 font-bold text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
            >
              <Edit3 size={16} className="inline mr-2" /> Edit Profile
            </button>
          ) : (
            <div className="flex items-center gap-3">
              {id && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 text-slate-400 font-bold text-[11px] uppercase tracking-widest hover:text-slate-600 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={loading}
                className="h-12 px-8 rounded-2xl bg-primary text-white font-black text-[11px] uppercase tracking-widest hover:shadow-2xl transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                {id ? "Update Employee" : "Save Record"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="mb-10">
        <div className="flex items-center justify-between gap-6 flex-wrap bg-white p-8 rounded-[40px] shadow-xl shadow-slate-200/40 border border-slate-100/50">
          <div className="flex items-center gap-8">
            <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center text-2xl font-extrabold flex-shrink-0 tracking-tighter border-4 border-white shadow-lg ${theme.bg} text-white`}>
              {initials || "E"}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/10 ${form.Status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                  {form.Status || "Status Pending"}
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  Emp ID: {id || "NEW"}
                </span>
              </div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-1 uppercase">
                {form.name || "New Hire"}
              </h1>
              <div className="flex items-center gap-4 text-slate-500 font-medium text-sm">
                <p className="flex items-center gap-1.5"><Briefcase size={16} className="text-primary/60" /> {form.designation || "No Designation Set"}</p>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <p className="flex items-center gap-1.5"><Building2 size={16} className="text-primary/60" /> {form.Department || "Unassigned"}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right pr-4 border-r border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Monthly Net</p>
              <p className="text-2xl font-black text-emerald-600 leading-none">
                {form.net_salary ? `${form.net_salary.toLocaleString()} ${form.currency || "INR"}` : "—"}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all cursor-pointer">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column */}
        <div className="lg:col-span-4 space-y-8">
          <div className={pageTheme.section.card}>
            <div className={pageTheme.section.header}>
              <div className={pageTheme.section.title}>
                <span className={pageTheme.section.titleDot} />
                Employment Summary
              </div>
            </div>
            <div className="p-8 space-y-6">
              {isEditing ? (
                <div className="space-y-4">
                  <Selection label="Status" name="Status" value={form.Status} onChange={handleChange} options={[{ label: "Active", value: "Active" }, { label: "Inactive", value: "Inactive" }]} />
                  <CustomDatePicker Lable="Joining Date" name="DateOfJoining" value={form.DateOfJoining} onChange={handleChange} />
                  <Selection label="Payroll Provider" name="provider" value={form.provider} options={providerOptions} onChange={handleChange} />
                </div>
              ) : (
                <div className="space-y-6">
                  <SummaryItem label="Joined On" value={form.DateOfJoining} icon={<Calendar size={18} />} color="blue" />
                  <SummaryItem label="Provider" value={providerOptions.find(p => p.value === form.provider)?.label || form.provider} icon={<Globe size={18} />} color="violet" />
                  <SummaryItem label="Emp Type" value={form.emp_type} icon={<User size={18} />} color="emerald" />
                </div>
              )}
            </div>
          </div>

          {!isEditing && (
            <div className={pageTheme.section.card}>
              <div className={pageTheme.section.header}>
                <div className={pageTheme.section.title}><span className={pageTheme.section.titleDot} />Related Actions</div>
              </div>
              <div className="p-4 space-y-2">
                <QuickAction icon={<ArrowRightIcon size={18} />} label="Leave History" color="primary" />
                <QuickAction icon={<ArrowRightIcon size={18} />} label="Attendance Log" color="violet" />
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 space-y-8 pb-20">
          <div className={pageTheme.section.card}>
            <div className={pageTheme.section.header}>
              <div className={pageTheme.section.title}><span className={pageTheme.section.titleDot} />Personal & Work Details</div>
            </div>
            <div className="p-8">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormFiled Lable="First Name" name="f_name" value={form.f_name} onChange={handleChange} in_PlaceHolder="Enter first name" />
                  <FormFiled Lable="Last Name" name="l_name" value={form.l_name} onChange={handleChange} in_PlaceHolder="Enter last name" />
                  <FormFiled Lable="Email" name="email" value={form.email} onChange={handleChange} in_PlaceHolder="Enter email address" />
                  <FormFiled Lable="Phone" name="phone" value={form.phone} onChange={handleChange} in_PlaceHolder="Enter phone number" />
                  <Selection label="Gender" name="gender" value={form.gender} onChange={handleChange} options={[{ label: "Male", value: "Male" }, { label: "Female", value: "Female" }]} />
                  <CustomDatePicker Lable="DOB" name="dob" value={form.dob} onChange={handleChange} />
                  <FormFiled Lable="Designation" name="designation" value={form.designation} onChange={handleChange} in_PlaceHolder="Enter designation" />
                  <Selection label="Department" name="Department" value={form.Department} onChange={handleChange} options={departmentOptions} />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <DetailItem label="Full Name" value={form.name} icon={<User size={18} />} />
                  <DetailItem label="Email" value={form.email} icon={<Mail size={18} />} />
                  <DetailItem label="Phone" value={form.phone} icon={<Phone size={18} />} />
                  <DetailItem label="Designation" value={form.designation} icon={<Briefcase size={18} />} />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <InfoCard title="Education" icon={<GraduationCap size={20} />} data={form.education} isEditing={isEditing}
              onAdd={() => setForm({ ...form, education: [...form.education, { degree: "", institution: "", graduationYear: "" }] })}
              renderItem={(edu: any) => (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-500 flex items-center justify-center flex-shrink-0"><GraduationCap size={20} /></div>
                  <div><p className="text-sm font-black text-slate-800">{edu.degree}</p><p className="text-[11px] font-bold text-slate-400 uppercase">{edu.institution} • {edu.graduationYear}</p></div>
                </div>
              )}
              renderEditItem={(edu: any, idx: number) => (
                <div className="space-y-4 mb-4 p-4 border border-slate-100 rounded-xl bg-slate-50/50 relative">
                  <button type="button" onClick={() => handleDeleteArrayItem('education', idx)} className="absolute top-2 right-2 text-rose-500 hover:bg-rose-100 font-bold text-[10px] uppercase tracking-widest bg-rose-50 px-2 py-1 rounded">Delete</button>
                  <div className="pt-2">
                    <FormFiled Lable="Degree" name={`education[${idx}].degree`} value={edu.degree} onChange={handleChange} in_PlaceHolder="e.g. B.Tech" />
                  </div>
                  <FormFiled Lable="Institution" name={`education[${idx}].institution`} value={edu.institution} onChange={handleChange} in_PlaceHolder="e.g. MIT" />
                  <FormFiled Lable="Graduation Year" name={`education[${idx}].graduationYear`} value={edu.graduationYear} onChange={handleChange} in_PlaceHolder="e.g. 2023" />
                </div>
              )}
            />
            <InfoCard title="Experience" icon={<Briefcase size={20} />} data={form.WorkExp} isEditing={isEditing}
              onAdd={() => setForm({ ...form, WorkExp: [...form.WorkExp, { company_name: "", position: "", FromDate: "", ToDate: "" }] })}
              renderItem={(work: any) => (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0"><Briefcase size={20} /></div>
                  <div><p className="text-sm font-black text-slate-800">{work.position}</p><p className="text-[11px] font-bold text-slate-400 uppercase">{work.company_name}</p></div>
                </div>
              )}
              renderEditItem={(work: any, idx: number) => (
                <div className="space-y-4 mb-4 p-4 border border-slate-100 rounded-xl bg-slate-50/50 relative">
                  <button type="button" onClick={() => handleDeleteArrayItem('WorkExp', idx)} className="absolute top-2 right-2 text-rose-500 hover:bg-rose-100 font-bold text-[10px] uppercase tracking-widest bg-rose-50 px-2 py-1 rounded">Delete</button>
                  <div className="pt-2">
                    <FormFiled Lable="Company Name" name={`WorkExp[${idx}].company_name`} value={work.company_name} onChange={handleChange} in_PlaceHolder="e.g. Google" />
                  </div>
                  <FormFiled Lable="Position" name={`WorkExp[${idx}].position`} value={work.position} onChange={handleChange} in_PlaceHolder="e.g. Software Engineer" />
                  <CustomDatePicker Lable="From Date" name={`WorkExp[${idx}].FromDate`} value={work.FromDate} onChange={handleChange} />
                  <CustomDatePicker Lable="To Date" name={`WorkExp[${idx}].ToDate`} value={work.ToDate} onChange={handleChange} />
                </div>
              )}
            />
          </div>

          {/* Address Details */}
          <div className={pageTheme.section.card}>
            <div className={pageTheme.section.header}>
              <div className={pageTheme.section.title}><span className={pageTheme.section.titleDot} />Address Details</div>
            </div>
            <div className="p-8">
              {isEditing ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormFiled Lable="Current Street" name="Street" value={form.Street} onChange={handleChange} in_PlaceHolder="Enter current street" />
                    <FormFiled Lable="Current City" name="City" value={form.City} onChange={handleChange} in_PlaceHolder="Enter current city" />
                    <FormFiled Lable="Permanent Street" name="p_Street" value={form.p_Street} onChange={handleChange} in_PlaceHolder="Enter permanent street" />
                    <FormFiled Lable="Permanent City" name="p_City" value={form.p_City} onChange={handleChange} in_PlaceHolder="Enter permanent city" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">Current Address</p>
                    <DetailItem label="Street" value={form.Street} icon={<MapPin size={18} />} />
                    <DetailItem label="City" value={form.City} icon={<Building size={18} />} />
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-violet-500 uppercase tracking-widest">Permanent Address</p>
                    <DetailItem label="Street" value={form.p_Street} icon={<MapPin size={18} />} />
                    <DetailItem label="City" value={form.p_City} icon={<Building size={18} />} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Insurance & PF */}
          <div className={pageTheme.section.card}>
            <div className={pageTheme.section.header}>
              <div className={pageTheme.section.title}><span className={pageTheme.section.titleDot} />Insurance & PF</div>
            </div>
            <div className="p-8">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormFiled Lable="UAN Number" name="uan_number" value={form.uan_number} onChange={handleChange} in_PlaceHolder="Enter UAN" />
                  <FormFiled Lable="PF Member ID" name="pf_id" value={form.pf_id} onChange={handleChange} in_PlaceHolder="Enter PF Member ID" />
                  <FormFiled Lable="ESI Number" name="esi_no" value={form.esi_no} onChange={handleChange} in_PlaceHolder="Enter ESI Number" />
                  <FormFiled Lable="Insurance No" name="insurance_no" value={form.insurance_no} onChange={handleChange} in_PlaceHolder="Enter Insurance No" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8">
                  <DetailItem label="UAN Number" value={form.uan_number} icon={<Check size={18} />} />
                  <DetailItem label="PF Member ID" value={form.pf_id} icon={<Check size={18} />} />
                  <DetailItem label="ESI Number" value={form.esi_no} icon={<Check size={18} />} />
                  <DetailItem label="Insurance No" value={form.insurance_no} icon={<Check size={18} />} />
                </div>
              )}
            </div>
          </div>

          {/* Account Details */}
          <div className={pageTheme.section.card}>
            <div className={pageTheme.section.header}>
              <div className={pageTheme.section.title}><span className={pageTheme.section.titleDot} />Account Details</div>
            </div>
            <div className="p-8">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormFiled Lable="Bank Name" name="bankName" value={form.bankName} onChange={handleChange} in_PlaceHolder="Enter bank name" />
                  <FormFiled Lable="Account Number" name="accountNumber" value={form.accountNumber} onChange={handleChange} in_PlaceHolder="Enter account number" />
                  <FormFiled Lable="IFSC Code" name="ifscCode" value={form.ifscCode} onChange={handleChange} in_PlaceHolder="Enter IFSC code" />
                  <FormFiled Lable="PAN Number" name="panNumber" value={form.panNumber} onChange={handleChange} in_PlaceHolder="Enter PAN number" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8">
                  <DetailItem label="Bank Name" value={form.bankName} icon={<FaRegBuilding size={18} />} />
                  <DetailItem label="Account Number" value={form.accountNumber} icon={<Banknote size={18} />} />
                  <DetailItem label="IFSC Code" value={form.ifscCode} icon={<Phone size={18} />} />
                  <DetailItem label="PAN Number" value={form.panNumber} icon={<Briefcase size={18} />} />
                </div>
              )}
            </div>
          </div>

          {!isEditing && (
            <div className={pageTheme.section.card}>
              <div className={pageTheme.section.header}>
                <div className={pageTheme.section.title}><span className={pageTheme.section.titleDot} />Payroll Breakdown</div>
              </div>
              <div className="p-8 space-y-10">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                  <BreakdownSection title="Earnings" data={form.earnings_breakdown} color="emerald" currency={form.currency} />
                  <BreakdownSection title="Deductions" data={form.deductions_breakdown} color="rose" currency={form.currency} isDeduction />
                </div>
                <div className="pt-8 border-t border-slate-100 flex flex-col items-end gap-3">
                  <div className="flex items-center justify-between w-72 h-16 px-6 rounded-[24px] bg-slate-900 text-white">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Net Salary</span>
                    <span className="text-xl font-black">{form.net_salary.toLocaleString()} {form.currency}</span>
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

// ─── Sub-Components ─────────────────────────────────────────────────────────

function SummaryItem({ label, value, icon, color }: any) {
  const colors: any = { blue: "bg-blue-50 text-blue-500", violet: "bg-violet-50 text-violet-500", emerald: "bg-emerald-50 text-emerald-500" };
  return (
    <div className="flex items-center gap-4 group">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-all group-hover:scale-110 ${colors[color] || colors.blue}`}>{icon}</div>
      <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p><p className="text-[14px] font-bold text-slate-700">{value || "—"}</p></div>
    </div>
  );
}

function DetailItem({ label, value, icon }: any) {
  return (
    <div className="flex items-start gap-4">
      {icon && <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center flex-shrink-0">{icon}</div>}
      <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">{label}</p><p className="text-sm font-bold text-slate-700">{value || "—"}</p></div>
    </div>
  );
}

function QuickAction({ icon, label, color }: any) {
  const colors: any = { primary: "bg-primary/5 text-primary group-hover:bg-primary", violet: "bg-violet-50 text-violet-500 group-hover:bg-violet-500" };
  return (
    <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all group">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:text-white transition-all ${colors[color]}`}>{icon}</div>
        <span className="text-sm font-bold text-slate-700">{label}</span>
      </div>
      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Details</span>
    </button>
  );
}

function InfoCard({ title, data, isEditing, onAdd, renderItem, renderEditItem }: any) {
  return (
    <div className={pageTheme.section.card}>
      <div className={pageTheme.section.header}><div className={pageTheme.section.title}><span className={pageTheme.section.titleDot} />{title}</div></div>
      <div className="p-8 space-y-6">
        {isEditing ? (
          <div className="space-y-6">
            {data.map((item: any, idx: number) => <div key={idx}>{renderEditItem ? renderEditItem(item, idx) : null}</div>)}
            <button type="button" onClick={onAdd} className="text-xs font-black text-primary uppercase tracking-widest hover:underline">+ Add {title}</button>
          </div>
        ) : (
          data.map((item: any, idx: number) => <div key={idx}>{renderItem(item)}</div>)
        )}
      </div>
    </div>
  );
}

function BreakdownSection({ title, data, color, currency, isDeduction }: any) {
  const colors: any = { emerald: "text-emerald-600 bg-emerald-500 bg-emerald-50/30 border-emerald-100/50", rose: "text-rose-600 bg-rose-500 bg-rose-50/30 border-rose-100/50" };
  return (
    <div className="space-y-6">
      <h4 className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${isDeduction ? "text-rose-600" : "text-emerald-600"}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${isDeduction ? "bg-rose-500" : "bg-emerald-500"}`} />{title}
      </h4>
      <div className="space-y-4">
        {data.map((item: any, idx: number) => (
          <div key={idx} className={`flex items-center justify-between p-4 rounded-2xl border ${colors[color]}`}>
            <div><p className="text-[11px] font-black text-slate-800 uppercase">{item.name}</p><p className={`text-[9px] font-bold uppercase ${isDeduction ? "text-rose-500" : "text-emerald-500"}`}>{item.type}</p></div>
            <span className={`text-sm font-black ${isDeduction ? "text-rose-600" : "text-slate-800"}`}>{isDeduction ? "-" : ""}{item.amount.toLocaleString()} {currency}</span>
          </div>
        ))}
      </div>
    </div>
  );
}