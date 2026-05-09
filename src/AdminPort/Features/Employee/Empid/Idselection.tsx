import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { FormFiled } from "../../../../Components/Common/FormFiled";
import type {
  IDConfig,
  IDCategory,
  CustomIDStore,
  IDSectionProps,
} from "../../../../Types/customid";

// --- API Helper ---
const API_URL = "http://localhost:3001/CustomID";

// --- Preview Generator ---
function generatePreview(prefix: string, separator: string, digit: number): string {
  const padded = String(1).padStart(digit, "0");
  if (!prefix) return padded;
  return `${prefix}${separator}${padded}`;
}






// --- IDSection Component ---
function IDSection({
  label,
  configLabel,
  category,
  items,
  onAdd,
  onDelete,
  onActivate,
}: IDSectionProps) {
  const [prefix, setPrefix] = useState(category === "EMP" ? "EMP" : "DEP");
  const [separator, setSeparator] = useState(category === "EMP" ? "-" : "/");
  const [digit, setDigit] = useState(category === "EMP" ? 4 : 3);

  const activeItem = items.find((i: IDConfig) => i.isActive);
  const preview = generatePreview(prefix, separator, digit);

  function handleAdd() {
    const newItem: IDConfig = {
      id: String(Date.now()),
      prefix: prefix.trim(),
      separator,
      digit,
      isActive: items.length === 0, // First item active-ah irukum
    };
    onAdd(category, newItem);
  }

  return (
    <>
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-8">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-1 h-5 bg-indigo-600 rounded-full" />
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{label}</h2>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700">{configLabel}</label>
              <div className="flex gap-3">
                <div className="flex-1">
                   <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Prefix</p>
                   <FormFiled in_PlaceHolder="EMP" value={prefix} onChange={(e: any) => setPrefix(e.target.value)} />
                </div>
                <div className="w-20">
                   <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Separator</p>
                   <FormFiled in_PlaceHolder="-" value={separator} onChange={(e: any) => setSeparator(e.target.value)} />
                </div>
                <div className="w-20">
                   <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Digit</p>
                   <FormFiled  in_PlaceHolder="4" value={String(digit)} onChange={(e: any) => setDigit(Number(e.target.value))} />
                </div>
              </div>
              <button onClick={handleAdd} className="w-full py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-900 transition">
                Add New Configuration
              </button>
            </div>

            {/* Live Preview of Active or Current Input */}
            <div className={`rounded-2xl px-6 py-5 border ${activeItem ? "bg-indigo-50/40 border-indigo-200" : "bg-slate-50 border-slate-200"}`}>
               <div className="flex justify-between items-start mb-2">
                 <p className="text-[10px] font-bold uppercase text-slate-400">Current Active Preview</p>
                 <span className="bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded tracking-tighter">ACTIVE</span>
               </div>
               <p className="text-3xl font-black font-mono text-slate-800 tracking-tighter">
                 {activeItem ? generatePreview(activeItem.prefix, activeItem.separator, activeItem.digit) : preview}
               </p>
            </div>
          </div>

          {/* Saved List */}
          <div className="pt-4 border-t border-slate-50">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">Saved Formats</p>
            <div className="grid gap-2">
              {items.map((item: IDConfig) => (
                <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${item.isActive ? 'bg-white border-indigo-200 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-70'}`}>
                   <span className="font-mono font-bold text-slate-700">{generatePreview(item.prefix, item.separator, item.digit)}</span>
                   <div className="flex gap-2">
                     {!item.isActive && (
                       <button onClick={() => onActivate(category, item.id)} className="text-[10px] font-bold px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-indigo-50 hover:text-indigo-600">Activate</button>
                     )}
                     <button onClick={() => onDelete(category, item.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition"><Trash2 size={16} /></button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// --- Main Page Component ---
export default function EmpidCustom() {
  const [store, setStore] = useState<CustomIDStore>({ EMP: [], DEP: [] });

  // 1. Initial Fetch from API
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setStore(data))
      .catch(err => console.error("Fetch error:", err));
  }, []);

  // 2. Save Helper (Backend Update)
  const syncWithBackend = async (newData: CustomIDStore) => {
    try {
      await fetch(API_URL, {
        method: "PUT", // or POST depending on your json-server setup
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData)
      });
      setStore(newData);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const handleAdd = (category: IDCategory, item: IDConfig) => {
    const updatedStore = { ...store, [category]: [...store[category], item] };
    syncWithBackend(updatedStore);
  };

  const handleUpdate = (category: IDCategory, updatedItem: IDConfig) => {
    const updatedStore = {
      ...store,
      [category]: store[category].map((i: IDConfig) => i.id === updatedItem.id ? updatedItem : i)
    };
    syncWithBackend(updatedStore);
  };

  const handleDelete = (category: IDCategory, id: string) => {
    const updatedStore = {
      ...store,
      [category]: store[category].filter((i: IDConfig) => i.id !== id)
    };
    syncWithBackend(updatedStore);
  };

  const handleActivate = (category: IDCategory, selectedId: string) => {
    const updatedStore = {
      ...store,
      [category]: store[category].map((i: IDConfig) => ({ ...i, isActive: i.id === selectedId }))
    };
    syncWithBackend(updatedStore);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">ID Format Management</h1>
          <p className="text-sm text-slate-500">Configure how Employee and Department IDs are generated.</p>
        </header>

        <IDSection
          label="Employee ID"
          configLabel="Employee Format"
          category="EMP"
          items={store.EMP}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onActivate={handleActivate}
        />

        <IDSection
          label="Department ID"
          configLabel="Department Format"
          category="DEP"
          items={store.DEP}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onActivate={handleActivate}
        />
      </div>
    </div>
  );
}