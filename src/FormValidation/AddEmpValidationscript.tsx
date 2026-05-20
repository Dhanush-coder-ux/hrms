/**
 * Apex Solutions HRMS
 * Core Onboarding Validation Engine & Reusable Input Utility
 * 
 * This module exports pure, highly optimized helper functions and validators
 * to handle employee onboarding constraints. Free from React UI rendering.
 */

export interface WorkExperience {
  company_name: string;
  position: string;
  FromDate: string;
  ToDate?: string;
  is_current?: boolean;
}

export interface Education {
  degree: string;
  institution: string;
  graduationYear: string;
}

export interface Family {
  person_name: string;
  relationship_type: string;
  contact?: string;
  person_dob?: string;
}

export interface Nominee {
  nominee_name: string;
  nominee_aadhar: string;
}

export interface EmployeeValidationData {
  f_name: string;
  l_name: string;
  name: string;
  gender: string;
  dob: string;
  phone: string;
  email: string;
  Department: string;
  designation: string;
  emp_type: string;
  DateOfJoining: string;
  education: Education[];
  fresher?: boolean;
  WorkExp: WorkExperience[];
  Familys: Family[];
  Street: string;
  City: string;
  State: string;
  Pin_Code: number | string;
  sameAddress?: boolean;
  p_Street?: string;
  p_City?: string;
  p_State?: string;
  p_Pin_Code?: number | string;
  provider: string;
  payType: string;
  currency: string;
  payFrequency: string;
  annualSalary: string;
  bonusEligible?: boolean;
  bonus_Type?: string;
  bonus_CalculationMode?: "percentage" | "fixed";
  bonus_Value?: string;
  hasUAN?: boolean;
  uan_number?: string;
  pf_id?: string;
  aadhar_no?: string;
  hasESI?: boolean;
  esi_no?: string;
  esi_name?: string;
  apply_esi?: boolean;
  hasINS?: boolean;
  insurance_no?: string;
  insurance_provider?: string;
  Nominee: Nominee[];
  bankName: string;
  ifscCode: string;
  accountNumber: string;
  confirmAccount: string;
  panNumber: string;
}

// ── 1. AGE & DATE VALIDATION UTILITIES ────────────────────────────────────────

/**
 * Validates whether the given Date of Birth meets the minimum age constraint of 18 years.
 */
export const validateAge18 = (dob: string): boolean => {
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

/**
 * Checks if the given date string points to a future calendar date.
 */
export const validateFutureDate = (dStr: string): boolean => {
  if (!dStr) return false;
  const date = new Date(dStr + "T00:00:00");
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date > today;
};

/**
 * Checks if the graduation year falls in the future.
 */
export const validateFutureYear = (dStr: string): boolean => {
  if (!dStr) return false;
  const yr = new Date(dStr + "T00:00:00").getFullYear();
  const curYr = new Date().getFullYear();
  return yr > curYr;
};

// ── 2. IDENTITY & FORMAT MATCHERS ─────────────────────────────────────────────

/**
 * Validates Indian standard mobile numbers (10 digits starting with 6-9).
 */
export const validatePhone = (phone: string): boolean => {
  return /^[6-9]\d{9}$/.test(phone);
};

/**
 * Validates Indian Financial System Code (IFSC) format.
 */
export const validateIFSC = (ifsc: string): boolean => {
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);
};

/**
 * Validates Permanent Account Number (PAN) format.
 */
export const validatePAN = (pan: string): boolean => {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
};

// ── 3. DATE OVERLAP & CALCULATORS ────────────────────────────────────────────

/**
 * Checks if any date ranges inside the work experience list overlap with each other.
 */
export const checkExperienceOverlap = (exps: WorkExperience[]): boolean => {
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
        return true;
      }
    }
  }
  return false;
};

/**
 * Computes human-readable summary of the candidate's total cumulative experience.
 */
export const calculateExperience = (fresher: boolean, exps: WorkExperience[]): string => {
  if (fresher) return "Fresher (0 months)";
  let totalM = 0;
  exps.forEach((w) => {
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
};

// ── 4. DYNAMIC MULTI-STEP VALIDATOR ─────────────────────────────────────────

/**
 * Performs field-level validations based on the current onboarding step.
 * Returns an object containing error messages mapped to field IDs.
 */
export const runStepValidation = (
  step: number,
  formData: Partial<EmployeeValidationData>
): Record<string, string> => {
  const errs: Record<string, string> = {};

  // Step 1: Personal & Job Details
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

  // Step 2: Education & Work History
  if (step === 2) {
    // Validate education
    const educationKeys = new Set<string>();
    if (formData.education) {
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
    }

    // Validate Experience (if not fresher)
    if (!formData.fresher && formData.WorkExp) {
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

  // Step 3: Dependent Family & Address Details
  if (step === 3) {
    if (formData.Familys) {
      formData.Familys.forEach((fam, idx) => {
        if (!fam.person_name) errs[`fam_${idx}_person_name`] = "Dependent Name is required";
        if (!fam.relationship_type) errs[`fam_${idx}_relationship_type`] = "Relationship is required";
        if (fam.contact && !/^\+?[0-9\s-]{7,15}$/.test(fam.contact)) {
          errs[`fam_${idx}_contact`] = "Invalid contact number format";
        }
      });
    }

    if (!formData.Street) errs.Street = "Street Address is required";
    if (!formData.City) errs.City = "City is required";
    if (!formData.State) errs.State = "State is required";
    if (!formData.Pin_Code) errs.Pin_Code = "Pin Code is required";
    else if (!/^\d{6}$/.test(String(formData.Pin_Code))) errs.Pin_Code = "Pin code must be exactly 6 numeric digits";

    if (!formData.sameAddress) {
      if (!formData.p_Street) errs.p_Street = "Street Address is required";
      if (!formData.p_City) errs.p_City = "City is required";
      if (!formData.p_State) errs.p_State = "State is required";
      if (!formData.p_Pin_Code) errs.p_Pin_Code = "Pin Code is required";
      else if (!/^\d{6}$/.test(String(formData.p_Pin_Code))) errs.p_Pin_Code = "Pin code must be exactly 6 numeric digits";
    }
  }

  // Step 4: Compensation, PF, ESI & Insurance Details
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

    // ESI Calculation & Eligibility
    const monthlySalary = (parseFloat(formData.annualSalary || "0") || 0) / 12;
    const isEligibleForESI = monthlySalary > 0 && monthlySalary <= 21000;

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
      if (formData.Nominee) {
        formData.Nominee.forEach((nom, idx) => {
          if (!nom.nominee_name) errs[`nom_${idx}_nominee_name`] = "Nominee Name is required";
          if (!nom.nominee_aadhar) errs[`nom_${idx}_nominee_aadhar`] = "Nominee Aadhar is required";
          else if (!/^\d{4}\s\d{4}\s\d{4}$/.test(nom.nominee_aadhar)) {
            errs[`nom_${idx}_nominee_aadhar`] = "Aadhar must be in XXXX XXXX XXXX format";
          }
        });
      }
    }
  }

  // Step 5: Bank Details
  if (step === 5) {
    if (!formData.bankName) errs.bankName = "Bank Name is required";
    
    if (!formData.ifscCode) errs.ifscCode = "IFSC code is required";
    else if (!validateIFSC(formData.ifscCode)) {
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
    else if (!validatePAN(formData.panNumber)) {
      errs.panNumber = "Invalid PAN card format. Must match e.g. ABCDE1234F";
    }
  }

  return errs;
};
