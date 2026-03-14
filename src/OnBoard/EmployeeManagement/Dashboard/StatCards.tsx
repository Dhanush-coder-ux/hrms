import { Users, UserMinus, UserCheck, Building2 } from "lucide-react";
import { StatCard } from "./StatCard";

export const StatCards = () => {

  const stats = [
    {
      label: "Total Employees",
      value: 150,
      icon: Users,
      color: "bg-blue-500"
    },
    {
      label: "On Leave",
      value: 12,
      icon: UserMinus,
      color: "bg-rose-500"
    },
    {
      label: "Present Today",
      value: 138,
      icon: UserCheck,
      color: "bg-emerald-500"
    },
    {
      label: "Departments",
      value: 8,
      icon: Building2,
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};
