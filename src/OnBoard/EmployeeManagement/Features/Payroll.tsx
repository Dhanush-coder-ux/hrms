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
    <div>
      <MenuButtons menus={menuList} active={activeMenu} onClick={setActiveMenu} />
      {activeMenu === "Employees" && <PayrollComponents />}
      {activeMenu === "PayrollCalculation" && <PayRollCalculate />}
    </div>
  );
};

export default Payroll;
