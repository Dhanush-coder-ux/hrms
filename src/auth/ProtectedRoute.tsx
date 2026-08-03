import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { Role } from "./AuthContext";
import PageLoading from "../Components/Common/PageLoading";
import { ShieldAlert } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  moduleKey?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  moduleKey,
}) => {
  const { user, isLoading, hasRole, canAccessModule } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <PageLoading />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== "admin" && user.role !== "hr") {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return (
      <div className="h-full w-full flex items-center justify-center p-6 bg-slate-50">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-lg">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <ShieldAlert size={28} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Access Restricted</h2>
          <p className="text-sm text-slate-500 mb-6">
            Your current role (<span className="font-semibold uppercase text-primary">{user.role}</span>) does not have permission to access this feature.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  if (moduleKey && !canAccessModule(moduleKey)) {
    return (
      <div className="h-full w-full flex items-center justify-center p-6 bg-slate-50">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-lg">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <ShieldAlert size={28} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Module Access Restricted</h2>
          <p className="text-sm text-slate-500 mb-6">
            Your role (<span className="font-semibold uppercase text-primary">{user.role}</span>) is not authorized for the <span className="font-bold text-slate-700">{moduleKey}</span> module.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Return to Main Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
