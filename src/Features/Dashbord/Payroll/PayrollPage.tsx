import React from 'react'
import { Button } from '../../../Components/Common/Button';

interface PayrollItem {
  id: number;
  employee: string;
  salary: number;
  tax: number;
  net: number;
}

const PayrollComponents = () => {

    
    const payrollData: PayrollItem[] = [
    { id: 1, employee: "John Doe", salary: 50000, tax: 5000, net: 45000 },
    { id: 2, employee: "Jane Smith", salary: 60000, tax: 6000, net: 54000 },
    { id: 3, employee: "Mike Johnson", salary: 55000, tax: 5500, net: 49500 },
  ];



  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Payroll Management
        </h1>

      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Employee
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Salary
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Tax
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Net Pay
              </th>
            </tr>
          </thead>

          <tbody>
            {payrollData.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-800">
                  {item.employee}
                </td>
                <td className="px-4 py-3">
                  ₹{item.salary}
                </td>
                <td className="px-4 py-3 text-red-600">
                  ₹{item.tax}
                </td>
                <td className="px-4 py-3 font-semibold text-green-600">
                  ₹{item.net}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}



export default PayrollComponents


