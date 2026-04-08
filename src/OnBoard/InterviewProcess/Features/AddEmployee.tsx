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
import {Insurance} from "./AddEmployee/Insurance"



const API_URL = `${Api_URL}/employee/Register`;

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
    type: "success" as "success" | "error" 
  });
  const [popup, setPopup] = useState({ 
  show: false, 
  msg: "", 
  type: "success" as "success" | "error",
  data: null // Add this to hold the summary data
});

  const steps = [
    { label: "Step 1" },
    { label: "Step 2" },
    { label: "Step 3" },
    { label: "Step 4" },
    { label: "Step 5"}
  ];

  const normaliseDate = (val: any): string | null => {
    if (!val && val !== 0) return null;
    const s = String(val).trim();
    if (!s) return null;
    if (/^\d{4}$/.test(s)) return `${s}-01-01`;
    return s;
  };
  

  const finalSubmit = async () => {
    const raw = { ...employeeData, ...salaryData, ...bankData, ...insPFData};

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
      familys: (raw.familys || []).map((dep: any) => ({
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

        setPopup({ 
              show: true, 
              msg: "Employee created successfully!", 
              type: "success",
              data: finalData // Pass the details here!
            });
        

      } else {
        const errorDetail = await res.json();
        console.error("422 / Error Details:", JSON.stringify(errorDetail, null, 2));
        setmPopup({ 
          show: true, 
          msg: `Failed: ${errorDetail.detail || "Unknown error"}`, 
          type: "error" 
        });
      }
    } catch (err) {
      console.error("Connection Error:", err);
      setmPopup({ 
        show: true, 
        msg: "Connection Error: Server is unreachable.", 
        type: "error" 
      });
    }
  };

 const handleSuccessClose = () => {
  setPopup(prev => ({ ...prev, show: false }));
  // Using employeeData.Emp_id here is safe because Step 1 must be completed
  if (employeeData?.Emp_id) {
    navigate(`/EmployeeManagement/employee/${employeeData.Emp_id}`);
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
            initialData={insPFData}  // Fixed: was INSFD
            salaryData={salaryData}
            setInsPFdata={setInsPFData} // Fixed: matches Insurance component prop
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
      onClose={() => setmPopup(prev => ({ ...prev, show: false }))}
    />
    </div>
  );
};



export default App;