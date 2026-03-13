import React, { useState } from 'react';

interface ToggleProps {
  label?: string;
  initialState?: boolean;
  onToggle?: (state: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ label, initialState = false, onToggle }) => {
  const [enabled, setEnabled] = useState<boolean>(initialState);

  const handleToggle = () => {
    const newState = !enabled;
    setEnabled(newState);
    if (onToggle) onToggle(newState);
  };

  return (
    <div className="flex items-center gap-2 py-2">
      {/* Label: matches the 'bonusEligible' style */}
      {label && <span className="text-gray-600 text-sm font-medium">{label}</span>}
      
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={handleToggle}
        className={`
          relative inline-flex h-[22px] w-[44px] items-center rounded-full transition-colors 
          outline-none ring-0 border-2
          ${enabled ? 'bg-blue-400 border-blue-400' : 'bg-white border-gray-300'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full transition-transform duration-200 ease-in-out
            ${enabled ? 'translate-x-[22px] bg-white' : 'translate-x-1 bg-blue-400'}
          `}
        />
      </button>
    </div>
  );
};

export default Toggle;