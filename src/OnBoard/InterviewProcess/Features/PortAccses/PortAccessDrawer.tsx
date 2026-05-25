import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Key,
  Loader2,
  Shield,
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
  Download,
  ShieldAlert,
  EyeOff,
  Eye,
  Trash2,
} from "lucide-react";
import { BulkSuccessTable } from "./BulkSuccessTable";
import { getUserTheme } from "../../../../Components/Common/UserAvatar";

interface PortAccessDrawerProps {
  isOpen: boolean;
  mode: "single" | "bulk" | "revoke" | null;
  employee: any | null;
  stats: { total: number; active: number; missing: number; health: number };
  onClose: () => void;
  // Single mode props
  portalEmail: string;
  setPortalEmail: (val: string) => void;
  portalRole: string;
  setPortalRole: (val: string) => void;
  portalPassword: string;
  setPortalPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  singleSuccess: boolean;
  generatedCreds: any | null;
  submitting: boolean;
  copiedSingle: boolean;
  onSingleSubmit: (e: React.FormEvent) => void;
  onGeneratePassword: () => void;
  onCopySingle: (text: string) => void;
  // Bulk mode props
  bulkState: "idle" | "running" | "completed";
  bulkProgress: { current: number; total: number; empName: string } | null;
  bulkSuccessSheet: any[];
  copiedIndex: number | null;
  onBulkGenerate: () => void;
  onDownloadCSV: () => void;
  onCopyBulk: (text: string, index: number) => void;
  // Revoke mode props
  onRevokeConfirm: () => void;
}

export const PortAccessDrawer = ({
  isOpen,
  mode,
  employee,
  stats,
  onClose,
  portalEmail,
  setPortalEmail,
  portalRole,
  setPortalRole,
  portalPassword,
  setPortalPassword,
  showPassword,
  setShowPassword,
  singleSuccess,
  generatedCreds,
  submitting,
  copiedSingle,
  onSingleSubmit,
  onGeneratePassword,
  onCopySingle,
  bulkState,
  bulkProgress,
  bulkSuccessSheet,
  copiedIndex,
  onBulkGenerate,
  onDownloadCSV,
  onCopyBulk,
  onRevokeConfirm,
}: PortAccessDrawerProps) => {
  if (!isOpen || !mode) return null;

  const initials = employee?.name
    ? employee.name
        .split(" ")
        .slice(0, 2)
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
    : "";

  const theme = getUserTheme(employee?.name || "");

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        {/* Drawer */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="relative w-full max-w-[440px] h-[calc(100vh-32px)] bg-white rounded-[24px] flex flex-col overflow-hidden shadow-2xl font-sans"
        >
          {/* Header */}
          <div className={`p-6 pb-5 border-b border-slate-100 ${employee ? theme.bg : "bg-slate-800"} text-white relative shadow-lg`}>
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer text-white/80 transition-all hover:bg-white/20"
            >
              <X size={15} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 text-white rounded-xl flex items-center justify-center border border-white/10">
                {mode === "single" && <Key size={20} />}
                {mode === "bulk" && <Shield size={20} />}
                {mode === "revoke" && <ShieldAlert size={20} className="text-white" />}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white leading-tight">
                  {mode === "single" && "Portal Access Setup"}
                  {mode === "bulk" && "Bulk Access Keys"}
                  {mode === "revoke" && "Revoke Portal Access"}
                </h3>
                <p className="text-xs text-white/70">
                  {mode === "single" && "Configure login key for candidate"}
                  {mode === "bulk" && "Generate keys for all missing accounts"}
                  {mode === "revoke" && "Deactivate credentials immediately"}
                </p>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-5">
            {mode === "single" && employee && (
              <>
                {!singleSuccess ? (
                  <>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-black text-slate-500 border border-slate-300">
                          {initials}
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-800">{employee.name}</h4>
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
                            {employee.Emp_id} • {employee.Department || "No Dept"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={onSingleSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">
                          Portal Login Email
                        </label>
                        <input
                          type="email"
                          required
                          value={portalEmail}
                          onChange={(e) => setPortalEmail(e.target.value)}
                          className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-primary/40 focus:bg-white transition-all"
                          placeholder="john.doe@company.com"
                        />
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
                            onClick={onGeneratePassword}
                            className="text-[9px] font-black text-primary uppercase tracking-wider hover:underline cursor-pointer"
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
                            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full h-11 mt-4 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer"
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
                      Portal login has been successfully created. Copy credentials below to share with{" "}
                      <strong>{generatedCreds.name}</strong>.
                    </p>

                    <div className="mt-6 space-y-3 text-left bg-slate-50 p-4 border border-slate-100 rounded-2xl">
                      <div>
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                          Portal Login Email
                        </label>
                        <div className="text-xs font-bold text-slate-700 mt-0.5">{generatedCreds.email}</div>
                      </div>
                      <div>
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                          Access Key (Password)
                        </label>
                        <div className="flex items-center justify-between bg-white border border-slate-100 rounded-lg p-2 mt-1">
                          <span className="text-xs font-black tracking-wider text-slate-800">
                            {generatedCreds.password}
                          </span>
                          <button
                            onClick={() => onCopySingle(generatedCreds.password)}
                            className={`p-1.5 rounded transition-all active:scale-95 cursor-pointer ${
                              copiedSingle
                                ? "bg-emerald-50 text-emerald-500"
                                : "hover:bg-slate-50 text-slate-400"
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
                      onClick={onClose}
                      className="w-full h-11 mt-6 bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
                    >
                      Close & Done
                    </button>
                  </div>
                )}
              </>
            )}

            {mode === "bulk" && (
              <>
                {bulkState === "idle" && (
                  <div className="py-4 text-center">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-100">
                      <Key size={26} />
                    </div>
                    <h3 className="text-base font-extrabold text-slate-800">Bulk Generate Portal Keys</h3>
                    <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                      This utility scans the catalog and generates strong secure key credentials for all{" "}
                      <strong>{stats.missing} employees</strong> currently lacking access.
                    </p>

                    <div className="mt-8 flex gap-4 max-w-sm mx-auto">
                      <button
                        onClick={onClose}
                        className="flex-1 h-11 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={onBulkGenerate}
                        className="flex-1 h-11 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20 cursor-pointer"
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
                    <div className="w-full max-w-md bg-slate-100 h-2 rounded-full overflow-hidden mx-auto mt-6 border border-slate-55">
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
                  <div className="space-y-4">
                    <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center border border-emerald-100">
                          <CheckCircle2 size={20} />
                        </div>
                        <div>
                          <h3 className="text-sm font-extrabold text-slate-800 leading-tight">
                            Bulk Provisioning Complete!
                          </h3>
                          <p className="text-[11px] font-medium text-slate-400">
                            Generated keys for {bulkSuccessSheet.length} employee accounts.
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={onDownloadCSV}
                      className="flex items-center justify-center gap-1.5 w-full h-11 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
                    >
                      <Download size={14} /> Download Key Sheet (CSV)
                    </button>

                    {/* Table sheet of generated credentials */}
                    <BulkSuccessTable
                      bulkSuccessSheet={bulkSuccessSheet}
                      copiedIndex={copiedIndex}
                      onCopy={onCopyBulk}
                    />

                    <div className="bg-orange-50 border border-orange-100 p-3.5 rounded-2xl flex items-start gap-2.5 text-orange-700">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <p className="text-[11px] font-bold leading-normal">
                        Important: Security credentials can only be exported at this moment. Download the CSV sheet or
                        copy details now. They will not be visible again in plain text!
                      </p>
                    </div>

                    <button
                      onClick={onClose}
                      className="w-full h-11 bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
                    >
                      Close & Done
                    </button>
                  </div>
                )}
              </>
            )}

            {mode === "revoke" && employee && (
              <div className="py-4 text-center">
                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
                  <ShieldAlert size={24} />
                </div>

                <h3 className="text-base font-extrabold text-slate-800">Revoke Portal Access?</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Are you sure you want to deactivate and revoke web portal access credentials for{" "}
                  <strong>{employee.name}</strong> ({employee.Emp_id})? This will immediately terminate their ability to
                  log in.
                </p>

                <div className="mt-8 flex flex-col gap-3">
                  <button
                    onClick={onRevokeConfirm}
                    disabled={submitting}
                    className="w-full h-11 bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-rose-500/10 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {submitting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                    Confirm Deactivate
                  </button>
                  <button
                    onClick={onClose}
                    disabled={submitting}
                    className="w-full h-11 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Keep Access
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
