import { FaPiggyBank, FaUniversity, FaIdCard, FaHashtag, FaCode } from "react-icons/fa";
import { useState, useEffect } from "react";
import { FormFiled } from "../../../../Components/Common/FormFiled";
import { runStepValidation } from "../../../../FormValidation/AddEmpValidationscript";

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
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setLocalBankDetails(initialData);
      setConfirmAccountNumber(initialData.accountNumber ?? "");
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "confirmAccount") {
      setConfirmAccountNumber(value.replace(/\D/g, ""));
      return;
    }
    let finalValue = value;
    if (name === "bankName") {
      finalValue = value.replace(/[^A-Za-z\s]/g, "");
    } else if (name === "ifscCode") {
      finalValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11);
    } else if (name === "accountNumber") {
      finalValue = value.replace(/\D/g, "");
    } else if (name === "panNumber") {
      finalValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
    }
    setLocalBankDetails((prev) => ({ ...prev, [name]: finalValue }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      ...localBankDetails,
      confirmAccount: confirmAccountNumber
    };

    const step5Errs = runStepValidation(5, payload as any);

    if (Object.keys(step5Errs).length > 0) {
      setErrors(step5Errs);
      return;
    }

    setErrors({});
    setBankDetails?.(localBankDetails);
    ClicktoAction?.();
  };

  const isMatch = !!confirmAccountNumber && localBankDetails.accountNumber === confirmAccountNumber;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        .bank-page { font-family: 'DM Sans', sans-serif; padding: 24px; }
        .bank-heading { font-size: 28px; font-weight: 700; color: hsl(var(--text-hsl)); }
        .bank-section-head {
          font-size: 15px; font-weight: 600; color: hsl(var(--primary-hsl));
          margin-bottom: 18px; padding-bottom: 10px; border-bottom: 1.5px solid #e2e8f0;
        }
        .bank-submit-btn {
          background: hsl(var(--primary-hsl)); color: #fff; padding: 12px 40px;
          border-radius: 10px; font-size: 15px; font-weight: 600; border: none; cursor: pointer;
          box-shadow: 0 4px 14px hsl(var(--primary-hsl) / 0.35);
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .bank-submit-btn:hover { opacity: 0.9; box-shadow: 0 6px 20px hsl(var(--primary-hsl) / 0.45); }
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

      <div className="bank-page h-full overflow-auto">
        <AnimSection delay={0}>
          <div className="flex items-center gap-3 mb-8">
            <FaPiggyBank className="text-[26px] text-primary shrink-0" />
            <h1 className="bank-heading">Bank Details</h1>
          </div>
        </AnimSection>

        <form className="space-y-8" onSubmit={onSubmit}>
          <AnimSection delay={60}>
            <section>
              <div className="bank-section-head">Bank Account Information</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormFiled Lable="Bank Name" name="bankName" value={localBankDetails.bankName}
                  in_PlaceHolder="HDFC Bank" onChange={handleChange} icon={<FaUniversity size={14} />} error={errors.bankName} required={true} />
                <FormFiled Lable="IFSC Code" name="ifscCode" value={localBankDetails.ifscCode}
                  in_PlaceHolder="HDFC0001234" onChange={handleChange} icon={<FaCode size={14} />} error={errors.ifscCode} required={true} />
                <FormFiled Lable="Account Number" name="accountNumber" value={localBankDetails.accountNumber}
                  in_PlaceHolder="Enter Account Number" onChange={handleChange}
                  icon={<FaHashtag size={14} />} PrivacyInput={true} error={errors.accountNumber} required={true} />
                <div>
                  <FormFiled Lable="Verify Account Number" name="confirmAccount" value={confirmAccountNumber}
                    in_PlaceHolder="Re-enter Account Number" onChange={handleChange}
                    icon={<FaHashtag size={14} />} PrivacyInput={true} error={errors.confirmAccount} required={true} />
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
                  icon={<FaIdCard size={14} />} PrivacyInput={true} error={errors.panNumber} required={true} />
              </div>
            </section>
          </AnimSection>

          <AnimSection delay={180}>
            <div className="flex flex-col gap-3">
              {errors.summary && <div className="bank-error">{errors.summary}</div>}
              <button type="submit" className="bank-submit-btn" style={{ width: "fit-content" }}>Next</button>
            </div>
          </AnimSection>
        </form>
      </div>
    </>
  );
};