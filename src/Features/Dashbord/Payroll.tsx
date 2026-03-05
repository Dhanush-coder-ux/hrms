import { useState } from "react";

import PayrollComponents from "./Payroll/PayrollPage"
import MenuButtons from './Payroll/MenuButtons'
import PayRollCalculate from "./Payroll/PayRollCalculate";
import PayrollReport from "./Payroll/PayrollReport";


const Payroll = () => {
  const [activeMenu, setActiveMenu] = useState("Employees");


    const menuList = [
    { label: "Employees" },
    { label: "PayrollCalculation" },
    { label: "Reports" },
  ];

  const handleMenuClick = (label: string) => {
    setActiveMenu(label);
  }

  return (
    <div>
      <div>
         <MenuButtons
  menus={menuList}
  active={activeMenu}
  onClick={handleMenuClick}
/>


      </div>
      {
        activeMenu === "Employees" && <PayrollComponents />
      }
      {
        activeMenu === "PayrollCalculation" && <PayRollCalculate />
      }
      {
        activeMenu === "Reports" && <PayrollReport />
      }
    </div>
  )
}

export default Payroll
