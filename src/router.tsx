import { createBrowserRouter, useRouteError, Link, Navigate } from "react-router-dom";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

import { RootLayout } from "./Root/RootLayout";
import { ModuleSelect } from "./Root/ModuleSelect";
import { Login } from "./auth/Login";
import { ProtectedRoute } from "./auth/ProtectedRoute";

// ── Employee Management ─────────────────────────────────────
import { Attendance } from "./OnBoard/EmployeeManagement/Features/Attendance";
import Leaves from "./OnBoard/EmployeeManagement/Features/Leaves";
import { Department } from "./OnBoard/EmployeeManagement/Features/Department";
import Payroll from "./OnBoard/EmployeeManagement/Features/Payroll";
import Employee from "./OnBoard/EmployeeManagement/Features/Employee";
import { EMPleaves } from "./OnBoard/EmployeeManagement/Leaves/EMPleaves";
import { Events } from "./OnBoard/EmployeeManagement/Features/Events";
import { EmployeeLeaveDetails } from "./OnBoard/EmployeeManagement/Leaves/EmployeeLeaveDetails";

// ── Onboard Module ───────────────────────────────────────────
import AddEmployee from "./OnBoard/InterviewProcess/Features/AddEmployee";
import EmployeeRegister from "./OnBoard/InterviewProcess/Features/AddEmployee/EmployeeRegistor";
import { Salary } from "./OnBoard/InterviewProcess/Features/AddEmployee/Salary";
import EmployeeProfile from "./OnBoard/EmployeeManagement/Employee/EmployeeProfile";
import PayrollDetails from "./OnBoard/EmployeeManagement/Payroll/PayrollDetails";
import DepartmentProfile from "./OnBoard/EmployeeManagement/Department/DepartmentProfile";
import { Candidates } from "./OnBoard/InterviewProcess/Features/Candidates";
import { CandidateProfile } from "./OnBoard/InterviewProcess/Features/Candidate/CandidateProfile";
import { Interview } from "./OnBoard/InterviewProcess/Features/Interviews";

import { DepartmentsStacks } from "./AdminPort/Features/Department/DepartmentStacks";
import { EmployeeStack } from "./AdminPort/Features/Employee/EmployeeStack";
import { ExitRequests } from "./OffBoard/Features/ExitRequst";
import { AssetReturn } from "./OffBoard/Features/AssetReturn";
import { AccessDeactivation } from "./OffBoard/Features/Deactivation";
import { KnowledgeTransfer } from "./OffBoard/Features/KnowledgeTransfer";
import { Clearance } from "./OffBoard/Features/Clearance";
import { FinalSettlement } from "./OffBoard/Features/FinalSetilment";
import { Documents } from "./OffBoard/Features/Documents";
import { Requirement } from "./OnBoard/InterviewProcess/Features/Requirement";
import { RequirementProfile } from "./OnBoard/InterviewProcess/Features/Requirement/requirementProfile";
import { JobPostings } from "./OnBoard/InterviewProcess/Features/JobPostings";
import { PosterStacks } from "./AdminPort/Features/Poster/PosterStacks";
import { InterView } from "./AdminPort/Features/Interview/InterViewStack";
import { PortAccess } from "./OnBoard/InterviewProcess/Features/PortAccsess";
import { AttendanceHistory } from "./OnBoard/EmployeeManagement/Attendance/AttendanceHistory";

export function GlobalErrorBoundary() {
  const error: any = useRouteError();
  console.error("Router Caught Exception:", error);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-slate-800/80 border border-slate-700/50 backdrop-blur-xl rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-500/20">
          <AlertCircle size={28} className="animate-pulse" />
        </div>

        <h1 className="text-xl font-black uppercase tracking-wider mb-2">Systems Exception</h1>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          {error?.statusText === "Not Found" || error?.status === 404
            ? "The requested module path does not exist or was moved inside our corporate workspace directory."
            : error?.statusText || error?.message || "The requested module failed to initialize or the route does not exist."}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-slate-600 cursor-pointer"
          >
            <RefreshCw size={14} /> Retry Session
          </button>

          <Link
            to="/"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            <Home size={14} /> Return to Hub
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-700/40 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
          Apex Solutions HRMS OS • Core Router v1.0
        </div>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    errorElement: <GlobalErrorBoundary />,
    children: [
      // SINGLE MAIN DASHBOARD (MODULE OVERVIEW)
      { index: true, element: <ModuleSelect /> },

      // EMPLOYEE MANAGEMENT MODULE (Direct to /employee)
      {
        path: "EmployeeManagement",
        element: <Navigate to="/EmployeeManagement/employee" replace />,
      },
      {
        path: "EmployeeManagement/attendance",
        element: (
          <ProtectedRoute moduleKey="EmployeeManagement">
            <Attendance />
          </ProtectedRoute>
        ),
      },
      {
        path: "EmployeeManagement/leaves",
        element: (
          <ProtectedRoute moduleKey="EmployeeManagement">
            <Leaves />
          </ProtectedRoute>
        ),
      },
      {
        path: "EmployeeManagement/department",
        element: (
          <ProtectedRoute moduleKey="EmployeeManagement">
            <Department />
          </ProtectedRoute>
        ),
      },
      {
        path: "EmployeeManagement/departmentProfile/*",
        element: (
          <ProtectedRoute moduleKey="EmployeeManagement">
            <DepartmentProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "EmployeeManagement/payroll",
        element: (
          <ProtectedRoute moduleKey="EmployeeManagement">
            <Payroll />
          </ProtectedRoute>
        ),
      },
      {
        path: "EmployeeManagement/payrollDetails/*",
        element: (
          <ProtectedRoute moduleKey="EmployeeManagement">
            <PayrollDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "EmployeeManagement/employee",
        element: (
          <ProtectedRoute moduleKey="EmployeeManagement">
            <Employee />
          </ProtectedRoute>
        ),
      },
      {
        path: "EmployeeManagement/employee/*",
        element: (
          <ProtectedRoute moduleKey="EmployeeManagement">
            <EmployeeProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "EmployeeManagement/employeeleave",
        element: (
          <ProtectedRoute moduleKey="EmployeeManagement">
            <EMPleaves />
          </ProtectedRoute>
        ),
      },
      {
        path: "EmployeeManagement/events",
        element: (
          <ProtectedRoute moduleKey="EmployeeManagement">
            <Events />
          </ProtectedRoute>
        ),
      },
      {
        path: "EmployeeManagement/employee-leave/*",
        element: (
          <ProtectedRoute moduleKey="EmployeeManagement">
            <EmployeeLeaveDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "EmployeeManagement/attendancehistory/*",
        element: (
          <ProtectedRoute moduleKey="EmployeeManagement">
            <AttendanceHistory />
          </ProtectedRoute>
        ),
      },

      // ONBOARD MODULE (Direct to /Candidates)
      {
        path: "onboard",
        element: <Navigate to="/onboard/Candidates" replace />,
      },
      {
        path: "onboard/add-employee",
        element: (
          <ProtectedRoute moduleKey="onboard">
            <AddEmployee />
          </ProtectedRoute>
        ),
      },
      {
        path: "onboard/employeeregistration",
        element: (
          <ProtectedRoute moduleKey="onboard">
            <EmployeeRegister />
          </ProtectedRoute>
        ),
      },
      {
        path: "onboard/Salary",
        element: (
          <ProtectedRoute moduleKey="onboard">
            <Salary />
          </ProtectedRoute>
        ),
      },
      {
        path: "onboard/Candidates",
        element: (
          <ProtectedRoute moduleKey="onboard">
            <Candidates />
          </ProtectedRoute>
        ),
      },
      {
        path: "onboard/Candidates/*",
        element: (
          <ProtectedRoute moduleKey="onboard">
            <CandidateProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "onboard/interviews",
        element: (
          <ProtectedRoute moduleKey="onboard">
            <Interview />
          </ProtectedRoute>
        ),
      },
      {
        path: "onboard/requirement",
        element: (
          <ProtectedRoute moduleKey="onboard">
            <Requirement />
          </ProtectedRoute>
        ),
      },
      {
        path: "onboard/requirement/*",
        element: (
          <ProtectedRoute moduleKey="onboard">
            <RequirementProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "onboard/jobpostings",
        element: (
          <ProtectedRoute moduleKey="onboard">
            <JobPostings />
          </ProtectedRoute>
        ),
      },
      {
        path: "onboard/potal-access",
        element: (
          <ProtectedRoute moduleKey="onboard">
            <PortAccess />
          </ProtectedRoute>
        ),
      },

      // ADMIN MODULE (Direct to /departmentstacks)
      {
        path: "Admin",
        element: <Navigate to="/Admin/departmentstacks" replace />,
      },
      {
        path: "Admin/departmentstacks",
        element: (
          <ProtectedRoute moduleKey="Admin">
            <DepartmentsStacks />
          </ProtectedRoute>
        ),
      },
      {
        path: "Admin/employeestacks",
        element: (
          <ProtectedRoute moduleKey="Admin">
            <EmployeeStack />
          </ProtectedRoute>
        ),
      },
      {
        path: "Admin/posterstacks",
        element: (
          <ProtectedRoute moduleKey="Admin">
            <PosterStacks />
          </ProtectedRoute>
        ),
      },
      {
        path: "Admin/interviewsStack",
        element: (
          <ProtectedRoute moduleKey="Admin">
            <InterView />
          </ProtectedRoute>
        ),
      },

      // OFFBOARD MODULE (Direct to /requests)
      {
        path: "offboard",
        element: <Navigate to="/offboard/requests" replace />,
      },
      {
        path: "offboard/requests",
        element: (
          <ProtectedRoute moduleKey="offboard">
            <ExitRequests />
          </ProtectedRoute>
        ),
      },
      {
        path: "offboard/assets",
        element: (
          <ProtectedRoute moduleKey="offboard">
            <AssetReturn />
          </ProtectedRoute>
        ),
      },
      {
        path: "offboard/access",
        element: (
          <ProtectedRoute moduleKey="offboard">
            <AccessDeactivation />
          </ProtectedRoute>
        ),
      },
      {
        path: "offboard/kt",
        element: (
          <ProtectedRoute moduleKey="offboard">
            <KnowledgeTransfer />
          </ProtectedRoute>
        ),
      },
      {
        path: "offboard/clearance",
        element: (
          <ProtectedRoute moduleKey="offboard">
            <Clearance />
          </ProtectedRoute>
        ),
      },
      {
        path: "offboard/settlement",
        element: (
          <ProtectedRoute moduleKey="offboard">
            <FinalSettlement />
          </ProtectedRoute>
        ),
      },
      {
        path: "offboard/documents",
        element: (
          <ProtectedRoute moduleKey="offboard">
            <Documents />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
