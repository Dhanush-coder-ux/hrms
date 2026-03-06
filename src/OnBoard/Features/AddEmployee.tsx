import  { useState } from "react";
import StepButton from "./AddEmployee/ActiveTab" // Path to your component
import EmployeeRegister from "./AddEmployee/EmployeeRegistor";

const App = () => {
  // 1. Define your menu items
  const steps = [
    { label: "Step 1" },
    { label: "Step 2" },
    { label: "Step 3" }
  ];

  // 2. Manage the active state
  const [currentStep, setCurrentStep] = useState("Step 1");

  // 3. Handle the click event
  const handleStepClick = (label: string) => {
    setCurrentStep(label);
    console.log("Navigated to:", label);
  };


  return (
    <div >
      <StepButton 
        menus={steps} 
        active={currentStep} 
        onClick={handleStepClick} 
      />

      <div className="mt-5">
        {currentStep === "Step 1" && <EmployeeRegister ClicktoAction={() => console.log("Action triggered")} />  }
        {currentStep === "Step 2" && <div className="p-4 bg-white mt-4">Content for Step 2</div>  }
        {currentStep === "Step 3" && <div className="p-4 bg-white mt-4">Content for Step 3</div>  }
      </div>
    </div>
  );
};

export default App;
