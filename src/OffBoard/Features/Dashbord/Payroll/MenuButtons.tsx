import React from "react";

interface MenuItem {
  label: string;
}

interface MenuButtonsProps {
  menus: MenuItem[];
  active?: string;
  onClick?: (label: string) => void;
}

const MenuButtons: React.FC<MenuButtonsProps> = ({ menus, onClick, active }) => {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8">
          {menus.map((menu, index) => (
            <button
              key={index}
              onClick={() => onClick?.(menu.label)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                active === menu.label
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {menu.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MenuButtons;