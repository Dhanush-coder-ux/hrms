import { useParams } from "react-router-dom";
import { ExportCSVButton } from "../../../Components/Common/ExportButton";
import { Backbutton } from "../../../Components/Common/Backbutton";
import { useEffect, useState } from "react";
import { Api_URL } from "../../../APILINK";

const PayrollDetails = () => {
  const { id: emp_id } = useParams();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!emp_id) {
      console.log("emp_id missing ❌");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        console.log("Fetching for:", emp_id);

        const res = await fetch(`${Api_URL}/payroll/details/${emp_id}`);

        if (!res.ok) {
          console.log("API ERROR ❌", res.status);
          setData({
            employee: "Error",
            department: "-",
            salary: 0,
            tax: 0,
            net: 0,
            status: "Error",
          });
          return;
        }

        const result = await res.json();
        console.log("API RESULT:", result);

        // ✅ SAFE CALCULATION
        const totalDeduction = Array.isArray(result.deductions)
          ? result.deductions.reduce((acc: number, d: any) => acc + Number(d.value || 0), 0)
          : 0;

        const formatted = {
          employee: emp_id,
          department: result.department || "N/A",
          salary: Number(result.base_salary || 0),
          tax: totalDeduction,
          net: Number(result.net_salary || 0),
          status: "Pending",
        };

        setData(formatted);

      } catch (err) {
        console.error("FETCH ERROR:", err);

        setData({
          employee: "Error",
          department: "-",
          salary: 0,
          tax: 0,
          net: 0,
          status: "Error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [emp_id]);

  const columns = [
    { header: "Employee", accessor: "employee" },
    { header: "Department", accessor: "department" },
    { header: "Base Salary", accessor: "salary" },
    { header: "Tax Deductions", accessor: "tax" },
    { header: "Net Payable", accessor: "net" },
    { header: "Status", accessor: "status" },
  ];

  // ✅ LOADING CONTROL (FIXED)
  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading...</div>;
  }

  if (!data) {
    return <div className="p-10 text-center text-red-500">No Data Found</div>;
  }

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <Backbutton />

        <div className="flex justify-end mb-3 px-3">
          <ExportCSVButton data={[data]} columns={columns} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-indigo-600 p-8 text-white">
            <p className="text-indigo-100 text-sm font-bold uppercase tracking-widest mb-1">
              Employee Statement
            </p>
            <h2 className="text-4xl font-bold">{data.employee}</h2>
          </div>

          <div className="p-8 grid grid-cols-2 gap-y-8">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                Transaction ID
              </p>
              <p className="text-lg font-semibold text-gray-800">
                #PAY-{emp_id}9920
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                Department
              </p>
              <p className="text-lg font-semibold text-gray-800">
                {data.department}
              </p>
            </div>

            <div className="col-span-2 border-t border-gray-100 pt-8 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Base Salary</span>
                <span className="font-mono text-gray-900">
                  ₹{data.salary?.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center mb-4 text-red-500">
                <span>Tax Deductions (TDS)</span>
                <span className="font-mono">
                  -₹{data.tax?.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-gray-100">
                <span className="text-xl font-bold text-gray-900">
                  Net Payable
                </span>
                <span className="text-2xl font-black text-emerald-600 underline decoration-emerald-200 decoration-4">
                  ₹{data.net?.toLocaleString()}
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