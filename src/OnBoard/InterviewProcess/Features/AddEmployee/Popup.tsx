import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, User, Briefcase, CreditCard } from "lucide-react";

type PopupProps = {
  isVisible: boolean;
  onClose: () => void;
  type: "success" | "error";
  message: string;
  data?: any; // Pass the finalData here to show details
};

export const Popup = ({ isVisible, onClose, type, message, data }: PopupProps) => {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100"
        >
          {/* Header Section */}
          <div className={`p-6 text-center ${type === 'success' ? 'bg-primary/5' : 'bg-red-50'}`}>
            <div className="flex justify-end">
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col items-center gap-2">
              {type === "success" ? (
                <CheckCircle size={48} className="text-primary" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xl">!</div>
              )}
              <h2 className="text-2xl font-bold text-gray-800">{type === "success" ? "Success!" : "Notice"}</h2>
              <p className="text-gray-600">{message}</p>
            </div>
          </div>

          {/* Details Section (Only shows if data is provided) */}
          {data && type === "success" && (
            <div className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Employee Summary</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <User size={18} className="text-primary mt-1" />
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm font-semibold text-gray-800">{data.f_name} {data.l_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <Briefcase size={18} className="text-primary mt-1" />
                  <div>
                    <p className="text-xs text-gray-500">ID & Dept</p>
                    <p className="text-sm font-semibold text-gray-800">{data.Emp_id} | {data.Department}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl col-span-2">
                  <CreditCard size={18} className="text-primary mt-1" />
                  <div>
                    <p className="text-xs text-gray-500">Salary Details</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {data.currency} {data.annualSalary?.toLocaleString()} / Year
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Button */}
          <div className="p-6 pt-0">
            <button
              onClick={onClose}
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                type === "success" 
                ? "bg-primary text-white hover:brightness-110 shadow-lg shadow-primary/20" 
                : "bg-gray-800 text-white hover:bg-gray-900"
              }`}
            >
              Continue to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};




