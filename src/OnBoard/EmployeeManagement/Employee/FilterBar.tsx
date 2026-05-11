import { useState, useRef, useEffect } from "react";
import { ChevronDown, Filter } from "lucide-react"; // npm i lucide-react

interface FilterBarProps {
  departments: string[];
  value: string;
  onChange: (value: string) => void;
}

export default function FilterBar({ departments, value, onChange }: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* LABEL / TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 h-10 px-4 rounded-xl transition-all duration-200
          ${isOpen 
            ? "bg-white ring-4 ring-indigo-50 shadow-sm" 
            : "bg-white  hover:shadow-sm text-slate-600"}
        `}
      >
        <Filter className={`w-4 h-4 ${isOpen ? "text-indigo-500" : "text-slate-400"}`} />
        <span className="text-sm font-medium">
          {value === "All" ? "All Departments" : value}
        </span>
        <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-200 ${isOpen ? "rotate-180 text-indigo-500" : "text-slate-400"}`} />
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in duration-100">
          <div className="p-1.5">
            {departments.map((dept) => {
              const isSelected = value === dept;
              return (
                <button
                  key={dept}
                  onClick={() => {
                    onChange(dept);
                    setIsOpen(false);
                  }}
                  className={`
                    flex items-center justify-between w-full px-3 py-2.5 text-sm rounded-lg transition-colors
                    ${isSelected 
                      ? "bg-indigo-50 text-indigo-700 font-semibold" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
                  `}
                >
                  {dept === "All" ? "All Departments" : dept}
                  
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}