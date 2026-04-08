import type { ElementType } from "react";

interface LeaveStateProps {
  cardName: string;
  value: string | number;
  icon?: ElementType;

  iconColor?: string; // e.g., "text-blue-600"
  iconBg?: string;    // e.g., "bg-blue-50"
  borderColor?: string; // e.g., "border-blue-200"
  bgColor?: string;      // e.g., "bg-blue-50"
  nameColor?: string;    // e.g., "text-blue-600"
  valueColor?: string;   // e.g., "text-blue-900"
}

export const LeaveStateCard = ({
  cardName,
  value,
  icon: Icon,
  iconColor = "text-gray-600",
  iconBg = "bg-gray-100",
  borderColor = "border-gray-100",
  bgColor = "bg-white",
  nameColor = "text-gray-500",
  valueColor = "text-gray-900",
}: LeaveStateProps) => {
  return (
    <div className={`${bgColor} ${borderColor} p-6 rounded-2xl shadow-sm border transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className={`text-xs uppercase tracking-widest font-bold ${nameColor}`}>
            {cardName}
          </p>
          <p className={`text-2xl font-black mt-1 ${valueColor}`}>
            {value}
          </p>
        </div>
        
        {Icon && (
          <div className={`p-3 rounded-xl ${iconBg} ${iconColor}`}>
            <Icon size={22} strokeWidth={2.5} />
          </div>
        )}
      </div>
      
      {/* Optional: Add a subtle bottom bar or sparkline placeholder for extra UI flair */}
      <div className={`h-1 w-12 rounded-full ${iconBg.replace('bg-', 'bg-')}`} />
    </div>
  );
};