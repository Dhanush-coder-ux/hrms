import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: number | String;
  icon: LucideIcon;
  color: string;
}

export const StatCard = ({ label, value, icon: Icon, color }: Props) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition">

      <div className="flex justify-between items-center">

        <div className={`${color} text-white p-3 rounded-xl`}>
          <Icon size={20} />
        </div>

      </div>

      <p className="text-gray-500 mt-4 text-sm">{label}</p>

      <h2 className="text-3xl font-bold">{value}</h2>

    </div>
  );
};
