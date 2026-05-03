import { AnimatePresence, motion } from "framer-motion";
import { Plus, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import SearchBar from "../../../Components/Common/Searchbar";
import { DepartmentTable } from "./DepartmentTable";
import { Backbutton } from "../../../Components/Common/Backbutton";
import { FormFiled } from "../../../Components/Common/FormFiled";
import { HexColorPicker } from "react-colorful";

import { 
  FaFireExtinguisher, 
  FaUserTie, 
  FaLaptopCode, 
  FaTools, 
  FaBuilding, 
  FaStethoscope 
} from "react-icons/fa";

import { Api_URL } from "../../../APILINK";

const API_URL = `${Api_URL}/departments/`;

const ICON_LIST = [
  { name: "FaFireExtinguisher", icon: FaFireExtinguisher },
  { name: "FaUserTie", icon: FaUserTie },
  { name: "FaLaptopCode", icon: FaLaptopCode },
  { name: "FaTools", icon: FaTools },
  { name: "FaBuilding", icon: FaBuilding },
  { name: "FaStethoscope", icon: FaStethoscope },
];

export const DepartmentsStacks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [selectedDept, setSelectedDept] = useState<any>({
    Dep_id: null,
    Dep_name: "",
    Dep_head: "",
    Dep_icon: "FaBuilding",
    bg_color: "#dcfce7",
    icon_color: "#16a34a"
  });

  // ✅ FETCH
  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setDepartments(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // ✅ SAVE (POST / PUT)
const handleSave = async () => {
  try {
    if (!selectedDept.Dep_name || !selectedDept.Dep_head) {
      alert("Fill all required fields");
      return;
    }

    const isEdit = !!selectedDept.Dep_id;
    // Remove the trailing slash for the base POST if your router is sensitive, 
    // or ensure consistency.
    const url = isEdit 
      ? `${Api_URL}/departments/${selectedDept.Dep_id}` 
      : `${Api_URL}/departments/`; 

    const method = isEdit ? "PUT" : "POST";

    const payload = {
      Dep_name: selectedDept.Dep_name,
      Dep_head: selectedDept.Dep_head,
      Dep_icon: selectedDept.Dep_icon,
      bg_color: selectedDept.bg_color,
      icon_color: selectedDept.icon_color,
    };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.status === 422) {
      const errorData = await res.json();
      console.error("Validation Error Details:", errorData.detail);
      alert("Check the console for validation errors (422)");
      return;
    }

    if (!res.ok) throw new Error("Save failed");

    fetchDepartments();
    setShowModal(false);
  } catch (error) {
    console.error("Save error:", error);
  }
};

  // ✅ DELETE
  const handleDelete = async (row: any) => {
    if (!confirm("Are you sure?")) return;

    try {
      const res = await fetch(`${API_URL}${row.Dep_id}`, {   // ✅ FIXED
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Delete failed");
        return;
      }

      fetchDepartments();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ✅ MODAL
  const openModal = (dept: any = null) => {
    if (dept) {
      setSelectedDept(dept);
      setIsEditing(true);
    } else {
      setSelectedDept({
        Dep_id: null,
        Dep_name: "",
        Dep_head: "",
        Dep_icon: "FaBuilding",
        bg_color: "#dcfce7",
        icon_color: "#16a34a"
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

        <SearchBar value={searchTerm} onChange={(e: any) => setSearchTerm(e.target.value)} />

        {isLoading ? (
          <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" /></div>
        ) : (
          <DepartmentTable
            columns={[
              { header: "Dept", accessor: "Dep_name" }, // Adjusted accessor
              { header: "Head", accessor: "Dep_head" }, // Adjusted accessor
            ]}
            departmentsData={departments.filter(d => d.Dep_name?.toLowerCase().includes(searchTerm.toLowerCase()))}
            onEdit={(row: any) => openModal(row)}
            onDelete={handleDelete}
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
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold">{isEditing ? "Edit" : "Add"} Department</h3>
                <button onClick={() => setShowModal(false)}>✕</button>
              </div>

              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                <div className="space-y-4">
                    <FormFiled 
                      Lable="Department Name"
                      value={selectedDept.Dep_name}
                      onChange={(e) => setSelectedDept({ ...selectedDept, Dep_name: e.target.value })} 
                      in_PlaceHolder="Enter Dept Name"
                    />
                    <FormFiled 
                      Lable="Department Head"
                      value={selectedDept.Dep_head}
                      onChange={(e) => setSelectedDept({ ...selectedDept, Dep_head: e.target.value })} 
                      in_PlaceHolder="Enter Head Name"
                    />
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 block">Select Icon</label>
                  <div className="grid grid-cols-6 gap-3">
                    {ICON_LIST.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => setSelectedDept({ ...selectedDept, Dep_icon: item.name })}
                        className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                          selectedDept.Dep_icon === item.name 
                          ? "bg-indigo-600 text-white ring-4 ring-indigo-100" 
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        <item.icon size={20} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Icon Color</label>
                    <HexColorPicker 
                      color={selectedDept.icon_color} 
                      onChange={(color: string) => setSelectedDept({ ...selectedDept, icon_color: color })} 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Background Color</label>
                    <HexColorPicker 
                      color={selectedDept.bg_color} 
                      onChange={(color: string) => setSelectedDept({ ...selectedDept, bg_color: color })} 
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="p-4 border rounded-2xl bg-gray-50 flex items-center gap-4">
                    <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: selectedDept.bg_color }}
                    >
                        {(() => {
                            const IconObj = ICON_LIST.find(i => i.name === selectedDept.Dep_icon)?.icon || FaBuilding;
                            return <IconObj style={{ color: selectedDept.icon_color }} size={24} />;
                        })()}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">{selectedDept.Dep_name || "Preview Name"}</p>
                        <p className="text-xs text-gray-500">Head: {selectedDept.Dep_head || "---"}</p>
                    </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
                <button onClick={() => setShowModal(false)} className="px-5 py-2 font-bold text-gray-500">Cancel</button>
                <button onClick={handleSave} className="bg-indigo-600 text-white px-8 py-2 rounded-xl font-bold shadow-lg">
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