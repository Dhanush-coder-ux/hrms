import { useState } from "react";
import { FaMoneyBill } from "react-icons/fa";
import { FormFiled } from "../../../Components/Common/FormFiled";
import { Selection } from "../../../Components/Common/Selection";
import TailwindToggle from "../../../Components/Common/Toggle";

type SalaryProps = {
  empId?: string;
  setSalaryData?: (data: any) => void;
  ClicktoAction?: () => void;
};

interface PayrollData {
  provider: string;
  payType: string;
  currency: string;
  payFrequency: string;
  annualSalary: number | string;
  bonus_Type: string;
  bonus_CalculationMode: "percentage" | "fixed";
  bonus_Value: number | string;
}

export const Salary = ({ setSalaryData, ClicktoAction }: SalaryProps) => {
  const [B_togg, setB_togg] = useState(false);

  const [salaryData, setLocalSalaryData] = useState<PayrollData>({
    provider: "",
    payType: "",
    currency: "",
    payFrequency: "",
    annualSalary: "",
    bonus_Type: "",
    bonus_CalculationMode: "percentage",
    bonus_Value: "",
  });

  const onB_Togg = () => setB_togg(!B_togg);

  const ProviderList = [
  { value: "adp", label: "ADP" },
  { value: "gusto", label: "Gusto" },
  { value: "paychex", label: "Paychex" },
  { value: "rippling", label: "Rippling" },
  { value: "quickbooks", label: "QuickBooks Payroll" },
  { value: "bamboohr", label: "BambooHR" },
  { value: "workday", label: "Workday" },
  { value: "manual", label: "Manual / In-house" },
];

const PayTypeList = [
  { value: "Salary", label: "Salary" },
  { value: "Stipend", label: "Stipend" },
];

const CurrencyList = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "INR", label: "INR - Indian Rupee" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "JPY", label: "JPY - Japanese Yen" },
  { value: "CNY", label: "CNY - Chinese Yuan" },
  { value: "SGD", label: "SGD - Singapore Dollar" },
];

const bonusTypes = [
  { value: "performance", label: "Performance Bonus" },
  { value: "signing", label: "Signing Bonus" },
  { value: "retention", label: "Retention Bonus" },
  { value: "annual", label: "Annual / Year-End Bonus" },
  { value: "spot", label: "Spot Bonus" },
  { value: "referral", label: "Referral Bonus" },
  { value: "project", label: "Project Completion Bonus" },
  { value: "profit", label: "Profit Sharing" },
];

const frequencies = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-Weekly" },
  { value: "semimonthly", label: "Semi-Monthly" },
  { value: "monthly", label: "Monthly" },
];

  // Helper to handle both standard inputs and custom button updates
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string, value: any } }) => {
    const { name, value } = e.target;
    setLocalSalaryData((prev) => ({ ...prev, [name]: value }));
  };

  // Logic to calculate bonus for the Live Preview
  const calculateBonusDisplay = () => {
    const salary = Number(salaryData.annualSalary) || 0;
    const bonusVal = Number(salaryData.bonus_Value) || 0;

    if (salaryData.bonus_CalculationMode === "percentage") {
      return (salary * (bonusVal / 100)).toLocaleString();
    }
    return bonusVal.toLocaleString();
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSalaryData?.(salaryData);
    ClicktoAction?.();
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-8">
        <FaMoneyBill className="text-[28px] text-blue-600 shrink-0" />
        <h1 className="text-3xl font-bold">Payroll Add</h1>
      </div>

      <form className="space-y-6" onSubmit={onSubmit}>
        <section>
          <h3 className="text-lg font-medium text-blue-600 mb-4 border-b pb-2">Employee Basic Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Selection label="Payroll Provider" name="provider" value={salaryData.provider} options={ProviderList} onChange={handleChange} placeholder="Select Provider" />
            <Selection label="Type OF Pay" name="payType" value={salaryData.payType} options={PayTypeList} onChange={handleChange} placeholder="Type OF Pay" />
            <Selection label="Currency" name="currency" value={salaryData.currency} options={CurrencyList} onChange={handleChange} placeholder="Currency" />
            <Selection label="Pay Frequency" name="payFrequency" value={salaryData.payFrequency} options={frequencies} onChange={handleChange} placeholder="Pay Frequency" />
            <FormFiled Lable="Salary" name="annualSalary" value={salaryData.annualSalary} in_PlaceHolder="Enter Salary" onChange={handleChange} icon="$" />
          </div>
        </section>

        <div>
          <TailwindToggle label="Bonus Eligible" initialState={B_togg} onToggle={onB_Togg} />
        </div>

        {B_togg && (
          <section className="mt-6 animate-in fade-in duration-300">
            <h3 className="text-lg font-medium text-blue-600 mb-4 border-b pb-2">Bonus Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Selection label="Bonus Type" name="bonus_Type" value={salaryData.bonus_Type} options={bonusTypes} onChange={handleChange} placeholder="Select Bonus Type" />

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Calculation Method</label>
                <div className="flex p-1 bg-gray-100 rounded-xl w-fit">
                  <button
                    type="button"
                    onClick={() => handleChange({ target: { name: "bonus_CalculationMode", value: "percentage" } })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${salaryData.bonus_CalculationMode === "percentage" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}
                  >
                    % of Salary
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange({ target: { name: "bonus_CalculationMode", value: "fixed" } })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${salaryData.bonus_CalculationMode === "fixed" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}
                  >
                    Fixed Amount
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  {salaryData.bonus_CalculationMode === "percentage" ? "Bonus Percentage" : "Bonus Amount"}
                </label>
                <div className="relative">
                  <input
                    name="bonus_Value"
                    value={salaryData.bonus_Value}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder={salaryData.bonus_CalculationMode === "percentage" ? "e.g. 10" : "e.g. 5000"}
                  />
                  <span className="absolute right-3 top-2 text-gray-400">
                    {salaryData.bonus_CalculationMode === "percentage" ? "%" : (salaryData.currency || "$")}
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

                <div className="flex items-center gap-3 bg-white text-gray-700 p-2 px-4 rounded-xl w-fit shadow-md border border-gray-100">

          <div className="flex items-center justify-center bg-gray-100 text-blue-600 font-bold rounded-lg w-8 h-8 text-lg">
            {salaryData.currency === "EUR" ? "€" : salaryData.currency === "GBP" ? "£" : "$"}
          </div>


          <div className="flex items-center gap-2 text-sm font-medium">
 
            <span className="text-amber-600 font-bold">
              {salaryData.currency || "$"} {salaryData.annualSalary || "0"}
              {salaryData.payType && <span className="text-gray-400 font-normal"> / {salaryData.payType}</span>}
            </span>

            {salaryData.payFrequency && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">•</span>
                <span className="capitalize text-gray-600">{salaryData.payFrequency}</span>
              </div>
            )}


            {salaryData.provider && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">•</span>
                <span className="uppercase text-blue-500">{salaryData.provider}</span>
              </div>
            )}
            

            {salaryData.currency && (
               <div className="flex items-center gap-2">
               <span className="text-gray-400 text-xs">•</span>
               <span className="text-gray-400" >NetSalary : <span className="text-green-600 font-bold">565628</span></span>
               <span className="text-gray-400 uppercase">{salaryData.currency}</span>
             </div>
            )}
             {B_togg && salaryData.bonus_Value && (
              <>
                <span className="text-gray-400 text-xs">•</span>
                <span className="text-green-600 font-bold">
                  +{calculateBonusDisplay()} <span className="text-gray-400 font-normal text-[10px]">Bonus</span>
                </span>
              </>
            )}
          </div>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-10 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md active:scale-95">
            Next
        </button>
      </form>
    </div>
  );
};
