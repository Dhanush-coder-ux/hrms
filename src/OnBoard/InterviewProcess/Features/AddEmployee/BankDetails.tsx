import { FaPiggyBank, FaUniversity, FaIdCard, FaHashtag, FaCode } from "react-icons/fa";
import { useState, useEffect } from "react";
import { FormFiled } from "../../../../Components/Common/FormFiled";

interface BankData { bankName: string; accountNumber: string; ifscCode: string; panNumber: string; }


type BankProps = {
  empId?: string;
  initialData?: BankData | null;
  setBankDetails?: (data: any) => void;
  ClicktoAction?: () => void;
};

const DEFAULT_BANK: BankData = { bankName: "", accountNumber: "", ifscCode: "", panNumber: "" };

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

export const BankDetails = ({ setBankDetails, ClicktoAction, initialData }: BankProps) => {

  const [localBankDetails, setLocalBankDetails] = useState<BankData>(() => initialData ?? DEFAULT_BANK);
  const [confirmAccountNumber, setConfirmAccountNumber] = useState(
    () => initialData?.accountNumber ?? ""
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setLocalBankDetails(initialData);
      setConfirmAccountNumber(initialData.accountNumber ?? "");
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "confirmAccount") { setConfirmAccountNumber(value); return; }
    const finalValue = name === "panNumber" ? value.toUpperCase() : value;
    setLocalBankDetails((prev) => ({ ...prev, [name]: finalValue }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (localBankDetails.accountNumber !== confirmAccountNumber) {
      setError("Account numbers do not match!"); return;
    }
    setError(""); setBankDetails?.(localBankDetails); ClicktoAction?.();
  };

  const isMatch = !!confirmAccountNumber && localBankDetails.accountNumber === confirmAccountNumber;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        .bank-page { font-family: 'DM Sans', sans-serif; padding: 24px; }
        .bank-heading { font-size: 28px; font-weight: 700; color: #0f172a; }
        .bank-section-head {
          font-size: 15px; font-weight: 600; color: #4f46e5;
          margin-bottom: 18px; padding-bottom: 10px; border-bottom: 1.5px solid #e2e8f0;
        }
        .bank-submit-btn {
          background: #6366f1; color: #fff; padding: 12px 40px;
          border-radius: 10px; font-size: 15px; font-weight: 600; border: none; cursor: pointer;
          box-shadow: 0 4px 14px rgba(99,102,241,0.35);
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .bank-submit-btn:hover { background: #4f46e5; box-shadow: 0 6px 20px rgba(99,102,241,0.45); }
        .bank-submit-btn:active { transform: scale(0.97); }
        .bank-match-msg {
          font-size: 12px; font-weight: 500; margin-top: 5px;
          transition: all 0.25s ease; animation: fadeIn 0.2s ease;
        }
        .bank-match-msg.match   { color: #16a34a; }
        .bank-match-msg.mismatch { color: #dc2626; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        .bank-error {
          padding: 10px 16px; background: #fef2f2; border: 1px solid #fecaca;
          border-radius: 8px; color: #dc2626; font-size: 14px; font-weight: 500;
          animation: shake 0.35s cubic-bezier(0.36,0.07,0.19,0.97);
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%,60%  { transform: translateX(-5px); }
          40%,80%  { transform: translateX(5px); }
        }
      `}</style>

      <div className="bank-page">
        <AnimSection delay={0}>
          <div className="flex items-center gap-3 mb-8">
            <FaPiggyBank className="text-[26px] text-indigo-500 shrink-0" />
            <h1 className="bank-heading">Bank Details</h1>
          </div>
        </AnimSection>

        <form className="space-y-8" onSubmit={onSubmit}>
          <AnimSection delay={60}>
            <section>
              <div className="bank-section-head">Bank Account Information</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormFiled Lable="Bank Name" name="bankName" value={localBankDetails.bankName}
                  in_PlaceHolder="HDFC Bank" onChange={handleChange} icon={<FaUniversity size={14} />} />
                <FormFiled Lable="IFSC Code" name="ifscCode" value={localBankDetails.ifscCode}
                  in_PlaceHolder="HDFC0001234" onChange={handleChange} icon={<FaCode size={14} />} />
                <FormFiled Lable="Account Number" name="accountNumber" value={localBankDetails.accountNumber}
                  in_PlaceHolder="Enter Account Number" onChange={handleChange}
                  icon={<FaHashtag size={14} />} PrivacyInput={true} />
                <div>
                  <FormFiled Lable="Verify Account Number" name="confirmAccount" value={confirmAccountNumber}
                    in_PlaceHolder="Re-enter Account Number" onChange={handleChange}
                    icon={<FaHashtag size={14} />} PrivacyInput={true} />
                  {confirmAccountNumber && (
                    <p className={`bank-match-msg ${isMatch ? "match" : "mismatch"}`}>
                      {isMatch ? "✓ Account numbers match" : "✗ Numbers do not match"}
                    </p>
                  )}
                </div>
              </div>
            </section>
          </AnimSection>

          <AnimSection delay={120}>
            <section>
              <div className="bank-section-head">Tax Identification</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormFiled Lable="PAN Card Number" name="panNumber" value={localBankDetails.panNumber}
                  in_PlaceHolder="ABCDE1234F" onChange={handleChange}
                  icon={<FaIdCard size={14} />} PrivacyInput={true} />
              </div>
            </section>
          </AnimSection>

          <AnimSection delay={180}>
            <div className="flex flex-col gap-3">
              {error && <div className="bank-error">{error}</div>}
              <button type="submit" className="bank-submit-btn" style={{ width: "fit-content" }}>Next</button>
            </div>
          </AnimSection>
        </form>
      </div>
    </>
  );
};