
export interface AttendanceRecord {
  Emp_id: string;
  employee_name: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: string;
}

export interface Employee {
  Emp_id: string;
  name: string;
  email: string;
  phone: string;
  Department: string;
  designation: string;
  Status: "Active" | "Inactive";
  dateOfJoining: string;
}

export interface EventFormData {
    event_id: string;
    category: string;
    event_title: string;
    date: string;
    time: string | null;
    location?: string;
    organizer?: string;
    description?: string;
    plan: { plan_type: string; details: string };
    [x: string]: string | undefined | { plan_type: string; details: string } | null;
}

export interface LeaveHistory {
  id: number;
  Emp_id: string;
  employee_name: string;
  Duration: string; // backend format: "YYYY-MM-DD to YYYY-MM-DD"
  Days: number;
  status: string;
  leave_type: string;
  from_date : string;
  to_date : string;
  applayDate : string ;
  Reason: string;
}

export interface Empleaves {
  Emp_id: string; 
  name: string;
  employee_name: string;
  total_leave: number;
  Used: number;
  available_leaves: number;
  leave_history: LeaveHistory[];
}

export interface PayrollData {
  id: number;
  employee: string;
  salary: number;
  tax: number;
  net: number;
  status: "Paid" | "Pending" | "Processing";
  department: string;
  date: string;
}