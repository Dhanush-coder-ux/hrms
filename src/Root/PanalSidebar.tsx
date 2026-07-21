import {
  Building2,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Cog,
  FileSpreadsheet,
  FileText,
  LayoutDashboard,

  LockKeyhole,

  PackageCheck,
  Paperclip,
  PersonStanding,
  ReceiptIndianRupee,
  Repeat,
  ShieldOff,
  UserMinus,
  UserPlus,
  Users,
  Users2Icon,
  Wallet,
} from "lucide-react";
import { MdOutlineAdminPanelSettings, MdSocialDistance } from "react-icons/md";



export const employeeNavigation = [
  { label: "Dashboard", path: "/EmployeeManagement", icon: LayoutDashboard },
  { label: "Employees", path: "/EmployeeManagement/employee", icon: Users },
  {
    label: "Attendance",
    path: "/EmployeeManagement/attendance",
    icon: CalendarCheck,
  },
  {
    label: "Leaves",
    path: "/EmployeeManagement/leaves",
    icon: FileSpreadsheet,
  },
  { label: "Event", path: "/EmployeeManagement/events", icon: CalendarDays },
  {
    label: "Payroll",
    path: "/EmployeeManagement/payroll",
    icon: ReceiptIndianRupee,
  },
  {
    label: "Department",
    path: "/EmployeeManagement/department",
    icon: Building2,
  },
];

export const onboardNavigation = [
  { label: "Dashboard", path: "/onboard", icon: LayoutDashboard },
  { label: "Candidates", path: "/onboard/candidates", icon: UserPlus },
  { label: "Interviews", path: "/onboard/interviews", icon: Users },
  { label: "Requirement", path: "/onboard/requirement", icon: Paperclip },
  { label: "Offer Letters", path: "/onboard/offers", icon: FileText },
  {label:"Job Postings", path:"/onboard/jobpostings",icon:MdSocialDistance},
  {
    label: "Add Employee",
    path: "/onboard/add-employee",
    icon: PersonStanding,
  },
  {label:"Portal Access", path:"/onboard/potal-access",icon:LockKeyhole}

];

export const AdminPort = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Department", path: "admin/departmentstacks", icon: Building2 },
  { label: "Employee Updates", path: "admin/employeestacks", icon: Users2Icon },
  {label: "Poster Stacks", path: "admin/posterstacks", icon: MdSocialDistance},
  {label: "Interview Settings", path: "admin/interviewsStack",icon:Cog}
];

export const OffboardNavigation = [
  { label: "Dashboard", path: "/offboard", icon: LayoutDashboard },

  { label: "Exit Requests", path: "/offboard/requests", icon: UserMinus },

  { label: "Asset Return", path: "/offboard/assets", icon: PackageCheck },

  { label: "Access Deactivation", path: "/offboard/access", icon: ShieldOff },

  { label: "Knowledge Transfer", path: "/offboard/kt", icon: Repeat },

  { label: "Clearance", path: "/offboard/clearance", icon: CheckCircle2 },

  { label: "Final Settlement", path: "/offboard/settlement", icon: Wallet },

  { label: "Documents", path: "/offboard/documents", icon: FileText },
];

export const DashboardNavigation = [
  {label:"ProfilePage",path:"mainprofile",icon: Users},
  {lable:"Onboard",path:"/Mainonboard",icons:UserPlus},
  {lable:"Offboard",path:"/Mainoffboard",icon:UserMinus},
  {lable:"Admin",path:"/Mainadmin",icon:MdOutlineAdminPanelSettings},
]
