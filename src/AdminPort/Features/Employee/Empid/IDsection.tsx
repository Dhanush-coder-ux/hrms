import { useState } from "react";
import { Trash2, Plus, CheckCircle2, Shield, Fingerprint, Hash, Layout, ArrowRight } from "lucide-react";

import { FormFiled } from "../../../../Components/Common/FormFiled";

import type { IDConfig, IDSectionProps } from "../../../../Types/customid";

function generatePreview(prefix: string, separator: string, digit: number): string {
  const padded = String(1).padStart(digit, "0");
  if (!prefix) return padded;
  return `${prefix}${separator}${padded}`;
}

export default function IDSection({
  label,
  category,
  items,
  onAdd,
  onDelete,
  onActivate,
}: IDSectionProps) {
  const [prefix, setPrefix] = useState(
    category === "EMP" ? "EMP" : 
    category === "DEP" ? "DEP" : 
    category === "CAN" ? "CAN" : "INT"
  );
  const [separator, setSeparator] = useState(category === "EMP" ? "-" : "/");
  const [digit, setDigit] = useState(category === "EMP" ? 4 : 3);

  const activeItem = items.find((i: IDConfig) => i.isActive);
  const preview = generatePreview(prefix, separator, digit);

  function handleAdd() {
    if (!prefix.trim()) return;
    const newItem: IDConfig = {
      id: String(Date.now()),
      prefix: prefix.trim(),
      separator,
      digit,
      isActive: items.length === 0,
    };
    onAdd(category, newItem);
  }

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-white/70 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
      
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-violet-500/5 blur-[100px] rounded-full" />

      {/* Header */}
      <div className="relative px-8 py-6 border-b border-slate-100/80 flex items-center justify-between bg-white/40">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-200/50">
            {category === "EMP" ? <Fingerprint size={22} /> : 
             category === "DEP" ? <Shield size={22} /> : 
             category === "CAN" ? <Hash size={22} /> : <Layout size={22} />}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-none mb-1.5">
              {label} Setup
            </h2>
            <div className="flex items-center gap-2">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Module Configuration
              </p>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100">
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type:</span>
           <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{category}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Configuration Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-5 w-1 bg-indigo-500 rounded-full" />
              <h3 className="text-sm font-bold text-slate-800 tracking-tight">Create New Format</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <FormFiled
                  Lable="Prefix"
                  in_PlaceHolder="EMP"
                  value={prefix}
                  onChange={(e: any) => setPrefix(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <FormFiled
                  Lable="Separator"
                  in_PlaceHolder="-"
                  value={separator}
                  onChange={(e: any) => setSeparator(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <FormFiled
                  Lable="Digit Count"
                  in_PlaceHolder="4"
                  value={String(digit)}
                  onChange={(e: any) => setDigit(Number(e.target.value))}
                />
              </div>
            </div>

            <button
              onClick={handleAdd}
              className="group relative w-full overflow-hidden rounded-2xl bg-slate-900 py-4 text-sm font-bold text-white transition-all duration-300 hover:shadow-xl hover:shadow-slate-200 active:scale-95"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                <Plus size={18} />
                <span>Register Format</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </button>
          </div>

          {/* Preview Card */}
          <div className="lg:col-span-5 h-full">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-5 w-1 bg-violet-500 rounded-full" />
              <h3 className="text-sm font-bold text-slate-800 tracking-tight">Live Preview</h3>
            </div>
            
            <div className={`relative h-[160px] rounded-[2rem] p-6 flex flex-col justify-between overflow-hidden shadow-inner transition-all duration-500 ${
              activeItem 
                ? "bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 text-white shadow-xl shadow-indigo-100" 
                : "bg-slate-100 border-2 border-dashed border-slate-200 text-slate-400"
            }`}>
              {/* Pattern Overlay */}
              <div className="absolute inset-0 opacity-[0.07] pointer-events-none" 
                   style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeItem ? "bg-white/20" : "bg-slate-200"}`}>
                    <Layout size={14} className={activeItem ? "text-white" : "text-slate-400"} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Format Prototype</span>
                </div>
                {activeItem && (
                  <div className="flex items-center gap-1.5 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-400/30">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-100">Live</span>
                  </div>
                )}
              </div>

              <div className="relative">
                <p className={`text-4xl font-black tracking-tight font-mono ${activeItem ? "text-white" : "text-slate-300"}`}>
                  {activeItem ? generatePreview(activeItem.prefix, activeItem.separator, activeItem.digit) : preview}
                </p>
                <p className="text-[10px] font-medium opacity-60 mt-1 uppercase tracking-widest">
                  Generated Unique Identifier
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* List Section */}
        {items && items.length > 0 && (
          <div className="mt-12 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-bold text-slate-800">Available Formats</h3>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                  {items.length} Total
                </span>
              </div>
            </div>

            <div className="grid gap-3">
              {items.map((item: IDConfig) => (
                <div
                  key={item.id}
                  className={`group flex items-center justify-between rounded-2xl border-2 p-5 transition-all duration-300 ${
                    item.isActive
                      ? "border-indigo-100 bg-indigo-50/50 shadow-sm"
                      : "border-slate-50 bg-slate-50/30 hover:border-indigo-100 hover:bg-white hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      item.isActive ? "bg-white text-indigo-600 shadow-sm" : "bg-white text-slate-400 shadow-sm group-hover:text-indigo-500"
                    }`}>
                      <Hash size={20} />
                    </div>
                    <div>
                      <p className="font-mono text-xl font-black text-slate-800 leading-none mb-1.5">
                        {generatePreview(item.prefix, item.separator, item.digit)}
                      </p>
                      <div className="flex items-center gap-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          ID Blueprint
                        </p>
                        {item.isActive && (
                          <div className="flex items-center gap-1 text-indigo-600">
                            <CheckCircle2 size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Primary</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {!item.isActive && (
                      <button
                        onClick={() => onActivate(category, item.id)}
                        className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-[11px] font-bold text-slate-700 shadow-sm border border-slate-200 transition-all hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-indigo-100"
                      >
                        <span>Switch</span>
                        <ArrowRight size={14} />
                      </button>
                    )}

                    <button
                      onClick={() => onDelete(category, item.id)}
                      className={`rounded-xl p-2.5 transition-all ${
                        item.isActive 
                          ? "text-slate-300 cursor-not-allowed opacity-50" 
                          : "text-slate-400 hover:bg-red-50 hover:text-red-500 hover:scale-110 active:scale-95"
                      }`}
                      disabled={item.isActive}
                      title={item.isActive ? "Active format cannot be deleted" : "Delete format"}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
