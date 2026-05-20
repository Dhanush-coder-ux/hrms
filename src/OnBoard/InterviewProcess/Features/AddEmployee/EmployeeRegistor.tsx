import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { FormFiled } from "../../../../Components/Common/FormFiled";
import { Selection } from "../../../../Components/Common/Selection";
import { CustomDatePicker } from "../../../../Components/Common/CustomDatePicker";
import { FaUser, FaTrash, FaPlus } from "react-icons/fa";
import { Checkbox } from "../../../../Components/Common/CheckBox";
import type { Employee, Education, Family } from "../../../../Types/typesOnboarding";
// import { departmentOptions,genderOptions,useEmpTypeOptions, useRelationshipOptions } from "../../../../Stacks";

import { useOptions, Stackvalues, DepAPI_Url } from "../../../../Stacks";
import { useListOptions } from "../../../../Hooks/ListOption";
import { runStepValidation } from "../../../../FormValidation/AddEmpValidationscript";

const DEFAULT_FORM: Employee = {

  f_name: "",
  l_name: "",
  name: "",
  gender: "",
  dob: "",
  email: "",
  phone: "",
  Department: "",
  designation: "",
  emp_type: "",
  DateOfJoining: "",
  education: [{ degree: "", institution: "", graduationYear: "" }],
  WorkExp: [{ company_name: "", position: "", FromDate: "", ToDate: "" }],
  Street: "",
  City: "",
  State: "",
  Pin_Code: "" as any,
  p_Street: "",
  p_City: "",
  p_State: "",
  p_Pin_Code: "" as any,
  Familys: [
    { person_name: "", relationship_type: "", contact: "", person_dob: "" },
  ],
};

// ── NEW: accepts initialData so the form re-hydrates on back-navigation ───────
type EmployeeRegisterProps = {
  initialData?: Employee | null;
  ClicktoAction?: () => void;
  setEmployeeData?: (data: any) => void;
};

const AnimSection = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition:
          "opacity 0.45s ease, transform 0.45s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {children}
    </div>
  );
};

const AnimRow = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0) scaleY(1)"
          : "translateY(-10px) scaleY(0.96)",
        transformOrigin: "top",
        transition:
          "opacity 0.3s ease, transform 0.3s cubic-bezier(0.34,1.2,0.64,1)",
      }}
    >
      {children}
    </div>
  );
};

const EmployeeRegister = ({
  ClicktoAction,
  setEmployeeData,
  initialData,
}: EmployeeRegisterProps) => {
  // ── Seed from initialData if coming back to this step ─────────────────────
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState<Employee>(
    () => initialData ?? DEFAULT_FORM,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const departmentOptions = useListOptions(DepAPI_Url);

  const genderOptions = useOptions(Stackvalues, "gender", "label", "value");

  const relationOptions = useOptions(
    Stackvalues,
    "relationship",
    "label",
    "value",
  );

  const employeeTypeOptions = useOptions(
    Stackvalues,
    "employeeType",
    "label",
    "value",
  );

  // If parent re-passes initialData (e.g. hot-reload), stay in sync
  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const onChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { target: { name: string; value: string } },
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      let parsedValue: any = value;
      if (name === "f_name" || name === "l_name") {
        parsedValue = value.replace(/[^A-Za-z]/g, "");
      } else if (name === "phone") {
        parsedValue = value.replace(/\D/g, "").slice(0, 10);
      } else if (name === "Pin_Code" || name === "p_Pin_Code") {
        const digits = value.replace(/\D/g, "").slice(0, 6);
        parsedValue = digits ? Number(digits) : "";
      }
      const s = { ...prev, [name]: parsedValue };
      if (name === "f_name" || name === "l_name")
        s.name = `${s.f_name} ${s.l_name}`.trim();
      return s;
    });
  };

  const handleEduChange = (
    index: number,
    field: keyof Education,
    value: string,
  ) => {
    const u = [...formData.education];
    let finalValue = value;
    if (field === "degree" || field === "institution") {
      finalValue = value.replace(/[^A-Za-z\s.]/g, "");
    }
    u[index] = { ...u[index], [field]: finalValue };
    setFormData({ ...formData, education: u });
  };

  const handleWorkExpChange = (
    index: number,
    field: keyof typeof formData.WorkExp[0],
    value: string,
  ) => {
    const u = [...formData.WorkExp];
    let finalValue = value;
    if (field === "company_name" || field === "position") {
      finalValue = value.replace(/[^A-Za-z\s.]/g, "");
    }
    u[index] = { ...u[index], [field]: finalValue } as any;
    setFormData({ ...formData, WorkExp: u });
  };

  const handleFamilyChange = (
    index: number,
    field: keyof Family,
    value: string,
  ) => {
    const u = [...formData.Familys];
    let finalValue = value;
    if (field === "person_name") {
      finalValue = value.replace(/[^A-Za-z\s]/g, "");
    } else if (field === "contact") {
      finalValue = value.replace(/\D/g, "").slice(0, 10);
    }
    u[index] = { ...u[index], [field]: finalValue };
    setFormData({ ...formData, Familys: u });
  };

  const addEducationSection = (e?: any) => {
    if (e?.preventDefault) e.preventDefault();
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        { degree: "", institution: "", graduationYear: "" },
      ],
    });
  };
  const addExperienceSection = (e?: any) => {
    if (e?.preventDefault) e.preventDefault();
    setFormData({
      ...formData,
      WorkExp: [
        ...formData.WorkExp,
        {
          company_name: "",
          ToDate: "",
          FromDate: "",
          position: "",
        },
      ],
    });
  };

  const removeEducationSection = (index: number) => {
    if (formData.education.length > 1)
      setFormData({
        ...formData,
        education: formData.education.filter((_, i) => i !== index),
      });
  };

  const removeWorkexpSection = (index: number) => {
    if (formData.WorkExp.length > 1)
      setFormData({
        ...formData,
        WorkExp: formData.WorkExp.filter((_, i) => i !== index),
      });
  };

  const addFamilySection = (e?: any) => {
    if (e?.preventDefault) e.preventDefault();
    setFormData({
      ...formData,
      Familys: [
        ...formData.Familys,
        { person_name: "", relationship_type: "", contact: "", person_dob: "" },
      ],
    });
  };

  const removeFamilySection = (index: number) => {
    if (formData.Familys.length > 1)
      setFormData({
        ...formData,
        Familys: formData.Familys.filter((_, i) => i !== index),
      });
  };

  const handleSameAddress = (checked: boolean) => {
    setIsChecked(checked);
    setFormData((prev) => ({
      ...prev,
      p_Street: checked ? prev.Street : "",
      p_City: checked ? prev.City : "",
      p_State: checked ? prev.State : "",
      p_Pin_Code: checked ? prev.Pin_Code : "" as any,
    }));
  };


  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Run validations for Steps 1, 2, and 3
    const step1Errs = runStepValidation(1, formData as any);
    const step2Errs = runStepValidation(2, formData as any);
    const step3Errs = runStepValidation(3, formData as any);

    const allErrors = { ...step1Errs, ...step2Errs, ...step3Errs };

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      // Scroll to the first invalid element
      const firstErrorKey = Object.keys(allErrors)[0];
      const element = document.getElementById(firstErrorKey);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setErrors({});
    try {
      const updatedData = { ...formData };
      setEmployeeData?.(updatedData);
      ClicktoAction?.();
    } catch (error) {
      console.error("Error", error);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        .emp-page { font-family: 'DM Sans', sans-serif; padding: 24px; }
        .emp-section-head {
          font-size: 15px; font-weight: 600; color: hsl(var(--primary-hsl));
          margin-bottom: 18px; padding-bottom: 10px;
          border-bottom: 1.5px solid #e2e8f0;
          display: flex; align-items: center; justify-content: space-between;
        }
        .emp-row-card {
          position: relative; margin-bottom: 16px; padding: 18px;
          border: 1.5px solid #e2e8f0; border-radius: 12px;
          background: linear-gradient(135deg, rgba(var(--primary-hsl), 0.05) 0%, rgba(var(--primary-hsl), 0.02) 100%);
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .emp-row-card:hover { border-color: hsl(var(--primary-hsl) / 0.3); box-shadow: 0 4px 16px rgba(var(--primary-hsl), 0.08); }
        .emp-add-btn {
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600; color: hsl(var(--primary-hsl));
          background: transparent; border: none; cursor: pointer;
          padding: 4px 10px; border-radius: 8px;
          transition: background 0.15s, color 0.15s;
        }
        .emp-add-btn:hover { background: hsl(var(--primary-hsl) / 0.1); color: hsl(var(--primary-hsl)); }
        .emp-remove-btn {
          display: flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 8px;
          border: none; background: transparent; cursor: pointer;
          color: #94a3b8; transition: all 0.15s ease;
          margin-bottom: 18px;
        }
        .emp-remove-btn:hover { background: #fee2e2; color: #ef4444; }
        .emp-submit-btn {
          background: hsl(var(--primary-hsl)); color: #fff;
          padding: 12px 40px; border-radius: 10px;
          font-size: 15px; font-weight: 600; border: none; cursor: pointer;
          box-shadow: 0 4px 14px hsl(var(--primary-hsl) / 0.35);
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .emp-submit-btn:hover { opacity: 0.9; box-shadow: 0 6px 20px hsl(var(--primary-hsl) / 0.45); }
        .emp-submit-btn:active { transform: scale(0.97); }
        .emp-heading { font-size: 28px; font-weight: 700; color: hsl(var(--text-hsl)); }
      `}</style>

      <div className="emp-page min-h-full">
        <AnimSection delay={0}>
          <div className="flex items-center gap-3 mb-8">
            <FaUser className="text-[26px] text-primary shrink-0" />
            <h1 className="emp-heading">Add New Employee</h1>
          </div>
        </AnimSection>

        <form className="space-y-8" onSubmit={onSubmit}>
          {/* Employee Basic Details */}
          <AnimSection delay={60}>
            <section>
              <div className="emp-section-head">Employee Basic Details</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormFiled
                  name="f_name"
                  value={formData.f_name}
                  Lable="First Name"
                  in_PlaceHolder="John"
                  onChange={onChange}
                  error={errors.f_name}
                  required={true}
                />
                <FormFiled
                  name="l_name"
                  value={formData.l_name}
                  Lable="Last Name"
                  in_PlaceHolder="Doe"
                  onChange={onChange}
                  error={errors.l_name}
                  required={true}
                />
                <FormFiled
                  name="name"
                  value={formData.name}
                  Lable="Full Name (Auto)"
                  in_PlaceHolder="John Doe"
                  onChange={onChange}
                  error={errors.name}
                  required={true}
                />
                <Selection
                  label="Gender"
                  name="gender"
                  options={genderOptions}
                  value={formData.gender || ""}
                  onChange={onChange}
                  error={errors.gender}
                  required={true}
                />
                <CustomDatePicker
                  name="dob"
                  value={formData.dob || ""}
                  Lable="Date of Birth"
                  onChange={onChange}
                  error={errors.dob}
                  required={true}
                />
                <FormFiled
                  name="phone"
                  value={formData.phone}
                  Lable="Phone"
                  in_PlaceHolder="+91 9876543210"
                  onChange={onChange}
                  error={errors.phone}
                  required={true}
                />
                <FormFiled
                  name="email"
                  value={formData.email}
                  Lable="Email"
                  in_PlaceHolder="employee@company.com"
                  onChange={onChange}
                  error={errors.email}
                  required={true}
                />
              </div>
            </section>
          </AnimSection>

          {/* Job Information */}
          <AnimSection delay={120}>
            <section>
              <div className="emp-section-head">Job Information</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Selection
                  label="Department"
                  name="Department"
                  options={departmentOptions}
                  value={formData.Department || ""}
                  onChange={onChange}
                  error={errors.Department}
                  required={true}
                />
                <FormFiled
                  name="designation"
                  value={formData.designation}
                  Lable="Designation"
                  in_PlaceHolder="Software Engineer"
                  onChange={onChange}
                  error={errors.designation}
                  required={true}
                />
                <CustomDatePicker
                  name="DateOfJoining"
                  value={formData.DateOfJoining || ""}
                  Lable="Date of Joining"
                  onChange={onChange}
                  error={errors.DateOfJoining}
                  required={true}
                />
                <Selection
                  label="Employment Type"
                  name="emp_type"
                  options={employeeTypeOptions}
                  value={formData.emp_type || ""}
                  onChange={onChange}
                  error={errors.emp_type}
                  required={true}
                />
              </div>
            </section>
          </AnimSection>

          {/* Education History */}
          <AnimSection delay={180}>
            <section>
              <div className="emp-section-head">
                Education History
                <button
                  type="button"
                  className="emp-add-btn"
                  onClick={addEducationSection}
                >
                  <FaPlus size={11} /> Add Qualification
                </button>
              </div>
              {formData.education.map((edu, index) => (
                <AnimRow key={index}>
                  <div className="emp-row-card">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-4">
                        <FormFiled
                          name="degree"
                          value={edu.degree}
                          Lable="Degree"
                          in_PlaceHolder="B.Sc Computer Science"
                          onChange={(e) =>
                            handleEduChange(index, "degree", e.target.value)
                          }
                          error={errors[`edu_${index}_degree`]}
                          required={true}
                        />
                      </div>
                      <div className="md:col-span-4">
                        <FormFiled
                          name="institution"
                          value={edu.institution}
                          Lable="Institution"
                          in_PlaceHolder="University Name"
                          onChange={(e) =>
                            handleEduChange(
                              index,
                              "institution",
                              e.target.value,
                            )
                          }
                          error={errors[`edu_${index}_institution`]}
                          required={true}
                        />
                      </div>
                      <div className="md:col-span-3">
                        <CustomDatePicker
                          name="graduationYear"
                          value={edu.graduationYear}
                          Lable="Graduation Year"
                          onChange={(val) => {
                            const v =
                              typeof val === "string"
                                ? val
                                : val.target?.value || "";
                            handleEduChange(index, "graduationYear", v);
                          }}
                          error={errors[`edu_${index}_graduationYear`]}
                          required={true}
                        />
                      </div>
                      <div className="md:col-span-1 flex items-end justify-center">
                        {formData.education.length > 1 ? (
                          <button
                            type="button"
                            className="emp-remove-btn"
                            onClick={() => removeEducationSection(index)}
                            title="Remove"
                          >
                            <FaTrash size={13} />
                          </button>
                        ) : (
                          <div className="w-8 h-8 mb-4" />
                        )}
                      </div>
                    </div>
                  </div>
                </AnimRow>
              ))}
            </section>
          </AnimSection>

          {/* Work Experience Information */}
          <AnimSection delay={300}>
            <section>
              <div className="emp-section-head">
                Work Experience Information
                <button
                  type="button"
                  className="emp-add-btn"
                  onClick={addExperienceSection}
                >
                  <FaPlus size={11} /> Add Experience
                </button>
              </div>
              {formData.WorkExp.map((work, index) => (
                <AnimRow key={index}>
                  <div className="emp-row-card">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-3">
                        <FormFiled
                          Lable="Company Name"
                          in_PlaceHolder="Company Name"
                          value={work.company_name}
                          onChange={(e) => handleWorkExpChange(index, "company_name", e.target.value)}
                          name={""}
                          error={errors[`exp_${index}_company_name`]}
                          required={true}
                        />
                      </div>
                      <div className="md:col-span-3">
                        <FormFiled
                          Lable="Position"
                          in_PlaceHolder="Software Engineer"
                          value={work.position}
                          onChange={(e) => handleWorkExpChange(index, "position", e.target.value)}
                          name={""}
                          error={errors[`exp_${index}_position`]}
                          required={true}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <CustomDatePicker
                          Lable="From Date"
                          value={work.FromDate}
                          onChange={(val) => {
                            const v =
                              typeof val === "string"
                                ? val
                                : val.target?.value || "";
                            handleWorkExpChange(index, "FromDate", v);
                          }}
                          name={""}
                          error={errors[`exp_${index}_FromDate`]}
                          required={true}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <CustomDatePicker
                          Lable="To Date"
                          value={work.ToDate}
                          onChange={(val) => {
                            const v =
                              typeof val === "string"
                                ? val
                                : val.target?.value || "";
                            handleWorkExpChange(index, "ToDate", v);
                          }}
                          name={""}
                          error={errors[`exp_${index}_ToDate`]}
                          required={!work.ToDate && !work.FromDate ? false : true}
                        />
                      </div>
                      <div className="md:col-span-2 flex items-end justify-center">
                        {formData.WorkExp.length > 1 && (
                          <button
                            type="button"
                            className="emp-remove-btn"
                            onClick={() => removeWorkexpSection(index)}
                          >
                            <FaTrash size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </AnimRow>
              ))}
            </section>
          </AnimSection>

          {/* Family Details */}
          <AnimSection delay={300}>
            <section>
              <div className="emp-section-head">
                Family Details
                <button
                  type="button"
                  className="emp-add-btn"
                  onClick={addFamilySection}
                >
                  <FaPlus size={11} /> Add Person
                </button>
              </div>
              {formData.Familys.map((Depen, index) => (
                <AnimRow key={index}>
                  <div className="emp-row-card">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-3">
                        <FormFiled
                          name="name"
                          value={Depen.person_name}
                          Lable="Name"
                          in_PlaceHolder="Family Name"
                          onChange={(e) => handleFamilyChange(index, "person_name", e.target.value)}
                          error={errors[`fam_${index}_person_name`]}
                          required={true}
                        />
                      </div>
                      <div className="md:col-span-3">
                        <Selection
                          label="Relationship"
                          name="relationship"
                          options={relationOptions}
                          value={Depen.relationship_type}
                          onChange={(e) => handleFamilyChange(index, "relationship_type", e.target.value)}
                          error={errors[`fam_${index}_relationship_type`]}
                          required={true}
                        />
                      </div>
                      <div className="md:col-span-3">
                        <FormFiled
                          name="contact"
                          value={Depen.contact}
                          Lable="Contact"
                          in_PlaceHolder="+91 9876543210"
                          onChange={(e) => handleFamilyChange(index, "contact", e.target.value)}
                          error={errors[`fam_${index}_contact`]}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <CustomDatePicker
                          name="DOB"
                          value={Depen.person_dob}
                          Lable="Date of Birth"
                          onChange={(val) => {
                            const v =
                              typeof val === "string"
                                ? val
                                : val.target?.value || "";
                            handleFamilyChange(index, "person_dob", v);
                          }}
                          error={errors[`fam_${index}_person_dob`]}
                        />
                      </div>
                      <div className="md:col-span-1 flex items-end justify-center">
                        {formData.Familys.length > 1 ? (
                          <button
                            type="button"
                            className="emp-remove-btn"
                            onClick={() => removeFamilySection(index)}
                            title="Remove"
                          >
                            <FaTrash size={13} />
                          </button>
                        ) : (
                          <div className="w-8 h-8 mb-4" />
                        )}
                      </div>
                    </div>
                  </div>
                </AnimRow>
              ))}
            </section>
          </AnimSection>

          {/* Current Address Details */}
          <AnimSection delay={360}>
            <section>
              <div className="emp-section-head">Current Address Details</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormFiled
                  name="Street"
                  value={formData.Street}
                  Lable="Street Address"
                  in_PlaceHolder="Street Address"
                  onChange={onChange}
                  error={errors.Street}
                  required={true}
                />
                <FormFiled
                  name="City"
                  value={formData.City}
                  Lable="City"
                  in_PlaceHolder="City"
                  onChange={onChange}
                  error={errors.City}
                  required={true}
                />
                <FormFiled
                  name="State"
                  value={formData.State}
                  Lable="State"
                  in_PlaceHolder="State"
                  onChange={onChange}
                  error={errors.State}
                  required={true}
                />
                <FormFiled
                  name="Pin_Code"
                  value={formData.Pin_Code}
                  Lable="Pin Code"
                  in_PlaceHolder="Pin Code"
                  onChange={onChange}
                  error={errors.Pin_Code}
                  required={true}
                />
              </div>
            </section>
          </AnimSection>

          {/* Permanent Address Details */}
          <AnimSection delay={420}>
            <section>
              <div className="emp-section-head">Permanent Address Details</div>
              <div className="mb-5">
                <Checkbox
                  label="Same as Current Address"
                  checked={isChecked}
                  onChange={handleSameAddress}
                  name="sameAddress"
                />
              </div>
              <div
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                style={{
                  opacity: isChecked ? 0.65 : 1,
                  pointerEvents: isChecked ? "none" : "auto",
                  transition: "opacity 0.3s ease",
                }}
              >
                <FormFiled
                  name="p_Street"
                  value={formData.p_Street}
                  Lable="Street Address"
                  in_PlaceHolder="Street Address"
                  onChange={onChange}
                  error={errors.p_Street}
                  required={!isChecked}
                />
                <FormFiled
                  name="p_City"
                  value={formData.p_City}
                  Lable="City"
                  in_PlaceHolder="City"
                  onChange={onChange}
                  error={errors.p_City}
                  required={!isChecked}
                />
                <FormFiled
                  name="p_State"
                  value={formData.p_State}
                  Lable="State"
                  in_PlaceHolder="State"
                  onChange={onChange}
                  error={errors.p_State}
                  required={!isChecked}
                />
                <FormFiled
                  name="p_Pin_Code"
                  value={formData.p_Pin_Code}
                  Lable="Pin Code"
                  in_PlaceHolder="Pin Code"
                  onChange={onChange}
                  error={errors.p_Pin_Code}
                  required={!isChecked}
                />
              </div>
            </section>
          </AnimSection>

          <AnimSection delay={480}>
            <button type="submit" className="emp-submit-btn">
              Next
            </button>
          </AnimSection>
        </form>
      </div>
    </>
  );
};

export default EmployeeRegister;
