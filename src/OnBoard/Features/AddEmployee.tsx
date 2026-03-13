import { useState } from "react";
import StepButton from "./AddEmployee/ActiveTab";
import EmployeeRegister from "./AddEmployee/EmployeeRegistor";
import { Salary } from "./AddEmployee/Salary";
import { BankDetails } from "./AddEmployee/BankDetails";
import { Verify } from "./AddEmployee/Veryfy";

const API_URL = "http://127.0.0.1:8000/employee";

const App = () => {
  const [currentStep, setCurrentStep] = useState("Step 1");
  const [employeeData, setEmployeeData] = useState<any>({});
  const [salaryData, setSalaryData] = useState<any>({});
  const [bankData, setBankData] = useState<any>({});

  const steps = [
    { label: "Step 1" },
    { label: "Step 2" },
    { label: "Step 3" },
    { label: "Step 4" },
  ];

  const normaliseDate = (val: any): string | null => {
    if (!val && val !== 0) return null;
    const s = String(val).trim();
    if (!s) return null;
    if (/^\d{4}$/.test(s)) return `${s}-01-01`;
    return s;
  };

  const finalSubmit = async () => {
    // ── Combine all steps into one flat payload ──────────────────────────────
    const raw = {
      ...employeeData,
      ...salaryData,
      ...bankData,
    };

    // ── Coerce types so Pydantic never gets an unexpected string ─────────────
    const finalData = {
      ...raw,

      // Top-level dates
      dob: normaliseDate(raw.dob),
      DateOfJoining: normaliseDate(raw.DateOfJoining),

      // Numeric fields — DOM inputs always return strings; cast explicitly
      annualSalary: parseFloat(raw.annualSalary) || 0,
      bonus_Value: parseFloat(raw.bonus_Value) || 0,
      Pin_Code: parseInt(raw.Pin_Code) || 0,
      p_Pin_Code: parseInt(raw.p_Pin_Code) || 0,

      // Nested education — normalise graduationYear dates
      education: (raw.education || []).map((edu: any) => ({
        ...edu,
        graduationYear: normaliseDate(edu.graduationYear),
      })),

      // Nested dependents — normalise person_dob dates
      dependents: (raw.dependents || []).map((dep: any) => ({
        ...dep,
        person_dob: normaliseDate(dep.person_dob),
      })),
    };

    console.log("Payload being sent:", JSON.stringify(finalData, null, 2));

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      if (res.ok) {
        alert("Employee created successfully!");
        // Optionally reset all steps:
        // setCurrentStep("Step 1");
        // setEmployeeData({}); setSalaryData({}); setBankData({});
      } else {
        const errorDetail = await res.json();
        // Log the full Pydantic error detail so you can see exactly which
        // field failed and why (loc + msg).
        console.error("422 / Error Details:", JSON.stringify(errorDetail, null, 2));
        alert(`Failed: ${JSON.stringify(errorDetail.detail, null, 2)}`);
      }
    } catch (err) {
      console.error("Connection Error:", err);
      alert("Server is offline or unreachable.");
    }
  };

  return (
    <div>
      <StepButton
        menus={steps}
        active={currentStep}
        onClick={(label) => setCurrentStep(label)}
      />

      <div className="bg-white shadow mt-10 rounded-xl p-6 max-w-6xl mx-auto">
        {currentStep === "Step 1" && (
          <EmployeeRegister
            setEmployeeData={setEmployeeData}
            ClicktoAction={() => setCurrentStep("Step 2")}
          />
        )}
        {currentStep === "Step 2" && (
          <Salary
            setSalaryData={setSalaryData}
            ClicktoAction={() => setCurrentStep("Step 3")}
          />
        )}
        {currentStep === "Step 3" && (
          <BankDetails
            setBankDetails={setBankData}
            ClicktoAction={() => setCurrentStep("Step 4")}
          />
        )}
        {currentStep === "Step 4" && (
          <Verify
            employeeData={employeeData}
            salaryData={salaryData}
            bankData={bankData}
            onFinalSubmit={finalSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default App;
