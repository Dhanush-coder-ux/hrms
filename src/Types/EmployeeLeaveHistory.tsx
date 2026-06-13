
export interface EmployeeLeaveHistory {
  leave_history: never[];
  empid: string,
  employee_name: string,
  total_leave: number,
  Used: number,
  available_leaves: number,
  LeaveDays : [LeaveDays]
}

interface LeaveDays {
      id: number,
      applayDate: string,
      from_date: string,
      to_date: string,
      Days: number,
      status: string,
      Reason: string,
      leave_type: string,
    }