

type Form={
    Lable : string,
    in_PlaceHolder : string,
    value : string | number ,
    name : string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export const FormFiled = ({ Lable, name, value, onChange, in_PlaceHolder }:Form) => {
   return (
    <div className="mb-4">
      {/* Refined label with better spacing and contrast */}
      <label className="block mb-1.5 text-sm font-semibold text-gray-700">
        {Lable}
      </label>
      
      {/* Input with soft shadow, border-focus ring, and smooth transition */}
      <input
        type="text"
        name={name}
        value={value}
        placeholder={in_PlaceHolder}
        onChange={onChange}
        className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm 
                   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
                   transition-all duration-200"
      />
    </div>
  );
};
