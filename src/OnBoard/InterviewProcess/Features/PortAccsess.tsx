import { useState, useEffect, useMemo } from "react";
import {
  LockKeyhole,
  Key,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  Shield,
} from "lucide-react";
import { pageTheme } from "../../../Themes/PageThems/pageConfig";
import { Api_URL } from "../../../APILINK";
import { PortAccsesTable } from "./PortAccses/PortAccsesTable";
import { PortAccessDrawer } from "./PortAccses/PortAccessDrawer";
import SearchBar from "../../../Components/Common/Searchbar";
import StatCard from "../../../Components/Common/StatCard";

export const PortAccess = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDept, setSelectedDept] = useState<string>("");
  const [accessFilter, setAccessFilter] = useState<"all" | "missing" | "granted">("all");

  // Single employee generation modal state
  const [showSingleModal, setShowSingleModal] = useState<boolean>(false);
  const [selectedEmp, setSelectedEmp] = useState<any | null>(null);
  const [portalEmail, setPortalEmail] = useState<string>("");
  const [portalRole, setPortalRole] = useState<string>("employee");
  const [portalPassword, setPortalPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [singleSuccess, setSingleSuccess] = useState<boolean>(false);
  const [generatedCreds, setGeneratedCreds] = useState<any | null>(null);

  // Bulk generation state
  const [showBulkModal, setShowBulkModal] = useState<boolean>(false);
  const [bulkProgress, setBulkProgress] = useState<{ current: number; total: number; empName: string } | null>(null);
  const [bulkSuccessSheet, setBulkSuccessSheet] = useState<any[]>([]);
  const [bulkState, setBulkState] = useState<"idle" | "running" | "completed">("idle");

  // Revoke action confirmation
  const [showRevokeModal, setShowRevokeModal] = useState<boolean>(false);
  const [empToRevoke, setEmpToRevoke] = useState<any | null>(null);

  // Copy indicator
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedSingle, setCopiedSingle] = useState<boolean>(false);

  // Fetch employees portal status
  const fetchPortalStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${Api_URL}/Auth/employee-portal-status`);
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      } else {
        console.error("Failed to fetch employee portal status");
      }
    } catch (err) {
      console.error("Error fetching employee portal status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortalStatus();
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((e) => e.has_portal_access).length;
    const missing = employees.filter((e) => !e.has_portal_access).length;
    const health = total > 0 ? Math.round((active / total) * 100) : 0;
    return { total, active, missing, health };
  }, [employees]);

  // Unique departments for filter list
  const departments = useMemo(() => {
    return Array.from(new Set(employees.map((e) => e.Department).filter(Boolean)));
  }, [employees]);

  // Filter employees list
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        emp.name?.toLowerCase().includes(query) ||
        emp.Emp_id?.toLowerCase().includes(query) ||
        emp.email?.toLowerCase().includes(query);

      const matchesDept = !selectedDept || emp.Department === selectedDept;

      let matchesAccess = true;
      if (accessFilter === "missing") matchesAccess = !emp.has_portal_access;
      if (accessFilter === "granted") matchesAccess = emp.has_portal_access;

      return matchesSearch && matchesDept && matchesAccess;
    });
  }, [employees, searchQuery, selectedDept, accessFilter]);

  // Helper: Cryptographically secure/strong random key generator based on Name & DOB
  const generateStrongPassword = (name?: string, dob?: string) => {
    if (name) {
      // 1. Clean and extract name prefix
      const cleanName = name.replace(/[^a-zA-Z]/g, "");
      const namePart = cleanName ? cleanName.split(/\s+/)[0] : "User";
      const namePrefix = namePart.charAt(0).toUpperCase() + namePart.slice(1, 4).toLowerCase();

      // 2. Extract DOB suffix (DDMM)
      let dobSuffix = "";
      if (dob) {
        // e.g. YYYY-MM-DD
        const match = dob.match(/(\d{4})-(\d{2})-(\d{2})/);
        if (match) {
          dobSuffix = `${match[3]}${match[2]}`;
        } else {
          // e.g. DD-MM-YYYY
          const match2 = dob.match(/(\d{2})-(\d{2})-(\d{4})/);
          if (match2) {
            dobSuffix = `${match2[1]}${match2[2]}`;
          } else {
            const digits = dob.replace(/\D/g, "");
            if (digits.length >= 4) {
              dobSuffix = digits.slice(0, 4);
            }
          }
        }
      }

      if (!dobSuffix) {
        // Fallback: 4 random digits
        dobSuffix = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join("");
      }

      // 3. Random suffix satisfying password strength (1 uppercase, 1 digit, 1 special)
      const uppercase = "ABCDEFGHJKLMNOPQRSTUVWXYZ";
      const numbers = "23456789";
      const symbols = "!@#$%&*?";

      const randUpper = uppercase.charAt(Math.floor(Math.random() * uppercase.length));
      const randNum = numbers.charAt(Math.floor(Math.random() * numbers.length));
      const randSymbol = symbols.charAt(Math.floor(Math.random() * symbols.length));

      const suffixArr = [randUpper, randNum, randSymbol];
      // Shuffle suffix
      const shuffledSuffix = suffixArr.sort(() => 0.5 - Math.random()).join("");

      return `${namePrefix}${dobSuffix}@${shuffledSuffix}`;
    } else {
      // Fallback fully random
      const uppercase = "ABCDEFGHJKLMNOPQRSTUVWXYZ";
      const lowercase = "abcdefghijkmnopqrstuvwxyz";
      const numbers = "23456789";
      const symbols = "!@#$%&*?";
      const allChars = uppercase + lowercase + numbers + symbols;

      let password = "";
      password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
      password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
      password += numbers.charAt(Math.floor(Math.random() * numbers.length));
      password += symbols.charAt(Math.floor(Math.random() * symbols.length));

      for (let i = 0; i < 6; i++) {
        password += allChars.charAt(Math.floor(Math.random() * allChars.length));
      }

      return password.split("").sort(() => 0.5 - Math.random()).join("");
    }
  };

  // Open single credential generation modal
  const openSingleGen = (emp: any) => {
    setSelectedEmp(emp);
    setPortalEmail(emp.email || `${emp.name.toLowerCase().replace(/\s+/g, "")}@company.com`);
    setPortalRole("employee");
    setPortalPassword(generateStrongPassword(emp.name, emp.dob));
    setShowPassword(false);
    setSingleSuccess(false);
    setGeneratedCreds(null);
    setShowSingleModal(true);
  };

  // Handle single credential creation submission
  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portalEmail || !portalPassword) return;

    setSubmitting(true);
    try {
      const payload = {
        email: portalEmail,
        password: portalPassword,
        role: portalRole,
        emp_id: selectedEmp.Emp_id
      };

      const res = await fetch(`${Api_URL}/Auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setGeneratedCreds({
          name: selectedEmp.name,
          empId: selectedEmp.Emp_id,
          email: portalEmail,
          password: portalPassword,
          role: portalRole
        });
        setSingleSuccess(true);
        fetchPortalStatus();
      } else {
        const errorData = await res.json();
        alert(errorData.detail || "Failed to create portal access");
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  // Open revoke access modal
  const openRevokeModal = (emp: any) => {
    setEmpToRevoke(emp);
    setShowRevokeModal(true);
  };

  // Handle access revocation
  const handleRevokeConfirm = async () => {
    if (!empToRevoke) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${Api_URL}/Auth/revoke/${empToRevoke.Emp_id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setShowRevokeModal(false);
        setEmpToRevoke(null);
        fetchPortalStatus();
      } else {
        alert("Failed to revoke portal access credentials.");
      }
    } catch (err) {
      console.error(err);
      alert("Error revoking access.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle bulk credential generation
  const handleBulkGenerate = async () => {
    const missingAccessEmployees = employees.filter((e) => !e.has_portal_access);
    if (missingAccessEmployees.length === 0) {
      alert("All employees already have portal access credentials!");
      return;
    }

    setBulkState("running");
    setBulkSuccessSheet([]);
    const successItems = [];

    for (let i = 0; i < missingAccessEmployees.length; i++) {
      const emp = missingAccessEmployees[i];
      setBulkProgress({
        current: i + 1,
        total: missingAccessEmployees.length,
        empName: emp.name
      });

      const email = emp.email || `${emp.name.toLowerCase().replace(/\s+/g, "")}@company.com`;
      const password = generateStrongPassword(emp.name, emp.dob);
      const role = "employee";

      try {
        const res = await fetch(`${Api_URL}/Auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            role,
            emp_id: emp.Emp_id
          })
        });

        if (res.ok) {
          successItems.push({
            empId: emp.Emp_id,
            name: emp.name,
            email,
            password,
            role
          });
        }
      } catch (err) {
        console.error(`Failed to register bulk portal for ${emp.name}`, err);
      }
    }

    setBulkSuccessSheet(successItems);
    setBulkState("completed");
    fetchPortalStatus();
  };

  // Copy to clipboard helper
  const copyToClipboard = (text: string, isSingle: boolean = false, index: number | null = null) => {
    navigator.clipboard.writeText(text);
    if (isSingle) {
      setCopiedSingle(true);
      setTimeout(() => setCopiedSingle(false), 2000);
    } else if (index !== null) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  // Download key-sheet as CSV
  const downloadCSV = () => {
    const headers = ["Employee ID", "Employee Name", "Portal Login Email", "Portal Secure Key (Password)", "Role"];
    const rows = bulkSuccessSheet.map((item) => [
      item.empId,
      item.name,
      item.email,
      item.password,
      item.role
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map(val => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `portal_access_keys_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={pageTheme.layout.mainContainer}>
      {/* HEADER */}
      <div className={pageTheme.header.wrapper}>
        <div className="flex flex-col">
          <div className={pageTheme.header.pill}>
            <LockKeyhole size={12} />
            <span>Portal Access Control</span>
          </div>
          <h1 className={pageTheme.header.title}>Portal Access Management</h1>
          <p className={pageTheme.header.subtitle}>
            Monitor, generate, and revoke web portal access keys for company employees.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchPortalStatus()}
            className="flex items-center justify-center w-11 h-11 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all shadow-sm active:scale-95"
            title="Refresh List"
          >
            <RefreshCw size={16} className={loading ? "animate-spin text-primary" : ""} />
          </button>
          <button
            onClick={() => {
              setBulkState("idle");
              setShowBulkModal(true);
            }}
            className="flex items-center gap-2 h-11 px-6 bg-primary text-white rounded-xl text-sm font-bold hover:brightness-115 transition-all active:scale-95 shadow-lg shadow-primary/20"
          >
            <Key size={16} /> Bulk Generate Keys
          </button>
        </div>
      </div>

      {/* STATS PANEL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={Shield}
          label="Total Employees"
          value={stats.total}
          subText="Active records in corporate hub"
          iconBgClass="bg-blue-500/5 text-blue-500"
          iconColorClass="text-blue-500"
          valueColorClass="text-slate-800"
        />
        <StatCard
          icon={ShieldCheck}
          label="Portal Active Keys"
          value={stats.active}
          subText="Employees with portal access credentials"
          iconBgClass="bg-emerald-500/5 text-emerald-500"
          iconColorClass="text-emerald-500"
          valueColorClass="text-emerald-600"
        />
        <StatCard
          icon={ShieldAlert}
          label="Missing Portal Keys"
          value={stats.missing}
          subText="Employees who cannot log in currently"
          iconBgClass="bg-orange-500/5 text-orange-500"
          iconColorClass="text-orange-500"
          valueColorClass="text-orange-500"
        />
        <StatCard
          icon={LockKeyhole}
          label="Key Health Ratio"
          value={`${stats.health}%`}
          subText="Overall key coverage index"
          iconBgClass="bg-indigo-500/5 text-indigo-500"
          iconColorClass="text-indigo-500"
          valueColorClass="text-indigo-600"
        />
      </div>

      {/* FILTER PANEL */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm">
        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name, ID or email..."
          className="w-full md:w-80"
        />

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap justify-end">
          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-500 focus:outline-none focus:border-primary/40 cursor-pointer"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* Access Filter Tab Pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setAccessFilter("all")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                accessFilter === "all" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setAccessFilter("missing")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                accessFilter === "missing" ? "bg-white text-orange-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <ShieldAlert size={12} />
              Missing Key
            </button>
            <button
              onClick={() => setAccessFilter("granted")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                accessFilter === "granted" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <ShieldCheck size={12} />
              Granted
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className={pageTheme.section.card}>
        <div className={pageTheme.section.header}>
          <div className={pageTheme.section.title}>
            <span className={pageTheme.section.titleDot} />
            Employee Access Roster
          </div>
          <span className={pageTheme.section.countBadge}>
            {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? "s" : ""} found
          </span>
        </div>

        <PortAccsesTable
          employees={filteredEmployees}
          loading={loading}
          onRevoke={openRevokeModal}
          onGenerateKey={openSingleGen}
        />
      </div>


      <PortAccessDrawer
        isOpen={showSingleModal || showBulkModal || showRevokeModal}
        mode={showSingleModal ? "single" : showBulkModal ? "bulk" : showRevokeModal ? "revoke" : null}
        employee={showSingleModal ? selectedEmp : showRevokeModal ? empToRevoke : null}
        stats={stats}
        onClose={() => {
          setShowSingleModal(false);
          setShowBulkModal(false);
          setShowRevokeModal(false);
        }}
        portalEmail={portalEmail}
        setPortalEmail={setPortalEmail}
        portalRole={portalRole}
        setPortalRole={setPortalRole}
        portalPassword={portalPassword}
        setPortalPassword={setPortalPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        singleSuccess={singleSuccess}
        generatedCreds={generatedCreds}
        submitting={submitting}
        copiedSingle={copiedSingle}
        onSingleSubmit={handleSingleSubmit}
        onGeneratePassword={() => setPortalPassword(generateStrongPassword(selectedEmp?.name, selectedEmp?.dob))}
        onCopySingle={(text) => copyToClipboard(text, true)}
        bulkState={bulkState}
        bulkProgress={bulkProgress}
        bulkSuccessSheet={bulkSuccessSheet}
        copiedIndex={copiedIndex}
        onBulkGenerate={handleBulkGenerate}
        onDownloadCSV={downloadCSV}
        onCopyBulk={(text, idx) => copyToClipboard(text, false, idx)}
        onRevokeConfirm={handleRevokeConfirm}
      />
    </div>
  );
};
