import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";

type Option = { label: string; value: string | number };

type SelectionProps = {
  label?: string;
  name: string;
  value: string | number;
  options: Option[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  compact?: boolean;
};

export const Selection = ({
  label,
  name,
  value,
  options,
  onChange,
  placeholder,
  compact = false,
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
    el.style.top = `${rect.bottom + 6}px`;
    el.style.left = `${rect.left}px`;
    el.style.width = `${rect.width}px`;
    if (compact) el.style.width = "auto";
    if (compact) el.style.minWidth = "120px";
  }, [compact]);

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
      className={`sel-portal-dropdown ${open ? "is-open" : ""} ${compact ? "compact" : ""}`}
      style={{
        position: "fixed",
        zIndex: 9999,
        visibility: open ? "visible" : "hidden",
        pointerEvents: open ? "auto" : "none",
      }}
    >
      <div className="sel-search-wrap">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="sel-search-icon">
          <circle cx="6" cy="6" r="4.5" stroke="#94a3b8" strokeWidth="1.4" />
          <path d="M9.5 9.5L12 12" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className="sel-search-input"
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

      <div className="sel-divider" />

      <div className="sel-options">
        {placeholder && (
          <div
            className={`sel-option ${!value ? "selected" : ""}`}
            role="option"
            aria-selected={!value}
            onClick={() => handleSelect({ label: placeholder, value: "" })}
          >
            <span className="sel-placeholder-text">{placeholder}</span>
            <svg className="sel-option-check" width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 6.5L5.2 10L11 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}

        {filteredOptions.length > 0 ? (
          filteredOptions.map((opt, i) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <div
                key={`${opt.value}-${i}`}
                className={`sel-option ${isSelected ? "selected" : ""}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt)}
              >
                <span>{opt.label}</span>
                <svg className="sel-option-check" width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2 6.5L5.2 10L11 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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

        .sel-wrapper {
          font-family: 'DM Sans', sans-serif;
          position: relative; width: 100%; user-select: none;
        }
        .sel-label {
          display: block; font-size: 12px; font-weight: 600;
          letter-spacing: 0.07em; text-transform: uppercase;
          color: #475569; margin-bottom: 7px; transition: color 0.18s ease;
        }
        .sel-label.focused { color: #4f46e5; }
        .sel-label.has-value { color: #334155; }

        .sel-trigger {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          gap: 8px; padding: 11px 14px; background: #fff;
          border: 1.5px solid #868687; border-radius: 10px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 0 0 3.5px transparent;
          cursor: pointer; transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }
        .sel-trigger.compact {
           padding: 4px 8px; border-radius: 8px; border-color: #cbd5e1;
        }
        .sel-trigger:hover { border-color: #a5b4fc; }
        .sel-trigger.open {
          border-color: #6366f1;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 0 0 3.5px rgba(99,102,241,0.15);
        }

        .sel-display {
          flex: 1; font-size: 14px; color: #0f172a;
          text-align: left; overflow: hidden;
          white-space: nowrap; text-overflow: ellipsis;
        }
        .sel-trigger.compact .sel-display { font-size: 13px; font-weight: 600; color: #1e293b; }
        .sel-display.placeholder-text { color: #94a3b8; }

        .sel-chevron { color: #64748b; flex-shrink: 0; transition: transform 0.22s, color 0.18s; }
        .sel-trigger.open .sel-chevron { transform: rotate(180deg); color: #4f46e5; }

        .sel-portal-dropdown {
          background: #fff; border: 1.5px solid #e2e8f0; border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06);
          overflow: hidden;
        }
        .sel-portal-dropdown.is-open {
          animation: sel-pop 0.18s cubic-bezier(0.34,1.56,0.64,1) forwards;
          transform-origin: top center;
        }
        @keyframes sel-pop {
          from { opacity: 0; transform: scaleY(0.92) translateY(-4px); }
          to   { opacity: 1; transform: scaleY(1) translateY(0); }
        }

        .sel-search-wrap {
          display: flex; align-items: center; gap: 8px; padding: 10px 12px;
        }
        .sel-search-icon { flex-shrink: 0; }
        .sel-search-input {
          flex: 1; border: none; outline: none;
          font-family: inherit; font-size: 13px; color: #0f172a; background: transparent;
        }
        .sel-search-input::placeholder { color: #94a3b8; }

        .sel-options { max-height: 200px; overflow-y: auto; padding: 6px; }

        .sel-option {
          display: flex; align-items: center; justify-content: space-between;
          padding: 9px 12px; border-radius: 8px;
          font-size: 14px; cursor: pointer; transition: background 0.12s;
        }
        .sel-option:hover { background: #eef2ff; color: #4338ca; }
        .sel-option.selected { background: #eef2ff; color: #4338ca; font-weight: 600; }
        .sel-option-check { opacity: 0; color: #6366f1; flex-shrink: 0; }
        .sel-option.selected .sel-option-check { opacity: 1; }

        .sel-placeholder-text {
          font-size: 12px; font-weight: 600; text-transform: uppercase; color: #94a3b8;
        }
        .sel-no-results { padding: 12px; font-size: 13px; color: #94a3b8; text-align: center; }
        .sel-divider { height: 1px; background: #f1f5f9; margin: 0 6px; }
      `}</style>

      <div className="sel-wrapper">
        {label && (
          <label
            className={`sel-label ${focused || open ? "focused" : ""} ${hasValue ? "has-value" : ""}`}
          >
            {label}
          </label>
        )}

        {/* Trigger — shows selected label (e.g. "Digital Marketing"), NOT raw value (DEP-003) */}
        <div
          ref={triggerRef}
          className={`sel-trigger ${open ? "open" : ""} ${compact ? "compact" : ""}`}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          tabIndex={0}
          onClick={() => { setOpen((o) => !o); setFocused(true); }}
          onFocus={() => setFocused(true)}
          onBlur={() => { if (!open) setFocused(false); }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen((o) => !o); }
            if (e.key === "Escape") { setOpen(false); setFocused(false); }
            if (e.key === "ArrowDown" && !open) setOpen(true);
          }}
        >
          <span className={`sel-display ${!hasValue ? "placeholder-text" : ""}`}>
            {selected ? selected.label : (placeholder ?? "Select…")}
          </span>
          <svg className="sel-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {dropdown}
      </div>
    </>
  );
};