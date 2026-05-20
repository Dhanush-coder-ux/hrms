import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search, Check } from "lucide-react";
import { inputTheme } from "../../Themes/ComponentsThems/InputTheme";

type Option = { label: string; value: string | number };

type SelectionProps = {
  label?: string;
  name: string;
  value: string | number;
  options: Option[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  compact?: boolean;
  disabled?: boolean;
  error?: string;
  required?: boolean;
};

export const Selection = ({
  label,
  name,
  value,
  options,
  onChange,
  placeholder,
  compact = false,
  disabled = false,
  error,
  required,
}: SelectionProps) => {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const triggerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find selected option by matching value (always string-compare)
  const selected = options.find((o) => String(o.value) === String(value));
  const hasValue = !!selected;

  // Filter options by search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  // Reset search when dropdown closes
  useEffect(() => {
    if (!open) setSearchQuery("");
  }, [open]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  // Position the portal dropdown below the trigger
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !dropdownRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const el = dropdownRef.current;
    
    // Check if it would overflow the right side
    let left = rect.left;
    if (left + rect.width > window.innerWidth) {
      left = window.innerWidth - rect.width - 16;
    }
    
    if (left < 0) left = 16;

    el.style.top = `${rect.bottom + 6}px`;
    el.style.left = `${left}px`;
    el.style.width = `${rect.width}px`;
  }, []);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(updatePosition);
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setOpen(false);
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSelect = useCallback(
    (opt: Option) => {
      const syntheticEvent = {
        target: {
          name,                     
          value: String(opt.value), 
        },
      } as React.ChangeEvent<HTMLSelectElement>;

      onChange(syntheticEvent);
      setOpen(false);
      setFocused(false);
      setSearchQuery("");
    },
    [name, onChange]
  );

  const dropdown = createPortal(
    <div
      ref={dropdownRef}
      className={`${inputTheme.select.dropdown} ${open ? "opacity-100 scale-100" : "opacity-0 scale-95"} transition-all duration-200`}
      style={{
        position: "fixed",
        zIndex: 9999,
        visibility: open ? "visible" : "hidden",
        pointerEvents: open ? "auto" : "none",
      }}
    >
      <div className="flex items-center gap-2 p-2.5 border-b border-slate-50">
        <Search size={13} className="text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent border-none outline-none text-[13px] font-medium text-slate-900 placeholder:text-slate-300"
          placeholder="Search…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") { setOpen(false); setFocused(false); }
            if (e.key === "Enter" && filteredOptions.length > 0) {
              handleSelect(filteredOptions[0]);
            }
          }}
        />
      </div>

      <div className="max-h-[200px] overflow-y-auto p-1.5 custom-scrollbar">
        {placeholder && (
          <button
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-bold transition-all ${!value ? "bg-primary/5 text-primary" : "hover:bg-slate-50 text-slate-400"}`}
            onClick={() => handleSelect({ label: placeholder, value: "" })}
          >
            {placeholder}
            {!value && <Check size={14} />}
          </button>
        )}

        {filteredOptions.length > 0 ? (
          filteredOptions.map((opt, i) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <button
                key={`${opt.value}-${i}`}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-bold transition-all ${isSelected ? "bg-primary/5 text-primary" : "hover:bg-slate-50 text-slate-600"}`}
                onClick={() => handleSelect(opt)}
              >
                <span>{opt.label}</span>
                {isSelected && <Check size={14} />}
              </button>
            );
          })
        ) : (
          <div className="p-4 text-center text-xs text-slate-300 font-medium">No results found</div>
        )}
      </div>
    </div>,
    document.body
  );

  return (
    <div className="w-full">
      {label && (
        <label
          className={`${inputTheme.label} ${focused || open ? "text-primary" : ""} ${error ? "text-rose-500" : ""}`}
        >
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}

      <div
        ref={triggerRef}
        className={`${inputTheme.select.trigger} ${open ? "border-primary ring-4 ring-primary/10 shadow-sm" : ""} ${compact ? "py-1.5 px-3 rounded-lg" : ""} ${disabled ? "opacity-60 cursor-not-allowed bg-slate-50 border-slate-200" : "cursor-pointer"} ${error ? inputTheme.error : ""} transition-all group`}
        onClick={() => { 
          if (disabled) return;
          setOpen((o) => !o); 
          setFocused(true); 
        }}
        onFocus={() => { if (!disabled) setFocused(true); }}
        onBlur={() => { if (!open) setFocused(false); }}
        tabIndex={disabled ? -1 : 0}
      >
        <span className={`flex-1 truncate text-sm font-bold ${!hasValue ? "text-slate-300" : "text-slate-900"}`}>
          {selected ? selected.label : (placeholder ?? "Select…")}
        </span>
        <ChevronDown 
          size={16} 
          className={`text-slate-400 transition-transform duration-300 ${open ? 'rotate-180 text-primary' : ''} ${error ? 'text-rose-500' : ''}`} 
        />
      </div>

      {dropdown}

      {error && (
        <span className="text-[10px] font-bold text-rose-500 mt-1.5 px-1 uppercase tracking-wider block">
          {error}
        </span>
      )}
    </div>
  );
};