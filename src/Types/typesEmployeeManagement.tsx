
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
  apply_date: string;
  from_date: string;
  to_date: string;
  number_of_days: number;
  approve_status: string;
  reason: string;
}

export interface Empleaves {
  empid: string;
  name: string;
  total_leave: number;
  used_leave: number;
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