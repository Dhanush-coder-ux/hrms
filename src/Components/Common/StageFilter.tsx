import { Filter } from "lucide-react";

interface StageFilterProps {
  stages: string[];
  selectedStage: string;
  onStageChange: (stage: string) => void;
  counts: Record<string, number>;
  totalCount: number;
  showClear?: boolean;
}

const StageFilter = ({
  stages,
  selectedStage,
  onStageChange,
  counts,
  totalCount,
  showClear = true
}: StageFilterProps) => {
  return (
    <div className="flex items-center gap-2 mb-6 flex-wrap">
      {/* ALL Button */}
      <button
        onClick={() => onStageChange("")}
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border-[1.5px] text-xs font-bold transition-all cursor-pointer ${
          selectedStage === ""
            ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100"
            : "bg-white border-slate-200 text-slate-500 hover:border-indigo-600 hover:text-indigo-600"
        }`}
      >
        All
        <span
          className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
            selectedStage === "" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
          }`}
        >
          {totalCount}
        </span>
      </button>

      {/* Individual Stage Buttons */}
      {stages.map((s) => (
        <button
          key={s}
          onClick={() => onStageChange(selectedStage === s ? "" : s)}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border-[1.5px] text-xs font-bold transition-all cursor-pointer ${
            selectedStage === s
              ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100"
              : "bg-white border-slate-200 text-slate-500 hover:border-indigo-600 hover:text-indigo-600"
          }`}
        >
          {s}
          <span
            className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
              selectedStage === s ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
            }`}
          >
            {counts[s] || 0}
          </span>
        </button>
      ))}

      {/* Clear Filter */}
      {showClear && selectedStage && (
        <button
          onClick={() => onStageChange("")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-[1.5px] border-dashed border-slate-200 bg-transparent text-[11px] font-bold text-slate-400 cursor-pointer transition-colors hover:text-rose-500 hover:border-rose-300"
        >
          <Filter size={11} /> Clear
        </button>
      )}
    </div>
  );
};

export default StageFilter;
