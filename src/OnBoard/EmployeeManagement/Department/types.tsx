export interface Department {
  Dep_id: string;
  Dep_name: string;
  Dep_head: string;
  Total_employees: number;
  id: string | number;
  dep_name: string;
  head_of_dep: string;
  emp_count: number;
  Task_status: 'In Progress' | 'Completed' | 'On Hold' | 'Active';
  budget_utilization: string;
  location: string;
  extral_info: string;
}

// Since your provided JSON didn't have employees, 
// we'll use this for the profile view.
export interface Employee {
  id: string;
  name: string;
  dep_id: string | number;
  designation: string;
  status: 'Active' | 'Inactive';
  email?: string;
}