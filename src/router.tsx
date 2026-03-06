import { createBrowserRouter } from "react-router-dom";

import { RootLayout } from "./Root/RootLayout";
import { ModuleSelect } from "./Root/ModuleSelect";

import MainLayout from "./OffBoard/Components/Layout/MainLayout";
import { Dashboard } from "./OffBoard/Features/Dashbord/Dashboard";
import { Attendance } from "./OffBoard/Features/Dashbord/Attendance";
import Leaves from "./OffBoard/Features/Dashbord/Leaves";
import { Department } from "./OffBoard/Features/Dashbord/Department";
import Payroll from "./OffBoard/Features/Dashbord/Payroll";
import { Employee } from "./OffBoard/Features/Dashbord/Employee";
import { EMPleaves } from "./OffBoard/Features/Dashbord/Leaves/EMPleaves";
import { Events } from "./OffBoard/Features/Dashbord/Events";
import { EmployeeLeaveDetails } from "./OffBoard/Features/Dashbord/Leaves/EmployeeLeaveDetails";

import OnbordMainLayout from "./OnBoard/Components/Layout/OnboardMainLayout";
import AddEmployee from "./OnBoard/Features/AddEmployee";
import EmployeeRegister from "./OnBoard/Features/AddEmployee/EmployeeRegistor";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // Navbar always visible
    children: [
      
      // MODULE SELECT PAGE
      {
        index: true,
        element: <ModuleSelect />,
      },

      // OFFBOARD MODULE
      {
        path: "offboard",
        element: <MainLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "attendance", element: <Attendance /> },
          { path: "leaves", element: <Leaves /> },
          { path: "department", element: <Department /> },
          { path: "payroll", element: <Payroll /> },
          { path: "employee", element: <Employee /> },
          { path: "employeeleave", element: <EMPleaves /> },
          { path: "events", element: <Events /> },
          { path: "employee-leave/:empid", element: <EmployeeLeaveDetails /> },
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
          {
            path: "add-employee",
            element: <AddEmployee />,
          },
          {
            path: "employeeregistration",
            element: <EmployeeRegister />,
          }
        ],
      },

    ],
  },
]);

