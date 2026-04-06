import { useState, useEffect, useRef } from "react";
import { FaMoneyBill } from "react-icons/fa";
import { FormFiled } from "../../../../Components/Common/FormFiled";
import { Selection } from "../../../../Components/Common/Selection";
import TailwindToggle from "../../../../Components/Common/Toggle";

// ── NEW: accepts initialData ──────────────────────────────────────────────────
type SalaryProps = {
  empId?: string;
  initialData?: any;
  setSalaryData?: (data: any) => void;
  ClicktoAction?: () => void;
};

interface PayrollData {
  provider: string; payType: string; currency: string; payFrequency: string;
  annualSalary: number; bonus_Type: string; bonus_CalculationMode: "percentage" | "fixed"; bonus_Value: number;
}

const DEFAULT_SALARY: PayrollData = {
  provider: "", payType: "", currency: "", payFrequency: "",
  annualSalary: 0, bonus_Type: "", bonus_CalculationMode: "percentage", bonus_Value: 0,
};

const CURRENCY_SYMBOL: Record<string, string> = {
  USD: "$", EUR: "€", GBP: "£", INR: "₹", AUD: "A$", CAD: "C$", JPY: "¥", CNY: "¥", SGD: "S$",
};

const AnimSection = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const [v, setV] = useState(false);
  useEffect(() => { const t = setTimeout(() => setV(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{
      opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(18px)",
      transition: "opacity 0.45s ease, transform 0.45s cubic-bezier(0.4,0,0.2,1)",
    }}>{children}</div>
  );
};

export const Salary = ({ setSalaryData, ClicktoAction, initialData }: SalaryProps) => {
  const [B_togg, setB_togg] = useState(() => !!initialData?.bonus_Value);
  const bonusRef = useRef<HTMLDivElement>(null);
  const [bonusHeight, setBonusHeight] = useState(0);

  // ── Seed from initialData on mount / back-navigation ─────────────────────
  const [salaryData, setLocalSalaryData] = useState<PayrollData>(() => initialData ?? DEFAULT_SALARY);

  useEffect(() => {
    if (initialData) {
      setLocalSalaryData(initialData);
      setB_togg(!!initialData.bonus_Value);
    }
  }, [initialData]);

  useEffect(() => {
    const el = bonusRef.current;
    if (!el) return;
    if (B_togg) {
      el.style.visibility = "hidden";
      el.style.height = "auto";
      const h = el.scrollHeight;
      el.style.visibility = "";
      el.style.height = "0px";
      requestAnimationFrame(() => setBonusHeight(h));
    } else {
      setBonusHeight(0);
    }
  }, [B_togg]);

  const currSymbol = CURRENCY_SYMBOL[salaryData.currency] ?? "$";

  const ProviderList = [
    { value: "adp", label: "ADP" }, { value: "gusto", label: "Gusto" },
    { value: "paychex", label: "Paychex" }, { value: "rippling", label: "Rippling" },
    { value: "quickbooks", label: "QuickBooks Payroll" }, { value: "bamboohr", label: "BambooHR" },
    { value: "workday", label: "Workday" }, { value: "manual", label: "Manual / In-house" },
  ];
  const PayTypeList = [{ value: "Salary", label: "Salary" }, { value: "Stipend", label: "Stipend" }];
  const CurrencyList = [
    { value: "USD", label: "USD - US Dollar" }, { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" }, { value: "INR", label: "INR - Indian Rupee" },
    { value: "AUD", label: "AUD - Australian Dollar" }, { value: "CAD", label: "CAD - Canadian Dollar" },
    { value: "JPY", label: "JPY - Japanese Yen" }, { value: "CNY", label: "CNY - Chinese Yuan" },
    { value: "SGD", label: "SGD - Singapore Dollar" },
  ];
  const bonusTypes = [
    { value: "performance", label: "Performance Bonus" }, { value: "signing", label: "Signing Bonus" },
    { value: "retention", label: "Retention Bonus" }, { value: "annual", label: "Annual / Year-End Bonus" },
    { value: "spot", label: "Spot Bonus" }, { value: "referral", label: "Referral Bonus" },
    { value: "project", label: "Project Completion Bonus" }, { value: "profit", label: "Profit Sharing" },
  ];
  const frequencies = [
    { value: "annual", label: "Annual" }, { value: "monthly", label: "Monthly" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: any } }
  ) => {
    const { name, value } = e.target;
    setLocalSalaryData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateBonusDisplay = () => {
    const salary = Number(salaryData.annualSalary) || 0;
    const bonusVal = Number(salaryData.bonus_Value) || 0;
    return salaryData.bonus_CalculationMode === "percentage"
      ? (salary * (bonusVal / 100)).toLocaleString()
      : bonusVal.toLocaleString();
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setSalaryData?.(salaryData); ClicktoAction?.();
  };



  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        .sal-page { font-family: 'DM Sans', sans-serif; padding: 24px; }
        .sal-heading { font-size: 28px; font-weight: 700; color: #0f172a; }
        .sal-section-head {
          font-size: 15px; font-weight: 600; color: #4f46e5;
          margin-bottom: 18px; padding-bottom: 10px; border-bottom: 1.5px solid #e2e8f0;
        }
        .sal-submit-btn {
          background: #6366f1; color: #fff; padding: 12px 40px;
          border-radius: 10px; font-size: 15px; font-weight: 600; border: none; cursor: pointer;
          box-shadow: 0 4px 14px rgba(99,102,241,0.35);
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .sal-submit-btn:hover  { background: #4f46e5; box-shadow: 0 6px 20px rgba(99,102,241,0.45); }
        .sal-submit-btn:active { transform: scale(0.97); }
        .sal-bonus-accordion {
          overflow: hidden;
          transition: height 0.38s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.32s ease;
        }
        .sal-bonus-inner { padding: 2px 0 8px; }
        .sal-mode-pill { display: flex; padding: 4px; background: #f1f5f9; border-radius: 10px; width: fit-content; }
        .sal-mode-btn {
          padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 500;
          border: none; cursor: pointer; transition: all 0.2s ease; color: #64748b; background: transparent;
        }
        .sal-mode-btn.active { background: #fff; color: #4f46e5; font-weight: 600; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
        .sal-preview {
          display: flex; align-items: center; gap: 12px;
          background: #fff; border: 1.5px solid #e2e8f0; border-radius: 14px;
          padding: 10px 18px; width: fit-content;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05); transition: all 0.25s ease;
        }
        .sal-preview:hover { border-color: #c7d2fe; box-shadow: 0 4px 16px rgba(99,102,241,0.1); }
        .sal-currency-badge {
          display: flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 8px;
          background: #eef2ff; color: #4f46e5; font-weight: 700; font-size: 16px;
        }
        .sal-bonus-input {
          width: 100%; padding: 11px 40px 11px 14px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; color: #0f172a;
          background: #fff; border: 1.5px solid #cbd5e1; border-radius: 10px;
          outline: none; transition: all 0.2s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .sal-bonus-input::placeholder { color: #94a3b8; }
        .sal-bonus-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3.5px rgba(99,102,241,0.15); }
        .sal-bonus-input:hover { border-color: #a5b4fc; }
        .sal-bonus-suffix {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          font-size: 13px; font-weight: 600; color: #64748b; pointer-events: none;
        }
        .sal-label {
          font-size: 12px; font-weight: 600; letter-spacing: 0.07em;
          text-transform: uppercase; color: #475569; margin-bottom: 7px;
        }
      `}</style>

      <div className="sal-page">
        <AnimSection delay={0}>
          <div className="flex items-center gap-3 mb-8">
            <FaMoneyBill className="text-[26px] text-indigo-500 shrink-0" />
            <h1 className="sal-heading">Payroll Add</h1>
          </div>
        </AnimSection>

        <form className="space-y-8" onSubmit={onSubmit}>
          <AnimSection delay={60}>
            <section>
              <div className="sal-section-head">Employee Basic Details</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Selection label="Payroll Provider" name="provider" value={salaryData.provider} options={ProviderList} onChange={handleChange} placeholder="Select Provider" />
                <Selection label="Type Of Pay" name="payType" value={salaryData.payType} options={PayTypeList} onChange={handleChange} placeholder="Type Of Pay" />
                <Selection label="Currency" name="currency" value={salaryData.currency} options={CurrencyList} onChange={handleChange} placeholder="Currency" />
                <Selection label="Pay Frequency" name="payFrequency" value={salaryData.payFrequency} options={frequencies} onChange={handleChange} placeholder="Pay Frequency" />
                <FormFiled Lable="Annual Salary" name="annualSalary" value={salaryData.annualSalary} in_PlaceHolder="Enter Salary" onChange={handleChange} icon={currSymbol} />
              </div>
            </section>
          </AnimSection>

          <AnimSection delay={120}>
            <TailwindToggle label="Bonus Eligible" initialState={B_togg} onToggle={() => setB_togg(b => !b)} />
          </AnimSection>

          <div
            className="sal-bonus-accordion"
            style={{ height: bonusHeight, opacity: B_togg ? 1 : 0, pointerEvents: B_togg ? "auto" : "none" }}
          >
            <div ref={bonusRef} className="sal-bonus-inner">
              <div className="sal-section-head">Bonus Details</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Selection label="Bonus Type" name="bonus_Type" value={salaryData.bonus_Type} options={bonusTypes} onChange={handleChange} placeholder="Select Bonus Type" />
                <div>
                  <div className="sal-label">Calculation Method</div>
                  <div className="sal-mode-pill">
                    <button type="button"
                      className={`sal-mode-btn ${salaryData.bonus_CalculationMode === "percentage" ? "active" : ""}`}
                      onClick={() => handleChange({ target: { name: "bonus_CalculationMode", value: "percentage" } })}>
                      % of Salary
                    </button>
                    <button type="button"
                      className={`sal-mode-btn ${salaryData.bonus_CalculationMode === "fixed" ? "active" : ""}`}
                      onClick={() => handleChange({ target: { name: "bonus_CalculationMode", value: "fixed" } })}>
                      Fixed Amount
                    </button>
                  </div>
                </div>
                <div>
                  <div className="sal-label">
                    {salaryData.bonus_CalculationMode === "percentage" ? "Bonus Percentage" : "Bonus Amount"}
                  </div>
                  <div className="relative">
                    <input
                      name="bonus_Value"
                      value={salaryData.bonus_Value}
                      onChange={handleChange}
                      className="sal-bonus-input"
                      placeholder={salaryData.bonus_CalculationMode === "percentage" ? "e.g. 10" : "e.g. 5000"}
                    />
                    <span className="sal-bonus-suffix">
                      {salaryData.bonus_CalculationMode === "percentage" ? "%" : currSymbol}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <AnimSection delay={180}>
            <div className="sal-preview">
              <div className="sal-currency-badge">{currSymbol}</div>
              <div className="flex items-center gap-3 text-sm font-medium flex-wrap">
                <span style={{ color: "#d97706", fontWeight: 700 }}>
                  {currSymbol} {salaryData.annualSalary || "0"}
                  {salaryData.payType && (
                    <span style={{ color: "#94a3b8", fontWeight: 400 }}> / {salaryData.payType}</span>
                  )}
                </span>
                {salaryData.payFrequency && (
                  <><span style={{ color: "#cbd5e1" }}>•</span>
                  <span style={{ color: "#5b9deb" }}>{salaryData.payFrequency}: </span>
                  <span className="text-[#02eb5b]">
                    {salaryData.payFrequency === 'annual' 
                  ? salaryData.annualSalary 
                  : (salaryData.annualSalary/12).toFixed(2)} 
                  </span>
                  
                   <span style={{ color: "#64748b" }} >{salaryData.currency}</span>
                   </>
                )}
                {salaryData.provider && (
                  <><span style={{ color: "#cbd5e1" }}>•</span>
                  <span style={{ color: "#6366f1", textTransform: "uppercase" as const }}>{salaryData.provider}</span></>
                )}
                {salaryData.currency && (
                  <><span style={{ color: "#cbd5e1" }}>•</span>
                  <span style={{ color: "#64748b" }}>Net: <span style={{ color: "#16a34a", fontWeight: 700 }}>{ (Number(salaryData.annualSalary) + (Number(salaryData.annualSalary) * 0.12)  ).toLocaleString('en-IN') }</span> {salaryData.currency}</span></>
                )}
                {B_togg && salaryData.bonus_Value > 0 && (
                  <><span style={{ color: "#cbd5e1" }}>•</span>
                  <span style={{ color: "#16a34a", fontWeight: 700 }}>
                    +{currSymbol}{calculateBonusDisplay()}{" "}
                    <span style={{ color: "#94a3b8", fontSize: "11px", fontWeight: 400 }}>Bonus</span>
                  </span></>
                )}
              </div>
            </div>
          </AnimSection>

          <AnimSection delay={240}>
            <button type="submit" className="sal-submit-btn">Next</button>
          </AnimSection>
        </form>
      </div>
    </>
  );
};