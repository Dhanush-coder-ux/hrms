import { AnimatePresence, motion } from "framer-motion";
import { Edit3, Trash2, User } from "lucide-react";
import { 
  FaFireExtinguisher, FaUserTie, FaLaptopCode, 
  FaTools, FaBuilding, FaStethoscope 
} from "react-icons/fa";

const ICON_MAP: Record<string, any> = {
  FaFireExtinguisher, FaUserTie, FaLaptopCode, 
  FaTools, FaBuilding, FaStethoscope 
};

interface DepartmentListProps {
  departmentsData: Record<string, any>[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
}

export const DepartmentList = ({
  departmentsData,
  onEdit,
  onDelete,
}: DepartmentListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {departmentsData?.length === 0 ? (
        <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-400 font-medium">No Departments Found</p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {departmentsData?.map((dept, index) => {
            const RowIcon = ICON_MAP[dept.Dep_icon] || FaBuilding;

            return (
              <motion.div
  key={dept.Dep_id || index}
  layout
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.9 }}
  transition={{ duration: 0.2 }}
  // Added 'flex flex-col h-full' to ensure internal alignment
  className="group relative flex flex-col h-full bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
>
  {/* TOP SECTION: Grows to fill space */}
  <div className="flex-1"> 
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        {/* Icon Container */}
        <div
          className="w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center shadow-sm"
          style={{
            backgroundColor: dept.bg_color || "#f1f5f9",
            color: dept.icon_color || "#64748b",
          }}
        >
          <RowIcon size={22} />
        </div>

        <div className="min-w-0"> {/* min-w-0 prevents flex-overflow */}
          <h3 className="font-bold text-slate-800 text-lg leading-tight truncate-2-lines">
            {dept.Dep_name}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-slate-500">
            <User size={14} className="text-slate-400" />
            <span className="text-xs font-medium uppercase tracking-wider truncate">
              {dept.Dep_head || "No Head Assigned"}
            </span>
          </div>
        </div>
      </div>

      {/* Actions Menu */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button onClick={() => onEdit?.(dept)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
          <Edit3 size={18} />
        </button>
        <button onClick={() => onDelete?.(dept)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  </div>

  {/* BOTTOM SECTION: Always stays at the bottom */}
  <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
      ID: {dept.Dep_id || "NEW"}
    </span>
    <div className="text-xs font-medium text-slate-500">
      Employees:
      <span className="ml-1 px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full text-[10px] font-bold">
        {dept.Total_employees}
      </span>
    </div>
  </div>
</motion.div>
            );
          })}
        </AnimatePresence>
      )}
    </div>
  );
};