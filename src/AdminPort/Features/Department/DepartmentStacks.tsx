import { AnimatePresence, motion } from "framer-motion";
import { Plus, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import SearchBar from "../../../Components/Common/Searchbar";
import { DepartmentTable } from "./DepartmentTable";
import { Backbutton } from "../../../Components/Common/Backbutton";
import { FormFiled } from "../../../Components/Common/FormFiled";
import { HexColorPicker } from "react-colorful";

// Import all possible icons you want to offer
import { 
  FaFireExtinguisher, 
  FaUserTie, 
  FaLaptopCode, 
  FaTools, 
  FaBuilding, 
  FaStethoscope 
} from "react-icons/fa";

// 1. ICON MAPPER: Translates string names from JSON to actual Components
const ICON_LIST = [
  { name: "FaFireExtinguisher", icon: FaFireExtinguisher },
  { name: "FaUserTie", icon: FaUserTie },
  { name: "FaLaptopCode", icon: FaLaptopCode },
  { name: "FaTools", icon: FaTools },
  { name: "FaBuilding", icon: FaBuilding },
  { name: "FaStethoscope", icon: FaStethoscope },
];

const API_URL = "http://localhost:3001/departmentsStacks";

export const DepartmentsStacks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [selectedDept, setSelectedDept] = useState<any>({
    name: "",
    head: "",
    employees: 0,
    iconName: "FaBuilding", // Default icon string
    iconBg: "#e2e8f0",
    iconColor: "#475569"
  });

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setDepartments(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchDepartments(); }, []);

  const handleSave = async () => {
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `${API_URL}/${selectedDept.id}` : API_URL;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedDept),
    });
    
    fetchDepartments();
    setShowModal(false);
  };

  const openModal = (dept: any = null) => {
    if (dept) {
      setSelectedDept(dept);
      setIsEditing(true);
    } else {
      setSelectedDept({ 
        name: "", 
        head: "", 
        employees: 0, 
        iconName: "FaBuilding", 
        iconBg: "#dcfce7", 
        iconColor: "#16a34a" 
      });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 lg:p-10 min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <Backbutton />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase">Departments</h1>
            <p className="text-slate-500 text-sm">Manage organizational structure</p>
          </div>
          <button
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
            onClick={() => openModal()}
          >
            <Plus size={20} /> ADD NEW
          </button>
        </div>
        <div className="mb-2">
        <SearchBar value={searchTerm} onChange={(e: any) => setSearchTerm(e.target.value)} />
        </div>
        {isLoading ? (
          <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" /></div>
        ) : (
          <DepartmentTable
            columns={[
              { header: "Dept", accessor: "name" },
              { header: "Head", accessor: "head" },
            ]}
            departmentsData={departments.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()))}
            onEdit={(row: any) => openModal(row)}
            onDelete={async (row: any) => {
              await fetch(`${API_URL}/${row.id}`, { method: "DELETE" });
              fetchDepartments();
            }}
          />
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b flex justify-between items-center bg-white sticky top-0 z-10">
                <h3 className="text-xl font-bold">{isEditing ? "Edit" : "Add"} Department</h3>
                <button onClick={() => setShowModal(false)}>✕</button>
              </div>

              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                {/* 1. Basic Info */}
                <div className="space-y-4">
                    <FormFiled 
                    Lable="Department Name"
                    value={selectedDept.name}
                    onChange={(e) => setSelectedDept({ ...selectedDept, name: e.target.value })} in_PlaceHolder={""}                    />
                    <FormFiled 
                    Lable="Department Head"
                    value={selectedDept.head}
                    onChange={(e) => setSelectedDept({ ...selectedDept, head: e.target.value })} in_PlaceHolder={""}                    />
                </div>

                {/* 2. Icon Picker */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 block">Select Icon</label>
                  <div className="grid grid-cols-6 gap-3">
                    {ICON_LIST.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => setSelectedDept({ ...selectedDept, iconName: item.name })}
                        className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                          selectedDept.iconName === item.name 
                          ? "bg-indigo-600 text-white ring-4 ring-indigo-100" 
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        <item.icon size={20} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Color Pickers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Icon Color</label>
                    <HexColorPicker 
                      color={selectedDept.iconColor} 
                      onChange={(color: string) => setSelectedDept({ ...selectedDept, iconColor: color })} 
                    />
                    <div className="mt-2 text-center font-mono text-sm">{selectedDept.iconColor}</div>
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Background Color</label>
                    <HexColorPicker 
                      color={selectedDept.iconBg} 
                      onChange={(color: string) => setSelectedDept({ ...selectedDept, iconBg: color })} 
                    />
                    <div className="mt-2 text-center font-mono text-sm">{selectedDept.iconBg}</div>
                  </div>
                </div>

                {/* 4. Live Preview Card */}
                <div className="p-4 border rounded-2xl bg-gray-50 flex items-center gap-4">
                    <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: selectedDept.iconBg }}
                    >
                        {/* Render the selected icon in the preview */}
                        {(() => {
                            const IconObj = ICON_LIST.find(i => i.name === selectedDept.iconName)?.icon || FaBuilding;
                            return <IconObj style={{ color: selectedDept.iconColor }} size={24} />;
                        })()}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">{selectedDept.name || "Preview Name"}</p>
                        <p className="text-xs text-gray-500">Head: {selectedDept.head || "---"}</p>
                    </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
                <button onClick={() => setShowModal(false)} className="px-5 py-2 font-bold text-gray-500">Cancel</button>
                <button onClick={handleSave} className="bg-indigo-600 text-white px-8 py-2 rounded-xl font-bold shadow-lg shadow-indigo-200">
                  {isEditing ? "Save Changes" : "Create"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};