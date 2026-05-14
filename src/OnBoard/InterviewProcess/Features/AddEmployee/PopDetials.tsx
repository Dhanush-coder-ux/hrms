import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, X } from "lucide-react";
import { useEffect } from "react";

type PopupProps = {
  message: string;
  type?: "success" | "error";
  isVisible: boolean;
  onClose: () => void;
};

export const MessagePopup = ({ message, type, isVisible, onClose }: PopupProps) => {
  // Auto-hide after 4 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: "-50%" }}
          animate={{ opacity: 1, y: 20, x: "-50%" }}
          exit={{ opacity: 0, y: -20, x: "-50%" }}
          className={`fixed top-0 left-1/2 z-100 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border min-w-[320px] ${
            type === "success" 
              ? "bg-primary/5 border-primary/20 text-primary" 
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {type === "success" ? (
            <CheckCircle className="text-primary" size={20} />
          ) : (
            <XCircle className="text-red-500" size={20} />
          )}
          
          <span className="text-sm font-semibold flex-1">{message}</span>

          <button 
            onClick={onClose}
            className="p-1 hover:bg-black/5 rounded-full transition-colors"
          >
            <X size={16} className="opacity-50" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
