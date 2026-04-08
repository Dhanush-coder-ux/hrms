import { useEffect, useState } from "react";
import { FaUser, FaMoneyBill, FaPiggyBank, FaCheckCircle } from "react-icons/fa";

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

export const Verify = ({ 
  employeeData, 
  salaryData, 
  bankData, 
  insData, // <--- Destructure it here
  onFinalSubmit 
}: VerifyProps) => {
  const InfoRow = ({ label, value }: { label: string; value: any }) => (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.05)",
    }}>
      <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: 600, maxWidth: "60%", textAlign: "right" }}>{value || "N/A"}</span>
    </div>
  );

  if (!employeeData || !salaryData || !bankData) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>⚠️</div>
        <p style={{ color: "#ef4444", fontWeight: 500 }}>Please complete all previous steps before reviewing.</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .vfy-page { font-family: 'DM Sans', sans-serif; padding: 24px; }
        .vfy-heading { font-size: 28px; font-weight: 700; color: #0f172a; }

        .vfy-card {
          border-radius: 16px; padding: 24px; border: 1.5px solid;
          transition: box-shadow 0.25s ease, transform 0.25s ease;
          height: 100%;
        }
        .vfy-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.08); transform: translateY(-2px); }

        .vfy-card-emp   { background: #f8faff; border-color: #c7d2fe; }
        .vfy-card-sal   { background: #fffbeb; border-color: #fcd34d; }
        .vfy-card-bank  { background: #faf5ff; border-color: #d8b4fe; }

        .vfy-card-head {
          display: flex; align-items: center; gap: 8px; margin-bottom: 16px;
          font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
        }

        .vfy-submit-btn {
          background: #16a34a; color: #fff;
          padding: 14px 48px; border-radius: 12px; font-size: 16px; font-weight: 700;
          border: none; cursor: pointer;
          box-shadow: 0 4px 16px rgba(22,163,74,0.3);
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .vfy-submit-btn:hover { background: #15803d; box-shadow: 0 6px 24px rgba(22,163,74,0.4); }
        .vfy-submit-btn:active { transform: scale(0.97); }

        .vfy-footer {
          display: flex; flex-direction: column; align-items: center; gap: 12px;
          margin-top: 40px; padding-top: 32px; border-top: 1.5px solid #e2e8f0;
        }
        .vfy-confirm-note { font-size: 13px; color: #94a3b8; font-style: italic; text-align: center; }

        .vfy-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 1024px) {
          .vfy-grid {
            grid-template-columns: 1fr 1fr;
          }
          .vfy-col-span-2 {
            grid-column: span 2;
          }
        }
      `}</style>

      <div className="vfy-page">
        <AnimCard delay={0}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
            <FaCheckCircle style={{ fontSize: "26px", color: "#16a34a", flexShrink: 0 }} />
            <h1 className="vfy-heading">Review Information</h1>
          </div>
        </AnimCard>

        <div className="vfy-grid">
          {/* Employee */}
          <AnimCard delay={80}>
            <div className="vfy-card vfy-card-emp">
              <div className="vfy-card-head" style={{ color: "#4338ca" }}>
                <FaUser /> Employee Details
              </div>
              <InfoRow label="Full Name"    value={employeeData.name} />
              <InfoRow label="Employee ID"  value={employeeData.Emp_id} />
              <InfoRow label="Department"   value={employeeData.Department} />
              <InfoRow label="Designation"  value={employeeData.designation} />
              <InfoRow label="Email"        value={employeeData.email} />
            </div>
          </AnimCard>

          {/* Salary */}
          <AnimCard delay={160}>
            <div className="vfy-card vfy-card-sal">
              <div className="vfy-card-head" style={{ color: "#b45309" }}>
                <FaMoneyBill /> Payroll Details
              </div>
              <InfoRow label="Provider"      value={salaryData.provider} />
              <InfoRow label="Base Salary"   value={`${salaryData.currency} ${salaryData.annualSalary}`} />
              <InfoRow label="Pay Frequency" value={salaryData.payFrequency} />
              {salaryData.bonus_Value && (
                <InfoRow label="Bonus"
                  value={salaryData.bonus_CalculationMode === "percentage"
                    ? `${salaryData.bonus_Value}%`
                    : `${salaryData.currency} ${salaryData.bonus_Value}`} />
              )}
            </div>
          </AnimCard>

          <AnimCard delay={80}>
            <div className="vfy-card vfy-card-emp">
              <div className="vfy-card-head" style={{ color: "#4338ca" }}>
                <FaUser /> Employee Details
              </div>
              <InfoRow label="Full Name"    value={employeeData.name} />
              <InfoRow label="Employee ID"  value={employeeData.Emp_id} />
              <InfoRow label="Department"   value={employeeData.Department} />
              <InfoRow label="Designation"  value={employeeData.designation} />
              <InfoRow label="Email"        value={employeeData.email} />
            </div>
          </AnimCard>

          {/* Bank — full width via className on AnimCard */}
          <AnimCard delay={240} className="vfy-col-span-2">
            <div className="vfy-card vfy-card-bank">
              <div className="vfy-card-head" style={{ color: "#7c3aed" }}>
                <FaPiggyBank /> Banking &amp; Tax
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0 40px" }}>
                <InfoRow label="Bank Name"       value={bankData.bankName} />
                <InfoRow label="IFSC Code"        value={bankData.ifscCode} />
                <InfoRow label="Account Number"   value="**** **** ****" />
                <InfoRow label="PAN Number"       value={bankData.panNumber} />
              </div>
            </div>
          </AnimCard>
        </div>

        <AnimCard delay={340}>
          <div className="vfy-footer">
            <p className="vfy-confirm-note">
              By clicking submit, you confirm that all the information provided above is accurate.
            </p>
            <button className="vfy-submit-btn" onClick={onFinalSubmit}>
              ✓ Confirm &amp; Submit Employee Profile
            </button>
          </div>
        </AnimCard>
      </div>
    </>
  );
};