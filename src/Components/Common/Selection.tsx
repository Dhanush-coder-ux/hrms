import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";

type Option = { label: string; value: string | number };
type SelectionProps = {
  label: string;
  name: string;
  value: string;
  options: Option[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
};

export const Selection = ({ label, name, value, options, onChange, placeholder }: SelectionProps) => {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const triggerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hiddenSelectRef = useRef<HTMLSelectElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = options.find(o => String(o.value) === String(value));
  const hasValue = !!selected;

  // Filter logic: Case-insensitive search
  const filteredOptions = useMemo(() => {
    return options.filter(opt => 
      opt.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  // Sync search query with selection when dropdown closes or value changes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
    }
  }, [open, value]);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !dropdownRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const el = dropdownRef.current;
    el.style.top = `${rect.bottom + 6}px`;
    el.style.left = `${rect.left}px`;
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

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setOpen(false);
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSelect = (opt: Option) => {
    const nativeSelect = hiddenSelectRef.current;
    if (nativeSelect) {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, "value")?.set;
      setter?.call(nativeSelect, String(opt.value));
      nativeSelect.dispatchEvent(new Event("change", { bubbles: true }));
    }
    setOpen(false);
    setFocused(false);
    setSearchQuery("");
  };

  const dropdown = createPortal(
    <div
      ref={dropdownRef}
      className={`sel-portal-dropdown ${open ? "is-open" : ""}`}
      style={{ position: "fixed", zIndex: 9999, visibility: open ? "visible" : "hidden", pointerEvents: open ? "auto" : "none" }}
    >
      <div className="sel-options">
        {placeholder && !searchQuery && (
          <>
            <div className="sel-placeholder-opt" role="option" aria-selected={!hasValue}
              onClick={() => handleSelect({ label: placeholder, value: "" })}>
              {placeholder}
            </div>
            <div className="sel-divider" />
          </>
        )}
        
        {filteredOptions.length > 0 ? (
          filteredOptions.map((opt, i) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <div key={`${opt.value}-${i}`} className={`sel-option ${isSelected ? "selected" : ""}`}
                role="option" aria-selected={isSelected} onClick={() => handleSelect(opt)}>
                <span>{opt.label}</span>
                <svg className="sel-option-check" width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2 6.5L5.2 10L11 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            );
          })
        ) : (
          <div className="sel-no-results">No matches found</div>
        )}
      </div>
    </div>,
    document.body
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        .sel-wrapper { font-family: 'DM Sans', sans-serif; position: relative; width: 100%; user-select: none; }
        .sel-label {
          display: block; font-size: 12px; font-weight: 600;
          letter-spacing: 0.07em; text-transform: uppercase;
          color: #475569; margin-bottom: 7px; transition: color 0.18s ease;
        }
        .sel-label.focused { color: #4f46e5; }
        .sel-label.has-value { color: #334155; }

        .sel-trigger {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          gap: 8px; padding: 11px 14px; background: #fff; border: 1.5px solid #cbd5e1; border-radius: 10px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 0 0 3.5px transparent;
          cursor: text; transition: border-color 0.2s, box-shadow 0.2s; outline: 2px solid transparent;
          will-change: box-shadow, border-color;
        }
        .sel-trigger:hover { border-color: #a5b4fc; }
        .sel-trigger.open { border-color: #6366f1; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 0 0 3.5px rgba(99,102,241,0.15); }

        .sel-input {
          flex: 1; border: none; outline: none; padding: 0; margin: 0;
          font-family: inherit; font-size: 14px; color: #0f172a;
          background: transparent; width: 100%;
        }
        .sel-input::placeholder { color: #94a3b8; }

        .sel-chevron { color: #64748b; flex-shrink: 0; transition: transform 0.22s, color 0.18s; }
        .sel-trigger.open .sel-chevron { transform: rotate(180deg); color: #4f46e5; }

        .sel-portal-dropdown {
          background: #fff; border: 1.5px solid #e2e8f0; border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06);
          overflow: hidden;
        }
        .sel-portal-dropdown.is-open { animation: sel-pop 0.18s cubic-bezier(0.34,1.56,0.64,1) forwards; transform-origin: top center; }
        @keyframes sel-pop { from { opacity: 0; transform: scaleY(0.92) translateY(-4px); } to { opacity: 1; transform: scaleY(1) translateY(0); } }

        .sel-options { max-height: 220px; overflow-y: auto; padding: 6px; }
        .sel-option {
          display: flex; align-items: center; justify-content: space-between;
          padding: 9px 12px; border-radius: 8px; font-size: 14px; cursor: pointer; transition: background 0.12s;
        }
        .sel-option:hover { background: #eef2ff; color: #4338ca; }
        .sel-option.selected { background: #eef2ff; color: #4338ca; font-weight: 600; }
        .sel-option-check { opacity: 0; color: #6366f1; }
        .sel-option.selected .sel-option-check { opacity: 1; }
        .sel-no-results { padding: 12px; font-size: 13px; color: #94a3b8; text-align: center; }

        .sel-placeholder-opt { padding: 9px 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #94a3b8; cursor: pointer; border-radius: 8px; }
        .sel-divider { height: 1px; background: #f1f5f9; margin: 4px 6px; }
        .sel-native { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
      `}</style>

      <div className="sel-wrapper">
        <select ref={hiddenSelectRef} name={name} value={value} onChange={onChange}
          className="sel-native" tabIndex={-1} aria-hidden="true">
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt, i) => <option key={`${opt.value}-${i}`} value={opt.value}>{opt.label}</option>)}
        </select>

        <label className={`sel-label ${focused || open ? "focused" : ""} ${hasValue ? "has-value" : ""}`}>
          {label}
        </label>

        <div
          ref={triggerRef}
          className={`sel-trigger ${open ? "open" : ""}`}
          onClick={() => {
            setOpen(true);
            inputRef.current?.focus();
          }}
        >
          <input
            ref={inputRef}
            type="text"
            className="sel-input"
            value={open ? searchQuery : (selected?.label || "")}
            placeholder={selected ? selected.label : (placeholder ?? "Select…")}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (!open) setOpen(true);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              if (!open) setFocused(false);
            }}
            onKeyDown={e => {
              if (e.key === "Escape") { setOpen(false); setFocused(false); }
              if (e.key === "ArrowDown" && !open) { setOpen(true); }
            }}
          />
          <svg className="sel-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {dropdown}
      </div>
    </>
  );
};