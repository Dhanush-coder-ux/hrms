import { useState } from "react";
import StepButton from "./AddEmployee/ActiveTab";
import EmployeeRegister from "./AddEmployee/EmployeeRegistor";
import { Salary } from "./AddEmployee/Salary";



const API_URL = "http://127.0.0.1:8000/employee";

const App = () => {

  const [currentStep, setCurrentStep] = useState("Step 1");

  const [employeeData, setEmployeeData] = useState<any>(null);
  const [salaryData, setSalaryData] = useState<any>(null);

  const steps = [
    { label: "Step 1" },
    { label: "Step 2" },
    { label: "Step 3" }
  ];

  const handleStepClick = (label: string) => {
    setCurrentStep(label);
  };

  const finalSubmit = async () => {
    const finalData = {
      employee: employeeData,
      salary: salaryData
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(finalData)
      });

      if (res.ok) {
        alert("Employee created successfully");
      }
    } catch {
      alert("Server Error");
    }
  };

  return (
    <div>
      <StepButton
        menus={steps}
        active={currentStep}
        onClick={handleStepClick}
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
          <div className="text-center">

            <h2 className="text-2xl font-bold mb-6">
              Review & Submit
            </h2>

            <button
              onClick={finalSubmit}
              className="bg-green-600 text-white px-10 py-3 rounded-lg"
            >
              Final Submit
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default App;
