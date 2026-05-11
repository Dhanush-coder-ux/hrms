import { createBrowserRouter } from "react-router-dom";

import { RootLayout } from "./Root/RootLayout";
import { ModuleSelect } from "./Root/ModuleSelect";

// ── Employee Management (was "OnBoard") ─────────────────────────────────────

import { Dashboard as EmpDashboard } from "./OnBoard/EmployeeManagement/Features/Dashboard";
import { Attendance } from "./OnBoard/EmployeeManagement/Features/Attendance";

import Leaves from "./OnBoard/EmployeeManagement/Features/Leaves";
import { Department } from "./OnBoard/EmployeeManagement/Features/Department";
import Payroll from "./OnBoard/EmployeeManagement/Features/Payroll";
import Employee from "./OnBoard/EmployeeManagement/Features/Employee";
import { EMPleaves } from "./OnBoard/EmployeeManagement/Leaves/EMPleaves";
import { Events } from "./OnBoard/EmployeeManagement/Features/Events";
import { EmployeeLeaveDetails } from "./OnBoard/EmployeeManagement/Leaves/EmployeeLeaveDetails";

// ── Onboard Module ───────────────────────────────────────────────────────────

import AddEmployee from "./OnBoard/InterviewProcess/Features/AddEmployee";
import EmployeeRegister from "./OnBoard/InterviewProcess/Features/AddEmployee/EmployeeRegistor";
import { Salary } from "./OnBoard/InterviewProcess/Features/AddEmployee/Salary";
import EmployeeProfile from "./OnBoard/EmployeeManagement/Employee/EmployeeProfile";
import PayrollDetails from "./OnBoard/EmployeeManagement/Payroll/PayrollDetails";
import DepartmentProfile, {  } from "./OnBoard/EmployeeManagement/Department/DepartmentProfile";
import { Candidates } from "./OnBoard/InterviewProcess/Features/Candidates";
import { Interview } from "./OnBoard/InterviewProcess/Features/Interviews";
import { OfferLetterPage } from "./OnBoard/InterviewProcess/Features/OfferLetter";

import { DepartmentsStacks } from "./AdminPort/Features/Department/DepartmentStacks";
import { EmployeeStack } from "./AdminPort/Features/Employee/EmployeeStack";
import { ExitRequests } from "./OffBoard/Features/ExitRequst";
import { AssetReturn } from "./OffBoard/Features/AssetReturn";
import { AccessDeactivation } from "./OffBoard/Features/Deactivation";
import { KnowledgeTransfer } from "./OffBoard/Features/KnowledgeTransfer";
import { Clearance } from "./OffBoard/Features/Clearance";
import { FinalSettlement } from "./OffBoard/Features/FinalSetilment";
import { Documents } from "./OffBoard/Features/Documents";
import { OffboardingDashboard } from "./OffBoard/Features/Dashboard";
import { OnboardingDashboard } from "./OnBoard/InterviewProcess/Features/OnDashboard";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // MODULE SELECT
      { index: true, element: <ModuleSelect /> },

      // OnBOARD MODULE (Employee Management)
      {
        path: "EmployeeManagement",
        children: [
          { index: true, element: <EmpDashboard /> },
          { path: "attendance", element: <Attendance /> },
          { path: "leaves", element: <Leaves /> },
          { path: "department", element: <Department /> },
          { path: "departmentProfile/:id", element: <DepartmentProfile /> },
          { path: "payroll", element: <Payroll /> },
          { path: "payrollDetails/:id", element: <PayrollDetails /> },
          { path: "employee", element: <Employee /> },
          { path: "employee/:id", element: <EmployeeProfile /> },
          { path: "employeeleave", element: <EMPleaves /> },
          { path: "events", element: <Events /> },
          { path: "employee-leave/:empid", element: <EmployeeLeaveDetails /> },
        ],
      },

      {
        path: "onboard",

        children: [
          {
            index: true,
            element: <OnboardingDashboard />,
          },
          { path: "add-employee", element: <AddEmployee /> },
          { path: "employeeregistration", element: <EmployeeRegister /> },
          { path: "Salary", element: <Salary /> },
          { path: "Candidates", element: <Candidates /> },
          { path: "interviews", element: <Interview /> },
          { path: "offers", element: <OfferLetterPage /> },
        ],
      },
      {
        path: "Admin",
        children: [
          {
            index: true,
            element: <h1>Admin DashBoard</h1>,
          },
          { path: "departmentstacks", element: <DepartmentsStacks /> },
          { path: "employeestacks", element: <EmployeeStack /> },
        ],
      },
      {
        path: "offboard",
        children: [
          { index: true, element:<OffboardingDashboard /> },

          { path: "requests", element: <ExitRequests /> },
          { path: "assets", element: <AssetReturn /> },
          {path: "access", element: <AccessDeactivation /> },
          { path: "kt", element: <KnowledgeTransfer /> },
          { path: "clearance", element: <Clearance/> },
          { path: "settlement", element: <FinalSettlement /> },
          { path: "documents", element: <Documents /> },
        ],
      },
    ],
  },
]);
