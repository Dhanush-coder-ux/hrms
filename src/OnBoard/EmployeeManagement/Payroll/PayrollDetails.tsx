import { useParams } from "react-router-dom";
import { ExportCSVButton } from "../../../Components/Common/ExportButton";
import { Backbutton } from "../../../Components/Common/Backbutton";
import { useEffect, useState } from "react";
import { Api_URL } from "../../../APILINK";

const PayrollDetails = () => {
  const { id: emp_id } = useParams();

  const [data, setData] = useState<any>(null);
  const [view, setView] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!emp_id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`${Api_URL}/payroll/details/${emp_id}`);

        if (!res.ok) {
          setData(null);
          return;
        }

        const result = await res.json();

        const formatted = {
          employee: result.emp_id || emp_id,
          provider: result.provider_name || "N/A",
          salary_type: result.salary_type || "yearly",
          monthly: result.monthly || {},
          yearly: result.yearly || {},
        };

        setData(formatted);
      } catch (err) {
        console.error(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [emp_id]);

  const current = data?.[view];

  const columns = [
  { header: "Employee", accessor: "employee" },
  { header: "Provider", accessor: "provider" },
  { header: "View", accessor: "view" },
  { header: "Net Salary", accessor: "net_salary" },
] as any;

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!data) {
    return <div className="p-10 text-center text-red-500">No Data</div>;
  }

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <Backbutton />

        {/* ✅ TOGGLE BUTTON */}
        <div className="flex justify-center gap-4 my-4">
          <button
            onClick={() => setView("monthly")}
            className={`px-4 py-2 rounded ${
              view === "monthly" ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setView("yearly")}
            className={`px-4 py-2 rounded ${
              view === "yearly" ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
          >
            Yearly
          </button>
        </div>

        <div className="flex justify-end mb-3 px-3">
          <ExportCSVButton
            data={[
              {
                employee: data.employee,
                provider: data.provider,
                view,
                net_salary: current?.net_salary,
              },
            ]}
            columns={columns}
          />
        </div>

        <div className="bg-white rounded-2xl shadow border overflow-hidden">
          {/* HEADER */}
          <div className="bg-indigo-600 p-8 text-white">
            <p className="text-sm uppercase">Payroll ({view})</p>
            <h2 className="text-3xl font-bold">{data.employee}</h2>
            <p className="text-sm mt-1">{data.provider}</p>
          </div>

          {/* BODY */}
          <div className="p-6">

            {/* BASE */}
            <div className="flex justify-between mb-4">
              <span>Base Salary</span>
              <span>₹{current?.base_salary?.toLocaleString()}</span>
            </div>

            {/* EARNINGS */}
            <p className="font-bold mt-4 mb-2">Earnings</p>
            {current?.earnings?.map((e: any, i: number) => (
              <div key={i} className="flex justify-between">
                <span>{e.name}</span>
                <span className="text-green-600">
                  ₹{e.value.toLocaleString()}
                </span>
              </div>
            ))}

            {/* DEDUCTIONS */}
            <p className="font-bold mt-4 mb-2">Deductions</p>
            {current?.deductions?.map((d: any, i: number) => (
              <div key={i} className="flex justify-between text-red-500">
                <span>{d.name}</span>
                <span>-₹{d.value.toLocaleString()}</span>
              </div>
            ))}

            {/* GROSS */}
            <div className="flex justify-between mt-6 border-t pt-4">
              <span>Gross Salary</span>
              <span>₹{current?.gross_salary?.toLocaleString()}</span>
            </div>

            {/* NET */}
            <div className="flex justify-between mt-4 text-xl font-bold">
              <span>Net Salary</span>
              <span className="text-emerald-600">
                ₹{current?.net_salary?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollDetails;