import { AnimatePresence, motion } from "framer-motion";
import { Edit3, Trash2 } from "lucide-react";
// Import the icons again for the mapping
import { 
  FaFireExtinguisher, FaUserTie, FaLaptopCode, 
  FaTools, FaBuilding, FaStethoscope 
} from "react-icons/fa";

// This must match the list in your main Stacks file
const ICON_MAP: Record<string, any> = {
  FaFireExtinguisher: FaFireExtinguisher,
  FaUserTie: FaUserTie,
  FaLaptopCode: FaLaptopCode,
  FaTools: FaTools,
  FaBuilding: FaBuilding,
  FaStethoscope: FaStethoscope,
};

type Column = {
  header: string;
  accessor: string;
};

interface TableDataProps {
  columns: Column[];
  departmentsData: Record<string, any>[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
}

export const DepartmentTable = ({
  columns,
  departmentsData,
  onEdit,
  onDelete,
}: TableDataProps) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                {col.header}
              </th>
            ))}
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {departmentsData?.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="text-center py-10 text-slate-400">
                No Departments Found
              </td>
            </tr>
          ) : (
            <AnimatePresence mode="popLayout">
              {departmentsData?.map((dept, index) => (
                <motion.tr
                  key={dept.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                >
                  {columns.map((col, i) => {
                    const value = dept[col.accessor];

                    if (col.accessor === "name") {
                      // 🔥 FIX: Lookup the component using the string stored in 'iconName'
                      const RowIcon = ICON_MAP[dept.iconName] || FaBuilding; 

                      return (
                        <td key={i} className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="p-2 rounded-lg flex items-center justify-center"
                              style={{
                                backgroundColor: dept.iconBg || "#eef2ff",
                                color: dept.iconColor || "#4f46e5",
                              }}
                            >
                              <RowIcon size={20} />
                            </div>
                            <span className="font-semibold text-slate-700">
                              {value}
                            </span>
                          </div>
                        </td>
                      );
                    }

                    return (
                      <td key={i} className="px-6 py-4 text-slate-600">
                        {col.accessor === "employees" ? `${value || 0} Members` : value}
                      </td>
                    );
                  })}

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit?.(dept)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => onDelete?.(dept)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          )}
        </tbody>
      </table>
    </div>
  );
};