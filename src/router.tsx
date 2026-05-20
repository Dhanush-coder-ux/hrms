import { createBrowserRouter, useRouteError, Link } from "react-router-dom";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

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
import DepartmentProfile, { } from "./OnBoard/EmployeeManagement/Department/DepartmentProfile";
import { Candidates } from "./OnBoard/InterviewProcess/Features/Candidates";
import { CandidateProfile } from "./OnBoard/InterviewProcess/Features/Candidate/CandidateProfile";
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
import { Requirement } from "./OnBoard/InterviewProcess/Features/Requirement";
import { RequirementProfile } from "./OnBoard/InterviewProcess/Features/Requirement/requirementProfile";
import { JobPostings } from "./OnBoard/InterviewProcess/Features/JobPostings";
import { PosterStacks } from "./AdminPort/Features/Poster/PosterStacks";
import { InterView } from "./AdminPort/Features/Interview/InterViewStack";


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
    path: "/",
    element: <RootLayout />,
    errorElement: <GlobalErrorBoundary />,
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
          { path: "Candidates/:id", element: <CandidateProfile /> },
          { path: "interviews", element: <Interview /> },
          { path: "offers", element: <OfferLetterPage /> },
          { path: "requirement", element: <Requirement /> },
          { path: "requirement/:id", element: <RequirementProfile /> },
          { path: "jobpostings", element: <JobPostings /> }
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
          { path: "posterstacks", element: <PosterStacks /> },
          { path: "interviewsStack", element: <InterView /> }
        ],
      },
      {
        path: "offboard",
        children: [
          { index: true, element: <OffboardingDashboard /> },

          { path: "requests", element: <ExitRequests /> },
          { path: "assets", element: <AssetReturn /> },
          { path: "access", element: <AccessDeactivation /> },
          { path: "kt", element: <KnowledgeTransfer /> },
          { path: "clearance", element: <Clearance /> },
          { path: "settlement", element: <FinalSettlement /> },
          { path: "documents", element: <Documents /> },
        ],
      },
    ],
  },
]);
