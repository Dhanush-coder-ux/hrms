import React from "react";

interface ButtonProps {
  B_name: string;
  ClickToAction: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  B_name,
  ClickToAction,
}) => {
  return (
    <div>
      <button
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all"
        onClick={ClickToAction}
      >
        {B_name}
      </button>
    </div>
  );
};
