import { useState } from "react";
import { FaMoneyBill } from "react-icons/fa";
import { FormFiled } from "../../../Components/Common/FormFiled";
import { Selection } from "../../../Components/Common/Selection";

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
}

export const Salary = ({setSalaryData, ClicktoAction }: SalaryProps) => {
  const [salaryData, setLocalSalaryData] = useState<PayrollData>({
    provider: "",
    payType: "",
    currency: "",
    payFrequency: "",
    annualSalary: "",
  });

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

  const frequencies = [
    { value: "weekly", label: "Weekly" },
    { value: "biweekly", label: "Bi-Weekly" },
    { value: "semimonthly", label: "Semi-Monthly" },
    { value: "monthly", label: "Monthly" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalSalaryData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSalaryData?.(salaryData);
    ClicktoAction?.();
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <FaMoneyBill className="text-3xl text-blue-600" />
        <h1 className="text-3xl font-bold">Payroll Add</h1>
      </div>

      <form className="space-y-6" onSubmit={onSubmit}>
        <section>
          <h3 className="text-lg font-medium text-blue-600 mb-4 border-b pb-2">
            Employee Basic Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Selection label="Payroll Provider" name="provider" value={salaryData.provider} options={ProviderList} onChange={handleChange} placeholder="Select Provider" />
            <Selection label="Type OF Pay" name="payType" value={salaryData.payType} options={PayTypeList} onChange={handleChange} placeholder="Type OF Pay" />
            <Selection label="Currency" name="currency" value={salaryData.currency} options={CurrencyList} onChange={handleChange} placeholder="Currency" />
            <Selection label="Pay Frequency" name="payFrequency" value={salaryData.payFrequency} options={frequencies} onChange={handleChange} placeholder="Pay Frequency" />
            <FormFiled Lable="Salary" name="annualSalary" value={salaryData.annualSalary} in_PlaceHolder="Enter Salary" onChange={handleChange} icon="$" />
          </div>
        </section>

        {/* Dynamic Live Preview Badge */}
        <div className="flex items-center gap-3 bg-white text-gray-700 p-2 px-4 rounded-xl w-fit shadow-md border border-gray-100">
          {/* Icon Box */}
          <div className="flex items-center justify-center bg-gray-100 text-blue-600 font-bold rounded-lg w-8 h-8 text-lg">
            {salaryData.currency === "EUR" ? "€" : salaryData.currency === "GBP" ? "£" : "$"}
          </div>

          {/* Data Row */}
          <div className="flex items-center gap-2 text-sm font-medium">
            {/* 1. Salary & Pay Type */}
            <span className="text-amber-600 font-bold">
              {salaryData.currency || "$"} {salaryData.annualSalary || "0"}
              {salaryData.payType && <span className="text-gray-400 font-normal"> / {salaryData.payType}</span>}
            </span>

            {/* 2. Frequency - Only shows dot + value if frequency exists */}
            {salaryData.payFrequency && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">•</span>
                <span className="capitalize text-gray-600">{salaryData.payFrequency}</span>
              </div>
            )}

            {/* 3. Provider - Only shows dot + value if provider exists */}
            {salaryData.provider && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">•</span>
                <span className="uppercase text-blue-500">{salaryData.provider}</span>
              </div>
            )}
            
            {/* Net SALARY */}

            {/* 4. Extra Currency code - Only shows if selected */}
            {salaryData.currency && (
               <div className="flex items-center gap-2">
               <span className="text-gray-400 text-xs">•</span>
               <span className="text-gray-400" >NetSalary : <span className="text-green-600 font-bold">565628</span></span>
               <span className="text-gray-400 uppercase">{salaryData.currency}</span>
             </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-10 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md active:scale-95"
        >
          Submit
        </button>
      </form>
    </div>
  );
};