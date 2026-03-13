import { useState, type ChangeEvent, type FormEvent } from "react";
import { FormFiled } from "../../../Components/Common/FormFiled";
import { Selection } from "../../../Components/Common/Selection";
import { CustomDatePicker } from "../../../Components/Common/CustomDatePicker";
import { FaUser, FaTrash, FaPlus } from "react-icons/fa";
import { Checkbox } from "../../../Components/Common/CheckBox";

// --- Interfaces ---
interface Education {
  degree: string;
  institution: string;
  graduationYear: string;
}

interface Dependent {
  person_name: string;
  relationship_type: string;
  contact: string;
  person_dob: string;
}

interface Employee {
  Emp_id: string;
  f_name: string;
  l_name: string;
  name: string;
  gender?: string;
  dob?: string;
  email: string;
  phone: string;
  Department: string;
  designation: string;
  emp_type: string;
  DateOfJoining: string;
  education: Education[];
  company_name: string;
  position: string;
  FromDate: string;
  ToDate: string;
  dependents: Dependent[];
  Street: string;
  City: string;
  State: string;
  Pin_Code: number;
  p_Street: string;
  p_City: string;
  p_State: string;
  p_Pin_Code: number;
}

type EmployeeRegisterProps = {
  ClicktoAction?: () => void;
  setEmployeeData?: (data: any) => void;
};

const EmployeeRegister = ({ ClicktoAction, setEmployeeData }: EmployeeRegisterProps) => {
  const [isChecked, setIsChecked] = useState(false);

  const [formData, setFormData] = useState<Employee>({
    Emp_id: "", f_name: "", l_name: "", name: "",
    gender: "", dob: "", email: "", phone: "",
    Department: "", designation: "", emp_type: "", DateOfJoining: "",
    education: [{ degree: "", institution: "", graduationYear: "" }],
    company_name: "", position: "", FromDate: "", ToDate: "",
    Street: "", City: "", State: "", Pin_Code: 0,
    p_Street: "", p_City: "", p_State: "", p_Pin_Code: 0,
    dependents: [{ person_name: "", relationship_type: "", contact: "", person_dob: "" }],
  });

  // --- Change Handlers ---
  const onChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === "f_name" || name === "l_name") {
        newState.name = `${newState.f_name} ${newState.l_name}`.trim();
      }
      return newState;
    });
  };

  const handleEduChange = (index: number, field: keyof Education, value: string) => {
    const updatedEdu = [...formData.education];
    updatedEdu[index] = { ...updatedEdu[index], [field]: value };
    setFormData({ ...formData, education: updatedEdu });
  };

  const addEducationSection = (e?: any) => {
    if (e?.preventDefault) e.preventDefault();
    setFormData({
      ...formData,
      education: [...formData.education, { degree: "", institution: "", graduationYear: "" }],
    });
  };

  const removeEducationSection = (index: number) => {
    if (formData.education.length > 1) {
      setFormData({ ...formData, education: formData.education.filter((_, i) => i !== index) });
    }
  };

  const addDependentSection = (e?: any) => {
    if (e?.preventDefault) e.preventDefault();
    setFormData({
      ...formData,
      dependents: [...formData.dependents, { person_name: "", relationship_type: "", contact: "", person_dob: "" }],
    });
  };

  const removeDependentSection = (index: number) => {
    if (formData.dependents.length > 1) {
      setFormData({ ...formData, dependents: formData.dependents.filter((_, i) => i !== index) });
    }
  };

  // ── FIX: single handler wires checkbox state + address copy ──────────────
  const handleSameAddress = (checked: boolean) => {
    setIsChecked(checked);
    setFormData((prev) => ({
      ...prev,
      p_Street:   checked ? prev.Street   : "",
      p_City:     checked ? prev.City     : "",
      p_State:    checked ? prev.State    : "",
      p_Pin_Code: checked ? prev.Pin_Code : 0,
    }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmployeeData?.(formData);
    ClicktoAction?.();
  };

  // --- Options ---
  const genderOptions = [{ label: "Male", value: "Male" }, { label: "Female", value: "Female" }];
  const departmentOptions = [{ label: "HR", value: "HR" }, { label: "IT", value: "IT" }, { label: "Finance", value: "Finance" }];
  const empTypeOptions = [{ label: "Full Time", value: "Full Time" }, { label: "Part Time", value: "Part Time" }, { label: "Contract", value: "Contract" }];
  const relationshipOptions = [
    { label: "Wife", value: "Wife" }, { label: "Child", value: "Child" },
    { label: "Father", value: "Father" }, { label: "Mother", value: "Mother" },
    { label: "Brother", value: "Brother" }, { label: "Sister", value: "Sister" },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-8">
        <FaUser className="text-[28px] text-blue-600 shrink-0" />
        <h1 className="text-3xl font-bold">Add New Employee</h1>
      </div>

      <form className="space-y-6" onSubmit={onSubmit}>

        {/* Section 1: Basic Details */}
        <section>
          <h3 className="text-lg font-medium text-blue-600 mb-4 border-b pb-2">Employee Basic Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormFiled name="Emp_id" value={formData.Emp_id} Lable="Employee Code" in_PlaceHolder="EMP-001" onChange={onChange} />
            <FormFiled name="f_name" value={formData.f_name} Lable="First Name" in_PlaceHolder="John" onChange={onChange} />
            <FormFiled name="l_name" value={formData.l_name} Lable="Last Name" in_PlaceHolder="Doe" onChange={onChange} />
            <FormFiled name="name" value={formData.name} Lable="Full Name (Auto)" in_PlaceHolder="John Doe" onChange={onChange} />
            <Selection label="Gender" name="gender" options={genderOptions} value={formData.gender || ""} onChange={onChange} />
            <CustomDatePicker name="dob" value={formData.dob || ""} Lable="Date of Birth" onChange={onChange} />
            <FormFiled name="phone" value={formData.phone} Lable="Phone" in_PlaceHolder="+91 9876543210" onChange={onChange} />
            <FormFiled name="email" value={formData.email} Lable="Email" in_PlaceHolder="employee@company.com" onChange={onChange} />
          </div>
        </section>

        {/* Section 2: Job Information */}
        <section>
          <h3 className="text-lg font-medium text-blue-600 mb-4 border-b pb-2">Job Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Selection label="Department" name="Department" options={departmentOptions} value={formData.Department || ""} onChange={onChange} />
            <FormFiled name="designation" value={formData.designation} Lable="Designation" in_PlaceHolder="Software Engineer" onChange={onChange} />
            <CustomDatePicker name="DateOfJoining" value={formData.DateOfJoining || ""} Lable="Date of Joining" onChange={onChange} />
            <Selection label="Employment Type" name="emp_type" options={empTypeOptions} value={formData.emp_type || ""} onChange={onChange} />
          </div>
        </section>

        {/* Section 3: Education (Dynamic) */}
        <section>
          <div className="text-lg font-medium text-blue-600 mb-4 border-b pb-2 flex items-center justify-between">
            <h3 className="text-lg font-medium text-blue-600">Education History</h3>
            <button type="button" onClick={addEducationSection}
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
              <FaPlus className="text-xs" /> Add Qualification
            </button>
          </div>
          {formData.education.map((edu, index) => (
            <div key={index} className="relative mb-6 p-4 border border-gray-300 rounded-lg bg-blue-50/50">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4">
                  <FormFiled name="degree" value={edu.degree} Lable="Degree" in_PlaceHolder="B.Sc Computer Science"
                    onChange={(e) => handleEduChange(index, "degree", e.target.value)} />
                </div>
                <div className="md:col-span-4">
                  <FormFiled name="institution" value={edu.institution} Lable="Institution" in_PlaceHolder="University Name"
                    onChange={(e) => handleEduChange(index, "institution", e.target.value)} />
                </div>
                <div className="md:col-span-3">
                  <CustomDatePicker name="graduationYear" value={edu.graduationYear} Lable="Graduation Year"
                    onChange={(val) => {
                      const v = typeof val === "string" ? val : (val.target?.value || "");
                      handleEduChange(index, "graduationYear", v);
                    }} />
                </div>
                <div className="md:col-span-1 flex items-end justify-center">
                  {formData.education.length > 1 ? (
                    <button type="button" onClick={() => removeEducationSection(index)}
                      className="mb-5 p-3 hover:text-red-500 rounded-lg transition-colors" title="Remove">
                      <FaTrash />
                    </button>
                  ) : <div className="w-10 h-10 mb-2" />}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Work Information */}
        <section>
          <h3 className="text-lg font-medium text-blue-600 mb-4 border-b pb-2">Work Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormFiled name="company_name" Lable="Company Name" in_PlaceHolder="Company Name" value={formData.company_name} onChange={onChange} />
            <FormFiled name="position" Lable="Position" in_PlaceHolder="Position" value={formData.position} onChange={onChange} />
            <CustomDatePicker name="FromDate" value={formData.FromDate || ""} Lable="From" onChange={onChange} />
            <CustomDatePicker name="ToDate" value={formData.ToDate || ""} Lable="To" onChange={onChange} />
          </div>
        </section>

        {/* Dependent Details */}
        <section>
          <div className="text-lg font-medium text-blue-600 mb-4 border-b pb-2 flex items-center justify-between">
            <h3 className="text-lg font-medium text-blue-600">Dependent Details</h3>
            <button type="button" onClick={addDependentSection}
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
              <FaPlus className="text-xs" /> Add Person
            </button>
          </div>
          {formData.dependents.map((Depen, index) => (
            <div key={index} className="relative mb-6 p-4 border border-gray-300 rounded-lg bg-blue-50/50">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-3">
                  <FormFiled name="name" value={Depen.person_name} Lable="Name" in_PlaceHolder="Dependent Name"
                    onChange={(e) => {
                      const u = [...formData.dependents];
                      u[index] = { ...u[index], person_name: e.target.value };
                      setFormData({ ...formData, dependents: u });
                    }} />
                </div>
                <div className="md:col-span-3">
                  <Selection label="Relationship" name="relationship" options={relationshipOptions} value={Depen.relationship_type}
                    onChange={(e) => {
                      const u = [...formData.dependents];
                      u[index] = { ...u[index], relationship_type: e.target.value };
                      setFormData({ ...formData, dependents: u });
                    }} />
                </div>
                <div className="md:col-span-3">
                  <FormFiled name="contact" value={Depen.contact} Lable="Contact" in_PlaceHolder="+91 9876543210"
                    onChange={(e) => {
                      const u = [...formData.dependents];
                      u[index] = { ...u[index], contact: e.target.value };
                      setFormData({ ...formData, dependents: u });
                    }} />
                </div>
                <div className="md:col-span-2">
                  <CustomDatePicker name="DOB" value={Depen.person_dob} Lable="Date of Birth"
                    onChange={(val) => {
                      const v = typeof val === "string" ? val : (val.target?.value || "");
                      const u = [...formData.dependents];
                      u[index] = { ...u[index], person_dob: v };
                      setFormData({ ...formData, dependents: u });
                    }} />
                </div>
                <div className="md:col-span-1 flex items-end justify-center">
                  {formData.dependents.length > 1 ? (
                    <button type="button" onClick={() => removeDependentSection(index)}
                      className="mb-5 p-3 hover:text-red-700 rounded-lg transition-colors" title="Remove">
                      <FaTrash />
                    </button>
                  ) : <div className="w-10 h-10 mb-2" />}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Current Address */}
        <section>
          <h3 className="text-lg font-medium text-blue-600 mb-4 border-b pb-2">Current Address Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormFiled name="Street" value={formData.Street} Lable="Street Address" in_PlaceHolder="Street Address" onChange={onChange} />
            <FormFiled name="City" value={formData.City} Lable="City" in_PlaceHolder="City" onChange={onChange} />
            <FormFiled name="State" value={formData.State} Lable="State" in_PlaceHolder="State" onChange={onChange} />
            <FormFiled name="Pin_Code" value={formData.Pin_Code} Lable="Pin Code" in_PlaceHolder="Pin Code" onChange={onChange} />
          </div>
        </section>

        {/* Permanent Address */}
        <section>
          <h3 className="text-lg font-medium text-blue-600 mb-4 border-b pb-2">Permanent Address Details</h3>

          {/* ── FIX: onChange={handleSameAddress} — copies address + sets state ── */}
          <div className="mb-4">
            <Checkbox
              label="Same as Current Address"
              checked={isChecked}
              onChange={handleSameAddress}
              name="sameAddress"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormFiled name="p_Street" value={formData.p_Street} Lable="Street Address" in_PlaceHolder="Street Address" onChange={onChange} />
            <FormFiled name="p_City" value={formData.p_City} Lable="City" in_PlaceHolder="City" onChange={onChange} />
            <FormFiled name="p_State" value={formData.p_State} Lable="State" in_PlaceHolder="State" onChange={onChange} />
            <FormFiled name="p_Pin_Code" value={formData.p_Pin_Code} Lable="Pin Code" in_PlaceHolder="Pin Code" onChange={onChange} />
          </div>
        </section>

        <button type="submit"
          className="bg-blue-600 text-white px-10 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md active:scale-95">
          Submit
        </button>
      </form>
    </div>
  );
};

export default EmployeeRegister;