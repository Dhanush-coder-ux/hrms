import { createBrowserRouter } from "react-router-dom";

import { RootLayout } from "./Root/RootLayout";
import { ModuleSelect } from "./Root/ModuleSelect";

// ── Employee Management (was "OnBoard") ─────────────────────────────────────

import { Dashboard as EmpDashboard } from "./OnBoard/EmployeeManagement/Features/Dashboard";
import {Attendance} from "./OnBoard/EmployeeManagement/Features/Attendance";

import Leaves from "./OnBoard/EmployeeManagement/Features/Leaves";
import { Department } from "./OnBoard/EmployeeManagement/Features/Department";
import Payroll from "./OnBoard/EmployeeManagement/Features/Payroll";
import  Employee  from "./OnBoard/EmployeeManagement/Features/Employee";
import { EMPleaves } from "./OnBoard/EmployeeManagement/Leaves/EMPleaves";
import { Events } from "./OnBoard/EmployeeManagement/Features/Events";
import { EmployeeLeaveDetails } from "./OnBoard/EmployeeManagement/Leaves/EmployeeLeaveDetails";

// ── Onboard Module ───────────────────────────────────────────────────────────

import AddEmployee from "./OnBoard/InterviewProcess/Features/AddEmployee";
import EmployeeRegister from "./OnBoard/InterviewProcess/Features/AddEmployee/EmployeeRegistor";
import { Salary } from "./OnBoard/InterviewProcess/Features/AddEmployee/Salary";
import EmployeeProfile from "./OnBoard/EmployeeManagement/Employee/EmployeePfrofile";
import PayrollDetails from "./OnBoard/EmployeeManagement/Payroll/PayrollDetails";
import { DepartmentProfile } from "./OnBoard/EmployeeManagement/Department/DepartmentProfile";
import { Candidates } from "./OnBoard/InterviewProcess/Features/Candidates";
import  { Interview} from "./OnBoard/InterviewProcess/Features/Interviews";
import { OfferLetter } from "./OnBoard/InterviewProcess/Features/OfferLetter";

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
          { index: true,                          element: <EmpDashboard /> },
          { path: "attendance",                   element: <Attendance /> },
          { path: "leaves",                       element: <Leaves /> },
          { path: "department",                   element: <Department /> },
          { path:"departmentProfile/:id",             element:<DepartmentProfile/> },
          { path: "payroll",                      element: <Payroll /> },
          { path: "payrollDetails/:id",           element: <PayrollDetails /> },
          { path: "employee",                     element: <Employee /> },
          { path: "employee/:id",                 element: <EmployeeProfile /> },
          { path: "employeeleave",                element: <EMPleaves /> },
          { path: "events",                       element: <Events /> },
          { path: "employee-leave/:empid",        element: <EmployeeLeaveDetails /> },
        ],
      },

      {
        path: "onboard",
        
        children: [
          {
            index: true,
            element: <h1 className="p-6 text-xl">Onboard Dashboard</h1>,
          },
          { path: "add-employee",         element: <AddEmployee /> },
          { path: "employeeregistration", element: <EmployeeRegister /> },
          { path: "Salary",               element: <Salary /> },
          {path: "Candidates",            element:<Candidates/>},
          {path:"interviews",              element:<Interview/>},
          {path:"offers",                    element:<OfferLetter/>}
        ],
      },
      {
        path : "Admin"
      }

    ],
  },
]);
