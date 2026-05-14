import { useState } from "react";
import { useTheme } from "./ThemeContext";
import { Palette, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const THEMES = [
  { name: "Indigo", primary: "239 84% 67%", bg: "239 100% 98%", text: "239 60% 20%" },
  { name: "Emerald", primary: "142 70% 45%", bg: "142 70% 98%", text: "142 70% 15%" },
  { name: "Rose", primary: "346 84% 61%", bg: "346 84% 98%", text: "346 84% 20%" },
  { name: "Amber", primary: "37 90% 51%", bg: "37 90% 98%", text: "37 90% 15%" },
  { name: "Sky", primary: "199 89% 48%", bg: "199 89% 98%", text: "199 89% 20%" },
  { name: "Violet", primary: "262 83% 58%", bg: "262 83% 98%", text: "262 83% 20%" },
];

export const ThemeToggle = () => {
  const { primaryColor, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const currentTheme = THEMES.find(t => t.primary === primaryColor) || THEMES[0];

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 bg-white border border-slate-200 pl-3 pr-2 py-1.5 rounded-xl shadow-sm hover:border-primary/50 transition-all active:scale-95 group"
      >
        <div 
          className="w-4 h-4 rounded-full shadow-inner" 
          style={{ backgroundColor: `hsl(${primaryColor})` }}
        />
        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
          {currentTheme.name}
        </span>
        <ChevronDown 
          size={14} 
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Popover */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for closing */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 origin-top-right"
            >
              <div className="px-3 py-2 border-b border-slate-50 mb-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Palette size={10} />
                  Select Theme
                </p>
              </div>

              <div className="space-y-0.5">
                {THEMES.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => {
                      setTheme(t.primary, t.bg, t.text);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl transition-all group ${
                      primaryColor === t.primary 
                        ? "bg-primary/5 text-primary" 
                        : "hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: `hsl(${t.primary})` }}
                      />
                      <span className="text-[12px] font-bold">{t.name}</span>
                    </div>
                    {primaryColor === t.primary && (
                      <Check size={14} className="text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
