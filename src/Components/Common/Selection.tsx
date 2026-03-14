import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

type Option = { label: string; value: string | number };
type SelectionProps = {
  label: string; name: string; value: string;
  options: Option[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
};

export const Selection = ({ label, name, value, options, onChange, placeholder }: SelectionProps) => {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  const triggerRef = useRef<HTMLDivElement>(null);
  const hiddenSelectRef = useRef<HTMLSelectElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = options.find(o => String(o.value) === String(value));
  const displayLabel = selected ? selected.label : placeholder ?? "Select…";
  const hasValue = !!selected;

  // FIX: Mutate dropdown DOM styles directly instead of calling setState.
  // The old approach (setDropdownStyle → re-render) was forcing a full React
  // render cycle on every scroll/resize, which caused the trigger to repaint and jitter.
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !dropdownRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const el = dropdownRef.current;
    el.style.top   = `${rect.bottom + 6}px`;
    el.style.left  = `${rect.left}px`;
    el.style.width = `${rect.width}px`;
  }, []);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(updatePosition); // after paint so ref is in DOM
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
        setOpen(false); setFocused(false);
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
    setOpen(false); setFocused(false);
  };

  // FIX: Keep dropdown always mounted (visibility:hidden when closed) instead of
  // conditionally rendering. Mount/unmount causes layout recalc that jitters the trigger.
  const dropdown = createPortal(
    <div
      ref={dropdownRef}
      className={`sel-portal-dropdown ${open ? "is-open" : ""}`}
      style={{ position: "fixed", zIndex: 9999, visibility: open ? "visible" : "hidden", pointerEvents: open ? "auto" : "none" }}
    >
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
        .sel-label.focused   { color: #4f46e5; }
        .sel-label.has-value { color: #334155; }

        .sel-trigger {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          gap: 8px; padding: 11px 14px;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          background: #fff; border: 1.5px solid #868687; border-radius: 10px;
          /* FIX: always keep both shadow layers — only their alpha changes, never the layer count */
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 0 0 3.5px transparent;
          cursor: pointer;
          /* FIX: scope transition to only changing properties — "transition:all" repaints everything */
          transition: border-color 0.2s cubic-bezier(0.4,0,0.2,1),
                      box-shadow   0.2s cubic-bezier(0.4,0,0.2,1);
          /* FIX: transparent outline prevents the browser from flashing its default focus ring */
          outline: 2px solid transparent;
          /* FIX: promote to compositor layer so shadow/border changes don't repaint parent flow */
          will-change: box-shadow, border-color;
        }
        .sel-trigger:hover {
          border-color: #a5b4fc;
          box-shadow: 0 2px 6px rgba(0,0,0,0.07), 0 0 0 3.5px transparent;
        }
        .sel-trigger.open,
        .sel-trigger:focus {
          border-color: #6366f1;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 0 0 3.5px rgba(99,102,241,0.15);
        }

        .sel-trigger-text {
          font-size: 14px; font-weight: 400; color: #0f172a;
          flex: 1; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .sel-trigger-text.placeholder { color: #94a3b8; }

        .sel-chevron {
          color: #64748b; flex-shrink: 0;
          transition: transform 0.22s cubic-bezier(0.4,0,0.2,1), color 0.18s;
          /* FIX: own compositor layer so chevron rotation doesn't invalidate trigger layout */
          will-change: transform;
        }
        .sel-trigger.open .sel-chevron { transform: rotate(180deg); color: #4f46e5; }

        /* ── Portal dropdown ── */
        .sel-portal-dropdown {
          background: #fff; border: 1.5px solid #e2e8f0; border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06);
          overflow: hidden;
        }
        /* FIX: only animate when becoming visible — no animation on hidden state */
        .sel-portal-dropdown.is-open {
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

        .sel-option {
          display: flex; align-items: center; justify-content: space-between;
          padding: 9px 12px; border-radius: 8px;
          font-size: 14px; font-weight: 400; color: #1e293b;
          cursor: pointer; transition: background 0.12s, color 0.12s; gap: 8px;
        }
        .sel-option:hover          { background: #eef2ff; color: #4338ca; }
        .sel-option.selected       { background: #eef2ff; color: #4338ca; font-weight: 600; }
        .sel-option-check          { flex-shrink: 0; opacity: 0; transition: opacity 0.15s; color: #6366f1; }
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
          role="combobox" aria-expanded={open} aria-haspopup="listbox" tabIndex={0}
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

        {dropdown}
      </div>
    </>
  );
};