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
  id: number;
  Candidate_ID: string;
  Candidate_name: string;
  Job_title: string;
  Candidate_Phone: string;
  Candidate_Email: string;
  Candidate_Skills?: string;
  Candidate_Source?: string;
  Resume_path?: string;
  Candidate_status: string;
  current_candidate_stage?: string;
}

export interface InterviewRecord {
  id: number;
  candidate_id: number;
  Candidate_id: string; // The alphanumeric ID from backend
  Interview_date: string;
  Interview_time: string;
  Interview_status: string;
  Stage_status: string;
  Stage_name?: string;
  Interviewer_name?: string | null;
  Interview_score?: number | null;
  Interviewer_feedback?: string | null;
  Final_decision?: string | null;
  Rejection_reason?: string | null;
  created_at: string;
  candidate_name?: string;
  candidate_role?: string;
  current_candidate_stage?: string;
  completed_stages_count?: number;
  total_stages_count?: number;
}

export interface CandidateStageRecord {
    id: number;
    candidate_id: number;
    stage_id: number;
    Stage_status: string;
    Stage_name?: string;
}