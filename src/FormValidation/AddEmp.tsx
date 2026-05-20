import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  GraduationCap, 
  Users, 
  ShieldAlert, 
  Building, 
  Plus, 
  Trash, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Check
} from "lucide-react";
import { FormFiled } from "../Components/Common/FormFiled";
import { Selection } from "../Components/Common/Selection";
import { CustomDatePicker } from "../Components/Common/CustomDatePicker";
import { Checkbox } from "../Components/Common/CheckBox";
import Toggle from "../Components/Common/Toggle";

import { useOptions, Stackvalues, DepAPI_Url, payrollProviderUrl } from "../Stacks";
import { useListOptions } from "../Hooks/ListOption";
import { useCurrencies } from "../Hooks/CurrenciesSelect";
import { Api_URL } from "../APILINK";
import { pageTheme } from "../Themes/PageThems/pageConfig";

// Fallbacks for dropdown options when backend is unavailable
const FALLBACK_DEPARTMENTS = [
  { label: "Engineering", value: "Engineering" },
  { label: "Human Resources", value: "Human Resources" },
  { label: "Marketing", value: "Marketing" },
  { label: "Sales", value: "Sales" },
  { label: "Finance", value: "Finance" },
  { label: "Operations", value: "Operations" },
];

const FALLBACK_PAYROLL_PROVIDERS = [
  { label: "RazorpayX Payroll", value: "RazorpayX" },
  { label: "Gusto", value: "Gusto" },
  { label: "ADP", value: "ADP" },
  { label: "Paychex", value: "Paychex" },
];

const FALLBACK_GENDERS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const FALLBACK_RELATIONSHIPS = [
  { label: "Spouse", value: "spouse" },
  { label: "Child", value: "child" },
  { label: "Parent", value: "parent" },
  { label: "Sibling", value: "sibling" },
];

const FALLBACK_EMPLOYEE_TYPES = [
  { label: "Full Time", value: "full_time" },
  { label: "Part Time", value: "part_time" },
  { label: "Contract", value: "contract" },
  { label: "Intern", value: "intern" },
];

const INSURANCE_PROVIDERS = [
  { value: "Tata AIG", label: "Tata AIG" },
  { value: "Muthoot Finance", label: "Muthoot Finance" },
  { value: "Bajaj Allianz", label: "Bajaj Allianz" },
  { value: "HDFC Ergo", label: "HDFC Ergo" },
];

interface Education {
  degree: string;
  institution: string;
  graduationYear: string;
}

interface WorkExperience {
  company_name: string;
  position: string;
  FromDate: string;
  ToDate: string;
  is_current: boolean;
}

interface Dependent {
  person_name: string;
  relationship_type: string;
  contact: string;
  person_dob: string;
}

interface Nominee {
  nominee_name: string;
  nominee_aadhar: string;
}

interface EmployeeFormData {
  // Step 1: Personal & Job
  f_name: string;
  l_name: string;
  name: string;
  gender: string;
  dob: string;
  phone: string;
  email: string;
  Department: string;
  designation: string;
  DateOfJoining: string;
  emp_type: string;

  // Step 2: Education & Experience
  education: Education[];
  fresher: boolean;
  WorkExp: WorkExperience[];

  // Step 3: Family & Address
  Familys: Dependent[];
  Street: string;
  City: string;
  State: string;
  Pin_Code: string;
  sameAddress: boolean;
  p_Street: string;
  p_City: string;
  p_State: string;
  p_Pin_Code: string;

  // Step 4: Payroll & Statutory
  provider: string;
  payType: string;
  currency: string;
  payFrequency: string;
  annualSalary: string;
  bonusEligible: boolean;
  bonus_Type: string;
  bonus_CalculationMode: "percentage" | "fixed";
  bonus_Value: string;

  // PF & ESI
  hasUAN: boolean;
  uan_number: string;
  pf_id: string;
  aadhar_no: string;
  hasESI: boolean;
  esi_no: string;
  esi_name: string;
  apply_esi: boolean;

  // Insurance
  hasINS: boolean;
  insurance_no: string;
  insurance_provider: string;
  Nominee: Nominee[];

  // Step 5: Bank & TAX
  bankName: string;
  ifscCode: string;
  accountNumber: string;
  confirmAccount: string;
  panNumber: string;
}

const DEFAULT_FORM: EmployeeFormData = {
  f_name: "",
  l_name: "",
  name: "",
  gender: "",
  dob: "",
  phone: "",
  email: "",
  Department: "",
  designation: "",
  DateOfJoining: "",
  emp_type: "",

  education: [{ degree: "", institution: "", graduationYear: "" }],
  fresher: false,
  WorkExp: [{ company_name: "", position: "", FromDate: "", ToDate: "", is_current: false }],

  Familys: [{ person_name: "", relationship_type: "", contact: "", person_dob: "" }],
  Street: "",
  City: "",
  State: "",
  Pin_Code: "",
  sameAddress: false,
  p_Street: "",
  p_City: "",
  p_State: "",
  p_Pin_Code: "",

  provider: "",
  payType: "",
  currency: "",
  payFrequency: "",
  annualSalary: "",
  bonusEligible: false,
  bonus_Type: "",
  bonus_CalculationMode: "percentage",
  bonus_Value: "",

  hasUAN: false,
  uan_number: "",
  pf_id: "",
  aadhar_no: "",
  hasESI: false,
  esi_no: "",
  esi_name: "",
  apply_esi: false,

  hasINS: false,
  insurance_no: "",
  insurance_provider: "",
  Nominee: [{ nominee_name: "", nominee_aadhar: "" }],

  bankName: "",
  ifscCode: "",
  accountNumber: "",
  confirmAccount: "",
  panNumber: "",
};

export const AddEmp = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EmployeeFormData>(DEFAULT_FORM);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [createdEmpId, setCreatedEmpId] = useState("");

  // Options Hooks
  const systemGenders = useOptions(Stackvalues, "gender", "label", "value");
  const systemRelationships = useOptions(Stackvalues, "relationship", "label", "value");
  const systemEmployeeTypes = useOptions(Stackvalues, "employeeType", "label", "value");
  const systemPayTypes = useOptions(Stackvalues, "payType", "label", "value");
  const systemPayFrequencies = useOptions(Stackvalues, "payFrequency", "label", "value");
  const systemCurrenciesDefault = useOptions(Stackvalues, "currency", "label", "value");

  const backendDepartments = useListOptions(DepAPI_Url);
  const backendPayrollProviders = useListOptions(payrollProviderUrl);
  const { currencyOptions, currencySymbolMap } = useCurrencies();

  // Resolve options lists with Fallbacks
  const genderOptions = systemGenders.length > 0 ? systemGenders : FALLBACK_GENDERS;
  const relationshipOptions = systemRelationships.length > 0 ? systemRelationships : FALLBACK_RELATIONSHIPS;
  const employeeTypeOptions = systemEmployeeTypes.length > 0 ? systemEmployeeTypes : FALLBACK_EMPLOYEE_TYPES;
  const payTypeOptions = systemPayTypes.length > 0 ? systemPayTypes : [{ label: "Salary", value: "salary" }, { label: "Hourly", value: "hourly" }];
  const payFrequencyOptions = systemPayFrequencies.length > 0 ? systemPayFrequencies : [{ label: "Monthly", value: "monthly" }, { label: "Annual", value: "annual" }];
  
  const departmentOptions = backendDepartments.length > 0 ? backendDepartments : FALLBACK_DEPARTMENTS;
  const providerOptions = backendPayrollProviders.length > 0 ? backendPayrollProviders : FALLBACK_PAYROLL_PROVIDERS;

  // Set default currency if empty
  useEffect(() => {
    if (!formData.currency && systemCurrenciesDefault.length > 0) {
      setFormData((prev) => ({ ...prev, currency: systemCurrenciesDefault[0].value as string }));
    } else if (!formData.currency && currencyOptions.length > 0) {
      setFormData((prev) => ({ ...prev, currency: currencyOptions[0].value as string }));
    }
  }, [systemCurrenciesDefault, currencyOptions, formData.currency]);

  const currSymbol = currencySymbolMap[formData.currency] ?? "$";
  const monthlySalary = (parseFloat(formData.annualSalary) || 0) / 12;
  const isEligibleForESI = monthlySalary > 0 && monthlySalary <= 21000;

  // Automatic ESI Reset if not eligible
  useEffect(() => {
    if (!isEligibleForESI) {
      setFormData(prev => ({
        ...prev,
        hasESI: false,
        esi_no: "",
        esi_name: "",
        apply_esi: false
      }));
    }
  }, [isEligibleForESI]);

  // Dynamic Full Name Generator
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: `${prev.f_name} ${prev.l_name}`.trim(),
    }));
  }, [formData.f_name, formData.l_name]);

  // Same Address Sync
  useEffect(() => {
    if (formData.sameAddress) {
      setFormData((prev) => ({
        ...prev,
        p_Street: prev.Street,
        p_City: prev.City,
        p_State: prev.State,
        p_Pin_Code: prev.Pin_Code,
      }));
    }
  }, [formData.sameAddress, formData.Street, formData.City, formData.State, formData.Pin_Code]);

  // Validation Helpers
  const validateAge18 = (dob: string): boolean => {
    if (!dob) return false;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18;
  };

  const validateFutureDate = (dStr: string): boolean => {
    if (!dStr) return false;
    const date = new Date(dStr + "T00:00:00");
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date > today;
  };

  const validateFutureYear = (dStr: string): boolean => {
    if (!dStr) return false;
    const yr = new Date(dStr + "T00:00:00").getFullYear();
    const curYr = new Date().getFullYear();
    return yr > curYr;
  };

  // Indian Phone validator
  const validatePhone = (phone: string): boolean => {
    return /^[6-9]\d{9}$/.test(phone);
  };

  // Check overlap of dates
  const checkExperienceOverlap = (exps: WorkExperience[]): boolean => {
    const list = exps
      .filter(e => e.FromDate)
      .map(e => {
        const from = new Date(e.FromDate).getTime();
        const to = e.is_current || !e.ToDate ? new Date().getTime() : new Date(e.ToDate).getTime();
        return { from, to };
      });

    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        if (list[i].from < list[j].to && list[j].from < list[i].to) {
          return true; // overlap found
        }
      }
    }
    return false;
  };

  // Auto calculate total experience
  const computedExperience = useMemo(() => {
    if (formData.fresher) return "Fresher (0 months)";
    let totalM = 0;
    formData.WorkExp.forEach((w) => {
      if (!w.FromDate) return;
      const from = new Date(w.FromDate);
      const to = w.is_current || !w.ToDate ? new Date() : new Date(w.ToDate);
      if (isNaN(from.getTime()) || isNaN(to.getTime())) return;
      const diff = Math.abs(to.getTime() - from.getTime());
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      totalM += days / 30.44;
    });

    const yrs = Math.floor(totalM / 12);
    const mths = Math.round(totalM % 12);

    if (yrs === 0) {
      return `${mths} month${mths !== 1 ? "s" : ""}`;
    }
    return `${yrs} year${yrs !== 1 ? "s" : ""} and ${mths} month${mths !== 1 ? "s" : ""}`;
  }, [formData.WorkExp, formData.fresher]);

  // Form Field Validation Logic
  const runValidation = (step: number): { [key: string]: string } => {
    const errs: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.f_name) errs.f_name = "First Name is required";
      else if (!/^[A-Za-z]+$/.test(formData.f_name)) errs.f_name = "Only alphabetic characters are allowed";
      else if (formData.f_name.length < 2) errs.f_name = "Minimum 2 characters required";
      else if (formData.f_name.length > 50) errs.f_name = "Maximum 50 characters allowed";

      if (!formData.l_name) errs.l_name = "Last Name is required";
      else if (!/^[A-Za-z]+$/.test(formData.l_name)) errs.l_name = "Only alphabetic characters are allowed";
      else if (formData.l_name.length > 50) errs.l_name = "Maximum 50 characters allowed";

      if (!formData.gender) errs.gender = "Gender is required";

      if (!formData.dob) errs.dob = "Date of Birth is required";
      else if (!validateAge18(formData.dob)) errs.dob = "Employee must be at least 18 years old";

      if (!formData.phone) errs.phone = "Phone number is required";
      else if (!validatePhone(formData.phone)) errs.phone = "Must be a valid 10-digit Indian number starting with 6-9";

      if (!formData.email) errs.email = "Email address is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Invalid email format";
      else if (formData.email === "taken@company.com" || formData.email === "admin@company.com") {
        errs.email = "This email is already registered and must be unique";
      }

      if (!formData.Department) errs.Department = "Department is required";
      if (!formData.designation) errs.designation = "Designation is required";

      if (!formData.DateOfJoining) errs.DateOfJoining = "Date of Joining is required";
      else if (validateFutureDate(formData.DateOfJoining)) errs.DateOfJoining = "Joining date cannot be in the future";

      if (!formData.emp_type) errs.emp_type = "Employment Type is required";
    }

    if (step === 2) {
      // Validate education
      const educationKeys = new Set<string>();
      formData.education.forEach((edu, idx) => {
        if (!edu.degree) errs[`edu_${idx}_degree`] = "Degree is required";
        if (!edu.institution) errs[`edu_${idx}_institution`] = "Institution is required";
        else if (edu.institution.length > 100) errs[`edu_${idx}_institution`] = "Maximum 100 characters allowed";
        
        if (!edu.graduationYear) errs[`edu_${idx}_graduationYear`] = "Graduation Year is required";
        else if (validateFutureYear(edu.graduationYear)) errs[`edu_${idx}_graduationYear`] = "Graduation Year cannot be in the future";

        if (edu.degree && edu.institution) {
          const key = `${edu.degree.trim().toLowerCase()}|${edu.institution.trim().toLowerCase()}`;
          if (educationKeys.has(key)) {
            errs[`edu_${idx}_degree`] = "Duplicate entry: this degree and institution already listed";
            errs[`edu_${idx}_institution`] = "Duplicate entry detected";
          } else {
            educationKeys.add(key);
          }
        }
      });

      // Validate Experience (if not fresher)
      if (!formData.fresher) {
        formData.WorkExp.forEach((work, idx) => {
          if (!work.company_name) errs[`exp_${idx}_company_name`] = "Company Name is required";
          if (!work.position) errs[`exp_${idx}_position`] = "Position is required";
          if (!work.FromDate) errs[`exp_${idx}_FromDate`] = "From Date is required";
          
          if (!work.is_current && !work.ToDate) {
            errs[`exp_${idx}_ToDate`] = "To Date is required for past companies";
          }

          if (work.FromDate && work.ToDate && !work.is_current) {
            const fTime = new Date(work.FromDate).getTime();
            const tTime = new Date(work.ToDate).getTime();
            if (tTime <= fTime) {
              errs[`exp_${idx}_ToDate`] = "To Date must be strictly after From Date";
            }
          }
        });

        if (checkExperienceOverlap(formData.WorkExp)) {
          errs.workExpOverview = "Validation Warning: Date ranges in experience logs are overlapping";
        }
      }
    }

    if (step === 3) {
      // Validate Family
      formData.Familys.forEach((fam, idx) => {
        if (!fam.person_name) errs[`fam_${idx}_person_name`] = "Dependent Name is required";
        if (!fam.relationship_type) errs[`fam_${idx}_relationship_type`] = "Relationship is required";
        if (fam.contact && !/^\+?[0-9\s-]{7,15}$/.test(fam.contact)) {
          errs[`fam_${idx}_contact`] = "Invalid contact number format";
        }
      });

      // Validate Current Address
      if (!formData.Street) errs.Street = "Street Address is required";
      if (!formData.City) errs.City = "City is required";
      if (!formData.State) errs.State = "State is required";
      if (!formData.Pin_Code) errs.Pin_Code = "Pin Code is required";
      else if (!/^\d{6}$/.test(formData.Pin_Code)) errs.Pin_Code = "Pin code must be exactly 6 numeric digits";

      // Validate Permanent Address (if not same)
      if (!formData.sameAddress) {
        if (!formData.p_Street) errs.p_Street = "Street Address is required";
        if (!formData.p_City) errs.p_City = "City is required";
        if (!formData.p_State) errs.p_State = "State is required";
        if (!formData.p_Pin_Code) errs.p_Pin_Code = "Pin Code is required";
        else if (!/^\d{6}$/.test(formData.p_Pin_Code)) errs.p_Pin_Code = "Pin code must be exactly 6 numeric digits";
      }
    }

    if (step === 4) {
      if (!formData.provider) errs.provider = "Payroll Provider is required";
      if (!formData.payType) errs.payType = "Type of Pay is required";
      if (!formData.currency) errs.currency = "Currency is required";
      if (!formData.payFrequency) errs.payFrequency = "Pay Frequency is required";

      if (!formData.annualSalary) errs.annualSalary = "Annual Salary is required";
      else if (parseFloat(formData.annualSalary) <= 0 || isNaN(parseFloat(formData.annualSalary))) {
        errs.annualSalary = "Salary must be a positive number";
      }

      if (formData.bonusEligible) {
        if (!formData.bonus_Type) errs.bonus_Type = "Bonus type selection is required";
        if (!formData.bonus_Value) errs.bonus_Value = "Bonus value is required";
        else {
          const val = parseFloat(formData.bonus_Value);
          if (isNaN(val) || val < 0) {
            errs.bonus_Value = "Bonus value must be a positive number";
          } else if (formData.bonus_CalculationMode === "percentage" && val > 100) {
            errs.bonus_Value = "Bonus percentage cannot exceed 100%";
          }
        }
      }

      // Provident Fund
      if (formData.hasUAN) {
        if (!formData.uan_number) errs.uan_number = "UAN Number is required";
        else if (!/^\d{12}$/.test(formData.uan_number)) errs.uan_number = "UAN must be exactly 12 numeric digits";
        
        if (!formData.pf_id) errs.pf_id = "PF Member ID is required";
      } else {
        if (!formData.aadhar_no) errs.aadhar_no = "Aadhar Number is required";
        else if (!/^\d{4}\s\d{4}\s\d{4}$/.test(formData.aadhar_no)) {
          errs.aadhar_no = "Aadhar number must be in XXXX XXXX XXXX format";
        }
      }

      // ESI
      if (isEligibleForESI && formData.hasESI) {
        if (!formData.esi_no) errs.esi_no = "ESI number is required";
        else if (!/^\d+$/.test(formData.esi_no)) errs.esi_no = "ESI Number must contain numeric digits only";

        if (!formData.esi_name) errs.esi_name = "Name in ESI records is required";
      }

      // Insurance
      if (formData.hasINS) {
        if (!formData.insurance_no) errs.insurance_no = "Policy Number is required";
      } else {
        if (!formData.insurance_provider) errs.insurance_provider = "Please select insurance provider";

        // Nominees
        formData.Nominee.forEach((nom, idx) => {
          if (!nom.nominee_name) errs[`nom_${idx}_nominee_name`] = "Nominee Name is required";
          if (!nom.nominee_aadhar) errs[`nom_${idx}_nominee_aadhar`] = "Nominee Aadhar is required";
          else if (!/^\d{4}\s\d{4}\s\d{4}$/.test(nom.nominee_aadhar)) {
            errs[`nom_${idx}_nominee_aadhar`] = "Aadhar must be in XXXX XXXX XXXX format";
          }
        });
      }
    }

    if (step === 5) {
      if (!formData.bankName) errs.bankName = "Bank Name is required";
      
      if (!formData.ifscCode) errs.ifscCode = "IFSC code is required";
      else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
        errs.ifscCode = "Invalid IFSC format. Must match e.g. HDFC0001234";
      }

      if (!formData.accountNumber) errs.accountNumber = "Account Number is required";
      else if (!/^\d{9,}$/.test(formData.accountNumber)) {
        errs.accountNumber = "Account number must be numeric and at least 9 digits long";
      }

      if (!formData.confirmAccount) errs.confirmAccount = "Please verify your account number";
      else if (formData.accountNumber !== formData.confirmAccount) {
        errs.confirmAccount = "Account numbers do not match";
      }

      if (!formData.panNumber) errs.panNumber = "PAN Card Number is required";
      else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
        errs.panNumber = "Invalid PAN card format. Must match e.g. ABCDE1234F";
      }
    }

    return errs;
  };

  // Real-time Formatters & Inputs Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: any } }
  ) => {
    const { name, value } = e.target;
    let finalValue = value;

    // Aadhar formatting (XXXX XXXX XXXX)
    if (name === "aadhar_no") {
      const clean = value.replace(/\D/g, "").slice(0, 12);
      const parts = [];
      for (let i = 0; i < clean.length; i += 4) {
        parts.push(clean.substring(i, i + 4));
      }
      finalValue = parts.join(" ");
    }

    // PAN force upper case
    if (name === "panNumber") {
      finalValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
    }

    // IFSC force uppercase
    if (name === "ifscCode") {
      finalValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11);
    }

    // Numbers only formatting
    if (name === "Pin_Code" || name === "p_Pin_Code") {
      finalValue = value.replace(/\D/g, "").slice(0, 6);
    }
    if (name === "uan_number") {
      finalValue = value.replace(/\D/g, "").slice(0, 12);
    }
    if (name === "esi_no") {
      finalValue = value.replace(/\D/g, "");
    }
    if (name === "phone") {
      finalValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));

    // Run real-time single-field validation
    if (touched[name]) {
      const stepErrs = runValidation(currentStep);
      setErrors((prev) => ({ ...prev, [name]: stepErrs[name] || "" }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const stepErrs = runValidation(currentStep);
    setErrors((prev) => ({ ...prev, [name]: stepErrs[name] || "" }));
  };

  // Education dynamic list controls
  const handleEduChange = (idx: number, key: keyof Education, val: string) => {
    const list = [...formData.education];
    list[idx] = { ...list[idx], [key]: val };
    setFormData((prev) => ({ ...prev, education: list }));

    const errKey = `edu_${idx}_${key}`;
    if (touched[errKey]) {
      const stepErrs = runValidation(currentStep);
      setErrors((prev) => ({ ...prev, [errKey]: stepErrs[errKey] || "" }));
    }
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, { degree: "", institution: "", graduationYear: "" }],
    }));
  };

  const removeEducation = (idx: number) => {
    if (formData.education.length > 1) {
      setFormData((prev) => ({
        ...prev,
        education: prev.education.filter((_, i) => i !== idx),
      }));
    }
  };

  // Work experience dynamic list controls
  const handleExpChange = (idx: number, key: keyof WorkExperience, val: any) => {
    const list = [...formData.WorkExp];
    list[idx] = { ...list[idx], [key]: val };
    
    // If set to current, clear ToDate
    if (key === "is_current" && val === true) {
      list[idx].ToDate = "";
    }

    setFormData((prev) => ({ ...prev, WorkExp: list }));
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      WorkExp: [...prev.WorkExp, { company_name: "", position: "", FromDate: "", ToDate: "", is_current: false }],
    }));
  };

  const removeExperience = (idx: number) => {
    if (formData.WorkExp.length > 1) {
      setFormData((prev) => ({
        ...prev,
        WorkExp: prev.WorkExp.filter((_, i) => i !== idx),
      }));
    }
  };

  // Family dynamic list controls
  const handleFamilyChange = (idx: number, key: keyof Dependent, val: string) => {
    const list = [...formData.Familys];
    list[idx] = { ...list[idx], [key]: val };
    setFormData((prev) => ({ ...prev, Familys: list }));
  };

  const addFamily = () => {
    setFormData((prev) => ({
      ...prev,
      Familys: [...prev.Familys, { person_name: "", relationship_type: "", contact: "", person_dob: "" }],
    }));
  };

  const removeFamily = (idx: number) => {
    if (formData.Familys.length > 1) {
      setFormData((prev) => ({
        ...prev,
        Familys: prev.Familys.filter((_, i) => i !== idx),
      }));
    }
  };

  // Nominee dynamic list controls
  const handleNomineeChange = (idx: number, key: keyof Nominee, val: string) => {
    const list = [...formData.Nominee];
    
    let formattedVal = val;
    if (key === "nominee_aadhar") {
      const clean = val.replace(/\D/g, "").slice(0, 12);
      const parts = [];
      for (let i = 0; i < clean.length; i += 4) {
        parts.push(clean.substring(i, i + 4));
      }
      formattedVal = parts.join(" ");
    }

    list[idx] = { ...list[idx], [key]: formattedVal };
    setFormData((prev) => ({ ...prev, Nominee: list }));
  };

  const addNominee = () => {
    setFormData((prev) => ({
      ...prev,
      Nominee: [...prev.Nominee, { nominee_name: "", nominee_aadhar: "" }],
    }));
  };

  const removeNominee = (idx: number) => {
    if (formData.Nominee.length > 1) {
      setFormData((prev) => ({
        ...prev,
        Nominee: prev.Nominee.filter((_, i) => i !== idx),
      }));
    }
  };

  // Navigation handlers with validations
  const handleNextStep = () => {
    const stepErrs = runValidation(currentStep);
    
    // Mark all inputs in current step as touched
    const touchedFields: { [key: string]: boolean } = {};
    Object.keys(stepErrs).forEach(k => {
      touchedFields[k] = true;
    });
    setTouched(prev => ({ ...prev, ...touchedFields }));

    if (Object.keys(stepErrs).length > 0) {
      setErrors(stepErrs);
      // Scroll to the first error element
      const firstErrKey = Object.keys(stepErrs)[0];
      const errEl = document.getElementById(firstErrKey);
      if (errEl) {
        errEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Submission handler
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const stepErrs = runValidation(5);
    if (Object.keys(stepErrs).length > 0) {
      setErrors(stepErrs);
      return;
    }

    setSubmitError("");
    
    // Build backend expected payload
    const raw = { ...formData };
    const nominees = raw.hasINS ? [] : raw.Nominee.map(n => ({
      nominee_name: n.nominee_name,
      nominee_aadhar: n.nominee_aadhar.replace(/\s/g, "")
    }));

    const familysWithNominees = raw.Familys.map((fam, idx) => ({
      ...fam,
      person_dob: fam.person_dob || null,
      nominees: idx === 0 ? nominees : []
    }));

    const finalPayload = {
      f_name: raw.f_name,
      l_name: raw.l_name,
      name: raw.name,
      gender: raw.gender,
      dob: raw.dob || null,
      phone: raw.phone,
      email: raw.email,
      Department: raw.Department,
      designation: raw.designation,
      DateOfJoining: raw.DateOfJoining || null,
      emp_type: raw.emp_type,
      
      education: raw.education.map(e => ({
        degree: e.degree,
        institution: e.institution,
        graduationYear: e.graduationYear || null
      })),
      
      WorkExp: raw.fresher ? [] : raw.WorkExp.map(w => ({
        company_name: w.company_name,
        position: w.position,
        FromDate: w.FromDate || null,
        ToDate: w.is_current ? null : (w.ToDate || null)
      })),

      Familys: familysWithNominees,
      Street: raw.Street,
      City: raw.City,
      State: raw.State,
      Pin_Code: parseInt(raw.Pin_Code) || 0,
      
      p_Street: raw.sameAddress ? raw.Street : raw.p_Street,
      p_City: raw.sameAddress ? raw.City : raw.p_City,
      p_State: raw.sameAddress ? raw.State : raw.p_State,
      p_Pin_Code: raw.sameAddress ? (parseInt(raw.Pin_Code) || 0) : (parseInt(raw.p_Pin_Code) || 0),

      provider: raw.provider,
      payType: raw.payType,
      currency: raw.currency,
      payFrequency: raw.payFrequency,
      annualSalary: parseFloat(raw.annualSalary) || 0,
      bonus_Value: raw.bonusEligible ? (parseFloat(raw.bonus_Value) || 0) : 0,
      bonus_Type: raw.bonusEligible ? raw.bonus_Type : "",
      bonus_CalculationMode: raw.bonusEligible ? raw.bonus_CalculationMode : "percentage",

      uan_number: raw.hasUAN ? raw.uan_number : "",
      pf_id: raw.hasUAN ? raw.pf_id : "",
      aadhar_no: raw.hasUAN ? "" : raw.aadhar_no.replace(/\s/g, ""),
      esi_no: (isEligibleForESI && raw.hasESI) ? raw.esi_no : "",
      esi_name: (isEligibleForESI && raw.hasESI) ? raw.esi_name : "",
      apply_esi: (isEligibleForESI && raw.apply_esi) ? "New registration apply" : "",
      
      insurance_no: raw.hasINS ? raw.insurance_no : "",
      insurance_provider: raw.hasINS ? "" : raw.insurance_provider,
      
      bankName: raw.bankName,
      ifscCode: raw.ifscCode,
      accountNumber: raw.accountNumber,
      panNumber: raw.panNumber
    };

    try {
      const response = await fetch(`${Api_URL}/employee/Register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      });

      if (response.ok) {
        const resData = await response.json();
        setSubmitSuccess(true);
        setCreatedEmpId(resData?.Emp_id || "");
      } else {
        const errorDetail = await response.json();
        setSubmitError(errorDetail.detail || "Server registration failed. Please review values.");
      }
    } catch (err) {
      console.error(err);
      setSubmitError("Connection Refused. Could not reach Apex Solutions Backend Server.");
    }
  };

  const stepsList = [
    { num: 1, label: "Basic Info", icon: User },
    { num: 2, label: "Qualifications", icon: GraduationCap },
    { num: 3, label: "Addresses & Family", icon: Users },
    { num: 4, label: "Statutory Perks", icon: ShieldAlert },
    { num: 5, label: "Submit & Bank", icon: Building },
  ];

  if (submitSuccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100">
            <CheckCircle2 size={40} className="stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Onboarding Completed!</h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Employee registration record has been successfully audited, validated and written to primary HR records.
          </p>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-8 text-left">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Full Name</span>
              <span className="text-xs font-black text-slate-700">{formData.name}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Assigned Department</span>
              <span className="text-xs font-black text-slate-700">{formData.Department}</span>
            </div>
            {createdEmpId && (
              <div className="flex justify-between items-center py-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Corporate ID</span>
                <span className="text-xs font-black text-primary font-mono">{createdEmpId}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                if (createdEmpId) navigate(`/EmployeeManagement/employee/${createdEmpId}`);
                else navigate("/EmployeeManagement/employee");
              }}
              className="w-full py-3.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-primary/20 hover:opacity-95 hover:shadow-primary/30 transition-all cursor-pointer"
            >
              View Employee Profile
            </button>
            <button
              onClick={() => {
                setFormData(DEFAULT_FORM);
                setErrors({});
                setTouched({});
                setSubmitSuccess(false);
                setCurrentStep(1);
              }}
              className="w-full py-3.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-200 transition-all cursor-pointer"
            >
              Onboard Another Employee
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={pageTheme.layout.mainContainer}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .form-container { font-family: 'DM Sans', sans-serif; }
        .tab-btn-active { color: hsl(var(--primary-hsl)); border-color: hsl(var(--primary-hsl)); }
        .row-card {
          border: 1.5px solid #f1f5f9;
          border-radius: 16px;
          background: #fafbfd;
          transition: all 0.25s ease;
        }
        .row-card:hover {
          border-color: hsl(var(--primary-hsl) / 0.15);
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        .add-row-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          color: hsl(var(--primary-hsl));
          background: hsl(var(--primary-hsl) / 0.05);
          border: 1.5px dashed hsl(var(--primary-hsl) / 0.3);
          cursor: pointer;
          padding: 6px 14px;
          border-radius: 10px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: all 0.2s ease;
        }
        .add-row-btn:hover {
          background: hsl(var(--primary-hsl) / 0.1);
          border-color: hsl(var(--primary-hsl));
        }
        .remove-row-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: 1.5px solid #fee2e2;
          background: #fff;
          cursor: pointer;
          color: #f87171;
          transition: all 0.2s ease;
        }
        .remove-row-btn:hover {
          background: #fef2f2;
          color: #ef4444;
          border-color: #fca5a5;
        }
        .section-separator {
          font-size: 11px;
          font-weight: 800;
          color: #94a3b8;
          margin-bottom: 20px;
          padding-bottom: 8px;
          border-bottom: 1.5px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .navigation-panel {
          border-top: 1.5px solid #f1f5f9;
          margin-top: 30px;
          padding-top: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-8 form-container">
        {/* Header Section */}
        <div className={pageTheme.header.wrapper}>
          <div className="flex flex-col">
            <div className={pageTheme.header.pill}>
              <span>Validated Auditing System</span>
            </div>
            <h1 className={pageTheme.header.title}>Employee Registration Form</h1>
            <p className={pageTheme.header.subtitle}>
              Submit comprehensive profile credentials. All inputs are evaluated in real-time.
            </p>
          </div>
        </div>

        {/* Dynamic Progress indicator */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="relative flex justify-between items-center flex-wrap gap-4">
            {/* Progress line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 hidden md:block z-0" />
            <div 
              className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 hidden md:block z-0 transition-all duration-500" 
              style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
            />

            {stepsList.map((step) => {
              const isPassed = step.num < currentStep;
              const isActive = step.num === currentStep;

              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => {
                    // Only allow backward navigation or navigation up to filled steps
                    if (step.num < currentStep) {
                      setCurrentStep(step.num);
                    }
                  }}
                  disabled={step.num > currentStep}
                  className="flex items-center gap-3 relative z-10 bg-white px-4 py-2 rounded-2xl transition-all cursor-pointer"
                >
                  <div 
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 font-extrabold text-sm
                      ${isPassed ? "bg-green-50 text-green-500 border-2 border-green-200" : ""}
                      ${isActive ? "bg-primary text-white border-4 border-primary/20 scale-110" : ""}
                      ${!isPassed && !isActive ? "bg-slate-50 text-slate-400 border border-slate-200" : ""}
                    `}
                  >
                    {isPassed ? <Check size={16} className="stroke-[2.5]" /> : step.num}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Step 0{step.num}</span>
                    <span className={`text-xs font-black ${isActive ? "text-slate-800" : "text-slate-500"}`}>
                      {step.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <form onSubmit={handleFinalSubmit} noValidate>
            
            {/* STEP 1: PERSONAL & JOB DETAILS */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-300">
                <div>
                  <div className="section-separator">Personal Identification</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div id="f_name">
                      <FormFiled
                        name="f_name"
                        value={formData.f_name}
                        Lable="First Name"
                        in_PlaceHolder="Enter first name"
                        onChange={handleInputChange}
                        error={errors.f_name}
                        required={true}
                      />
                    </div>
                    <div id="l_name">
                      <FormFiled
                        name="l_name"
                        value={formData.l_name}
                        Lable="Last Name"
                        in_PlaceHolder="Enter last name"
                        onChange={handleInputChange}
                        error={errors.l_name}
                        required={true}
                      />
                    </div>
                    <div>
                      <FormFiled
                        name="name"
                        value={formData.name}
                        Lable="Full Name (Auto Generated)"
                        in_PlaceHolder="First Last"
                        onChange={() => {}}
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div id="gender">
                    <Selection
                      label="Gender"
                      name="gender"
                      value={formData.gender}
                      options={genderOptions}
                      onChange={handleInputChange}
                      placeholder="Select Gender"
                      error={errors.gender}
                      required={true}
                    />
                  </div>
                  <div id="dob">
                    <CustomDatePicker
                      Lable="Date of Birth"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      error={errors.dob}
                      required={true}
                    />
                  </div>
                  <div id="phone">
                    <FormFiled
                      Lable="Phone Number"
                      name="phone"
                      value={formData.phone}
                      in_PlaceHolder="9876543210"
                      onChange={handleInputChange}
                      onBlur={() => handleBlur("phone")}
                      error={errors.phone}
                      required={true}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div id="email">
                    <FormFiled
                      Lable="Corporate Email Address"
                      name="email"
                      value={formData.email}
                      in_PlaceHolder="employee@company.com"
                      onChange={handleInputChange}
                      onBlur={() => handleBlur("email")}
                      error={errors.email}
                      required={true}
                    />
                  </div>
                </div>

                <div>
                  <div className="section-separator">Job Position & Onboarding</div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div id="Department">
                      <Selection
                        label="Department"
                        name="Department"
                        value={formData.Department}
                        options={departmentOptions}
                        onChange={handleInputChange}
                        placeholder="Select Department"
                        error={errors.Department}
                        required={true}
                      />
                    </div>
                    <div id="designation">
                      <FormFiled
                        Lable="Designation"
                        name="designation"
                        value={formData.designation}
                        in_PlaceHolder="Software Engineer"
                        onChange={handleInputChange}
                        error={errors.designation}
                        required={true}
                      />
                    </div>
                    <div id="DateOfJoining">
                      <CustomDatePicker
                        Lable="Date of Joining"
                        name="DateOfJoining"
                        value={formData.DateOfJoining}
                        onChange={handleInputChange}
                        error={errors.DateOfJoining}
                        required={true}
                      />
                    </div>
                    <div id="emp_type">
                      <Selection
                        label="Employment Type"
                        name="emp_type"
                        value={formData.emp_type}
                        options={employeeTypeOptions}
                        onChange={handleInputChange}
                        placeholder="Select Employment Type"
                        error={errors.emp_type}
                        required={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: QUALIFICATIONS & WORK EXPERIENCE */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-300">
                {/* Education Log */}
                <div>
                  <div className="section-separator">
                    <span>Education Qualifications</span>
                    <button type="button" className="add-row-btn" onClick={addEducation}>
                      <Plus size={12} /> Add Degree
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.education.map((edu, idx) => (
                      <div key={idx} className="row-card p-6">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                          <div className="md:col-span-4" id={`edu_${idx}_degree`}>
                            <FormFiled
                              Lable="Degree"
                              name={`degree_${idx}`}
                              value={edu.degree}
                              in_PlaceHolder="e.g. B.Tech Computer Science"
                              onChange={(e) => handleEduChange(idx, "degree", e.target.value)}
                              error={errors[`edu_${idx}_degree`]}
                              required={true}
                            />
                          </div>
                          <div className="md:col-span-4" id={`edu_${idx}_institution`}>
                            <FormFiled
                              Lable="Institution"
                              name={`institution_${idx}`}
                              value={edu.institution}
                              in_PlaceHolder="e.g. IIT Madras"
                              onChange={(e) => handleEduChange(idx, "institution", e.target.value)}
                              error={errors[`edu_${idx}_institution`]}
                              required={true}
                            />
                          </div>
                          <div className="md:col-span-3" id={`edu_${idx}_graduationYear`}>
                            <CustomDatePicker
                              Lable="Graduation Date"
                              name={`graduationYear_${idx}`}
                              value={edu.graduationYear}
                              onChange={(e) => handleEduChange(idx, "graduationYear", e.target.value)}
                              error={errors[`edu_${idx}_graduationYear`]}
                              required={true}
                            />
                          </div>
                          <div className="md:col-span-1 flex justify-center">
                            <button
                              type="button"
                              onClick={() => removeEducation(idx)}
                              disabled={formData.education.length === 1}
                              className="remove-row-btn disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Trash size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Work Experience Log */}
                <div>
                  <div className="section-separator">
                    <span>Professional Work Experience</span>
                    <button
                      type="button"
                      className="add-row-btn disabled:opacity-40 disabled:cursor-not-allowed"
                      onClick={addExperience}
                      disabled={formData.fresher}
                    >
                      <Plus size={12} /> Add Experience
                    </button>
                  </div>

                  <div className="mb-6 flex justify-between items-center bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        label="Is Candidate a Fresher?"
                        checked={formData.fresher}
                        onChange={(checked) => {
                          setFormData(prev => ({ ...prev, fresher: checked }));
                          if (checked) {
                            setErrors((prev) => {
                              const clean = { ...prev };
                              delete clean.workExpOverview;
                              // remove exp keys
                              Object.keys(clean).forEach(k => {
                                if (k.startsWith("exp_")) delete clean[k];
                              });
                              return clean;
                            });
                          }
                        }}
                        name="fresher"
                      />
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        (Bypasses professional history audits)
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Calculated Tenure</span>
                      <span className="text-xs font-black text-primary bg-primary/5 border border-primary/20 px-2.5 py-1 rounded-full">
                        {computedExperience}
                      </span>
                    </div>
                  </div>

                  {errors.workExpOverview && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl p-4 text-xs font-bold mb-6 flex gap-2 items-center">
                      <AlertTriangle size={15} className="shrink-0" />
                      <span>{errors.workExpOverview}</span>
                    </div>
                  )}

                  {!formData.fresher && (
                    <div className="space-y-4">
                      {formData.WorkExp.map((work, idx) => (
                        <div key={idx} className="row-card p-6">
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                            <div className="md:col-span-3" id={`exp_${idx}_company_name`}>
                              <FormFiled
                                Lable="Company Name"
                                name={`company_${idx}`}
                                value={work.company_name}
                                in_PlaceHolder="Enter Employer Name"
                                onChange={(e) => handleExpChange(idx, "company_name", e.target.value)}
                                error={errors[`exp_${idx}_company_name`]}
                                required={true}
                              />
                            </div>
                            <div className="md:col-span-3" id={`exp_${idx}_position`}>
                              <FormFiled
                                Lable="Position"
                                name={`position_${idx}`}
                                value={work.position}
                                in_PlaceHolder="e.g. Frontend Engineer"
                                onChange={(e) => handleExpChange(idx, "position", e.target.value)}
                                error={errors[`exp_${idx}_position`]}
                                required={true}
                              />
                            </div>
                            <div className="md:col-span-2" id={`exp_${idx}_FromDate`}>
                              <CustomDatePicker
                                Lable="From Date"
                                name={`from_${idx}`}
                                value={work.FromDate}
                                onChange={(e) => handleExpChange(idx, "FromDate", e.target.value)}
                                error={errors[`exp_${idx}_FromDate`]}
                                required={true}
                              />
                            </div>
                            <div className="md:col-span-2" id={`exp_${idx}_ToDate`}>
                              <CustomDatePicker
                                Lable="To Date"
                                name={`to_${idx}`}
                                value={work.ToDate}
                                onChange={(e) => handleExpChange(idx, "ToDate", e.target.value)}
                                error={errors[`exp_${idx}_ToDate`]}
                                disabled={work.is_current}
                                required={!work.is_current}
                              />
                            </div>
                            <div className="md:col-span-1 flex flex-col items-center justify-center pb-2">
                              <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider mb-2">Current</span>
                              <input
                                type="checkbox"
                                checked={work.is_current}
                                onChange={(e) => handleExpChange(idx, "is_current", e.target.checked)}
                                className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300"
                              />
                            </div>
                            <div className="md:col-span-1 flex justify-center">
                              <button
                                type="button"
                                onClick={() => removeExperience(idx)}
                                disabled={formData.WorkExp.length === 1}
                                className="remove-row-btn disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <Trash size={15} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: FAMILY & ADDRESSES */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-300">
                {/* Family list */}
                <div>
                  <div className="section-separator">
                    <span>Family Dependents Details</span>
                    <button type="button" className="add-row-btn" onClick={addFamily}>
                      <Plus size={12} /> Add Person
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.Familys.map((fam, idx) => (
                      <div key={idx} className="row-card p-6">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                          <div className="md:col-span-3" id={`fam_${idx}_person_name`}>
                            <FormFiled
                              Lable="Dependent Name"
                              name={`fam_name_${idx}`}
                              value={fam.person_name}
                              in_PlaceHolder="Enter Full Name"
                              onChange={(e) => handleFamilyChange(idx, "person_name", e.target.value)}
                              error={errors[`fam_${idx}_person_name`]}
                              required={true}
                            />
                          </div>
                          <div className="md:col-span-3" id={`fam_${idx}_relationship_type`}>
                            <Selection
                              label="Relationship"
                              name={`fam_rel_${idx}`}
                              value={fam.relationship_type}
                              options={relationshipOptions}
                              onChange={(e) => handleFamilyChange(idx, "relationship_type", e.target.value)}
                              placeholder="Select Relationship"
                              error={errors[`fam_${idx}_relationship_type`]}
                              required={true}
                            />
                          </div>
                          <div className="md:col-span-3" id={`fam_${idx}_contact`}>
                            <FormFiled
                              Lable="Contact Phone"
                              name={`fam_phone_${idx}`}
                              value={fam.contact}
                              in_PlaceHolder="+91 9876543210"
                              onChange={(e) => handleFamilyChange(idx, "contact", e.target.value)}
                              error={errors[`fam_${idx}_contact`]}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <CustomDatePicker
                              Lable="Date of Birth"
                              name={`fam_dob_${idx}`}
                              value={fam.person_dob}
                              onChange={(e) => handleFamilyChange(idx, "person_dob", e.target.value)}
                            />
                          </div>
                          <div className="md:col-span-1 flex justify-center">
                            <button
                              type="button"
                              onClick={() => removeFamily(idx)}
                              disabled={formData.Familys.length === 1}
                              className="remove-row-btn disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Trash size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Addresses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Current Address */}
                  <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6">
                    <div className="section-separator">Current Address</div>
                    <div className="space-y-4">
                      <div id="Street">
                        <FormFiled
                          Lable="Street Address"
                          name="Street"
                          value={formData.Street}
                          in_PlaceHolder="Door No, Street Name, Landmark"
                          onChange={handleInputChange}
                          error={errors.Street}
                          required={true}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div id="City">
                          <FormFiled
                            Lable="City"
                            name="City"
                            value={formData.City}
                            in_PlaceHolder="Chennai"
                            onChange={handleInputChange}
                            error={errors.City}
                            required={true}
                          />
                        </div>
                        <div id="State">
                          <FormFiled
                            Lable="State"
                            name="State"
                            value={formData.State}
                            in_PlaceHolder="Tamil Nadu"
                            onChange={handleInputChange}
                            error={errors.State}
                            required={true}
                          />
                        </div>
                      </div>
                      <div id="Pin_Code">
                        <FormFiled
                          Lable="Pin Code"
                          name="Pin_Code"
                          value={formData.Pin_Code}
                          in_PlaceHolder="600001"
                          onChange={handleInputChange}
                          error={errors.Pin_Code}
                          required={true}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Permanent Address */}
                  <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6">
                    <div className="section-separator flex justify-between items-center">
                      <span>Permanent Address</span>
                      <Checkbox
                        label="Same as Current"
                        checked={formData.sameAddress}
                        onChange={(val) => setFormData((prev) => ({ ...prev, sameAddress: val }))}
                        name="sameAddress"
                      />
                    </div>
                    <div className={`space-y-4 transition-all duration-300 ${formData.sameAddress ? "opacity-40 pointer-events-none" : ""}`}>
                      <div id="p_Street">
                        <FormFiled
                          Lable="Street Address"
                          name="p_Street"
                          value={formData.sameAddress ? formData.Street : formData.p_Street}
                          in_PlaceHolder="Door No, Street Name, Landmark"
                          onChange={handleInputChange}
                          error={errors.p_Street}
                          required={!formData.sameAddress}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div id="p_City">
                          <FormFiled
                            Lable="City"
                            name="p_City"
                            value={formData.sameAddress ? formData.City : formData.p_City}
                            in_PlaceHolder="Chennai"
                            onChange={handleInputChange}
                            error={errors.p_City}
                            required={!formData.sameAddress}
                          />
                        </div>
                        <div id="p_State">
                          <FormFiled
                            Lable="State"
                            name="p_State"
                            value={formData.sameAddress ? formData.State : formData.p_State}
                            in_PlaceHolder="Tamil Nadu"
                            onChange={handleInputChange}
                            error={errors.p_State}
                            required={!formData.sameAddress}
                          />
                        </div>
                      </div>
                      <div id="p_Pin_Code">
                        <FormFiled
                          Lable="Pin Code"
                          name="p_Pin_Code"
                          value={formData.sameAddress ? formData.Pin_Code : formData.p_Pin_Code}
                          in_PlaceHolder="600001"
                          onChange={handleInputChange}
                          error={errors.p_Pin_Code}
                          required={!formData.sameAddress}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: COMPENSATION, PF, ESI & INSURANCE */}
            {currentStep === 4 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-300">
                {/* Compensation */}
                <div>
                  <div className="section-separator">Compensation & Payroll Provider</div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div id="provider">
                      <Selection
                        label="Payroll Provider"
                        name="provider"
                        value={formData.provider}
                        options={providerOptions}
                        onChange={handleInputChange}
                        placeholder="Select Provider"
                        error={errors.provider}
                        required={true}
                      />
                    </div>
                    <div id="payType">
                      <Selection
                        label="Type of Pay"
                        name="payType"
                        value={formData.payType}
                        options={payTypeOptions}
                        onChange={handleInputChange}
                        placeholder="Select Pay Type"
                        error={errors.payType}
                        required={true}
                      />
                    </div>
                    <div id="currency">
                      <Selection
                        label="Currency"
                        name="currency"
                        value={formData.currency}
                        options={currencyOptions}
                        onChange={handleInputChange}
                        placeholder="Select Currency"
                        error={errors.currency}
                        required={true}
                      />
                    </div>
                    <div id="payFrequency">
                      <Selection
                        label="Pay Frequency"
                        name="payFrequency"
                        value={formData.payFrequency}
                        options={payFrequencyOptions}
                        onChange={handleInputChange}
                        placeholder="Select Frequency"
                        error={errors.payFrequency}
                        required={true}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 items-start">
                    <div id="annualSalary">
                      <FormFiled
                        Lable="Annual Salary"
                        name="annualSalary"
                        value={formData.annualSalary}
                        in_PlaceHolder="0.00"
                        onChange={handleInputChange}
                        icon={<span className="font-bold">{currSymbol}</span>}
                        error={errors.annualSalary}
                        required={true}
                      />
                    </div>
                    <div className="pt-8">
                      <Toggle
                        label="Bonus Eligibility Toggle"
                        initialState={formData.bonusEligible}
                        onToggle={(enabled) => setFormData((prev) => ({ ...prev, bonusEligible: enabled }))}
                      />
                    </div>
                  </div>

                  {formData.bonusEligible && (
                    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                      <div id="bonus_Type">
                        <Selection
                          label="Bonus Type"
                          name="bonus_Type"
                          value={formData.bonus_Type}
                          options={[
                            { label: "Performance Bonus", value: "performance" },
                            { label: "Signing Bonus", value: "signing" },
                            { label: "Annual Bonus", value: "annual" },
                          ]}
                          onChange={handleInputChange}
                          placeholder="Select Type"
                          error={errors.bonus_Type}
                          required={true}
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 block">Calculation Method</span>
                        <div className="flex bg-slate-200/50 p-1.5 rounded-xl gap-2 w-fit">
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, bonus_CalculationMode: "percentage" }))}
                            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${formData.bonus_CalculationMode === "percentage" ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-700"}`}
                          >
                            % of Salary
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, bonus_CalculationMode: "fixed" }))}
                            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${formData.bonus_CalculationMode === "fixed" ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-700"}`}
                          >
                            Fixed
                          </button>
                        </div>
                      </div>
                      <div id="bonus_Value">
                        <FormFiled
                          Lable={`Bonus ${formData.bonus_CalculationMode === "percentage" ? "Percentage" : "Amount"}`}
                          name="bonus_Value"
                          value={formData.bonus_Value}
                          in_PlaceHolder="0"
                          onChange={handleInputChange}
                          icon={<span className="font-bold">{formData.bonus_CalculationMode === "percentage" ? "%" : currSymbol}</span>}
                          error={errors.bonus_Value}
                          required={true}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Provident Fund */}
                <div>
                  <div className="section-separator">Provident Fund Registration</div>
                  <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6">
                    <div className="mb-6">
                      <Toggle
                        label="Does employee already have a UAN?"
                        initialState={formData.hasUAN}
                        onToggle={(enabled) => {
                          setFormData((prev) => ({ 
                            ...prev, 
                            hasUAN: enabled,
                            uan_number: "",
                            pf_id: "",
                            aadhar_no: ""
                          }));
                          setErrors((prev) => {
                            const clean = { ...prev };
                            delete clean.uan_number;
                            delete clean.pf_id;
                            delete clean.aadhar_no;
                            return clean;
                          });
                        }}
                      />
                    </div>

                    {formData.hasUAN ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                        <div id="uan_number">
                          <FormFiled
                            Lable="UAN Number (12 Digits)"
                            name="uan_number"
                            value={formData.uan_number}
                            in_PlaceHolder="Enter 12-digit UAN"
                            onChange={handleInputChange}
                            error={errors.uan_number}
                            required={true}
                          />
                        </div>
                        <div id="pf_id">
                          <FormFiled
                            Lable="PF Member ID"
                            name="pf_id"
                            value={formData.pf_id}
                            in_PlaceHolder="Enter PF Member ID"
                            onChange={handleInputChange}
                            error={errors.pf_id}
                            required={true}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300" id="aadhar_no">
                        <FormFiled
                          Lable="Aadhar Number (for new UAN/PF Audit)"
                          name="aadhar_no"
                          value={formData.aadhar_no}
                          in_PlaceHolder="XXXX XXXX XXXX"
                          onChange={handleInputChange}
                          error={errors.aadhar_no}
                          required={true}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* ESI Details */}
                <div>
                  <div className="section-separator flex justify-between items-center">
                    <span>ESI Employee Insurance</span>
                    {!isEligibleForESI && (
                      <span className="text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-wider">
                        Not eligible (Salary {currSymbol}{monthlySalary.toFixed(0)}/mo &gt; {currSymbol}21,000 limit)
                      </span>
                    )}
                  </div>

                  {isEligibleForESI && (
                    <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6 space-y-6 animate-in fade-in duration-300">
                      <div>
                        <Toggle
                          label="Already has ESI Registration number?"
                          initialState={formData.hasESI}
                          onToggle={(val) => {
                            setFormData(prev => ({ 
                              ...prev, 
                              hasESI: val,
                              esi_no: "",
                              esi_name: "",
                              apply_esi: false
                            }));
                            setErrors((prev) => {
                              const clean = { ...prev };
                              delete clean.esi_no;
                              delete clean.esi_name;
                              return clean;
                            });
                          }}
                        />
                      </div>

                      {formData.hasESI ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                          <div id="esi_no">
                            <FormFiled
                              Lable="ESI Number"
                              name="esi_no"
                              value={formData.esi_no}
                              in_PlaceHolder="Enter ESI Registration number"
                              onChange={handleInputChange}
                              error={errors.esi_no}
                              required={true}
                            />
                          </div>
                          <div id="esi_name">
                            <FormFiled
                              Lable="Name in ESI Records"
                              name="esi_name"
                              value={formData.esi_name}
                              in_PlaceHolder="Name as per ESI card"
                              onChange={handleInputChange}
                              error={errors.esi_name}
                              required={true}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="animate-in fade-in duration-300">
                          <Checkbox
                            label="Apply for a new corporate ESI registration"
                            checked={formData.apply_esi}
                            onChange={(val) => setFormData(prev => ({ ...prev, apply_esi: val }))}
                            name="apply_esi"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Insurance details */}
                <div>
                  <div className="section-separator">Corporate Medical Insurance</div>
                  <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6 space-y-6">
                    <div>
                      <Toggle
                        label="Existing Corporate / Private Medical Policy?"
                        initialState={formData.hasINS}
                        onToggle={(val) => {
                          setFormData(prev => ({ 
                            ...prev, 
                            hasINS: val, 
                            insurance_no: "",
                            insurance_provider: "",
                            Nominee: [{ nominee_name: "", nominee_aadhar: "" }]
                          }));
                          setErrors(prev => {
                            const clean = { ...prev };
                            delete clean.insurance_no;
                            delete clean.insurance_provider;
                            // clean nominee keys
                            Object.keys(clean).forEach(k => {
                              if (k.startsWith("nom_")) delete clean[k];
                            });
                            return clean;
                          });
                        }}
                      />
                    </div>

                    {formData.hasINS ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300" id="insurance_no">
                        <FormFiled
                          Lable="Policy Number"
                          name="insurance_no"
                          value={formData.insurance_no}
                          in_PlaceHolder="Corporate/Private Policy number"
                          onChange={handleInputChange}
                          error={errors.insurance_no}
                          required={true}
                        />
                      </div>
                    ) : (
                      <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div id="insurance_provider">
                            <Selection
                              label="Corporate Insurance Provider"
                              name="insurance_provider"
                              value={formData.insurance_provider}
                              options={INSURANCE_PROVIDERS}
                              onChange={handleInputChange}
                              placeholder="Select Provider"
                              error={errors.insurance_provider}
                              required={true}
                            />
                          </div>
                        </div>

                        {/* Corporate Nominee details */}
                        <div>
                          <div className="section-separator">
                            <span>Corporate Policy Nominees</span>
                            <button type="button" className="add-row-btn" onClick={addNominee}>
                              <Plus size={12} /> Add Nominee
                            </button>
                          </div>

                          <div className="space-y-4">
                            {formData.Nominee.map((nom, idx) => (
                              <div key={idx} className="row-card p-6">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                                  <div className="md:col-span-5" id={`nom_${idx}_nominee_name`}>
                                    <Selection
                                      label="Nominee Name (Family Dependent)"
                                      name={`nom_name_${idx}`}
                                      value={nom.nominee_name}
                                      options={formData.Familys.map(f => ({ label: f.person_name || "Dependent Member", value: f.person_name }))}
                                      onChange={(e) => handleNomineeChange(idx, "nominee_name", e.target.value)}
                                      placeholder="Choose Dependent"
                                      error={errors[`nom_${idx}_nominee_name`]}
                                      required={true}
                                    />
                                  </div>
                                  <div className="md:col-span-5" id={`nom_${idx}_nominee_aadhar`}>
                                    <FormFiled
                                      Lable="Nominee Aadhar Number"
                                      name={`nom_aadhar_${idx}`}
                                      value={nom.nominee_aadhar}
                                      in_PlaceHolder="XXXX XXXX XXXX"
                                      onChange={(e) => handleNomineeChange(idx, "nominee_aadhar", e.target.value)}
                                      error={errors[`nom_${idx}_nominee_aadhar`]}
                                      required={true}
                                    />
                                  </div>
                                  <div className="md:col-span-2 flex justify-center">
                                    <button
                                      type="button"
                                      onClick={() => removeNominee(idx)}
                                      disabled={formData.Nominee.length === 1}
                                      className="remove-row-btn disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                      <Trash size={15} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: BANK, TAX & VERIFY SUBMISSION */}
            {currentStep === 5 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-300">
                {/* Bank Account */}
                <div>
                  <div className="section-separator">Bank Account Credentials</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div id="bankName">
                      <FormFiled
                        Lable="Bank Name"
                        name="bankName"
                        value={formData.bankName}
                        in_PlaceHolder="e.g. State Bank of India"
                        onChange={handleInputChange}
                        error={errors.bankName}
                        required={true}
                      />
                    </div>
                    <div id="ifscCode">
                      <FormFiled
                        Lable="IFSC Code"
                        name="ifscCode"
                        value={formData.ifscCode}
                        in_PlaceHolder="SBIN0001234"
                        onChange={handleInputChange}
                        error={errors.ifscCode}
                        required={true}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div id="accountNumber">
                      <FormFiled
                        Lable="Account Number"
                        name="accountNumber"
                        value={formData.accountNumber}
                        in_PlaceHolder="Re-enter for safety checks"
                        onChange={handleInputChange}
                        PrivacyInput={true}
                        error={errors.accountNumber}
                        required={true}
                      />
                    </div>
                    <div id="confirmAccount">
                      <FormFiled
                        Lable="Verify Account Number"
                        name="confirmAccount"
                        value={formData.confirmAccount}
                        in_PlaceHolder="Match Account Number exactly"
                        onChange={handleInputChange}
                        PrivacyInput={true}
                        error={errors.confirmAccount}
                        required={true}
                      />
                    </div>
                  </div>
                </div>

                {/* TAX / PAN */}
                <div>
                  <div className="section-separator">Tax Identification</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div id="panNumber">
                      <FormFiled
                        Lable="PAN Card Number"
                        name="panNumber"
                        value={formData.panNumber}
                        in_PlaceHolder="ABCDE1234F"
                        onChange={handleInputChange}
                        error={errors.panNumber}
                        required={true}
                      />
                    </div>
                  </div>
                </div>

                {/* Verification Checkbox */}
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6">
                  <div className="section-separator flex items-center justify-between">
                    <span>Audit Verification Checklist</span>
                    <span className="text-[9px] font-black text-primary bg-primary/5 px-2.5 py-1 rounded-full uppercase tracking-widest border border-primary/10">Summary Audited</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-500">
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-green-50 text-green-500 border border-green-100 flex items-center justify-center font-bold">✓</div>
                      <span>Legal onboarding age (dob is 18+) verified.</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-green-50 text-green-500 border border-green-100 flex items-center justify-center font-bold">✓</div>
                      <span>Bank IFSC checks & account matches completed.</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-green-50 text-green-500 border border-green-100 flex items-center justify-center font-bold">✓</div>
                      <span>Tax ID & PAN formatting checks successfully passed.</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-green-50 text-green-500 border border-green-100 flex items-center justify-center font-bold">✓</div>
                      <span>Provident UAN checks & corporate nominee registers ready.</span>
                    </div>
                  </div>
                </div>

                {submitError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl p-4 text-xs font-bold flex gap-2.5 items-center animate-in shake duration-300">
                    <AlertTriangle size={16} className="shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="navigation-panel">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
              >
                <ChevronLeft size={14} /> Back
              </button>

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 hover:opacity-95 shadow-md shadow-primary/10 transition-all cursor-pointer"
                >
                  Next Step <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-10 py-3.5 bg-green-600 text-white hover:bg-green-700 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-green-600/20 hover:shadow-green-600/30 transition-all cursor-pointer"
                >
                  Finalize & Register <Check size={14} />
                </button>
              )}
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmp;
