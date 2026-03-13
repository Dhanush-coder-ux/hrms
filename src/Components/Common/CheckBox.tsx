import React from "react";

type CheckboxProps = {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;  // receives boolean directly
  name?: string;
  disabled?: boolean;
};

export const Checkbox = ({ label, checked, onChange, name, disabled = false }: CheckboxProps) => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        .cb-wrapper {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          user-select: none;
          font-family: 'DM Sans', sans-serif;
        }
        .cb-wrapper.disabled { cursor: not-allowed; opacity: 0.5; }

        .cb-native {
          position: absolute;
          opacity: 0; width: 0; height: 0;
          pointer-events: none;
        }

        .cb-box {
          width: 20px; height: 20px; flex-shrink: 0;
          border-radius: 6px; border: 1.5px solid #cbd5e1;
          background: #fff;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.18s cubic-bezier(0.4,0,0.2,1);
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .cb-wrapper:not(.disabled):hover .cb-box {
          border-color: #a5b4fc;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
        .cb-box.checked {
          background: #6366f1; border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.15), 0 1px 4px rgba(99,102,241,0.4);
        }

        .cb-check {
          opacity: 0; transform: scale(0.5);
          transition: opacity 0.15s ease, transform 0.18s cubic-bezier(0.34,1.56,0.64,1);
        }
        .cb-box.checked .cb-check { opacity: 1; transform: scale(1); }

        .cb-label {
          font-size: 14px; font-weight: 500; color: #334155;
          transition: color 0.15s ease; line-height: 1.4;
        }
        .cb-wrapper:not(.disabled):hover .cb-label { color: #1e293b; }
        .cb-label.checked { color: #1e293b; font-weight: 600; }
      `}</style>

      <label className={`cb-wrapper ${disabled ? "disabled" : ""}`}>
        <input
          type="checkbox"
          className="cb-native"
          name={name}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}  // pass boolean up
        />
        <span className={`cb-box ${checked ? "checked" : ""}`}>
          <svg className="cb-check" width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        {label && <span className={`cb-label ${checked ? "checked" : ""}`}>{label}</span>}
      </label>
    </>
  );
};