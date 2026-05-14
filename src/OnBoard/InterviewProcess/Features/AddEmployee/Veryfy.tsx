import { useEffect, useState } from "react";
import { FaUser, FaMoneyBill, FaPiggyBank, FaCheckCircle, FaBriefcase, FaGraduationCap, FaUsers, FaShieldAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Api_URL } from "../../../../APILINK";

interface VerifyProps {
  employeeData: any;
  salaryData: any;
  bankData: any;
  insData: any;
  onFinalSubmit: () => void;
}

const AnimCard = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const [v, setV] = useState(false);
  useEffect(() => { const t = setTimeout(() => setV(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div
      className={className}
      style={{
        opacity: v ? 1 : 0,
        transform: v ? "translateY(0) scale(1)" : "translateY(20px) scale(0.98)",
        transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {children}
    </div>
  );
};




export const Verify = ({ employeeData, salaryData, bankData, insData, onFinalSubmit }: VerifyProps) => {
  



  const InfoRow = ({ label, value }: { label: string; value: any }) => (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.05)",
    }}>
      <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: 600, maxWidth: "60%", textAlign: "right" }}>
        {value || "N/A"}
      </span>
    </div>
  );

const [empId, setEmpId] = useState("");

useEffect(() => {
  const fetchEmpId = async () => {
    try {
      const res = await fetch(`${Api_URL}/employee/next-id`);
      const data = await res.json();
      console.log("FULL API RESPONSE:", data);
      setEmpId(data.next_id);
    } catch (err) {
      console.error("Failed to fetch Emp ID", err);
    }
  };

  fetchEmpId();
}, []);
console.log("Employee Data:", empId);
console.log("API URL:", `${Api_URL}/employee/next-id`);
  if (!employeeData || !salaryData || !bankData || !insData) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>⚠️</div>
        <p style={{ color: "#ef4444", fontWeight: 500 }}>Please complete all previous steps before reviewing.</p>
      </div>
    );
  }





console.log("Employee Data:", empId);
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .vfy-page { font-family: 'DM Sans', sans-serif; padding: 24px; }
        .vfy-heading { font-size: 28px; font-weight: 700; color: hsl(var(--text-hsl)); }
        .vfy-card {
          border-radius: 16px; padding: 24px; border: 1.5px solid;
          background: #fff; transition: box-shadow 0.25s ease; height: 100%;
        }
        .vfy-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.08); }
        .vfy-card-head {
          display: flex; align-items: center; gap: 8px; margin-bottom: 16px;
          font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
        }
        .vfy-section-title {
          font-size: 14px; font-weight: 700; color: hsl(var(--primary-hsl)); margin: 15px 0 10px 0;
          display: flex; align-items: center; gap: 6px;
        }
        .vfy-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 1024px) { .vfy-grid { grid-template-columns: 1fr 1fr; } .vfy-full { grid-column: span 2; } }
        .vfy-submit-btn {
          background: hsl(var(--primary-hsl)); color: #fff; padding: 14px 48px; border-radius: 12px;
          font-size: 16px; font-weight: 700; border: none; cursor: pointer;
          box-shadow: 0 4px 16px hsl(var(--primary-hsl) / 0.3); transition: all 0.2s;
        }
        .vfy-submit-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .vfy-badge { padding: 2px 8px; border-radius: 6px; background: #f1f5f9; font-size: 11px; }
      `}`</style>

      <div className="vfy-page h-full overflow-auto">
        <AnimCard delay={0}>
          <div className="flex items-center gap-3 mb-8">
            <FaCheckCircle className="text-[26px] text-primary" />
            <h1 className="vfy-heading">Final Review</h1>
          </div>
        </AnimCard>

        <div className="vfy-grid">
          
          {/* 1. PRIMARY DETAILS & ADDRESS */}
          <AnimCard delay={100}>
            <div className="vfy-card" style={{ borderColor: "hsl(var(--primary-hsl) / 0.2)", background: "hsl(var(--primary-hsl) / 0.02)" }}>
              <div className="vfy-card-head" style={{ color: "hsl(var(--primary-hsl))" }}><FaUser /> Primary Profile</div>
              <InfoRow label="Full Name" value={employeeData.name} />
              <InfoRow label="Employee ID" value={empId || "Generating..."} />
              <InfoRow label="DOB" value={employeeData.dob} />
              <InfoRow label="Gender" value={employeeData.gender} />
              <InfoRow label="Email" value={employeeData.email} />
              <InfoRow label="Phone" value={employeeData.phone} />
              
              <div className="vfy-section-title"><FaMapMarkerAlt size={12}/> Address</div>
              <InfoRow label="Current" value={`${employeeData.Street}, ${employeeData.City}, ${employeeData.State} - ${employeeData.Pin_Code}`} />
              <InfoRow label="Permanent" value={`${employeeData.p_Street}, ${employeeData.p_City}, ${employeeData.p_State} - ${employeeData.p_Pin_Code}`} />
            </div>
          </AnimCard>

          {/* 2. JOB & PAYROLL */}
          <AnimCard delay={200}>
            <div className="vfy-card" style={{ borderColor: "hsl(var(--primary-hsl) / 0.2)", background: "hsl(var(--primary-hsl) / 0.05)" }}>
              <div className="vfy-card-head" style={{ color: "hsl(var(--primary-hsl))" }}><FaBriefcase /> Job & Payroll</div>
              <InfoRow label="Department" value={employeeData.Department} />
              <InfoRow label="Designation" value={employeeData.designation} />
              <InfoRow label="Joining Date" value={employeeData.DateOfJoining} />
              <InfoRow label="Employment" value={employeeData.emp_type} />
              
              <div className="vfy-section-title"><FaMoneyBill size={12}/> Salary Breakdown</div>
              <InfoRow label="Provider" value={salaryData.provider} />
              <InfoRow label="Annual Gross" value={`${salaryData.currency} ${Number(salaryData.annualSalary).toLocaleString()}`} />
              <InfoRow label="Pay Type" value={salaryData.payType} />
              {salaryData.bonus_Value > 0 && (
                <InfoRow label="Bonus" value={salaryData.bonus_CalculationMode === 'percentage' ? `${salaryData.bonus_Value}%` : `${salaryData.currency} ${salaryData.bonus_Value}`} />
              )}
            </div>
          </AnimCard>

          {/* 3. EDUCATION & EXPERIENCE */}
          <AnimCard delay={300} className="vfy-full">
            <div className="vfy-card" style={{ borderColor: "#e2e8f0" }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="vfy-card-head" style={{ color: "#64748b" }}><FaGraduationCap /> Education History</div>
                  {employeeData.education?.map((edu: any, i: number) => (
                    <div key={i} className="mb-3 p-3 bg-slate-50 rounded-lg">
                      <div className="font-semibold text-sm">{edu.degree}</div>
                      <div className="text-xs text-slate-500">{edu.institution} • {edu.graduationYear}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="vfy-card-head" style={{ color: "#64748b" }}><FaBriefcase /> Work Experience</div>
                  {employeeData.WorkExp?.map((exp: any, i: number) => (
                    <div key={i} className="mb-3 p-3 bg-slate-50 rounded-lg">
                      <div className="font-semibold text-sm">{exp.position}</div>
                      <div className="text-xs text-slate-500">{exp.company_name}</div>
                      <div className="text-[10px] text-indigo-500">{exp.FromDate} to {exp.ToDate}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimCard>

          {/* 4. BANKING & STATUTORY */}
          <AnimCard delay={400}>
            <div className="vfy-card" style={{ borderColor: "hsl(var(--primary-hsl) / 0.2)", background: "hsl(var(--primary-hsl) / 0.02)" }}>
              <div className="vfy-card-head" style={{ color: "hsl(var(--primary-hsl))" }}><FaPiggyBank /> Banking & Tax</div>
              <InfoRow label="Bank Name" value={bankData.bankName} />
              <InfoRow label="IFSC Code" value={bankData.ifscCode} />
              <InfoRow label="Account Number" value="•••• •••• ••••" />
              <InfoRow label="PAN Number" value={bankData.panNumber} />
              
              <div className="vfy-section-title"><FaShieldAlt size={12}/> Statutory (PF/ESI)</div>
              <InfoRow label="UAN Number" value={insData.uan_number} />
              <InfoRow label="PF ID" value={insData.pf_id} />
              <InfoRow label="ESI Number" value={insData.esi_no} />
              <InfoRow label="Aadhar" value={insData.aadhar_no} />
            </div>
          </AnimCard>

          {/* 5. FAMILY & NOMINEES */}
          <AnimCard delay={500}>
            <div className="vfy-card" style={{ borderColor: "#cbd5e1" }}>
              <div className="vfy-card-head" style={{ color: "#475569" }}><FaUsers /> Family & Nominees</div>
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Dependents</span>
                  {employeeData.Familys?.map((f: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm py-1 border-b border-dashed">
                      <span>{f.person_name} <span className="text-xs text-slate-400">({f.relationship_type})</span></span>
                      <span className="text-slate-500">{f.contact}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Insurance Nominees</span>
                  {insData.Nominee?.map((n: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm py-1 border-b border-dashed">
                      <span>{n.nominee_name}</span>
                      <span className="text-xs font-mono">{n.nominee_aadhar}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimCard>

        </div>

        <AnimCard delay={600}>
          <div className="vfy-footer mt-10 pt-8 border-t flex flex-col items-center gap-4">
            <p className="vfy-confirm-note text-slate-400 italic text-sm text-center">
              Please double-check all information. Once submitted, some details may require admin approval to change.
            </p>
            <button className="vfy-submit-btn" onClick={onFinalSubmit}>
              Confirm & Create Employee Profile
            </button>
          </div>
        </AnimCard>
      </div>
    </>
  );
};