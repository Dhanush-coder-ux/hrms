import { createBrowserRouter } from "react-router-dom";

import { RootLayout } from "./Root/RootLayout";
import { ModuleSelect } from "./Root/ModuleSelect";

// ── Employee Management (was "OnBoard") ─────────────────────────────────────
import MainLayout from "./OnBoard/EmployeeManagement/Components/Layout/MainLayout";
import { Dashboard as EmpDashboard } from "./OnBoard/EmployeeManagement/Dashboard";
import { Attendance } from "./OnBoard/EmployeeManagement/Attendance";
import Leaves from "./OnBoard/EmployeeManagement/Leaves";
import { Department } from "./OnBoard/EmployeeManagement/Department";
import Payroll from "./OnBoard/EmployeeManagement/Payroll";
import  Employee  from "./OnBoard/EmployeeManagement/Employee";
import { EMPleaves } from "./OnBoard/EmployeeManagement/Leaves/EMPleaves";
import { Events } from "./OnBoard/EmployeeManagement/Events";
import { EmployeeLeaveDetails } from "./OnBoard/EmployeeManagement/Leaves/EmployeeLeaveDetails";

// ── Onboard Module ───────────────────────────────────────────────────────────
import OnbordMainLayout from "./OnBoard/Components/Layout/OnboardMainLayout";
import AddEmployee from "./OnBoard/Features/AddEmployee";
import EmployeeRegister from "./OnBoard/Features/AddEmployee/EmployeeRegistor";
import { Salary } from "./OnBoard/Features/AddEmployee/Salary";
import EmployeeProfile from "./OnBoard/EmployeeManagement/Employee/EmployeePfrofile";

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
        element: <MainLayout />,
        children: [
          { index: true,                          element: <EmpDashboard /> },
          { path: "attendance",                   element: <Attendance /> },
          { path: "leaves",                       element: <Leaves /> },
          { path: "department",                   element: <Department /> },
          { path: "payroll",                      element: <Payroll /> },
          { path: "employee",                     element: <Employee /> },
          { path: "employee/:id",                 element: <EmployeeProfile /> },
          { path: "employeeleave",                element: <EMPleaves /> },
          { path: "events",                       element: <Events /> },
          { path: "employee-leave/:empid",        element: <EmployeeLeaveDetails /> },
        ],
      },

      // ONBOARD MODULE
      {
        path: "onboard",
        element: <OnbordMainLayout />,
        children: [
          {
            index: true,
            element: <h1 className="p-6 text-xl">Onboard Dashboard</h1>,
          },
          { path: "add-employee",         element: <AddEmployee /> },
          { path: "employeeregistration", element: <EmployeeRegister /> },
          { path: "Salary",               element: <Salary /> },
        ],
      },

    ],
  },
]);
