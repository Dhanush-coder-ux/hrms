import type { ElementType } from "react";

interface Scard {
  icon: ElementType;
  label: string;
  value: number | string;
  iconBg: string;    // e.g., "#dcfce7" or "rgba(34, 197, 94, 0.2)"
  iconColor: string; // e.g., "#16a34a" or "green"
  valueSize : string
}

function StatCard({ icon: Icon, label, value, iconBg, iconColor,valueSize }: Scard) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
      {/* Icon Container */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        <Icon size={30} className="font-extrabold" />
      </div>

      {/* Text Content */}
      <div className="flex flex-col">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <p className={`text-${valueSize} font-bold text-gray-900 mt-0.5`}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default StatCard;