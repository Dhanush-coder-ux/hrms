import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "../../../Components/Common/Button";
import { FormFiled } from "../../../Components/Common/FormFiled";
import { Plus, Trash2, X } from "lucide-react";
import { Selection } from "../../../Components/Common/Selection";
import { Api_URL } from "../../../APILINK";

type Variable = {
  name: string;
  type: "";
  value?: number;
};

type PayrollProvider = {
  provider_id: string;
  providername: string; // ✅ FIXED
  description: string;
  earnings: Variable[];
  deductions: Variable[];
};

const TypeOValue = [
  { label: "Fixed", value: "fixed" },
  { label: "Percentage %", value: "percentage" },
];

const CreateProviderList_Url = `${Api_URL}/payroll/create/providers`;
const ProviderList_Url = `${Api_URL}/payroll/providers`;
// assuming backend: DELETE /payroll/providers/{id}

export const Payrollprovider = () => {
  const [providers, setProviders] = useState<PayrollProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ShowModal, setShowModal] = useState(false);
  const [newProvider, setNewProvider] = useState<{
    providername: string;
    description: string;
    earnings: Variable[];
    deductions: Variable[];
  }>({
    providername: "",
    description: "",
    earnings: [],
    deductions: [],
  });

  // ➕ Add Variable
  const addVariable = (category: "earnings" | "deductions") => {
    const emptyVar: Variable = {
      name: "",
      type: "",
      value: 0,
    };

    setNewProvider({
      ...newProvider,
      [category]: [...newProvider[category], emptyVar],
    });
  };

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const res = await fetch(ProviderList_Url);

      console.log("STATUS:", res.status);

      if (!res.ok) {
        const err = await res.text();
        console.error("API ERROR:", err);
        setProviders([]);
        return;
      }

      const data = await res.json();
      console.log("FULL RESPONSE:", data);

      let list: any[] = [];

      if (Array.isArray(data)) {
        list = data;
      } else if (Array.isArray(data.data)) {
        list = data.data;
      } else {
        console.error("Unexpected format:", data);
        setProviders([]);
        return;
      }

      setProviders(list);
    } catch (error) {
      console.error("Fetch error:", error);
      setProviders([]);
    } finally {
      setIsLoading(false);
    }
  };
  // ➕ Submit
  const handleAddProvider = async () => {
    try {
      const payload = {
        ...newProvider,
        // Ensure strings match backend Enums and numbers are valid
        earnings: newProvider.earnings.map((e) => ({
          name: e.name,
          type: e.type.toLowerCase(), // Force lowercase
          value: Number(e.value || 0),
        })),
        deductions: newProvider.deductions.map((d) => ({
          name: d.name,
          type: d.type.toLowerCase(), // Force lowercase
          value: Number(d.value || 0),
        })),
      };
      const res = await fetch(CreateProviderList_Url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("POST FAILED:", errorData);
        return;
      }

      await fetchData();
      setShowModal(false);
      setNewProvider({
        providername: "",
        description: "",
        earnings: [],
        deductions: [],
      });
    } catch (error) {
      console.error("POST ERROR:", error);
    }
  };

  const handleDeleteProvider = async (provider_id: string) => {
    if (!confirm("Are you sure you want to delete this provider?")) return;

    try {
      const res = await fetch(`${Api_URL}/payroll/providers/${provider_id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("DELETE FAILED:", err);
        return;
      }

      console.log("Deleted successfully");

      // Refresh list
      await fetchData();
    } catch (error) {
      console.error("DELETE ERROR:", error);
    }
  };
  return (
    <main className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto p-8 lg:p-12"
          >
            {/* HEADER */}
            <header className="mb-10 flex justify-between items-end">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Payroll Provider
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Select and configure your preferred payroll integration.
                </p>
              </div>
              <Button
                B_name="+ Add Provider"
                ClickToAction={() => setShowModal(true)}
              />
            </header>

            {/* MAIN LIST CARD */}
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
                <div className="flex items-center gap-3">
                  {/* Refined side accent: Thinner and more elegant */}
                  <span
                    className="w-1 h-5 rounded-full bg-blue-600"
                    aria-hidden="true"
                  />

                  <div>
                    <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                      Available Providers
                    </h2>
                    {/* Optional: Subtle sub-text adds professional depth */}
                    <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">
                      Active system integrations
                    </p>
                  </div>
                </div>

                {/* Refined Badge: Better padding and typography weight */}
                <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100/50 rounded-full">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                  </span>
                  <span className="text-[11px] font-bold text-blue-700 whitespace-nowrap">
                    {providers.length} Total
                  </span>
                </div>
              </div>

              <div className="flex-1 h-70 overflow-y-auto space-y-3 no-scrollbar p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {isLoading ? (
                  [1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-20 w-full bg-slate-100 animate-pulse rounded-xl"
                    />
                  ))
                ) : providers.length > 0 ? (
                  providers.map((provider) => {
                    return (
                      <motion.div
                        key={provider.provider_id}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          alert(`Ready to create ${provider.providername}`)
                        }
                        className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-blue-50/50 hover:border-blue-300 cursor-pointer transition-colors duration-200 group"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">
                              {provider.providername}
                            </h2>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                              {provider.description ||
                                "No description available"}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* DELETE BUTTON */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // VERY IMPORTANT
                                handleDeleteProvider(provider.provider_id);
                              }}
                              className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 size={16} />
                            </button>
                            {/* ARROW */}
                            <div className="text-slate-300 group-hover:text-blue-400">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-10 text-slate-400 text-sm">
                    No providers found.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* REFINED MODAL */}
      <AnimatePresence>
        {ShowModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200"
            >
              {/* Header - More Elegant */}
              <div className="px-8 py-6  flex justify-between items-center bg-white">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Configure New Provider
                  </h2>
                  <p className="text-sm text-slate-500">
                    Define your integration settings and variables.
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-full transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content - Two Column Style */}
              <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
                <div className="p-8 space-y-10">
                  {/* Section 1: Basic Info */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-5 w-1 bg-blue-600 rounded-full"></div>
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                        General Information
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                      <FormFiled
                        Lable="Provider Name"
                        value={newProvider.providername}
                        onChange={(e) =>
                          setNewProvider({
                            ...newProvider,
                            providername: e.target.value, // ✅ FIXED
                          })
                        }
                        in_PlaceHolder={"Provider Name"}
                      />
                      <FormFiled
                        in_PlaceHolder="Briefly describe..."
                        Lable="Description"
                        value={newProvider.description}
                        onChange={(e) =>
                          setNewProvider({
                            ...newProvider,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </section>

                  {/* Section 2: Dynamic Variables */}
                  {(["earnings", "deductions"] as const).map((category) => (
                    <section key={category}>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-5 w-1 rounded-full ${category === "earnings" ? "bg-emerald-500" : "bg-rose-500"}`}
                          ></div>
                          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                            {category}
                          </h3>
                        </div>
                        <button
                          onClick={() => addVariable(category)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-blue-600 rounded-lg text-xs font-bold hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"
                        >
                          <Plus size={14} /> Add {category.slice(0, -1)}
                        </button>
                      </div>

                      <div className="space-y-3">
                        {newProvider[category].map((v, idx) => (
                          <motion.div
                            layout
                            key={idx}
                            className="group flex gap-3 items-center bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all"
                          >
                            <div className="flex-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">
                                Code
                              </label>
                              <input
                                className="w-full bg-slate-50 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 ring-blue-500 outline-none font-medium"
                                placeholder="BASIC"
                                value={v.name}
                                onChange={(e) => {
                                  const updated: Variable[] = [
                                    ...newProvider[category],
                                  ];
                                  updated[idx].name = e.target.value;
                                  setNewProvider({
                                    ...newProvider,
                                    [category]: updated,
                                  });
                                }}
                              />
                            </div>

                            <div className="w-40">
                              <Selection
                                label={"Type"}
                                name={"Type"}
                                value={v.type}
                                options={TypeOValue}
                                onChange={(e) => {
                                  const updated = [...newProvider[category]];
                                  updated[idx].type = e.target.value as any;
                                  setNewProvider({
                                    ...newProvider,
                                    [category]: updated,
                                  });
                                }}
                              />
                            </div>

                            <div className="w-32">
                              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">
                                Value
                              </label>
                              <input
                                type="number"
                                className="w-full bg-slate-50 border-none rounded-lg px-3 py-2 text-sm outline-none"
                                placeholder="0.00"
                                value={v.value || ""}
                                onChange={(e) => {
                                  const updated = [...newProvider[category]];
                                  updated[idx].value = Number(e.target.value);
                                  setNewProvider({
                                    ...newProvider,
                                    [category]: updated,
                                  });
                                }}
                              />
                            </div>

                            <button
                              className="mt-5 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              onClick={() => {
                                const updated = newProvider[category].filter(
                                  (_, i) => i !== idx,
                                );
                                setNewProvider({
                                  ...newProvider,
                                  [category]: updated,
                                });
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </motion.div>
                        ))}

                        {newProvider[category].length === 0 && (
                          <div className="border-2 border-dashed border-slate-200 rounded-2xl py-8 text-center">
                            <p className="text-sm text-slate-400">
                              No {category} configured yet.
                            </p>
                          </div>
                        )}
                      </div>
                    </section>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-6  bg-white flex justify-end items-center gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Discard Changes
                </button>
                <button
                  onClick={handleAddProvider}
                  className="px-8 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95 transition-all"
                >
                  Save Provider
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
};
