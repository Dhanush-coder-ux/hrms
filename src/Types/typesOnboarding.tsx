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

 f_name: string; l_name: string; name: string;
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
  Candidate_id: string;
  Candidate_name: string;
  Job_title: string;
  Candidate_Phone: string;
  Candidate_Email: string;
  Candidate_Skills: string;
  Candidate_Source: string;
  Resume_path: string;
  Status: string;
}

export interface Interview {
  Interview_id: string;
  Candidate_id: string;
  Interview_date: string;
  Interview_time: string;
  Interview_status: string;
  Candidate_feedback: string;
  // UI Helper fields (mapped in frontend)
  candidate_name?: string;
  candidate_role?: string;
}