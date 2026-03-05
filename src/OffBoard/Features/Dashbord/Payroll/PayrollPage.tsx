
import PayrollTable from '../../../Components/table/PayRollTable';

interface PayrollItem {
  id: number;
  employee: string;
  salary: number;
  tax: number;
  net: number;
  status: 'Paid' | 'Pending';
}

const PayrollComponents = () => {

    
    const payrollData: PayrollItem[] = [
    { id: 1, employee: "John Doe", salary: 50000, tax: 5000, net: 45000 ,status: 'Paid'},
    { id: 2, employee: "Jane Smith", salary: 60000, tax: 6000, net: 54000 ,status: 'Pending'},
    { id: 3, employee: "Mike Johnson", salary: 55000, tax: 5500, net: 49500 ,status: 'Paid'},
  ];
const columns = [
    { header: 'Employee', accessor: 'employee' },
    { header: 'Salary', accessor: 'salary' },
    { header: 'Tax', accessor: 'tax' },
    { header: 'Net Pay', accessor: 'net' },
    { header: 'Status', accessor: 'status' }
  ];


  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Payroll Management
        </h1>
      
      </div>
      <PayrollTable data={payrollData} columns={columns} />
    </div>
  )
}



export default PayrollComponents


