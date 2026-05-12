import type { ElementType } from "react";

interface StatCardProps {
  icon: ElementType;
  label: string;
  value: number | string;
  subText?: string;
  // Support for both legacy hex colors and new Tailwind classes
  iconBg?: string;    
  iconColor?: string; 
  valueSize?: string;
  // New Tailwind-based props
  bgClass?: string;
  iconBgClass?: string;
  iconColorClass?: string;
  valueColorClass?: string;
  hoverEffect?: boolean;
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  subText,
  iconBg, 
  iconColor, 
  valueSize = "2xl",
  bgClass = "bg-white",
  iconBgClass,
  iconColorClass,
  valueColorClass = "text-slate-900",
  hoverEffect = true
}: StatCardProps) {
  
  // Handle legacy hex colors if provided
  const iconStyle = iconBg || iconColor ? { 
    backgroundColor: iconBg, 
    color: iconColor 
  } : undefined;

  return (
    <div className={`${bgClass} rounded-2xl p-5 border-[1.5px] border-slate-100 flex items-start gap-4 transition-all ${hoverEffect ? "hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-sm" : ""}`}>
      {/* Icon Container */}
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBgClass || ""} ${iconColorClass || ""}`}
        style={iconStyle}
      >
        <Icon size={24} strokeWidth={2.5} />
      </div>

      {/* Text Content */}
      <div className="flex flex-col flex-1">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className={`text-${valueSize} font-extrabold leading-none ${valueColorClass}`}>
          {value}
        </p>
        {subText && (
          <p className="text-[11px] font-medium text-slate-300 mt-1.5">
            {subText}
          </p>
        )}
      </div>
    </div>
  );
}

export default StatCard;