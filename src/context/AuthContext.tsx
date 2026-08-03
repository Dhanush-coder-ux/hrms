import React, { createContext, useContext, useState, useEffect } from "react";
import { Api_URL } from "../APILINK";

export type Role = "admin" | "hr" | "manager" | "employee";

export interface User {
  id?: number;
  email: string;
  role: Role;
  emp_id?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  hasRole: (allowedRoles: Role[]) => boolean;
  canAccessModule: (moduleKey: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Only Admin and HR are permitted portal-wide access
export const ALLOWED_PORTAL_ROLES: Role[] = ["admin", "hr"];

const MODULE_PERMISSIONS: Record<string, Role[]> = {
  overview: ["admin", "hr"],
  EmployeeManagement: ["admin", "hr"],
  onboard: ["admin", "hr"],
  offboard: ["admin", "hr"],
  Admin: ["admin"],
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const response = await fetch(`${Api_URL}/Auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const userData: User = await response.json();
        if (!ALLOWED_PORTAL_ROLES.includes(userData.role)) {
          console.warn("User role not authorized for portal:", userData.role);
          logout();
        } else {
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } else {
        logout();
      }
    } catch (err) {
      console.error("Failed to verify user session:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCurrentUser(token);
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      // 1. Try real API backend first
      let data: any = null;
      try {
        const response = await fetch(`${Api_URL}/Auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          data = await response.json();
        }
      } catch (e) {
        // Backend not reachable, fall back to mock default credentials for Admin & HR
      }

      // 2. Default credentials fallback for Admin and HR
      if (!data) {
        const cleanEmail = email.trim().toLowerCase();
        if (cleanEmail === "admin@hrms.com" && password === "password123") {
          data = {
            access_token: "default-admin-jwt-token",
            email: "admin@hrms.com",
            role: "admin",
            emp_id: "ADM-001",
          };
        } else if (cleanEmail === "hr@hrms.com" && password === "password123") {
          data = {
            access_token: "default-hr-jwt-token",
            email: "hr@hrms.com",
            role: "hr",
            emp_id: "HR-001",
          };
        } else if (cleanEmail === "employee@hrms.com" || cleanEmail === "manager@hrms.com") {
          return {
            success: false,
            message: "Access Restricted: Only Admin and HR roles are permitted to access this portal.",
          };
        } else {
          return {
            success: false,
            message: "Invalid email or password. Default Admin: admin@hrms.com / password123",
          };
        }
      }

      const role = (data.role as Role) || "employee";

      // Enforce Admin and HR portal restriction
      if (!ALLOWED_PORTAL_ROLES.includes(role)) {
        return {
          success: false,
          message: "Access Denied: Only Admin and HR accounts are authorized to log into this portal.",
        };
      }

      const accessToken = data.access_token;
      const loggedUser: User = {
        email: data.email,
        role: role,
        emp_id: data.emp_id,
      };

      setToken(accessToken);
      setUser(loggedUser);
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(loggedUser));

      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || "Failed to connect to authentication server" };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const hasRole = (allowedRoles: Role[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  const canAccessModule = (moduleKey: string): boolean => {
    if (!user) return false;
    if (!ALLOWED_PORTAL_ROLES.includes(user.role)) return false;
    const allowed = MODULE_PERMISSIONS[moduleKey];
    if (!allowed) return true;
    return allowed.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        hasRole,
        canAccessModule,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
