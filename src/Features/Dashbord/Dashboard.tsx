import {
  Users,
  UserMinus,
  UserCheck,
  Building2,
  ArrowUpRight,
} from "lucide-react";

export const Dashboard = () => {
  const stats = [
    {
      label: "Total Employees",
      value: 150,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      progress: 100,
    },
    {
      label: "On Leave",
      value: 12,
      icon: UserMinus,
      color: "from-red-500 to-red-600",
      progress: 8,
    },
    {
      label: "Present Today",
      value: 138,
      icon: UserCheck,
      color: "from-green-500 to-green-600",
      progress: 92,
    },
    {
      label: "Departments",
      value: 8,
      icon: Building2,
      color: "from-purple-500 to-purple-600",
      progress: 60,
    },
  ];

  return (
    <section className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-sm text-gray-500">Overview & insights</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer"
            >
              {/* Gradient strip */}
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${stat.color}`}
              />

              {/* Icon */}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${stat.color} text-white`}
              >
                <Icon size={22} />
              </div>

              {/* Content */}
              <p className="mt-4 text-sm text-gray-500">{stat.label}</p>

              <div className="flex items-center justify-between mt-1">
                <h3 className="text-3xl font-bold text-gray-800">
                  {stat.value}
                </h3>
                <ArrowUpRight className="text-gray-400 group-hover:text-gray-700 transition" />
              </div>

              {/* Progress bar */}
              <div className="mt-4 h-2 w-full rounded-full bg-gray-200">
                <div
                  className={`h-2 rounded-full bg-linear-to-r ${stat.color}`}
                  style={{ width: `${stat.progress}%` }}
                />
              </div>

              <p className="mt-2 text-xs text-gray-400">
                {stat.progress}% updated
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
