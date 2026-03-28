export interface Education { 
    degree: string; 
    institution: string; 
    graduationYear: string; }


export interface Dependent { 
    person_name: string; 
    relationship_type: string; 
    contact: string; 
    person_dob: string; }

export interface Employee {
  Emp_id: string; f_name: string; l_name: string; name: string;
  gender?: string; dob?: string; email: string; phone: string;
  Department: string; designation: string; emp_type: string; DateOfJoining: string;
  education: Education[]; company_name: string; position: string; FromDate: string; ToDate: string;
  dependents: Dependent[];
  Street: string; City: string; State: string; Pin_Code: number;
  p_Street: string; p_City: string; p_State: string; p_Pin_Code: number;
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