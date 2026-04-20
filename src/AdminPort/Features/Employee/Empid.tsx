import { useState } from "react";
import { FormFiled } from "../../../Components/Common/FormFiled";

export default function EmpidCustom() {
  // Separate states for Employee ID
  const [empPrefix, setEmpPrefix] = useState("EMP");
  const [empSeparator, setEmpSeparator] = useState("-");
  const empNum = "1234";

  // Separate states for Department ID
  const [depPrefix, setDepPrefix] = useState("DEP");
  const [depSeparator, setDepSeparator] = useState("_");
  const depNum = "88";

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-600">
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Custom ID Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Use custom prefixes and symbols to format your entity identities.</p>
        </header>

        <div className="space-y-8">
          
          {/* --- SECTION 1: Employee ID --- */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-3 bg-white">
              <div className="w-1 h-5 bg-indigo-600 rounded-full"></div>
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Employee ID</h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">ID Format Configuration</label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 ml-1">Prefix</p>
                    <FormFiled 
                      in_PlaceHolder="EMP" 
                      value={empPrefix} 
                      onChange={(e) => setEmpPrefix(e.target.value)} 
                    />
                  </div>
                  <div className="w-24">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 ml-1">Separator</p>
                    <FormFiled 
                      in_PlaceHolder="-" 
                      value={empSeparator} 
                      onChange={(e) => setEmpSeparator(e.target.value)} 
                    />
                  </div>
                </div>
              </div>

              {/* ID Preview Box */}
              <div className="flex items-center justify-between bg-indigo-50/40 border border-indigo-100 rounded-2xl px-6 py-5">
                <div>
                  <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-1">Live Preview</p>
                  <p className="text-2xl font-black text-slate-800 tracking-tight font-mono">
                    {empPrefix}{empPrefix && empSeparator}{empNum}
                  </p>
                </div>
                <div className="bg-indigo-600 text-white px-3 py-1 rounded-md text-[10px] font-bold shadow-sm">
                  ACTIVE
                </div>
              </div>
            </div>
          </section>

          {/* --- SECTION 2: Department ID --- */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-3 bg-white">
              <div className="w-1 h-5 bg-indigo-600 rounded-full"></div>
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Department ID</h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Department Configuration</label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 ml-1">Prefix</p>
                    <FormFiled 
                      in_PlaceHolder="DEP" 
                      value={depPrefix} 
                      onChange={(e) => setDepPrefix(e.target.value)} 
                    />
                  </div>
                  <div className="w-24">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 ml-1">Separator</p>
                    <FormFiled 
                      in_PlaceHolder="_" 
                      value={depSeparator} 
                      onChange={(e) => setDepSeparator(e.target.value)} 
                    />
                  </div>
                </div>
              </div>

              {/* ID Preview Box */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Live Preview</p>
                  <p className="text-2xl font-black text-slate-700 tracking-tight font-mono">
                    {depPrefix}{depPrefix && depSeparator}{depNum}
                  </p>
                </div>
                <div className="bg-slate-200 text-slate-600 px-3 py-1 rounded-md text-[10px] font-bold">
                  DRAFT
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}