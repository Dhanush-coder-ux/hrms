export const WorkforceSummary = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm flex justify-between items-center">

      <div>
        <h3 className="font-semibold">Workforce health looks great</h3>
        <p className="text-sm text-gray-500">
          92% attendance · 8 active departments
        </p>
      </div>

      <div className="flex gap-3 text-sm">

        <span className="bg-blue-100 px-3 py-1 rounded-full">
          Full-time 78%
        </span>

        <span className="bg-purple-100 px-3 py-1 rounded-full">
          Part-time 14%
        </span>

        <span className="bg-green-100 px-3 py-1 rounded-full">
          Contract 8%
        </span>

      </div>

    </div>
  );
};
