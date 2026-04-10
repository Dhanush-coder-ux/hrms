export interface Education { 
    degree: string; 
    institution: string; 
    graduationYear: string; }


export interface Family { 
    person_name: string; 
    relationship_type: string; 
    contact: string; 
    person_dob: string; }

export interface WorkExpInfo{

  company_name: string; 
  position: string; 
  FromDate: string; 
  ToDate: string;

} 
export interface Employee {

  Emp_id: string; f_name: string; l_name: string; name: string;
  gender?: string; dob?: string; email: string; phone: string;
  Department: string; designation: string; emp_type: string; DateOfJoining: string;
  education: Education[]; 
  WorkExp : WorkExpInfo[];
  Familys: Family[];
  Street: string; City: string; State: string; Pin_Code: number;
  p_Street: string; p_City: string; p_State: string; p_Pin_Code: number;
}

interface Nominees { nominee_name: string; nominee_aadhar: string; }

export interface InsuranceTypes {
  apply_esi: any;
  uan_number: string;
  pf_id: string;
  insurance_no: string;
  aadhar_no: string ;// Added to match your UI
  esi_no:string;
  esi_name: string;
  insurance_provider: string;
  Nominee :Nominees[];
}

export interface PayrollData {
  provider: string; payType: string; currency: string; payFrequency: string;
  annualSalary: number; bonus_Type: string; bonus_CalculationMode: "percentage" | "fixed"; bonus_Value: number;
}

export interface Candidate {
  c_id: string;
  name: string;
  phone: string;
  email: string;
  reference: string;
  role: string;
  status: string;
  resumeUrl?: string;
}