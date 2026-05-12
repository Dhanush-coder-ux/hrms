import { useState, useEffect } from "react";

import IDSection from "./Empid/IDsection"
import type {
  IDConfig,
  IDCategory,
  CustomIDStore,

} from "../../../Types/customid";

import { Api_URL } from "../../../APILINK";



const API_URL = `${Api_URL}/CustomID/store`;

export default function EmpidCustom() {
  const [store, setStore] = useState<CustomIDStore>({ EMP: [], DEP: [], CAN: [], INT: [] });

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
    <div className="h-full bg-slate-50 p-4 md:p-8 font-sans overflow-hidden flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
        <header className="mb-8 flex-shrink-0">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">ID Format Management</h1>
          <p className="text-sm text-slate-500">Configure how Employee and Department IDs are generated.</p>
        </header>
        
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-1 gap-8 pb-10">
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

            <IDSection
              label="Campus ID"
              configLabel="Campus Format"
              category="CAN"
              items={store.CAN}
              onAdd={handleAdd}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onActivate={handleActivate}
            />
            
            <IDSection
              label="Interview ID"
              configLabel="Interview Format"
              category="INT"
              items={store.INT}
              onAdd={handleAdd}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onActivate={handleActivate}
            />  
          </div>
        </div>
      </div>
    </div>
  );
}