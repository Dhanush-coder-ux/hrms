import { createBrowserRouter } from "react-router-dom";

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
import { ModuleSelect } from "./Root/ModuleSelect";
import { RootLayout } from "./Root/RootLayout";

export const router = createBrowserRouter([
   {
   path: "/",
    element: <RootLayout />,   // 👈 Navbar here
    children: [
      {
        index: true,
        element: <ModuleSelect />, 
  },
  {
    path: "/",
    element: <MainLayout />,

    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "attendance",
        element: <Attendance />,
      },
      {
        path: "leaves",
        element: <Leaves />,
      },
      {
        path: "department",
        element: <Department />,
      },
      {
        path: "payroll",
        element: <Payroll />,
      },
      {
        path: "employee",
        element: <Employee />,
      },
      {
        path: "employeeleave",
        element: <EMPleaves />,
      },
      {
        path: "events",
        element: <Events />,
      },
      {
        path: "employee-leave/:empid",
        element: <EmployeeLeaveDetails />,
      },
    ],
  },
    ],
  },
]);