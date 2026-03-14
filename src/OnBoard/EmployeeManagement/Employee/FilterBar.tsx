interface FilterBarProps {
  departments: string[];
  value: string;
  onChange: (value: string) => void;
}

export default function FilterBar({ departments, value, onChange }: FilterBarProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 px-3 pr-8 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition cursor-pointer"
    >
      {departments.map((dept) => (
        <option key={dept} value={dept}>
          {dept === "All" ? "All Departments" : dept}
        </option>
      ))}
    </select>
  );
}