
import { FaUser, FaMoneyBill, FaPiggyBank, FaCheckCircle } from "react-icons/fa";

interface VerifyProps {
  employeeData: any;
  salaryData: any;
  bankData: any;
  onFinalSubmit: () => void;
}

export const Verify = ({ employeeData, salaryData, bankData, onFinalSubmit }: VerifyProps) => {
  
  // Helper to render data rows
  const InfoRow = ({ label, value }: { label: string; value: any }) => (
    <div className="flex justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="text-gray-500 font-medium">{label}:</span>
      <span className="text-gray-900 font-semibold">{value || "N/A"}</span>
    </div>
  );

  if (!employeeData || !salaryData || !bankData) {
    return (
      <div className="text-center p-10">
        <p className="text-red-500">Please complete all previous steps before reviewing.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-6">
        <FaCheckCircle className="text-[28px] text-green-600 shrink-0" />
        <h1 className="text-3xl font-bold">Review Information</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Section 1: Personal & Job Info */}
        <div className="bg-blue-50/30 p-6 rounded-2xl border border-blue-100">
          <div className="flex items-center gap-2 mb-4 text-blue-700">
            <FaUser />
            <h3 className="font-bold uppercase tracking-wider text-sm">Employee Details</h3>
          </div>
          <InfoRow label="Full Name" value={employeeData.name} />
          <InfoRow label="Employee ID" value={employeeData.Emp_id} />
          <InfoRow label="Department" value={employeeData.Department} />
          <InfoRow label="Designation" value={employeeData.designation} />
          <InfoRow label="Email" value={employeeData.email} />
        </div>

        {/* Section 2: Salary & Payroll */}
        <div className="bg-amber-50/30 p-6 rounded-2xl border border-amber-100">
          <div className="flex items-center gap-2 mb-4 text-amber-700">
            <FaMoneyBill />
            <h3 className="font-bold uppercase tracking-wider text-sm">Payroll Details</h3>
          </div>
          <InfoRow label="Provider" value={salaryData.provider} />
          <InfoRow label="Base Salary" value={`${salaryData.currency} ${salaryData.annualSalary}`} />
          <InfoRow label="Pay Frequency" value={salaryData.payFrequency} />
          {salaryData.bonus_Value && (
            <InfoRow 
                label="Bonus" 
                value={`${salaryData.bonus_CalculationMode === 'percentage' ? salaryData.bonus_Value + '%' : salaryData.currency + ' ' + salaryData.bonus_Value}`} 
            />
          )}
        </div>

        {/* Section 3: Bank Information */}
        <div className="bg-purple-50/30 p-6 rounded-2xl border border-purple-100 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4 text-purple-700">
            <FaPiggyBank />
            <h3 className="font-bold uppercase tracking-wider text-sm">Banking & Tax</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <InfoRow label="Bank Name" value={bankData.bankName} />
            <InfoRow label="IFSC Code" value={bankData.ifscCode} />
            <InfoRow label="Account Number" value="**** **** ****" /> {/* Security mask */}
            <InfoRow label="PAN Number" value={bankData.panNumber} />
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="flex flex-col items-center gap-4 mt-10 p-8 border-t border-gray-100">
        <p className="text-gray-500 text-sm italic">
          By clicking submit, you confirm that all the information provided above is accurate.
        </p>
        <button
          onClick={onFinalSubmit}
          className="bg-green-600 text-white px-16 py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-green-200 active:scale-95"
        >
          Confirm & Submit Employee Profile
        </button>
      </div>
    </div>
  );
};