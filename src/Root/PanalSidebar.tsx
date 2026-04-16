import { Building2, CalendarCheck, CalendarDays, FileSpreadsheet, FileText, LayoutDashboard, PersonStanding, ReceiptIndianRupee, UserPlus, Users, Variable } from "lucide-react";

 export const employeeNavigation = [
    { label: "Dashboard",  path: "/EmployeeManagement",            icon: LayoutDashboard },
    { label: "Employees",  path: "/EmployeeManagement/employee",   icon: Users },
    { label: "Attendance", path: "/EmployeeManagement/attendance", icon: CalendarCheck },
    { label: "Leaves",     path: "/EmployeeManagement/leaves",     icon: FileSpreadsheet },
    { label: "Event",      path: "/EmployeeManagement/events",     icon: CalendarDays },
    { label: "Payroll",    path: "/EmployeeManagement/payroll",    icon: ReceiptIndianRupee },
    { label: "Department", path: "/EmployeeManagement/department", icon: Building2 },
  ];

  export const onboardNavigation = [
    { label: "Dashboard", path: "/onboard", icon: LayoutDashboard },
    { label: "Candidates", path: "/onboard/candidates", icon: UserPlus },
    { label: "Interviews", path: "/onboard/interviews", icon: Users },
    { label: "Offer Letters", path: "/onboard/offers", icon: FileText },
    { label: "Add Employee", path: "/onboard/add-employee", icon: PersonStanding },
  ];

  export const AdminPort = [
    {label: "Dashboard", path:"/admin" , icon: LayoutDashboard},
    {label: "stack Values" , path:"/admin/stacks",  icon: Variable }
  ]