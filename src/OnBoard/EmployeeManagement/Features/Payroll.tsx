import { useState } from "react";
import PayrollComponents from "../Payroll/PayrollPage";
import MenuButtons from "../Payroll/MenuButtons";
import PayRollCalculate from "../Payroll/PayRollCalculate";

const Payroll = () => {
  const [activeMenu, setActiveMenu] = useState("Employees");

  const menuList = [
    { label: "Employees" },
    { label: "PayrollCalculation" }
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MenuButtons menus={menuList} active={activeMenu} onClick={setActiveMenu} />
      <div className="flex-1 min-h-0">
        {activeMenu === "Employees" && <PayrollComponents />}
        {activeMenu === "PayrollCalculation" && <PayRollCalculate />}
      </div>
    </div>
  );
};

export default Payroll;
