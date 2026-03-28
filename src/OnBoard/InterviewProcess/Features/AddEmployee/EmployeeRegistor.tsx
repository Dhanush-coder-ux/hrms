import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { FormFiled } from "../../../../Components/Common/FormFiled";
import { Selection } from "../../../../Components/Common/Selection";
import { CustomDatePicker } from "../../../../Components/Common/CustomDatePicker";
import { FaUser, FaTrash, FaPlus } from "react-icons/fa";
import { Checkbox } from "../../../../Components/Common/CheckBox";
import type {Employee ,Education} from "../../../../Types/typesOnboarding"

const DEFAULT_FORM: Employee = {
  Emp_id: "", f_name: "", l_name: "", name: "", gender: "", dob: "", email: "", phone: "",
  Department: "", designation: "", emp_type: "", DateOfJoining: "",
  education: [{ degree: "", institution: "", graduationYear: "" }],
  company_name: "", position: "", FromDate: "", ToDate: "",
  Street: "", City: "", State: "", Pin_Code: 0,
  p_Street: "", p_City: "", p_State: "", p_Pin_Code: 0,
  dependents: [{ person_name: "", relationship_type: "", contact: "", person_dob: "" }],
};

// ── NEW: accepts initialData so the form re-hydrates on back-navigation ───────
type EmployeeRegisterProps = {
  initialData?: Employee | null;
  ClicktoAction?: () => void;
  setEmployeeData?: (data: any) => void;
 
};

const AnimSection = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(18px)",
      transition: "opacity 0.45s ease, transform 0.45s cubic-bezier(0.4,0,0.2,1)",
    }}>
      {children}
    </div>
  );
};

const AnimRow = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0) scaleY(1)" : "translateY(-10px) scaleY(0.96)",
      transformOrigin: "top",
      transition: "opacity 0.3s ease, transform 0.3s cubic-bezier(0.34,1.2,0.64,1)",
    }}>
      {children}
    </div>
  );
};

const EmployeeRegister = ({ ClicktoAction, setEmployeeData, initialData }: EmployeeRegisterProps) => {
  // ── Seed from initialData if coming back to this step ─────────────────────
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState<Employee>(() => initialData ?? DEFAULT_FORM);

  // If parent re-passes initialData (e.g. hot-reload), stay in sync
  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const s = { ...prev, [name]: value };
      if (name === "f_name" || name === "l_name") s.name = `${s.f_name} ${s.l_name}`.trim();
      return s;
    });
  };

  const handleEduChange = (index: number, field: keyof Education, value: string) => {
    const u = [...formData.education]; u[index] = { ...u[index], [field]: value };
    setFormData({ ...formData, education: u });
  };

  const addEducationSection = (e?: any) => {
    if (e?.preventDefault) e.preventDefault();
    setFormData({ ...formData, education: [...formData.education, { degree: "", institution: "", graduationYear: "" }] });
  };

  const removeEducationSection = (index: number) => {
    if (formData.education.length > 1)
      setFormData({ ...formData, education: formData.education.filter((_, i) => i !== index) });
  };

  const addDependentSection = (e?: any) => {
    if (e?.preventDefault) e.preventDefault();
    setFormData({ ...formData, dependents: [...formData.dependents, { person_name: "", relationship_type: "", contact: "", person_dob: "" }] });
  };

  const removeDependentSection = (index: number) => {
    if (formData.dependents.length > 1)
      setFormData({ ...formData, dependents: formData.dependents.filter((_, i) => i !== index) });
  };

  const handleSameAddress = (checked: boolean) => {
    setIsChecked(checked);
    setFormData((prev) => ({
      ...prev,
      p_Street: checked ? prev.Street : "", p_City: checked ? prev.City : "",
      p_State: checked ? prev.State : "", p_Pin_Code: checked ? prev.Pin_Code : 0,
    }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setEmployeeData?.(formData); ClicktoAction?.();
  };

  const genderOptions = [{ label: "Male", value: "Male" }, { label: "Female", value: "Female" }];
  const departmentOptions = [{ label: "HR", value: "HR" }, { label: "IT", value: "IT" }, { label: "Finance", value: "Finance" }];
  const empTypeOptions = [{ label: "Full Time", value: "Full Time" }, { label: "Part Time", value: "Part Time" }, { label: "Contract", value: "Contract" }];
  const relationshipOptions = [
    { label: "Wife", value: "Wife" }, { label: "Child", value: "Child" },
    { label: "Father", value: "Father" }, { label: "Mother", value: "Mother" },
    { label: "Brother", value: "Brother" }, { label: "Sister", value: "Sister" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        .emp-page { font-family: 'DM Sans', sans-serif; padding: 24px; }
        .emp-section-head {
          font-size: 15px; font-weight: 600; color: #4f46e5;
          margin-bottom: 18px; padding-bottom: 10px;
          border-bottom: 1.5px solid #e2e8f0;
          display: flex; align-items: center; justify-content: space-between;
        }
        .emp-row-card {
          position: relative; margin-bottom: 16px; padding: 18px;
          border: 1.5px solid #e2e8f0; border-radius: 12px;
          background: linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%);
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .emp-row-card:hover { border-color: #c7d2fe; box-shadow: 0 4px 16px rgba(99,102,241,0.08); }
        .emp-add-btn {
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600; color: #6366f1;
          background: transparent; border: none; cursor: pointer;
          padding: 4px 10px; border-radius: 8px;
          transition: background 0.15s, color 0.15s;
        }
        .emp-add-btn:hover { background: #eef2ff; color: #4338ca; }
        .emp-remove-btn {
          display: flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 8px;
          border: none; background: transparent; cursor: pointer;
          color: #94a3b8; transition: all 0.15s ease;
          margin-bottom: 18px;
        }
        .emp-remove-btn:hover { background: #fee2e2; color: #ef4444; }
        .emp-submit-btn {
          background: #6366f1; color: #fff;
          padding: 12px 40px; border-radius: 10px;
          font-size: 15px; font-weight: 600; border: none; cursor: pointer;
          box-shadow: 0 4px 14px rgba(99,102,241,0.35);
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .emp-submit-btn:hover { background: #4f46e5; box-shadow: 0 6px 20px rgba(99,102,241,0.45); }
        .emp-submit-btn:active { transform: scale(0.97); }
        .emp-heading { font-size: 28px; font-weight: 700; color: #0f172a; }
      `}</style>

      <div className="emp-page">
        <AnimSection delay={0}>
          <div className="flex items-center gap-3 mb-8">
            <FaUser className="text-[26px] text-indigo-500 shrink-0" />
            <h1 className="emp-heading">Add New Employee</h1>
          </div>
        </AnimSection>

        <form className="space-y-8" onSubmit={onSubmit}>
          <AnimSection delay={60}>
            <section>
              <div className="emp-section-head">Employee Basic Details</div>
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
          </AnimSection>

          <AnimSection delay={120}>
            <section>
              <div className="emp-section-head">Job Information</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Selection label="Department" name="Department" options={departmentOptions} value={formData.Department || ""} onChange={onChange} />
                <FormFiled name="designation" value={formData.designation} Lable="Designation" in_PlaceHolder="Software Engineer" onChange={onChange} />
                <CustomDatePicker name="DateOfJoining" value={formData.DateOfJoining || ""} Lable="Date of Joining" onChange={onChange} />
                <Selection label="Employment Type" name="emp_type" options={empTypeOptions} value={formData.emp_type || ""} onChange={onChange} />
              </div>
            </section>
          </AnimSection>

          <AnimSection delay={180}>
            <section>
              <div className="emp-section-head">
                Education History
                <button type="button" className="emp-add-btn" onClick={addEducationSection}>
                  <FaPlus size={11} /> Add Qualification
                </button>
              </div>
              {formData.education.map((edu, index) => (
                <AnimRow key={index}>
                  <div className="emp-row-card">
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
                          <button type="button" className="emp-remove-btn" onClick={() => removeEducationSection(index)} title="Remove">
                            <FaTrash size={13} />
                          </button>
                        ) : <div className="w-8 h-8 mb-4" />}
                      </div>
                    </div>
                  </div>
                </AnimRow>
              ))}
            </section>
          </AnimSection>

          <AnimSection delay={240}>
            <section>
              <div className="emp-section-head">Work Information</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormFiled name="company_name" Lable="Company Name" in_PlaceHolder="Company Name" value={formData.company_name} onChange={onChange} />
                <FormFiled name="position" Lable="Position" in_PlaceHolder="Position" value={formData.position} onChange={onChange} />
                <CustomDatePicker name="FromDate" value={formData.FromDate || ""} Lable="From" onChange={onChange} />
                <CustomDatePicker name="ToDate" value={formData.ToDate || ""} Lable="To" onChange={onChange} />
              </div>
            </section>
          </AnimSection>

          <AnimSection delay={300}>
            <section>
              <div className="emp-section-head">
                Dependent Details
                <button type="button" className="emp-add-btn" onClick={addDependentSection}>
                  <FaPlus size={11} /> Add Person
                </button>
              </div>
              {formData.dependents.map((Depen, index) => (
                <AnimRow key={index}>
                  <div className="emp-row-card">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-3">
                        <FormFiled name="name" value={Depen.person_name} Lable="Name" in_PlaceHolder="Dependent Name"
                          onChange={(e) => { const u = [...formData.dependents]; u[index] = { ...u[index], person_name: e.target.value }; setFormData({ ...formData, dependents: u }); }} />
                      </div>
                      <div className="md:col-span-3">
                        <Selection label="Relationship" name="relationship" options={relationshipOptions} value={Depen.relationship_type}
                          onChange={(e) => { const u = [...formData.dependents]; u[index] = { ...u[index], relationship_type: e.target.value }; setFormData({ ...formData, dependents: u }); }} />
                      </div>
                      <div className="md:col-span-3">
                        <FormFiled name="contact" value={Depen.contact} Lable="Contact" in_PlaceHolder="+91 9876543210"
                          onChange={(e) => { const u = [...formData.dependents]; u[index] = { ...u[index], contact: e.target.value }; setFormData({ ...formData, dependents: u }); }} />
                      </div>
                      <div className="md:col-span-2">
                        <CustomDatePicker name="DOB" value={Depen.person_dob} Lable="Date of Birth"
                          onChange={(val) => {
                            const v = typeof val === "string" ? val : (val.target?.value || "");
                            const u = [...formData.dependents]; u[index] = { ...u[index], person_dob: v };
                            setFormData({ ...formData, dependents: u });
                          }} />
                      </div>
                      <div className="md:col-span-1 flex items-end justify-center">
                        {formData.dependents.length > 1 ? (
                          <button type="button" className="emp-remove-btn" onClick={() => removeDependentSection(index)} title="Remove">
                            <FaTrash size={13} />
                          </button>
                        ) : <div className="w-8 h-8 mb-4" />}
                      </div>
                    </div>
                  </div>
                </AnimRow>
              ))}
            </section>
          </AnimSection>

          <AnimSection delay={360}>
            <section>
              <div className="emp-section-head">Current Address Details</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormFiled name="Street" value={formData.Street} Lable="Street Address" in_PlaceHolder="Street Address" onChange={onChange} />
                <FormFiled name="City" value={formData.City} Lable="City" in_PlaceHolder="City" onChange={onChange} />
                <FormFiled name="State" value={formData.State} Lable="State" in_PlaceHolder="State" onChange={onChange} />
                <FormFiled name="Pin_Code" value={formData.Pin_Code} Lable="Pin Code" in_PlaceHolder="Pin Code" onChange={onChange} />
              </div>
            </section>
          </AnimSection>

          <AnimSection delay={420}>
            <section>
              <div className="emp-section-head">Permanent Address Details</div>
              <div className="mb-5">
                <Checkbox label="Same as Current Address" checked={isChecked} onChange={handleSameAddress} name="sameAddress" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6"
                style={{
                  opacity: isChecked ? 0.65 : 1,
                  pointerEvents: isChecked ? "none" : "auto",
                  transition: "opacity 0.3s ease",
                }}>
                <FormFiled name="p_Street" value={formData.p_Street} Lable="Street Address" in_PlaceHolder="Street Address" onChange={onChange} />
                <FormFiled name="p_City" value={formData.p_City} Lable="City" in_PlaceHolder="City" onChange={onChange} />
                <FormFiled name="p_State" value={formData.p_State} Lable="State" in_PlaceHolder="State" onChange={onChange} />
                <FormFiled name="p_Pin_Code" value={formData.p_Pin_Code} Lable="Pin Code" in_PlaceHolder="Pin Code" onChange={onChange} />
              </div>
            </section>
          </AnimSection>

          <AnimSection delay={480}>
            <button type="submit" className="emp-submit-btn">Next</button>
          </AnimSection>
        </form>
      </div>
    </>
  );
};

export default EmployeeRegister;