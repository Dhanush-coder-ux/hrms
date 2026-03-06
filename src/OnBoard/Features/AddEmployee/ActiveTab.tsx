import React from "react";


interface StepItem {
  label: string;
}

interface StepButtonsProps {
  menus: StepItem[];
  active?: string;
  onClick?: (label: string) => void;
}

const StepButton: React.FC<StepButtonsProps> = ({ menus, onClick, active }) => {
  return (
    <div className="rounded bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8">
          {menus.map((step, index) => (
            <button
              key={index}
              onClick={() => onClick?.(step.label)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                active === step.label
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {step.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default StepButton;