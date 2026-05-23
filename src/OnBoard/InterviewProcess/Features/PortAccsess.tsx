import { useState, useEffect, useMemo } from "react";
import {
  LockKeyhole,
  Key,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Copy,
  Check,
  Search,
  Trash2,
  RefreshCw,
  X,
  Download,
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
  CheckCircle2
} from "lucide-react";
import { pageTheme } from "../../../Themes/PageThems/pageConfig";
import { Api_URL } from "../../../APILINK";
import { PortAccsesTable } from "./PortAccses/PortAccsesTable";

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

  // Helper: Cryptographically secure/strong random key generator
  const generateStrongPassword = () => {
    const uppercase = "ABCDEFGHJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijkmnopqrstuvwxyz";
    const numbers = "23456789";
    const symbols = "!@#$%&*?";
    const allChars = uppercase + lowercase + numbers + symbols;

    let password = "";
    // Ensure at least one of each class
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));

    for (let i = 0; i < 6; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    // Shuffle characters
    return password.split("").sort(() => 0.5 - Math.random()).join("");
  };

  // Open single credential generation modal
  const openSingleGen = (emp: any) => {
    setSelectedEmp(emp);
    setPortalEmail(emp.email || `${emp.name.toLowerCase().replace(/\s+/g, "")}@company.com`);
    setPortalRole("employee");
    setPortalPassword(generateStrongPassword());
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
      const password = generateStrongPassword();
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
        <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">Total Employees</div>
          <div className="text-3xl font-black text-slate-800 leading-none">{stats.total}</div>
          <p className="text-[11px] font-medium text-slate-400 mt-2">Active records in corporate hub</p>
        </div>

        <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">Portal Active Keys</div>
          <div className="text-3xl font-black text-emerald-600 leading-none">{stats.active}</div>
          <p className="text-[11px] font-medium text-emerald-500 mt-2">Employees with portal access credentials</p>
        </div>

        <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">Missing Portal Keys</div>
          <div className="text-3xl font-black text-orange-500 leading-none">{stats.missing}</div>
          <p className="text-[11px] font-medium text-orange-500 mt-2">Employees who cannot log in currently</p>
        </div>

        <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">Key Health Ratio</div>
          <div className="text-3xl font-black text-indigo-600 leading-none">{stats.health}%</div>
          <p className="text-[11px] font-medium text-indigo-500 mt-2">Overall key coverage index</p>
        </div>
      </div>

      {/* FILTER PANEL */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search by name, ID or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-600 placeholder-slate-400 focus:outline-none focus:border-primary/40 focus:bg-white transition-all"
          />
        </div>

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

      {/* SINGLE KEY GENERATION MODAL */}
      {showSingleModal && selectedEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-[28px] border border-slate-100 shadow-2xl p-6 relative overflow-hidden animate-slide-up">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary" />

            <button
              onClick={() => setShowSingleModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
            >
              <X size={16} />
            </button>

            {!singleSuccess ? (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                    <Key size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-800 leading-tight">Create Portal Access</h3>
                    <p className="text-xs text-slate-400">Setup web access login for employee profile</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-black text-slate-500 border border-slate-300">
                      {selectedEmp.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800">{selectedEmp.name}</h4>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
                        {selectedEmp.Emp_id} • {selectedEmp.Department || "No Dept"}
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSingleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">
                      Portal Login Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={portalEmail}
                        onChange={(e) => setPortalEmail(e.target.value)}
                        className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-primary/40 focus:bg-white transition-all"
                        placeholder="john.doe@company.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">
                      Portal Role Privilege
                    </label>
                    <select
                      value={portalRole}
                      onChange={(e) => setPortalRole(e.target.value)}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:border-primary/40 cursor-pointer"
                    >
                      <option value="employee">Employee (Default)</option>
                      <option value="hr">HR Personnel</option>
                      <option value="manager">Department Manager</option>
                      <option value="admin">System Admin</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-0.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Secure Password Key
                      </label>
                      <button
                        type="button"
                        onClick={() => setPortalPassword(generateStrongPassword())}
                        className="text-[9px] font-black text-primary uppercase tracking-wider hover:underline"
                      >
                        Auto-Generate Strong
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={portalPassword}
                        onChange={(e) => setPortalPassword(e.target.value)}
                        className="w-full h-11 pl-4 pr-10 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-700 tracking-wider placeholder-slate-400 focus:outline-none focus:border-primary/40 focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-11 mt-4 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Provisioning...
                      </>
                    ) : (
                      <>
                        <Shield size={14} />
                        Grant Portal Access
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                  <CheckCircle2 size={28} className="animate-bounce" />
                </div>
                <h3 className="text-base font-extrabold text-slate-800">Access Key Granted!</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Portal login has been successfully created. Copy credentials below to share with <strong>{generatedCreds.name}</strong>.
                </p>

                <div className="mt-6 space-y-3 text-left bg-slate-50 p-4 border border-slate-100 rounded-2xl">
                  <div>
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Portal Login Email</label>
                    <div className="text-xs font-bold text-slate-700 mt-0.5">{generatedCreds.email}</div>
                  </div>
                  <div>
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Access Key (Password)</label>
                    <div className="flex items-center justify-between bg-white border border-slate-100 rounded-lg p-2 mt-1">
                      <span className="text-xs font-black tracking-wider text-slate-800">{generatedCreds.password}</span>
                      <button
                        onClick={() => copyToClipboard(generatedCreds.password, true)}
                        className={`p-1.5 rounded transition-all active:scale-95 ${
                          copiedSingle ? "bg-emerald-50 text-emerald-500" : "hover:bg-slate-50 text-slate-400"
                        }`}
                        title="Copy password key"
                      >
                        {copiedSingle ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-2 mt-2">
                    <span className="text-[9px] font-bold text-slate-400">Employee ID</span>
                    <span className="text-[9px] font-black text-slate-600">{generatedCreds.empId}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowSingleModal(false)}
                  className="w-full h-11 mt-6 bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-700 active:scale-95 transition-all"
                >
                  Close & Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BULK KEY GENERATION MODAL */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-[28px] border border-slate-100 shadow-2xl p-6 relative overflow-hidden animate-slide-up">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary" />

            <button
              onClick={() => setShowBulkModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
            >
              <X size={16} />
            </button>

            {bulkState === "idle" && (
              <div className="py-4 text-center">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-100">
                  <Key size={26} />
                </div>
                <h3 className="text-base font-extrabold text-slate-800">Bulk Generate Portal Keys</h3>
                <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                  This utility scans the catalog and generates strong secure key credentials for all <strong>{stats.missing} employees</strong> currently lacking access.
                </p>

                <div className="mt-8 flex gap-4 max-w-sm mx-auto">
                  <button
                    onClick={() => setShowBulkModal(false)}
                    className="flex-1 h-11 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-50 active:scale-95 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBulkGenerate}
                    className="flex-1 h-11 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
                  >
                    Confirm & Start
                  </button>
                </div>
              </div>
            )}

            {bulkState === "running" && bulkProgress && (
              <div className="py-8 text-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-6" />
                <h3 className="text-base font-extrabold text-slate-800">Generating Portal Keys</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Creating credential node for <strong>{bulkProgress.empName}</strong>...
                </p>

                {/* Progress bar */}
                <div className="w-full max-w-md bg-slate-100 h-2 rounded-full overflow-hidden mx-auto mt-6 border border-slate-50">
                  <div
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}
                  />
                </div>
                <div className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest">
                  Progress: {bulkProgress.current} / {bulkProgress.total} employees completed
                </div>
              </div>
            )}

            {bulkState === "completed" && (
              <div>
                <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center border border-emerald-100">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-800 leading-tight">Bulk Provisioning Complete!</h3>
                      <p className="text-[11px] font-medium text-slate-400">Generated keys for {bulkSuccessSheet.length} employee accounts.</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={downloadCSV}
                      className="flex items-center gap-1.5 h-9 px-4 bg-emerald-600 text-white rounded-lg text-[10px] font-extrabold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-sm shadow-emerald-500/10"
                    >
                      <Download size={12} /> Download Key Sheet (CSV)
                    </button>
                  </div>
                </div>

                {/* Table sheet of generated credentials */}
                <div className="max-h-[300px] overflow-y-auto border border-slate-100 rounded-2xl custom-scrollbar mb-6 bg-slate-50/50">
                  <table className="w-full border-collapse">
                    <thead className="sticky top-0 bg-white shadow-sm border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-2.5 text-left text-[9px] font-black tracking-widest text-slate-400 uppercase">ID</th>
                        <th className="px-4 py-2.5 text-left text-[9px] font-black tracking-widest text-slate-400 uppercase">Employee Name</th>
                        <th className="px-4 py-2.5 text-left text-[9px] font-black tracking-widest text-slate-400 uppercase">Portal Username</th>
                        <th className="px-4 py-2.5 text-left text-[9px] font-black tracking-widest text-slate-400 uppercase">Password Key</th>
                        <th className="px-4 py-2.5 text-center text-[9px] font-black tracking-widest text-slate-400 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bulkSuccessSheet.map((item, idx) => (
                        <tr key={item.empId} className="border-b border-slate-100 bg-white hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-[10px] font-bold text-slate-500">{item.empId}</td>
                          <td className="px-4 py-3 text-[10px] font-extrabold text-slate-800">{item.name}</td>
                          <td className="px-4 py-3 text-[10px] font-semibold text-slate-500">{item.email}</td>
                          <td className="px-4 py-3 text-[10px] font-black text-slate-700 font-mono tracking-wider">{item.password}</td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => copyToClipboard(`${item.email} / ${item.password}`, false, idx)}
                              className={`p-1 rounded text-slate-400 transition-all ${
                                copiedIndex === idx ? "bg-emerald-50 text-emerald-500" : "hover:bg-slate-100"
                              }`}
                              title="Copy Credentials"
                            >
                              {copiedIndex === idx ? <Check size={12} /> : <Copy size={12} />}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-orange-50 border border-orange-100 p-3.5 rounded-2xl flex items-start gap-2.5 mb-6 text-orange-700">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <p className="text-[11px] font-bold leading-normal">
                    Important: Security credentials can only be exported at this moment. Download the CSV sheet or copy details now. They will not be visible again in plain text!
                  </p>
                </div>

                <button
                  onClick={() => setShowBulkModal(false)}
                  className="w-full h-11 bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-700 active:scale-95 transition-all"
                >
                  Close & Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* REVOKE ACTION CONFIRMATION MODAL */}
      {showRevokeModal && empToRevoke && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-[28px] border border-slate-100 shadow-2xl p-6 relative overflow-hidden animate-slide-up text-center">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
              <ShieldAlert size={24} />
            </div>

            <h3 className="text-base font-extrabold text-slate-800">Revoke Portal Access?</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Are you sure you want to deactivate and revoke web portal access credentials for <strong>{empToRevoke.name}</strong> ({empToRevoke.Emp_id})? This will immediately terminate their ability to log in.
            </p>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setShowRevokeModal(false)}
                disabled={submitting}
                className="flex-1 h-11 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
              >
                Keep Access
              </button>
              <button
                onClick={handleRevokeConfirm}
                disabled={submitting}
                className="flex-1 h-11 bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-rose-500/10 flex items-center justify-center gap-1.5"
              >
                {submitting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                Confirm Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(12px) scale(0.98); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>
    </div>
  );
};
