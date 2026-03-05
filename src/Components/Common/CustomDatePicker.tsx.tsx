import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CustomDatePickerProps {
  name: string;
  value: string; // form state stays string
  Lable?: string;
  onChange: (e: {
    target: {
      name: string;
      value: string;
    };
  }) => void;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  name,
  value,
  Lable,
  onChange,
}) => {
  return (
  <div>
    <div className="block mb-1 text-sm font-medium text-gray-700">
      {Lable && (
        <label className="block mb-1 font-medium" >
          {Lable}
        </label>
      )}

      <DatePicker
        selected={value ? new Date(value) : null}
        dateFormat="yyyy-MM-dd"
        onChange={(date: Date | null) => {
          // ✅ adapt Date → event
          onChange({
            target: {
              name,
              value: date
                ? date.toISOString().split("T")[0]
                : "",
            },
          });
        }}
        className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm 
                   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
                   transition-all duration-200"
      />
    </div>
    </div>
  );
};
