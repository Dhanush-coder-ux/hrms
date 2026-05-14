import { useState, useEffect, useRef } from "react";
import { FaMoneyBill } from "react-icons/fa";
import { FormFiled } from "../../../../Components/Common/FormFiled";
import { Selection } from "../../../../Components/Common/Selection";
import TailwindToggle from "../../../../Components/Common/Toggle";
import type { PayrollData } from "../../../../Types/typesOnboarding";
import { useCurrencies } from "../../../../Hooks/CurrenciesSelect";
import { useListOptions } from "../../../../Hooks/ListOption";
import { useOptions, Stackvalues } from "../../../../Stacks";
import { Api_URL } from "../../../../APILINK";

type SalaryProps = {
  empId?: string;
  initialData?: any;
  setSalaryData?: (data: any) => void;
  ClicktoAction?: () => void;
};

const PayRollAPI_Url = `${Api_URL}/payroll/providers`;


export const DEFAULT_SALARY: PayrollData = {
  provider: "",
  payType: "",
  currency: "", // Will be populated by system default
  payFrequency: "",
  annualSalary: 0,
  bonus_Type: "",
  bonus_CalculationMode: "percentage",
  bonus_Value: 0,
};

// --- Animation Wrapper ---
const AnimSection = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const [v, setV] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setV(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      style={{
        opacity: v ? 1 : 0,
        transform: v ? "translateY(0)" : "translateY(18px)",
        transition: "opacity 0.45s ease, transform 0.45s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {children}
    </div>
  );
};

export const Salary = ({ setSalaryData, ClicktoAction, initialData }: SalaryProps) => {
  // 1. Fetch System Settings inside the component
  const systemDefaultOptions = useOptions(Stackvalues, "currency", "label", "value");
  const { currencyOptions, currencySymbolMap, currencyLoading } = useCurrencies();

  const [B_togg, setB_togg] = useState(() => !!initialData?.bonus_Value);
  const bonusRef = useRef<HTMLDivElement>(null);
  const [bonusHeight, setBonusHeight] = useState(0);

  // 2. Initialize state
  const [salaryData, setLocalSalaryData] = useState<PayrollData>(() => initialData ?? DEFAULT_SALARY);



  // 3. EFFECT: Set the default currency from system settings if no initialData exists
useEffect(() => {
  if (!initialData && systemDefaultOptions.length > 0) {
    setLocalSalaryData((prev) => ({
      ...prev,
      currency: prev.currency || systemDefaultOptions[0].value, // ✅ default from stack
    }));
  }
}, [systemDefaultOptions, initialData]);
  // Derive live currency symbol
  const currSymbol = currencySymbolMap[salaryData.currency] ?? "$";

  // Sync initialData on back-navigation
  useEffect(() => {
    if (initialData) {
      setLocalSalaryData(initialData);
      setB_togg(!!initialData.bonus_Value);
    }
  }, [initialData]);

  // Bonus accordion logic
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

  const ProviderList = useListOptions(PayRollAPI_Url);

const  frequencies = useOptions(Stackvalues, "payFrequency", "label", "value");
const PayTypeList = useOptions(Stackvalues, "payType", "label", "value");

  const bonusTypes = [
    { value: "performance", label: "Performance Bonus" },
    { value: "signing", label: "Signing Bonus" },
    { value: "annual", label: "Annual Bonus" },
  ];

  // const frequencies = [
  //   { value: "annual", label: "Annual" },
  //   { value: "monthly", label: "Monthly" },
  // ];

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
    e.preventDefault();
    setSalaryData?.(salaryData);
    ClicktoAction?.();
  };

  return (
    <>
      <style>{`
        .sal-page { font-family: 'DM Sans', sans-serif; padding: 24px; }
        .sal-heading { font-size: 28px; font-weight: 700; color: hsl(var(--text-hsl)); }
        .sal-section-head { font-size: 15px; font-weight: 600; color: hsl(var(--primary-hsl)); margin-bottom: 18px; padding-bottom: 10px; border-bottom: 1.5px solid #e2e8f0; }
        .sal-submit-btn { background: hsl(var(--primary-hsl)); color: #fff; padding: 12px 40px; border-radius: 10px; font-weight: 600; border: none; cursor: pointer; box-shadow: 0 4px 14px hsl(var(--primary-hsl) / 0.35); }
        .sal-submit-btn:hover { opacity: 0.9; box-shadow: 0 6px 20px hsl(var(--primary-hsl) / 0.45); }
        .sal-bonus-accordion { overflow: hidden; transition: height 0.38s ease, opacity 0.3s ease; }
        .sal-mode-pill { display: flex; padding: 4px; background: #f1f5f9; border-radius: 10px; width: fit-content; }
        .sal-mode-btn { padding: 8px 18px; border-radius: 8px; font-size: 13px; cursor: pointer; border: none; background: transparent; color: #64748b; transition: 0.2s; }
        .sal-mode-btn.active { background: #fff; color: hsl(var(--primary-hsl)); box-shadow: 0 1px 4px rgba(0,0,0,0.1); font-weight: 600; }
        .sal-preview { display: flex; align-items: center; gap: 12px; background: #fff; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 12px 18px; width: fit-content; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .sal-currency-badge { display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 8px; background: hsl(var(--primary-hsl) / 0.1); color: hsl(var(--primary-hsl)); font-weight: 700; }
        .sal-bonus-input { width: 100%; padding: 11px 40px 11px 14px; font-size: 14px; border: 1.5px solid #cbd5e1; border-radius: 10px; outline: none; transition: 0.2s; }
        .sal-bonus-input:focus { border-color: hsl(var(--primary-hsl)); box-shadow: 0 0 0 3.5px hsl(var(--primary-hsl) / 0.15); }
        .sal-label { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #475569; margin-bottom: 7px; }
      `}</style>

      <div className="sal-page min-h-full">
        <AnimSection delay={0}>
          <div className="flex items-center gap-3 mb-8">
            <FaMoneyBill className="text-[26px] text-primary" />
            <h1 className="sal-heading">Payroll Setup</h1>
          </div>
        </AnimSection>

        <form className="space-y-8" onSubmit={onSubmit}>
          <AnimSection delay={60}>
            <section>
              <div className="sal-section-head">Compensation Details</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Selection
                  label="Payroll Provider"
                  name="provider"
                  value={salaryData.provider}
                  options={ProviderList}
                  onChange={handleChange}
                  placeholder="Select Provider"
                />
                <Selection
                  label="Type Of Pay"
                  name="payType"
                  value={salaryData.payType}
                  options={PayTypeList}
                  onChange={handleChange}
                />
                <Selection
                  label={currencyLoading ? "Loading..." : "Currency"}
                  name="currency"
                  value={salaryData.currency}
                  options={currencyOptions}
                  onChange={handleChange}
                />
                <Selection
                  label="Pay Frequency"
                  name="payFrequency"
                  value={salaryData.payFrequency}
                  options={frequencies}
                  onChange={handleChange}
                />
                <FormFiled
                  Lable="Annual Salary"
                  name="annualSalary"
                  value={salaryData.annualSalary}
                  in_PlaceHolder="0.00"
                  onChange={handleChange}
                  icon={currSymbol}
                />
              </div>
            </section>
          </AnimSection>

          <AnimSection delay={120}>
            <TailwindToggle
              label="Bonus Eligible"
              initialState={B_togg}
              onToggle={() => setB_togg((b) => !b)}
            />
          </AnimSection>

          <div className="sal-bonus-accordion" style={{ height: bonusHeight, opacity: B_togg ? 1 : 0 }}>
            <div ref={bonusRef} className="pb-6">
              <div className="sal-section-head">Bonus Details</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Selection
                  label="Bonus Type"
                  name="bonus_Type"
                  value={salaryData.bonus_Type}
                  options={bonusTypes}
                  onChange={handleChange}
                />
                <div>
                  <div className="sal-label">Calculation Method</div>
                  <div className="sal-mode-pill">
                    <button
                      type="button"
                      className={`sal-mode-btn ${salaryData.bonus_CalculationMode === "percentage" ? "active" : ""}`}
                      onClick={() => handleChange({ target: { name: "bonus_CalculationMode", value: "percentage" } })}
                    >
                      % of Salary
                    </button>
                    <button
                      type="button"
                      className={`sal-mode-btn ${salaryData.bonus_CalculationMode === "fixed" ? "active" : ""}`}
                      onClick={() => handleChange({ target: { name: "bonus_CalculationMode", value: "fixed" } })}
                    >
                      Fixed
                    </button>
                  </div>
                </div>
                <div>
                  <div className="sal-label">Value</div>
                  <div className="relative">
                    <input
                      name="bonus_Value"
                      value={salaryData.bonus_Value}
                      onChange={handleChange}
                      className="sal-bonus-input"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
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
              <div className="flex gap-2 text-sm items-center">
                <span className="font-bold text-amber-600">
                  {currSymbol} {Number(salaryData.annualSalary).toLocaleString()}
                </span>
                {B_togg && Number(salaryData.bonus_Value) > 0 && (
                  <span className="text-green-600 font-bold">
                    + {currSymbol} {calculateBonusDisplay()} (Bonus)
                  </span>
                )}
              </div>
            </div>
          </AnimSection>

          <button type="submit" className="sal-submit-btn">Next Step</button>
        </form>
      </div>
    </>
  );
};