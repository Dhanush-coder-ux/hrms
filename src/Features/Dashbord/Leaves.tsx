import React from "react";
import { Link } from "react-router-dom";
import { 
  UserRoundX, 
  MessageSquareDiff, 
  CalendarRange, 
  WalletCards,
  ArrowRight
} from "lucide-react";

const Leaves: React.FC = () => {
  const navigationData = [
    {
      title: "Employee Leaves",
      description: "View and manage all historical employee leave records.",
      icon: UserRoundX,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      path: "/employeeleave"
    },
    {
      title: "Leave Requests",
      description: "Approve or reject pending leave applications.",
      icon: MessageSquareDiff,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      path: "/leaverequests"
    },
    {
      title: "Events",
      description: "Sync company holidays and team celebration events.",
      icon: CalendarRange,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      path: "/Events",
    },
    {
      title: "Leave Balance",
      description: "Check available quotas for sick, annual, and casual leaves.",
      icon: WalletCards,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      path: "/leavebalance"
    }
  ];

  return (
    <div className="p-8 bg-[#f8f9fa] min-h-screen">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Leave Management</h2>
        <p className="text-sm text-gray-500 mt-1">Select a module to manage attendance and time-off requests.</p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {navigationData.map((card, index) => (
          <Link 
            key={index} 
            to={card.path}
            className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col h-full"
          >
            {/* Icon Wrapper */}
            <div className={`w-12 h-12 ${card.bgColor} ${card.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
              <card.icon size={24} />
            </div>

            {/* Content */}
            <h3 className="text-lg font-bold text-gray-800 mb-2">{card.title}</h3>
            <p className="text-xs leading-relaxed text-gray-500 flex-grow">
              {card.description}
            </p>

            {/* Footer Action */}
            <div className="mt-6 flex items-center text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Open Module</span>
              <ArrowRight size={14} className="ml-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Leaves;