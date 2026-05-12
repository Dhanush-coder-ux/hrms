import { useEffect, useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Calculator,
  CalendarDays,
  Building2,
} from "lucide-react";

import { Api_URL } from "../../../APILINK";

const BASE_URL = Api_URL;

interface PayrollItem {
  name: string;
  type: string;
  value: number;
  amount: number;
}

interface Provider {
  provider_id: string;
  providername: string;
}

interface PayrollData {
  earnings: PayrollItem[];
  deductions: PayrollItem[];
  gross: number;
  totalEarnings: number;
  totalDeductions: number;
  net: number;
  baseSalary: number;
}

const PayRollCalculate = () => {
  const [providers, setProviders] = useState<
    Provider[]
  >([]);

  const [selectedProvider, setSelectedProvider] =
    useState<Provider | null>(null);

  const [salaryType, setSalaryType] = useState<
    "monthly" | "yearly"
  >("monthly");

  const [salary, setSalary] = useState<number>(0);

  const [payroll, setPayroll] =
    useState<PayrollData>({
      earnings: [],
      deductions: [],
      gross: 0,
      totalEarnings: 0,
      totalDeductions: 0,
      net: 0,
      baseSalary: 0,
    });

  /* Fetch Providers */
  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/payroll/providers`
      );

      if (!res.ok) {
  throw new Error("Payroll API Failed");
}

const data = await res.json();

      console.log("Providers:", data);

      setProviders(data);

      if (data.length > 0) {
        setSelectedProvider(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* Payroll Calculation */
  const calculatePayroll = async (
    providerId: string,
    amount: number,
    type: "monthly" | "yearly"
  ) => {
    try {
      const res = await fetch(
        `${BASE_URL}/payroll/calculate`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            provider_id: providerId,
            salary: amount,
            salary_type: type,
          }),
        }
      );

      const data = await res.json();

      console.log(
        "Payroll Response:",
        data
      );
      setPayroll({
        earnings: Array.isArray(data?.earnings) ? data.earnings : [],
        deductions: Array.isArray(data?.deductions) ? data.deductions : [],
        gross: data?.gross || 0,
        totalEarnings: data?.totalEarnings || 0,
        totalDeductions: data?.totalDeductions || 0,
        net: data?.net || 0,
        baseSalary: data?.baseSalary || 0,
      });
    } catch (err) {
      console.error(err);
    }
  };

  /* Auto Recalculate */
  useEffect(() => {
    if (
      selectedProvider &&
      salary > 0
    ) {
      calculatePayroll(
        selectedProvider.provider_id,
        salary,
        salaryType
      );
    }
  }, [
    selectedProvider,
    salary,
    salaryType,
  ]);

  return (
    <div className="h-full overflow-auto  text-slate-900">

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
              <Calculator className="w-8 h-8 text-indigo-600" />
              Payroll Master
            </h1>

            <p className="text-slate-500 mt-1">
              Real-time salary breakdown
            </p>
          </div>

          {/* Toggle */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">

            <button
              onClick={() =>
                setSalaryType("monthly")
              }
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                salaryType === "monthly"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() =>
                setSalaryType("yearly")
              }
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                salaryType === "yearly"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Yearly
            </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">

            {/* Config Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">

              <h3 className="font-semibold mb-6 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-slate-400" />
                Configuration
              </h3>

              <div className="space-y-5">

                {/* Provider */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Payroll Provider
                  </label>

                  <select
                    value={
                      selectedProvider?.provider_id ||
                      ""
                    }
                    onChange={(e) =>
                      setSelectedProvider(
                        providers.find(
                          (p) =>
                            p.provider_id ===
                            e.target.value
                        ) || null
                      )
                    }
                    className="w-full bg-slate-50 ring-1 ring-slate-200 rounded-xl px-4 py-3 outline-none"
                  >
                    {providers?.map((p) => (
                      <option
                        key={p.provider_id}
                        value={p.provider_id}
                      >
                        {p.providername}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Salary */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">

                    {salaryType ===
                    "monthly"
                      ? "Monthly Salary"
                      : "Annual Salary"}

                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                      ₹
                    </span>

                    <input
                      type="number"
                      value={salary || ""}
                      onChange={(e) =>
                        setSalary(
                          Number(
                            e.target.value
                          ) || 0
                        )
                      }
                      className="w-full bg-slate-50 ring-1 ring-slate-200 rounded-xl pl-8 pr-4 py-3 outline-none font-semibold text-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Net Salary */}
            <div className="bg-indigo-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">

              <div className="relative z-10">

                <p className="text-indigo-200 text-sm font-medium">
                  Take Home Pay
                </p>

                <h2 className="text-4xl font-bold mt-1">
                  ₹
                  {payroll.net?.toLocaleString() ||
                    "0"}
                </h2>

                <div className="mt-4 flex items-center gap-2 text-indigo-200 text-xs bg-white/10 w-fit px-3 py-1 rounded-full">

                  <TrendingUp className="w-3 h-3" />

                  Calculated for{" "}
                  {
                    selectedProvider?.providername
                  }
                </div>
              </div>

              <Wallet className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 -rotate-12" />
            </div>
          </aside>

          {/* Main */}
          <main className="lg:col-span-8 space-y-6">

            {/* Stats */}
            <div className="grid sm:grid-cols-3 gap-4">

              {[
                {
                  label: "Base Salary",
                  val:
                    payroll.baseSalary,
                  color:
                    "text-slate-700",
                  bg: "bg-white",
                },

                {
                  label: "Earnings",
                  val:
                    payroll.totalEarnings,
                  color:
                    "text-emerald-600",
                  bg: "bg-emerald-50",
                },

                {
                  label: "Deductions",
                  val:
                    payroll.totalDeductions,
                  color:
                    "text-rose-600",
                  bg: "bg-rose-50",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`${stat.bg} rounded-2xl p-5 border border-slate-200 shadow-sm`}
                >

                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {stat.label}
                  </p>

                  <p
                    className={`text-xl font-bold mt-1 ${stat.color}`}
                  >
                    ₹
                    {stat.val?.toLocaleString() ||
                      "0"}
                  </p>
                </div>
              ))}
            </div>

            {/* Earnings + Deductions */}
            <div className="grid md:grid-cols-2 gap-6">

              {/* Earnings */}
              <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

                <div className="p-6 border-b border-slate-100">

                  <h2 className="font-bold flex items-center gap-2">

                    <TrendingUp className="w-5 h-5 text-emerald-500" />

                    Earnings
                  </h2>
                </div>

                <div className="p-4 space-y-2">

                  {payroll?.earnings.map(
                    (item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-2xl transition-colors"
                      >

                        <div>
                          <p className="font-semibold text-sm">
                            {item.name}
                          </p>

                          <p className="text-[10px] text-slate-400 uppercase">
                            {item.value}

                            {item.type ===
                            "percentage"
                              ? "%"
                              : " Fixed"}
                          </p>
                        </div>

                        <span className="text-emerald-600 font-bold text-sm">
                          +₹
                          {item.amount?.toLocaleString() ||
                            "0"}
                        </span>
                      </div>
                    )
                  )}

                  {payroll.earnings.length ===
                    0 && (
                    <p className="text-center py-10 text-slate-400 text-sm italic">
                      No earnings defined
                    </p>
                  )}
                </div>
              </section>

              {/* Deductions */}
              <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

                <div className="p-6 border-b border-slate-100">

                  <h2 className="font-bold flex items-center gap-2">

                    <TrendingDown className="w-5 h-5 text-rose-500" />

                    Deductions
                  </h2>
                </div>

                <div className="p-4 space-y-2">

                  {payroll?.deductions.map(
                    (item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-2xl transition-colors"
                      >

                        <div>
                          <p className="font-semibold text-sm">
                            {item.name}
                          </p>

                          <p className="text-[10px] text-slate-400 uppercase">
                            {item.value}

                            {item.type ===
                            "percentage"
                              ? "%"
                              : " Fixed"}
                          </p>
                        </div>

                        <span className="text-rose-600 font-bold text-sm">
                          -₹
                          {item.amount?.toLocaleString() ||
                            "0"}
                        </span>
                      </div>
                    )
                  )}

                  {payroll.deductions.length ===
                    0 && (
                    <p className="text-center py-10 text-slate-400 text-sm italic">
                      No deductions defined
                    </p>
                  )}
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">

              <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">

                    <Building2 className="text-indigo-600 w-6 h-6" />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Gross Total
                    </p>

                    <p className="text-2xl font-black text-slate-800">
                      ₹
                      {payroll.gross?.toLocaleString() ||
                        "0"}
                    </p>
                  </div>
                </div>

                <div className="h-px w-full md:w-px md:h-12 bg-slate-100" />

                <div className="text-center md:text-right">

                  <p className="text-sm text-slate-500 italic mb-1">
                    Final payout
                  </p>

                  <p className="text-4xl font-black text-indigo-600 tracking-tighter">

                    ₹
                    {payroll.net?.toLocaleString() ||
                      "0"}
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PayRollCalculate;