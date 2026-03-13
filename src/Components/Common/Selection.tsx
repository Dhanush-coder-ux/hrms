import React, { useState, useRef, useEffect } from "react";

type Option = { label: string; value: string | number; };
type SelectionProps = {
  label: string; name: string; value: string;
  options: Option[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
};

export const Selection = ({ label, name, value, options, onChange, placeholder }: SelectionProps) => {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hiddenSelectRef = useRef<HTMLSelectElement>(null);

  const selected = options.find(o => String(o.value) === String(value));
  const displayLabel = selected ? selected.label : placeholder ?? "Select…";
  const hasValue = !!selected;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false); setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (opt: Option) => {
    const nativeSelect = hiddenSelectRef.current;
    if (nativeSelect) {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, "value")?.set;
      setter?.call(nativeSelect, String(opt.value));
      nativeSelect.dispatchEvent(new Event("change", { bubbles: true }));
    }
    setOpen(false); setFocused(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        .sel-wrapper { font-family: 'DM Sans', sans-serif; position: relative; width: 100%; user-select: none; }

        /* Label — 600, dark, readable */
        .sel-label {
          display: block; font-size: 12px; font-weight: 600;
          letter-spacing: 0.07em; text-transform: uppercase;
          color: #475569; margin-bottom: 7px; transition: color 0.18s ease;
        }
        .sel-label.focused   { color: #4f46e5; }
        .sel-label.has-value { color: #334155; }

        /* Trigger — same height as FormFiled */
        .sel-trigger {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          gap: 8px; padding: 11px 14px;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          background: #fff; border: 1.5px solid #868687;
          border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          cursor: pointer; transition: all 0.2s cubic-bezier(0.4,0,0.2,1); outline: none;
        }
        .sel-trigger:hover       { border-color: #a5b4fc; box-shadow: 0 2px 6px rgba(0,0,0,0.07); }
        .sel-trigger.open,
        .sel-trigger:focus       { border-color: #6366f1; box-shadow: 0 0 0 3.5px rgba(99,102,241,0.15); }

        /* Trigger text — near-black when selected, visible slate for placeholder */
        .sel-trigger-text {
          font-size: 14px; font-weight: 400; color: #0f172a;
          flex: 1; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .sel-trigger-text.placeholder { color: #94a3b8; font-weight: 400; }

        .sel-chevron {
          color: #64748b; flex-shrink: 0;
          transition: transform 0.22s cubic-bezier(0.4,0,0.2,1), color 0.18s;
        }
        .sel-trigger.open .sel-chevron { transform: rotate(180deg); color: #4f46e5; }

        /* Dropdown */
        .sel-dropdown {
          position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 50;
          background: #fff; border: 1.5px solid #e2e8f0; border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06);
          overflow: hidden;
          animation: sel-pop 0.18s cubic-bezier(0.34,1.56,0.64,1) forwards;
          transform-origin: top center;
        }
        @keyframes sel-pop {
          from { opacity: 0; transform: scaleY(0.92) translateY(-4px); }
          to   { opacity: 1; transform: scaleY(1)    translateY(0); }
        }

        .sel-options {
          max-height: 220px; overflow-y: auto; padding: 6px;
          scrollbar-width: thin; scrollbar-color: #e2e8f0 transparent;
        }
        .sel-options::-webkit-scrollbar { width: 4px; }
        .sel-options::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }

        /* Options — 14px, strong contrast */
        .sel-option {
          display: flex; align-items: center; justify-content: space-between;
          padding: 9px 12px; border-radius: 8px;
          font-size: 14px; font-weight: 400; color: #1e293b;
          cursor: pointer; transition: background 0.12s, color 0.12s; gap: 8px;
        }
        .sel-option:hover            { background: #eef2ff; color: #4338ca; }
        .sel-option.selected         { background: #eef2ff; color: #4338ca; font-weight: 600; }
        .sel-option-check            { flex-shrink: 0; opacity: 0; transition: opacity 0.15s; color: #6366f1; }
        .sel-option.selected .sel-option-check { opacity: 1; }

        .sel-placeholder-opt {
          padding: 9px 12px; font-size: 12px; font-weight: 600;
          letter-spacing: 0.05em; text-transform: uppercase;
          color: #94a3b8; cursor: pointer; border-radius: 8px; transition: background 0.12s;
        }
        .sel-placeholder-opt:hover { background: #f8fafc; }
        .sel-divider { height: 1px; background: #f1f5f9; margin: 4px 6px; }

        .sel-native { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
      `}</style>

      <div className="sel-wrapper" ref={wrapperRef}>
        <select ref={hiddenSelectRef} name={name} value={value} onChange={onChange}
          className="sel-native" tabIndex={-1} aria-hidden="true">
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt, i) => <option key={`${opt.value}-${i}`} value={opt.value}>{opt.label}</option>)}
        </select>

        <label className={`sel-label ${focused || open ? "focused" : ""} ${hasValue ? "has-value" : ""}`}>
          {label}
        </label>

        <div role="combobox" aria-expanded={open} aria-haspopup="listbox" tabIndex={0}
          className={`sel-trigger ${open ? "open" : ""}`}
          onClick={() => { setOpen(o => !o); setFocused(true); }}
          onFocus={() => setFocused(true)}
          onBlur={() => !open && setFocused(false)}
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(o => !o); }
            if (e.key === "Escape") { setOpen(false); setFocused(false); }
          }}>
          <span className={`sel-trigger-text ${!hasValue ? "placeholder" : ""}`}>{displayLabel}</span>
          <svg className="sel-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {open && (
          <div className="sel-dropdown" role="listbox">
            <div className="sel-options">
              {placeholder && (
                <>
                  <div className="sel-placeholder-opt" role="option" aria-selected={!hasValue}
                    onClick={() => handleSelect({ label: placeholder, value: "" })}>
                    {placeholder}
                  </div>
                  <div className="sel-divider" />
                </>
              )}
              {options.map((opt, i) => {
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
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};