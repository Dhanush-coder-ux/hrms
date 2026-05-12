import { useEffect, useState } from "react";
import { Landmark, TrendingUp, TrendingDown, FileCheck, Download, Calculator, ChevronDown, ChevronUp, UserCircle } from "lucide-react";

type SettlementLine = {
  label: string;
  amount: number;
  type: "addition" | "deduction";
};

type EmployeeSettlement = {
  emp_id: string;
  emp_name: string;
  designation: string;
  last_working_day: string;
  lines: SettlementLine[];
  status: "Draft" | "Processed";
};

export const FinalSettlement = () => {
  const [data, setData] = useState<EmployeeSettlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>("EMP001"); // First one expanded by default

  useEffect(() => {
    setTimeout(() => {
      setData([
        {
          emp_id: "EMP001",
          emp_name: "Arun Kumar",
          designation: "Senior Developer",
          last_working_day: "May 10, 2026",
          status: "Draft",
          lines: [
            { label: "Base Salary (Pro-rata)", amount: 45000, type: "addition" },
            { label: "Leave Encashment", amount: 12500, type: "addition" },
            { label: "Gratuity", amount: 25000, type: "addition" },
            { label: "Income Tax (TDS)", amount: 4200, type: "deduction" },
          ],
        },
        {
          emp_id: "EMP002",
          emp_name: "Priya Sharma",
          designation: "Product Designer",
          last_working_day: "May 12, 2026",
          status: "Draft",
          lines: [
            { label: "Base Salary (Pro-rata)", amount: 38000, type: "addition" },
            { label: "Bonus Carryover", amount: 5000, type: "addition" },
            { label: "Notice Buy-out", amount: 15000, type: "deduction" },
          ],
        },
        {
          emp_id: "EMP003",
          emp_name: "Vijay Raj",
          designation: "HR Manager",
          last_working_day: "May 15, 2026",
          status: "Processed",
          lines: [
            { label: "Base Salary", amount: 55000, type: "addition" },
            { label: "Performance Bonus", amount: 10000, type: "addition" },
          ],
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const calculateTotal = (lines: SettlementLine[]) => {
    return lines.reduce((acc, line) => 
      line.type === "addition" ? acc + line.amount : acc - line.amount, 0
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="p-8 bg-[#F8FAFC] h-full overflow-auto text-slate-900 font-sans">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Final <span className="text-blue-600">Settlement</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Review and process Full & Final dues for all exiting employees.</p>
        </div>
        <div className="flex gap-3">
            <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold shadow-sm">
                Queue: {data.length}
            </div>
            <button className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 transition-all flex items-center gap-2">
                <Calculator size={16} /> Auto-Calculate All
            </button>
        </div>
      </div>

      <div className="space-y-4 max-w-6xl mx-auto">
        {loading ? (
          <div className="text-center py-20 text-slate-400 font-medium animate-pulse uppercase tracking-widest text-xs">Loading Financial Ledgers...</div>
        ) : (
          data.map((emp) => {
            const isExpanded = expandedId === emp.emp_id;
            const netPayable = calculateTotal(emp.lines);

            return (
              <div 
                key={emp.emp_id} 
                className={`bg-white border transition-all duration-300 rounded-[2rem] overflow-hidden ${
                    isExpanded ? 'border-blue-200 shadow-xl shadow-blue-900/5' : 'border-slate-200 shadow-sm hover:border-slate-300'
                }`}
              >
                {/* Accordion Header (Summary View) */}
                <div 
                  onClick={() => toggleExpand(emp.emp_id)}
                  className={`p-6 flex flex-col md:flex-row items-center justify-between cursor-pointer transition-colors ${isExpanded ? 'bg-blue-50/30' : 'bg-white'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-100 rounded-full text-slate-400">
                        <UserCircle size={32} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">{emp.emp_name}</h3>
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{emp.emp_id} • {emp.designation}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-10 mt-4 md:mt-0">
                    <div className="text-center md:text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Amount</p>
                        <p className={`text-lg font-black ${isExpanded ? 'text-blue-600' : 'text-slate-800'}`}>₹{netPayable.toLocaleString()}</p>
                    </div>
                    <div className="hidden md:block">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${emp.status === 'Processed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                            {emp.status}
                        </span>
                    </div>
                    {isExpanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Details (The Math) */}
                {isExpanded && (
                  <div className="p-8 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-2 duration-300">
                    
                    {/* Detailed Ledger */}
                    <div className="space-y-2">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Breakdown Ledger</p>
                        {emp.lines.map((line, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-50/50 border border-slate-100/50">
                                <div className="flex items-center gap-3">
                                    {line.type === 'addition' ? <TrendingUp size={14} className="text-emerald-500" /> : <TrendingDown size={14} className="text-rose-500" />}
                                    <span className="text-sm font-medium text-slate-600">{line.label}</span>
                                </div>
                                <span className={`text-sm font-bold ${line.type === 'addition' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {line.type === 'addition' ? '+' : '-'} ₹{line.amount.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Final Actions & Payout Card */}
                    <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <Landmark size={28} className="text-blue-400" />
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Payable</p>
                                    <h2 className="text-3xl font-black text-white">₹{netPayable.toLocaleString()}</h2>
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                This settlement includes leave encashment, statutory dues, and any applicable deductions for unreturned company property.
                            </p>
                        </div>
                        
                        <div className="flex gap-3 mt-8">
                            <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-900/20">
                                <FileCheck size={16} /> Finalize
                            </button>
                            <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                                <Download size={18} />
                            </button>
                        </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};