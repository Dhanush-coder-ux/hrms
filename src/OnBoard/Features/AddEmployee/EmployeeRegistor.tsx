import { useState, type ChangeEvent, type FormEvent } from "react";
import { FormFiled } from "../../../Components/Common/FormFiled";
import { Selection } from "../../../Components/Common/Selection";
import { CustomDatePicker } from "../../../Components/Common/CustomDatePicker";

import { FaUser, FaTrash, FaPlus } from "react-icons/fa";



const API_URL = "http://localhost:3001/NewEmployees";

// --- Interfaces ---
interface Education {
  degree: string;
  institution: string;
  graduationYear: string;
}

interface Dependent {
  name: string;
  relationship: string;
  contact: string;
  DOB: string;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  gender?: string;
  dob?: string;
  email: string;
  phone: string;
// Job Info
  department: string;
  designation: string;
  manager: string;
  employmentType: string;
  salary: string;
  address: string;
  status: string;
  dateOfJoining: string;
    // New fields for dynamic education
  education: Education[];
  company_name: string;
  position: string;
  FromDate: string;
  ToDate: string;
//   dependents?: { name: string; relationship: string; contact: string }[]; // Optional dependents array
  dependents: Dependent[];
}
type EmployeeRegisterProps = {
    ClicktoAction?: () => void;
}


const EmployeeRegister = ( {ClicktoAction}: EmployeeRegisterProps) => {
  // --- 1. State Initialization ---
  const [formData, setFormData] = useState<Employee>({
    id: "",
    firstName: "",
    lastName: "",
    name: "",
    gender: "",
    dob: "",
    email: "",
    phone: "",
    // Job Info
    department: "",
    designation: "",
    manager: "",
    employmentType: "",
    salary: "",
    address: "",
    status: "Active",
    dateOfJoining: "",
    // Education starts with one empty section
    education: [{ degree: "", institution: "", graduationYear: "" }],
    company_name: "",
    position: "",
    FromDate: "",
    ToDate:"",
    // dependents: []
    dependents: [{ name: "", relationship: "", contact: "", DOB: "" }],
  });

  // --- 2. Change Handlers ---

  // Standard handler for top-level fields
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === "firstName" || name === "lastName") {
        newState.name = `${newState.firstName} ${newState.lastName}`.trim();
      }
      return newState;
    });
  };

  // Handler for nested Education fields (Degree, Institution)
  const handleEduChange = (index: number, field: keyof Education, value: string) => {
    const updatedEdu = [...formData.education];
    updatedEdu[index] = { ...updatedEdu[index], [field]: value };
    setFormData({ ...formData, education: updatedEdu });
  };

  // --- 3. Dynamic Array Actions ---

  const addEducationSection = (e?: any) => {
    // If this is called from a button inside a form, prevent refresh
    if (e?.preventDefault) e.preventDefault();
    
    setFormData({
      ...formData,
      education: [...formData.education, { degree: "", institution: "", graduationYear: "" }],
    });
  };

const addDependentSection = (e?: any) => {
  if (e?.preventDefault) e.preventDefault();      
  setFormData({
      ...formData,    
      dependents: [...formData.dependents, { name: "", relationship: "", contact: "", DOB: "" }],
  });
};

const removeDependentSection = (index: number) => {
  if (formData.dependents.length > 1) {
    const updatedDependents = formData.dependents.filter((_, i) => i !== index);
    setFormData({ ...formData, dependents: updatedDependents });
  }
};

const removeEducationSection = (index: number) => {
  if (formData.education.length > 1) {
    const updatedEdu = formData.education.filter((_, i) => i !== index);
    setFormData({ ...formData, education: updatedEdu });
  }
};

  // --- 4. Submit ---
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Employee Added Successfully");
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      alert("Error saving employee. Please check if the server is running.");
    }
  };

  // --- Options ---
  const genderOptions = [{ label: "Male", value: "Male" }, { label: "Female", value: "Female" }];
  const departmentOptions = [{ label: "HR", value: "HR" }, { label: "IT", value: "IT" }, { label: "Finance", value: "Finance" }];
  const empTypeOptions = [{ label: "Full Time", value: "Full Time" }, { label: "Part Time", value: "Part Time" }, { label: "Contract", value: "Contract" }];
  const relationshipOptions = [
    { label: "Wife", value: "Wife" },
    { label: "Child", value: "Child" },
    { label: "Father", value: "Parent" },
    { label: "Mother", value: "Parent" },
    { label: "Brother", value: "Sibling" },
    { label: "Sister", value: "Sibling" },
  ];

  return (

    

    <div className="bg-white shadow rounded-xl p-6 max-w-6xl mx-auto">
  
      <div className="flex items-center space-x-3 mb-8">
        <FaUser className="text-3xl font-bold text-blue-600" />
        <h1 className="text-3xl font-bold">Add New Employee</h1>
      </div>

      <form onSubmit={onSubmit}>
        <div className="space-y-8">
          {/* Section 1: Basic Details */}
          <section>
            <h3 className="text-lg font-medium text-blue-600 mb-4 border-b pb-2">Employee Basic Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormFiled name="id" value={formData.id} Lable="Employee Code" in_PlaceHolder="EMP-001" onChange={onChange} />
              <FormFiled name="firstName" value={formData.firstName} Lable="First Name" in_PlaceHolder="John" onChange={onChange} />
              <FormFiled name="lastName" value={formData.lastName} Lable="Last Name" in_PlaceHolder="Doe" onChange={onChange} />
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Selection label="Department" name="department" options={departmentOptions} value={formData.department || ""} onChange={onChange} />
              <FormFiled name="designation" value={formData.designation} Lable="Designation" in_PlaceHolder="Software Engineer" onChange={onChange} />
              <CustomDatePicker name="dateOfJoining" value={formData.dateOfJoining || ""} Lable="Date of Joining" onChange={onChange} />
              <Selection label="Employment Type" name="employmentType" options={empTypeOptions} value={formData.employmentType || ""} onChange={onChange} />
            </div>
          </section>

       {/* Section 3: Education (Dynamic) */}


        <section>
            <div className="text-lg font-medium text-blue-600 mb-4 border-b pb-2 flex items-center justify-between">
                <h3 className="text-lg font-medium text-blue-600">Education History</h3>
    {/* Add Button moved here for better UX */}
                <button 
                    type="button"
                    onClick={addEducationSection}
                    className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <FaPlus className="text-xs" /> Add Qualification
                </button>
            </div>

  {formData.education.map((edu, index) => (
    <div key={index} className="relative mb-6 p-4 border border-gray-300 rounded-lg bg-blue-50/50">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Degree  */}
        <div className="md:col-span-4">
          <FormFiled
            name="degree"
            value={edu.degree}
            Lable="Degree"
            in_PlaceHolder="B.Sc Computer Science"
            onChange={(e) => handleEduChange(index, "degree", e.target.value)}
          />
        </div>

        {/* Institution  */}
        <div className="md:col-span-4">
          <FormFiled
            name="institution"
            value={edu.institution}
            Lable="Institution"
            in_PlaceHolder="University Name"
            onChange={(e) => handleEduChange(index, "institution", e.target.value)}
          />
        </div>

        {/* Graduation Year  */}
        <div className="md:col-span-3">
          <CustomDatePicker
            name="graduationYear"
            value={edu.graduationYear}
            Lable="Graduation Year"
            onChange={(val) => {
              const valueToUse = typeof val === "string" ? val : (val.target?.value || "");
              handleEduChange(index, "graduationYear", valueToUse);
            }}
          />
        </div>

        {/* Action Button - spans 1 column */}
        <div className="md:col-span-1 flex items-end justify-center">
          {formData.education.length > 1 ? (
            <button
              type="button"
              onClick={() => removeEducationSection(index)}
              className="mb-5 mr-0 p-3 text-black-500 hover:text-red-500 rounded-lg transition-colors "
              title="Remove row"
            >
              <FaTrash />
            </button>
          ) : (
         
            <div className="w-10 h-10 mb-2"></div>
          )}
        </div>
      </div>
    </div>
  ))}
</section>


{/* Work Information */}
        <section >
            <div className="">
                <h3 className="text-lg font-medium text-blue-600 mb-4 border-b pb-2">Work Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormFiled name="Company_name" Lable="Company name" in_PlaceHolder="Company Name" value={formData.company_name} onChange={onChange} />
                    <FormFiled name="Position" Lable="Position" in_PlaceHolder="Position" value={formData.position} onChange={onChange} />
                    <CustomDatePicker name="FromDate" value={formData.FromDate || ""} Lable="From" onChange={onChange} />
                    <CustomDatePicker name="ToDate" value={formData.ToDate || ""} Lable="To" onChange={onChange} />
                </div>

            </div>
        </section>

{/*  */}
        <section>
            <div className="text-lg font-medium text-blue-600 mb-4 border-b pb-2 flex items-center justify-between">
            <h3 className="text-lg font-medium text-blue-600">Dependent Details</h3>
            <button 
                type="button"
                onClick={addDependentSection}
                className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
                <FaPlus className="text-xs" /> Add Person
            </button>
            </div>

            {formData.dependents.map((Depen, index) => (
            <div key={index} className="relative mb-6 p-4 border border-gray-300 rounded-lg bg-blue-50/50">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-3">
                    <FormFiled
                    name="name"
                    value={Depen.name}
                    Lable="Name"
                    in_PlaceHolder="Dependent Name"
                    onChange={(e) => {
                        const updatedDependents = [...formData.dependents];
                        updatedDependents[index] = { ...updatedDependents[index], name: e.target.value };
                        setFormData({ ...formData, dependents: updatedDependents });
                    }}
                    />
                </div>
                
                <div className="md:col-span-3">
                    <Selection
                    label="Relationship"
                    name="relationship"
                    options={relationshipOptions}
                    value={Depen.relationship}
                    onChange={(e) => {
                        const updatedDependents = [...formData.dependents];
                        updatedDependents[index] = { ...updatedDependents[index], relationship: e.target.value };
                        setFormData({ ...formData, dependents: updatedDependents });
                    }}
                    />
                </div>

                <div className="md:col-span-3">
                    <FormFiled
                    name="contact"
                    value={Depen.contact}               
                    Lable="Contact"
                    in_PlaceHolder="+91 9876543210"
                    onChange={(e) => {
                        const updatedDependents = [...formData.dependents];
                        updatedDependents[index] = { ...updatedDependents[index], contact: e.target.value };
                        setFormData({ ...formData, dependents: updatedDependents });
                    }}
                    />
                </div>

                <div className="md:col-span-2">
                    <CustomDatePicker
                    name="DOB"
                    value={Depen.DOB}
                    Lable="Date of Birth"
                    onChange={(val) => {
                        const valueToUse = typeof val === "string" ? val : (val.target?.value || "");
                        const updatedDependents = [...formData.dependents];
                        updatedDependents[index] = { ...updatedDependents[index], DOB: valueToUse };
                        setFormData({ ...formData, dependents: updatedDependents });
                    }}
                    />
                </div>

                <div className="md:col-span-1 flex items-end justify-center">
                    {formData.dependents.length > 1 ? (
                    <button
                        type="button"
                        onClick={() => removeDependentSection(index)}
                        className="mb-5 p-3 text-black-500 hover:text-red-700 rounded-lg transition-colors"
                        title="Remove row"
                    >
                        <FaTrash />
                    </button>
                    ) : (
                    <div className="w-10 h-10 mb-2"></div>
                    )}
                </div>
                </div>
            </div>
            ))}
        </section>


        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex justify-end pt-8">
          <button
            type="submit"
            className="bg-blue-600 text-white px-10 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md active:scale-95"
            onClick={ClicktoAction}
          >
            Save Employee Record
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeRegister;