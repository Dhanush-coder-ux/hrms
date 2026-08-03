import {
  Building2,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Cog,
  FileSpreadsheet,
  FileText,
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
  { label: "Candidates", path: "/onboard/Candidates", icon: UserPlus },
  { label: "Interviews", path: "/onboard/interviews", icon: Users },
  { label: "Requirement", path: "/onboard/requirement", icon: Paperclip },
  { label: "Job Postings", path: "/onboard/jobpostings", icon: MdSocialDistance },
  {
    label: "Add Employee",
    path: "/onboard/add-employee",
    icon: PersonStanding,
  },
  { label: "Portal Access", path: "/onboard/potal-access", icon: LockKeyhole },
];

export const AdminPort = [
  { label: "Department", path: "/Admin/departmentstacks", icon: Building2 },
  { label: "Employee Updates", path: "/Admin/employeestacks", icon: Users2Icon },
  { label: "Poster Stacks", path: "/Admin/posterstacks", icon: MdSocialDistance },
  { label: "Interview Settings", path: "/Admin/interviewsStack", icon: Cog },
];

export const OffboardNavigation = [
  { label: "Exit Requests", path: "/offboard/requests", icon: UserMinus },
  { label: "Asset Return", path: "/offboard/assets", icon: PackageCheck },
  { label: "Access Deactivation", path: "/offboard/access", icon: ShieldOff },
  { label: "Knowledge Transfer", path: "/offboard/kt", icon: Repeat },
  { label: "Clearance", path: "/offboard/clearance", icon: CheckCircle2 },
  { label: "Final Settlement", path: "/offboard/settlement", icon: Wallet },
  { label: "Documents", path: "/offboard/documents", icon: FileText },
];

export const DashboardNavigation = [
  { label: "ProfilePage", path: "/mainprofile", icon: Users },
  { label: "Onboard", path: "/Mainonboard", icon: UserPlus },
  { label: "Offboard", path: "/Mainoffboard", icon: UserMinus },
  { label: "Admin", path: "/Mainadmin", icon: MdOutlineAdminPanelSettings },
];
