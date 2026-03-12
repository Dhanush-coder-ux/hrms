type Form={
    Lable : string,
    in_PlaceHolder : string,
    value : string | number ,
    name : string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon?: React.ReactNode;
}

export const FormFiled = ({ Lable, icon, name, value, onChange, in_PlaceHolder }:Form) => {
   return (
    <div className="mb-4">
      <label className="block mb-1.5 text-sm font-semibold text-gray-700">
        {Lable}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 text-md font-bold font-mono pointer-events-none">
            {icon}
          </span>
        )}
      
      <input
        type="text"
        name={name}
        value={value}
        placeholder={in_PlaceHolder}
        onChange={onChange}
        className={`w-full py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm 
                   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
                   transition-all duration-200 
                   ${icon ? 'pl-8 pr-3' : 'px-3'}`} // This line fixes the overlap
      />
      </div>
    </div>
  );
};