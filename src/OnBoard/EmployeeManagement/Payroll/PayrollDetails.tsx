import { useParams } from "react-router-dom";
import { ExportCSVButton } from "../../../Components/Common/ExportButton";
import { Backbutton } from "../../../Components/Common/Backbutton";
import { useEffect, useState } from "react";
import { Api_URL } from "../../../APILINK";
import { empMangeTheme } from "../../../Themes/EmpMangeTheme/empMangeConfig";

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

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Payroll...</div>;
  if (!data) return <div className="p-10 text-center text-red-500 font-medium">No Data Found</div>;

  return (
    <div className={empMangeTheme.layout.mainContainer}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Backbutton />
          <ExportCSVButton
            data={[{
              employee: data.employee,
              provider: data.provider,
              view,
              net_salary: current?.net_salary,
            }]}
            columns={columns}
          />
        </div>

        {/* ✅ GLASSMORPISM HEADER */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8">
          <div className="bg-primary p-10 text-white flex flex-col md:flex-row justify-between items-end md:items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <p className="text-white/60 text-xs font-bold tracking-widest uppercase mb-2">Employee Statement</p>
              <h2 className="text-4xl font-extrabold tracking-tight">{data.employee}</h2>
              <p className="text-white/80 flex items-center gap-2 mt-2 font-medium">
                <span className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.6)]"></span> {data.provider}
              </p>
            </div>
            
            {/* VIEW TOGGLE */}
            <div className="flex bg-white/10 p-1 rounded-2xl backdrop-blur-md border border-white/20 relative z-10">
              {(["monthly", "yearly"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setView(mode)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    view === mode ? "bg-white text-primary shadow-xl scale-100" : "text-white/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {/* LEFT COLUMN: EARNINGS */}
            <div className="p-8">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Earnings Breakdown</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                  <span className="text-slate-600">Base Salary</span>
                  <span className="font-semibold text-lg">₹{current?.base_salary?.toLocaleString()}</span>
                </div>
                {current?.earnings?.map((e: any, i: number) => (
                  <div key={i} className="flex justify-between items-center group">
                    <span className="text-slate-500 group-hover:text-slate-800 transition-colors">{e.name}</span>
                    <span className="text-emerald-600 font-medium">+₹{e.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: DEDUCTIONS */}
            <div className="p-8 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Deductions</h3>
              <div className="space-y-4">
                {current?.deductions?.length > 0 ? (
                  current.deductions.map((d: any, i: number) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-slate-500">{d.name}</span>
                      <span className="text-rose-500 font-medium">-₹{d.value.toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic text-sm text-center py-4">No deductions recorded</p>
                )}
              </div>
            </div>
          </div>

          {/* FOOTER SUMMARY */}
          <div className="bg-slate-100/80 p-8 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-slate-400 text-xs font-bold uppercase">Gross Salary</p>
                <p className="text-xl font-bold text-slate-700">₹{current?.gross_salary?.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 md:col-span-2 flex justify-between items-center bg-gradient-to-r from-emerald-50 to-white">
                <div>
                  <p className="text-emerald-600 text-xs font-bold uppercase">Net Payable Amount</p>
                  <p className="text-3xl font-black text-emerald-700">₹{current?.net_salary?.toLocaleString()}</p>
                </div>
                <div className="hidden sm:block">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                        ✓
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-slate-400 text-xs">Generated for {view} cycle. This is a computer-generated document.</p>
      </div>
    </div>
  );
};

export default PayrollDetails;