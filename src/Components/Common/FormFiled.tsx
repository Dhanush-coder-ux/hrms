import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type Form = {
  Lable?: string;
  in_PlaceHolder: string;
  value: string | number;
  name?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  PrivacyInput?: boolean;
  disabled?: boolean;
  type?: string;
};

export const FormFiled = ({
  Lable,
  icon,
  name,
  value,
  onChange,
  in_PlaceHolder,
  PrivacyInput,
  disabled,
  type = "text",
}: Form) => {
  const [showValue, setShowValue] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputType = PrivacyInput && !showValue ? "password" : type;
  const hasValue = value !== "" && value !== undefined && value !== null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        .ff-wrapper { font-family: 'DM Sans', sans-serif; position: relative; width: 100%; }

        /* Label — 600 weight, dark slate, fully readable */
        .ff-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #475569;
          margin-bottom: 7px;
          transition: color 0.18s ease;
          user-select: none;
        }
        .ff-label.focused   { color: #4f46e5; }
        .ff-label.has-value { color: #334155; }

        .ff-input-wrap { position: relative; display: flex; align-items: center; }

        /* Left icon — medium weight, visible slate */
        .ff-icon-left {
          position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
          pointer-events: none; display: flex; align-items: center;
          font-size: 14px; font-weight: 600;
          color: #64748b;
          transition: color 0.18s ease; z-index: 1;
        }
        .ff-icon-left.focused { color: #4f46e5; }

        /* Input — 14px sans, near-black value text */
        .ff-input {
          width: 100%;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: #0f172a;
          background: #fff;
          border: 1.5px solid #868687;
          border-radius: 10px;
          outline: none;
          padding: 11px 14px;
          transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        /* Placeholder — visible but clearly secondary */
        .ff-input::placeholder {
          font-family: 'DM Sans', sans-serif;
          color: #94a3b8;
          font-size: 14px;
          font-weight: 400;
        }
        .ff-input:hover   { border-color: #a5b4fc; box-shadow: 0 2px 6px rgba(0,0,0,0.07); }
        .ff-input:focus   { border-color: #6366f1; box-shadow: 0 0 0 3.5px rgba(99,102,241,0.15); }
        .ff-input.with-icon-left  { padding-left: 40px; }
        .ff-input.with-icon-right { padding-right: 40px; }

        .ff-eye-btn {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          display: flex; align-items: center; justify-content: center;
          width: 26px; height: 26px; border: none; background: transparent;
          border-radius: 6px; cursor: pointer; color: #64748b;
          padding: 0; transition: all 0.15s ease; z-index: 1;
        }
        .ff-eye-btn:hover { background: #eef2ff; color: #4f46e5; }
        .ff-eye-btn:focus { outline: none; }
        .ff-input:disabled {
  background: #f1f5f9;
  color: #64748b;
  cursor: not-allowed;
  border-color: #e2e8f0;
}
      `}</style>

      <div className="ff-wrapper">
        <label
          className={`ff-label ${isFocused ? "focused" : ""} ${hasValue ? "has-value" : ""}`}
        >
          {Lable}
        </label>
        <div className="ff-input-wrap">
          {icon && (
            <span className={`ff-icon-left ${isFocused ? "focused" : ""}`}>
              {icon}
            </span>
          )}
          <input
            type={inputType}
            name={name}
            value={value}
            placeholder={in_PlaceHolder}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={[
              "ff-input",
              icon ? "with-icon-left" : "",
              PrivacyInput ? "with-icon-right" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            disabled={disabled}
          />
          {PrivacyInput && (
            <button
              type="button"
              className="ff-eye-btn"
              onClick={() => setShowValue((v) => !v)}
              tabIndex={-1}
              aria-label={showValue ? "Hide" : "Show"}
            >
              {showValue ? (
                <EyeOff size={15} strokeWidth={2} />
              ) : (
                <Eye size={15} strokeWidth={2} />
              )}
            </button>
          )}
        </div>
      </div>
    </>
  );
};
