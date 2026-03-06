


type Option = {
  label: string;
  value: string | number;
};
type SelectionProps = {
  label: string;
  name: string;
  value: string;
  options: Option[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
};

export const Selection = ({
  label,
  name,
  value,
  options,
  onChange,
  placeholder,
}: SelectionProps) => {
  return (
    <div className="block mb-1 text-sm font-medium text-gray-700">
      <label className="block mb-1 font-medium">{label}</label>
      <select
        name={name}        // ✅ MUST BE HERE
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm 
                   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
                   transition-all duration-200"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
