// src/pages/Payroll/PayrollDetails.tsx
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ExportCSVButton } from '../../../Components/ExportButton';

const PayrollDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state: data } = useLocation();
  const columns = [
    { header: 'Employee', accessor: 'employee' },
    { header: 'Department', accessor: 'department' },
    { header: 'Base Salary', accessor: 'salary' },
    { header: 'Tax Deductions', accessor: 'tax' },
    { header: 'Net Payable', accessor: 'net' },
    { header: 'Status', accessor: 'status' }
  ];
  if (!data) return <div className="p-10 text-center text-gray-500">No record found.</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="group mb-6 flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
          <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span> Back to list
        </button>
        <div className="flex justify-end mb-3 px-3">
          <ExportCSVButton data={[data]} columns={columns} />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-indigo-600 p-8 text-white">
            <p className="text-indigo-100 text-sm font-bold uppercase tracking-widest mb-1">Employee Statement</p>
            <h2 className="text-4xl font-bold">{data.employee}</h2>
          </div>

          <div className="p-8 grid grid-cols-2 gap-y-8">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Transaction ID</p>
              <p className="text-lg font-semibold text-gray-800">#PAY-{id}9920</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Department</p>
              <p className="text-lg font-semibold text-gray-800">{data.department}</p>
            </div>
            <div className="col-span-2 border-t border-gray-100 pt-8 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Base Salary</span>
                <span className="font-mono text-gray-900">₹{data.salary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-4 text-red-500">
                <span>Tax Deductions (TDS)</span>
                <span className="font-mono">-₹{data.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-gray-100">
                <span className="text-xl font-bold text-gray-900">Net Payable</span>
                <span className="text-2xl font-black text-emerald-600 underline decoration-emerald-200 decoration-4">
                  ₹{data.net.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollDetails;