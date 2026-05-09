import { useState, useEffect } from "react";
import { FormFiled } from "../../../Components/Common/FormFiled";
import type {
  IDConfig,
  IDCategory,
  CustomIDStore,
  IDSectionProps,
  EditModalProps,
  ConfirmModalProps,
} from "../../../Types/customid";

// --- API Helper ---
const API_URL = "http://localhost:3001/CustomID";

// --- Preview Generator ---
function generatePreview(prefix: string, separator: string, degit: number): string {
  const padded = String(1).padStart(degit, "0");
  if (!prefix) return padded;
  return `${prefix}${separator}${padded}`;
}

function generatePreview(prefix: string, separator: string, degit: number): string {
  if (!prefix) return String(1).padStart(degit, "0");
  return `${prefix}${separator}${String(1).padStart(degit, "0")}`;
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-80 space-y-4">
        <p className="text-sm font-semibold text-slate-700">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-bold rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({ item, onSave, onClose }: EditModalProps) {
  const [prefix, setPrefix] = useState(item.prefix);
  const [separator, setSeparator] = useState(item.separator);
  const [degit, setDegit] = useState(item.degit);
  const [error, setError] = useState("");

  const preview = generatePreview(prefix, separator, degit);

  function handleSave() {
    if (!prefix.trim()) return setError("Prefix cannot be empty.");
    if (degit < 1) return setError("Digit must be at least 1.");
    setError("");
    onSave({ ...item, prefix: prefix.trim(), separator, degit });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-96 space-y-4">
        <h3 className="text-sm font-bold text-slate-800">Edit Configuration</h3>
        <div className="space-y-3">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Prefix</p>
            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
            />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Separator</p>
            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
            />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Digit Count</p>
            <input
              type="number"
              min={1}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              value={degit}
              onChange={(e) => setDegit(Math.max(1, Number(e.target.value) || 1))}
            />
          </div>
        </div>

        {/* Preview */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
          <p className="text-[10px] text-indigo-400 font-bold uppercase mb-1">Preview</p>
          <p className="text-xl font-black font-mono text-slate-800">{preview}</p>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}




// --- IDSection Component ---
function IDSection({
  label,
  configLabel,
  category,
  items,
  onAdd,
  onUpdate,
  onDelete,
  onActivate,
}: IDSectionProps) {
  const [prefix, setPrefix] = useState(category === "EMP" ? "EMP" : "DEP");
  const [separator, setSeparator] = useState(category === "EMP" ? "-" : "/");
  const [degit, setDegit] = useState(category === "EMP" ? 4 : 3);
  const [addError, setAddError] = useState("");
  const [editItem, setEditItem] = useState<IDConfig | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const activeItem = items.find((i) => i.isActive);
  const preview = generatePreview(prefix, separator, degit);

  function handleAdd() {
    if (!prefix.trim()) return setAddError("Prefix cannot be empty.");
    const newItem: IDConfig = {
      id: String(Date.now()),
      prefix: prefix.trim(),
      separator,
      degit,
      isActive: items.length === 0, // First item active-ah irukum
    };
    onAdd(category, newItem);
    setAddError("");
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
                   <FormFiled type="number" in_PlaceHolder="4" value={String(degit)} onChange={(e: any) => setDegit(Number(e.target.value))} />
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
                 {activeItem ? generatePreview(activeItem.prefix, activeItem.separator, activeItem.degit) : preview}
               </p>
            </div>
          </div>

          {/* Saved List */}
          <div className="pt-4 border-t border-slate-50">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">Saved Formats</p>
            <div className="grid gap-2">
              {items.map((item) => (
                <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${item.isActive ? 'bg-white border-indigo-200 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-70'}`}>
                   <span className="font-mono font-bold text-slate-700">{generatePreview(item.prefix, item.separator, item.degit)}</span>
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
      [category]: store[category].map(i => i.id === updatedItem.id ? updatedItem : i)
    };
    syncWithBackend(updatedStore);
  };

  const handleDelete = (category: IDCategory, id: string) => {
    const updatedStore = {
      ...store,
      [category]: store[category].filter(i => i.id !== id)
    };
    syncWithBackend(updatedStore);
  };

  const handleActivate = (category: IDCategory, selectedId: string) => {
    const updatedStore = {
      ...store,
      [category]: store[category].map(i => ({ ...i, isActive: i.id === selectedId }))
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