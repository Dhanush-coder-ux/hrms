import React, { useState } from "react";

const MenuButtons: React.FC = () => {
  const [activeTab, setActiveTab] = useState("employees");

  const tabClass = (tab: string) =>
    `py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
      activeTab === tab
        ? "border-blue-600 text-blue-600"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }`;

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("employees")}
            className={tabClass("employees")}
          >
            Employees
          </button>

          <button
            onClick={() => setActiveTab("payroll")}
            className={tabClass("payroll")}
          >
            Payroll Calculator
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={tabClass("reports")}
          >
            Reports
          </button>
        </nav>
      </div>
    </div>
  );
};

export default MenuButtons;