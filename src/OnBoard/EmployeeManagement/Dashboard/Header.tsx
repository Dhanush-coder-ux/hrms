import { Calendar, RefreshCw, TrendingUp } from "lucide-react";

export const Header = () => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">

      <div>
        <p className="text-green-600 text-xs font-semibold">LIVE</p>
        <h1 className="text-3xl font-bold">Overview</h1>
        <p className="text-gray-500 text-sm">{today}</p>
      </div>

      <div className="flex gap-3">
        <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border">
          <Calendar size={14} />
          This Month
        </button>

        <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border">
          <RefreshCw size={14} />
          Refresh
        </button>

        <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl">
          <TrendingUp size={14} />
          View Report
        </button>
      </div>

    </div>
  );
};
