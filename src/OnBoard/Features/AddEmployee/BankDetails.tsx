import { FaPiggyBank, FaUniversity, FaIdCard, FaHashtag, FaCode } from "react-icons/fa";
import { useState } from "react";
import { FormFiled } from "../../../Components/Common/FormFiled";

interface BaankData {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  panNumber: string;
}

type BankProps = {
  empId?: string;
  setBankDetails?: (data: any) => void;
  ClicktoAction?: () => void;
};

export const BankDetails = ({ setBankDetails, ClicktoAction }: BankProps) => {
  const [localBankDetails, setLocalBankDetails] = useState<BaankData>({
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    panNumber: "",
  });

  // 1. New state for the verification field
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle verification field separately
    if (name === "confirmAccount") {
      setConfirmAccountNumber(value);
      return;
    }

    const finalValue = name === "panNumber" ? value.toUpperCase() : value;

    setLocalBankDetails((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 2. Validation Logic
    if (localBankDetails.accountNumber !== confirmAccountNumber) {
      setError("Account numbers do not match!");
      return;
    }

    setError(""); // Clear error on success
    setBankDetails?.(localBankDetails);
    ClicktoAction?.();
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-8">
        <FaPiggyBank className="text-[28px] text-blue-600 shrink-0" />
        <h1 className="text-3xl font-bold">Bank Details</h1>
      </div>

      <form className="space-y-6" onSubmit={onSubmit}>
        <section>
          <h3 className="text-lg font-medium text-blue-600 mb-4 border-b pb-2">
            Bank Account Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormFiled
              Lable="Bank Name"
              name="bankName"
              value={localBankDetails.bankName}
              in_PlaceHolder="HDFC Bank"
              onChange={handleChange}
              icon={<FaUniversity size={14} />}
            />
            <FormFiled
              Lable="IFSC Code"
              name="ifscCode"
              value={localBankDetails.ifscCode}
              in_PlaceHolder="HDFC0001234"
              onChange={handleChange}
              icon={<FaCode size={14} />}
            />
            
            {/* Primary Account Number */}
            <FormFiled
              Lable="Account Number"
              name="accountNumber"
              value={localBankDetails.accountNumber}
              in_PlaceHolder="Enter Account Number"
              onChange={handleChange}
              icon={<FaHashtag size={14} />}
              PrivacyInput={true}
            />

            {/* 3. Verification Field Logic */}
            <div className="relative">
                <FormFiled
                Lable="Verify Account Number"
                name="confirmAccount" // Unique name
                value={confirmAccountNumber}
                in_PlaceHolder="Re-enter Account Number"
                onChange={handleChange}
                icon={<FaHashtag size={14} />}
                PrivacyInput={true}
                />
                {/* Visual mismatch indicator */}
                {confirmAccountNumber && localBankDetails.accountNumber !== confirmAccountNumber && (
                    <span className="text-xs text-red-500 absolute -bottom-5">Numbers do not match</span>
                )}
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-medium text-blue-600 mb-4 border-b pb-2">
            Tax Identification
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormFiled
              Lable="PAN Card Number"
              name="panNumber"
              value={localBankDetails.panNumber}
              in_PlaceHolder="ABCDE1234F"
              onChange={handleChange}
              icon={<FaIdCard size={14} />}
              PrivacyInput={true}
            />
          </div>
        </section>

        <div className="flex flex-col gap-2">
            {error && <p className="text-red-600 font-medium">{error}</p>}
            <button
            type="submit"
            className="bg-blue-600 text-white w-fit px-10 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md active:scale-95"
            >
            Next
            </button>
        </div>
      </form>
    </div>
  );
};