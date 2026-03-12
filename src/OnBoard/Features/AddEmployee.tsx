import { useState } from "react";
import StepButton from "./AddEmployee/ActiveTab";
import EmployeeRegister from "./AddEmployee/EmployeeRegistor";
import { Salary } from "./AddEmployee/Salary";

const App = () => {
  const steps = [
    { label: "Step 1" },
    { label: "Step 2" },
    { label: "Step 3" }
  ];

  const [currentStep, setCurrentStep] = useState("Step 1");

  const handleStepClick = (label: string) => {
    setCurrentStep(label);
  };

  return (
    <div className="">
      <StepButton
        menus={steps}
        active={currentStep}
        onClick={handleStepClick}
      />

      <div className="bg-white shadow mt-10 rounded-xl p-6 max-w-6xl mx-auto">
        {currentStep === "Step 1" && (
          <EmployeeRegister ClicktoAction={() => setCurrentStep("Step 2")} />
        )}

        {currentStep === "Step 2" && <Salary />}

        {currentStep === "Step 3" && (
          <div className="p-4 bg-white mt-4">Content for Step 3</div>
        )}
      </div>
    </div>
  );
};

export default App;
