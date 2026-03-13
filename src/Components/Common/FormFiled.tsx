import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // Or your preferred icon library

type Form = {
  Lable: string;
  in_PlaceHolder: string;
  value: string | number;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  PrivacyInput?: boolean; // New optional prop to enable the eye icon
}

export const FormFiled = ({ Lable, icon, name, value, onChange, in_PlaceHolder, PrivacyInput }: Form) => {
  const [showValue, setShowValue] = useState(false);

  // Determine input type: if it's a password field and showValue is false, use 'password'
  const inputType = PrivacyInput && !showValue ? 'password' : 'text';

  return (
    <div className="mb-4 text-left">
      <label className="block mb-1.5 text-sm font-semibold text-gray-700">
        {Lable}
      </label>
      <div className="relative">
        {/* Left Icon (Optional) */}
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 text-md font-bold font-mono pointer-events-none">
            {icon}
          </span>
        )}

        <input
          type={inputType}
          name={name}
          value={value}
          placeholder={in_PlaceHolder}
          onChange={onChange}
          className={`w-full py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm 
                     placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
                     transition-all duration-200 
                     ${icon ? 'pl-9' : 'pl-3'} 
                     ${PrivacyInput ? 'pr-10' : 'pr-3'}`} 
        />

        {/* Right Eye Icon (Only if PrivacyInput is true) */}
        {PrivacyInput && (
          <button
            type="button"
            onClick={() => setShowValue(!showValue)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
          >
            {showValue ? (
              <EyeOff size={18} strokeWidth={2.5} />
            ) : (
              <Eye size={18} strokeWidth={2.5} />
            )}
          </button>
        )}
      </div>
    </div>
  );
};