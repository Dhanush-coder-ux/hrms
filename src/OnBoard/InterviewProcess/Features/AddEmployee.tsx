import { useState } from "react";
import StepButton from "./AddEmployee/ActiveTab";
import EmployeeRegister from "./AddEmployee/EmployeeRegistor";
import { Salary } from "./AddEmployee/Salary";
import { BankDetails } from "./AddEmployee/BankDetails";
import { Verify } from "./AddEmployee/Veryfy";
import { Api_URL } from "../../../APILINK";
import { Popup } from "./AddEmployee/Popup";
import { useNavigate } from "react-router-dom";
import { MessagePopup } from "./AddEmployee/PopDetials";
import { Insurance } from "./AddEmployee/Insurance";

type PopupData = {
  Emp_id?: string;
  message?: string;
};

const API_URL = `${Api_URL}/employee/Register`;
import { pageTheme } from "../../../Themes/PageThems/pageConfig";

const App = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState("Step 1");
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [salaryData, setSalaryData] = useState<any>(null);
  const [bankData, setBankData] = useState<any>(null);
  const [insPFData, setInsPFData] = useState<any>(null);

  const [mpopup, setmPopup] = useState({
    show: false,
    msg: "",
    type: "success" as "success" | "error",
  });

  const [popup, setPopup] = useState<{
    show: boolean;
    msg: string;
    type: "success" | "error";
    data: PopupData | null;
  }>({
    show: false,
    msg: "",
    type: "success",
    data: null,
  });

  const steps = [
    { label: "Step 1" },
    { label: "Step 2" },
    { label: "Step 3" },
    { label: "Step 4" },
    { label: "Step 5" },
  ];

  // ─── Date normaliser ────────────────────────────────────────────────────────
  const normaliseDate = (val: any): string | null => {
    if (!val && val !== 0) return null;
    const s = String(val).trim();
    if (!s) return null;
    if (/^\d{4}$/.test(s)) return `${s}-01-01`;
    return s;
  };

  // ─── Final Submit ────────────────────────────────────────────────────────────
  const finalSubmit = async () => {
    const raw = { ...employeeData, ...salaryData, ...bankData, ...insPFData };

    // FIX: nominees from Insurance step (insPFData.Nominee) must be
    // attached INSIDE Familys[], not sent as a separate top-level list.
    // The DB links nominees via family_id FK, not emp_id.
    //
    // Strategy: attach ALL nominees to the FIRST family member.
    // If your UI assigns nominees per family member, adjust accordingly.
    const nominees: any[] = insPFData?.Nominee || [];

    const familysWithNominees = (raw.Familys || []).map(
      (fam: any, idx: number) => ({
        ...fam,
        person_dob: normaliseDate(fam.person_dob),
        // Attach nominees only to the first family row (or distribute as needed)
        nominees: idx === 0 ? nominees : (fam.nominees || []),
      })
    );

    const finalData = {
      ...raw,
      dob: normaliseDate(raw.dob),
      DateOfJoining: normaliseDate(raw.DateOfJoining),
      annualSalary: parseFloat(raw.annualSalary) || 0,
      bonus_Value: parseFloat(raw.bonus_Value) || 0,
      Pin_Code: parseInt(raw.Pin_Code) || 0,
      p_Pin_Code: parseInt(raw.p_Pin_Code) || 0,
      education: (raw.education || []).map((edu: any) => ({
        ...edu,
        graduationYear: normaliseDate(edu.graduationYear),
      })),
      WorkExp: (raw.WorkExp || []).map((work: any) => ({
        ...work,
        FromDate: normaliseDate(work.FromDate),
        ToDate: normaliseDate(work.ToDate),
      })),
      // ✅ Familys now carries nominees inside each member
      Familys: familysWithNominees,
      // Remove old top-level nominee field if it slipped in
      nominee: undefined,
      Nominee: undefined,
    };

    console.log("Payload being sent:", JSON.stringify(finalData, null, 2));

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      if (res.ok) {
        const result = await res.json();
        setPopup({
          show: true,
          msg: "Employee created successfully!",
          type: "success",
          data: result,
        });
      } else {
        const errorDetail = await res.json();
        console.error("Error Details:", JSON.stringify(errorDetail, null, 2));
        setmPopup({
          show: true,
          msg: `Failed: ${errorDetail.detail || "Unknown error"}`,
          type: "error",
        });
      }
    } catch (err) {
      console.error("Connection Error:", err);
      setmPopup({
        show: true,
        msg: "Connection Error: Server is unreachable.",
        type: "error",
      });
    }
  };

  // ─── Success popup close ─────────────────────────────────────────────────────
  const handleSuccessClose = () => {
    setPopup((prev) => ({ ...prev, show: false }));
    if (popup.data?.Emp_id) {
      navigate(`/EmployeeManagement/employee/${popup.data.Emp_id}`);
    }
  };

  return (
    <div className={pageTheme.layout.mainContainer}>
      <div className="max-w-6xl mx-auto space-y-8">
      <div className={pageTheme.header.wrapper}>
        <div className="flex flex-col">
          <div className={pageTheme.header.pill}>
            <span>Employee Onboarding</span>
          </div>
          <h1 className={pageTheme.header.title}>Register New Employee</h1>
          <p className={pageTheme.header.subtitle}>Complete the 5-step process to add a new member to the organization.</p>
        </div>
      </div>

      <StepButton
        menus={steps}
        active={currentStep}
        onClick={(label) => setCurrentStep(label)}
      />

      <div className="bg-white shadow mt-10 rounded-xl p-6 max-w-6xl mx-auto">
        {currentStep === "Step 1" && (
          <EmployeeRegister
            initialData={employeeData}
            setEmployeeData={setEmployeeData}
            ClicktoAction={() => setCurrentStep("Step 2")}
          />
        )}
        {currentStep === "Step 2" && (
          <Salary
            initialData={salaryData}
            setSalaryData={setSalaryData}
            ClicktoAction={() => setCurrentStep("Step 3")}
          />
        )}
        {currentStep === "Step 3" && (
          <Insurance
            initialData={insPFData}
            salaryData={salaryData}
            setInsPFdata={setInsPFData}
            EmployeeD={employeeData}
            ClicktoAction={() => setCurrentStep("Step 4")}
          />
        )}
        {currentStep === "Step 4" && (
          <BankDetails
            initialData={bankData}
            setBankDetails={setBankData}
            ClicktoAction={() => setCurrentStep("Step 5")}
          />
        )}
        {currentStep === "Step 5" && (
          <Verify
            employeeData={employeeData}
            salaryData={salaryData}
            bankData={bankData}
            insData={insPFData}
            onFinalSubmit={finalSubmit}
          />
        )}
      </div>

      <Popup
        isVisible={popup.show}
        message={popup.msg}
        type={popup.type}
        data={popup.data}
        onClose={handleSuccessClose}
      />
      <MessagePopup
        isVisible={mpopup.show}
        message={mpopup.msg}
        type={mpopup.type}
        onClose={() => setmPopup((prev) => ({ ...prev, show: false }))}
      />
      </div>
    </div>
  );
};

export default App;