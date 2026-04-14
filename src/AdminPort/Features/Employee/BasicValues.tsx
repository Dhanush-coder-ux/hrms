import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, ChevronDown, Check, Loader2 } from "lucide-react";
import { useCurrencies } from "../../../Hooks/CurrenciesSelect";
import { Api_URL } from "../../../APILINK";

// ─── Types ───────────────────────────────────────────────────────────────────
type OptionItem = {
  label: string;
  value: string;
  symbol?: string;
};

type StackValue = {
  gender?: OptionItem[];
  employeeType?: OptionItem[];
  payType?: OptionItem[];
  payFrequency?: OptionItem[];
  currency?: OptionItem[];
  relationship?: OptionItem[]; // Added optional flag for consistency
};

type FieldConfig = {
  key: keyof StackValue;
  label: string;
  isDefault?: boolean;
};

type SyncState = "idle" | "saving" | "saved" | "error";

// ─── Config ───────────────────────────────────────────────────────────────────
const FIELD_CONFIGS: FieldConfig[] = [
  { key: "currency", label: "Currency", isDefault: true },
  { key: "gender", label: "Gender" },
  { key: "employeeType", label: "Employee Type" },
  { key: "payType", label: "Pay Type" },
  { key: "payFrequency", label: "Pay Frequency" },
  { key: "relationship", label: "Relationship" }, // Fixed capitalization
];

const TAG_COLORS: Record<string, any> = {
  gender: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    hoverBg: "hover:bg-red-50",
    hoverText: "hover:text-red-600",
    hoverBorder: "hover:border-red-200",
  },
  employeeType: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    hoverBg: "hover:bg-red-50",
    hoverText: "hover:text-red-600",
    hoverBorder: "hover:border-red-200",
  },
  payType: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    hoverBg: "hover:bg-red-50",
    hoverText: "hover:text-red-600",
    hoverBorder: "hover:border-red-200",
  },
  payFrequency: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    hoverBg: "hover:bg-red-50",
    hoverText: "hover:text-red-600",
    hoverBorder: "hover:border-red-200",
  },
  relationship: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    hoverBg: "hover:bg-red-50",
    hoverText: "hover:text-red-600",
    hoverBorder: "hover:border-red-200",
  },
};

// const API_URL = "http://localhost:3001/StackValue/1";
const API_URL = `http://127.0.0.1:8000/options/`; // Update with actual API URL

// ─── Sync Badge Component ─────────────────────────────────────────────────────
function SyncBadge({ state }: { state: SyncState }) {
  return (
    <AnimatePresence mode="wait">
      {state !== "idle" && (
        <motion.div
          key={state}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
            state === "saving"
              ? "bg-blue-50 text-blue-600 border-blue-200"
              : state === "saved"
                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                : "bg-red-50 text-red-600 border-red-200"
          }`}
        >
          {state === "saving" && <Loader2 size={11} className="animate-spin" />}
          {state === "saved" && <Check size={11} />}
          {state === "saving"
            ? "Saving…"
            : state === "saved"
              ? "Saved"
              : "Error"}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export const BasicValues = () => {
  const [data, setData] = useState<StackValue>({});
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [newVal, setNewVal] = useState("");
  const [syncState, setSyncState] = useState<SyncState>("idle");
  const [loading, setLoading] = useState(true);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { currencyOptions, currencySymbolMap, currencyLoading } =
    useCurrencies();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const promises = FIELD_CONFIGS.map(async (field) => {
        const res = await fetch(`${API_URL}${field.key}`);
        const json = res.ok ? await res.json() : { options: [] };
        return { key: field.key, options: json?.options || [] };
      });

      const results = await Promise.all(promises);

      const finalData: any = {};
      results.forEach((r) => {
        finalData[r.key] = r.options;
      });

      setData(finalData);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const persist = async (key: keyof StackValue, options: OptionItem[]) => {
    setSyncState("saving");

    try {
      await fetch(`${API_URL}${key}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ options }),
      });

      setSyncState("saved");
      setTimeout(() => setSyncState("idle"), 2000);
    } catch (err) {
      setSyncState("error");
    }
  };

  const handleAdd = async (key: keyof StackValue) => {
    const trimmed = newVal.trim();
    if (!trimmed) return;

    const itemValue = trimmed.toLowerCase().replace(/\s+/g, "_");
    const existing = data[key] || [];

    if (existing.some((i) => i.value === itemValue)) return;

    const newItem: OptionItem = { label: trimmed, value: itemValue };
    const updatedOptions = [...existing, newItem];

    const updated = { ...data, [key]: updatedOptions };
    setData(updated);

    await persist(key, updatedOptions); // 🔥 changed
  };

  const handleRemove = async (key: keyof StackValue, value: string) => {
    const existing = data[key] || [];
    const updatedOptions = existing.filter((i) => i.value !== value);

    const updated = { ...data, [key]: updatedOptions };
    setData(updated);

    await persist(key, updatedOptions); // 🔥 changed
  };

  const handleUpdateCurrency = async (opt: OptionItem) => {
    const updatedOptions = [
      {
        label: opt.label,
        value: opt.value,
        symbol: currencySymbolMap[opt.value],
      },
    ];

    const updated = { ...data, currency: updatedOptions };
    setData(updated);

    await persist("currency", updatedOptions); // 🔥 changed
  };

  if (loading || currencyLoading) {
    return (
      <main className="flex-1 min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-indigo-500" />
          <p className="text-sm text-slate-400 font-medium">
            Loading settings…
          </p>
        </div>
      </main>
    );
  }

  const currentCurrency = data.currency?.[0];

  return (
    <main className="flex-1 min-h-screen bg-slate-50 p-6 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Basic Settings
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Configure global system variables and dropdown options.
            </p>
          </div>
          <SyncBadge state={syncState} />
        </header>

        <div className="space-y-6">
          {/* SECTION 1 — System Defaults */}
          <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
              <span className="w-1.5 h-5 rounded-full bg-indigo-500 block" />
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                System Defaults
              </h2>
            </div>

            <div className="divide-y divide-slate-100">
              <div className="px-6 py-5 flex items-center justify-between gap-6">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Currency
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Global currency used across all records
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-base">
                    {currentCurrency?.symbol ||
                      currencySymbolMap[currentCurrency?.value || ""] ||
                      "—"}
                  </div>

                  <div className="relative">
                    <select
                      value={currentCurrency?.value || ""}
                      onChange={(e) => {
                        const opt = currencyOptions.find(
                          (o) => o.value === e.target.value,
                        );
                        if (opt) handleUpdateCurrency(opt);
                      }}
                      className="appearance-none bg-slate-50 border border-slate-200 hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3 py-2 pr-8 text-sm font-medium text-slate-700 outline-none transition-all cursor-pointer min-w-[180px]"
                    >
                      <option value="" disabled>
                        Select Currency
                      </option>
                      {currencyOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2 — Dropdown Configurations */}
          <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
              <span className="w-1.5 h-5 rounded-full bg-blue-500 block" />
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Dropdown Configurations
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y divide-slate-100 md:divide-y-0 md:border-b-0">
              {FIELD_CONFIGS.filter((f) => !f.isDefault).map((config, idx) => {
                const colors = TAG_COLORS[config.key] || TAG_COLORS["gender"];
                const fieldItems = data[config.key] || [];

                // Logic to handle border bottom for the grid items properly
                const isLastTwo =
                  idx >= FIELD_CONFIGS.filter((f) => !f.isDefault).length - 2;

                return (
                  <div
                    key={config.key}
                    className={`p-6 flex flex-col gap-4 border-slate-100 
                      ${idx % 2 === 0 ? "md:border-r" : ""} 
                      ${!isLastTwo ? "md:border-b" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">
                          {config.label}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5 uppercase tracking-wider font-medium">
                          {fieldItems.length} option
                          {fieldItems.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setActiveInput(config.key);
                          setNewVal("");
                        }}
                        className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg transition-all"
                      >
                        <Plus size={12} /> Add
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 min-h-9 content-start">
                      <AnimatePresence>
                        {fieldItems.map((item) => (
                          <motion.span
                            key={item.value}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.75 }}
                            className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${colors.bg} ${colors.text} ${colors.border} ${colors.hoverBg} ${colors.hoverText} ${colors.hoverBorder}`}
                          >
                            {item.label}
                            <button
                              onClick={() =>
                                handleRemove(config.key, item.value)
                              }
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-red-100 -mr-0.5"
                            >
                              <X size={10} />
                            </button>
                          </motion.span>
                        ))}
                      </AnimatePresence>

                      <AnimatePresence>
                        {activeInput === config.key && (
                          <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="overflow-hidden"
                          >
                            <input
                              autoFocus
                              value={newVal}
                              onChange={(e) => setNewVal(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleAdd(config.key);
                                if (e.key === "Escape") {
                                  setActiveInput(null);
                                  setNewVal("");
                                }
                              }}
                              onBlur={() =>
                                newVal.trim()
                                  ? handleAdd(config.key)
                                  : setActiveInput(null)
                              }
                              placeholder="Type & enter…"
                              className="text-xs border border-blue-300 bg-blue-50 px-3 py-1.5 rounded-lg outline-none w-32"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </motion.div>
    </main>
  );
};

export default BasicValues;
