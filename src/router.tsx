import { createBrowserRouter } from "react-router-dom";

import MainLayout from "./Components/Layout/MainLayout";
import { Dashboard } from "./Features/Dashbord/Dashboard";
import { Attendance } from "./Features/Dashbord/Attendance";
import Leaves from "./Features/Dashbord/Leaves";
import { Department } from "./Features/Dashbord/Department";
import Payroll from "./Features/Dashbord/Payroll";
import { Employee } from "./Features/Dashbord/Employee";
import { EMPleaves } from "./Features/Dashbord/Leaves/EMPleaves";
import { Events } from "./Features/Dashbord/Events";
import { EmployeeLeaveDetails } from "./Features/Dashbord/Leaves/EmployeeLeaveDetails";

export const router = createBrowserRouter([
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
        path: "/leaves",
        element: <Leaves />,
      },
      {
        path: "/department",
        element: <Department />,
      },
      {
        path: "/payroll",
        element: <Payroll />,
      },
      {
        path: "/employee",
        element: <Employee />,
      },
      {
        path:"/employeeleave",
        element:<EMPleaves/>
      },
      {
        path:"/Events",
        element:<Events/>
      },
      {
    path: "/employee-leave/:empid",
    element: <EmployeeLeaveDetails />
  }
    ],
  },
]);
