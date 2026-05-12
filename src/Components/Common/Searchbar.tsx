import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Search name or ID...",
  className = "w-[260px]"
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search 
        size={15} 
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" 
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-[42px] w-full pl-10 pr-3.5 rounded-xl border-[1.5px] border-slate-200 bg-white text-sm font-medium text-slate-900 shadow-sm outline-none transition-all focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-300"
      />
    </div>
  );
}