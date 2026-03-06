interface CardProps {
  CardTitle: string;
  NameOfIMG: string;
  IMG: string;
  onClick?: () => void;

}

export const Card = ({ IMG, CardTitle, NameOfIMG, onClick  }: CardProps) => {
  return (
    <div className="mt-10">
      <div
        className="bg-white shadow-lg rounded-2xl p-6 w-80 border border-gray-200 
                   transform transition-all duration-300 ease-in-out
                   hover:scale-105 hover:shadow-2xl hover:-translate-y-2 
                   cursor-pointer"
        onClick={onClick}
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-left">
          {CardTitle}
        </h1>

        <img
          src={IMG}
          alt={NameOfIMG}
          className="object-contain rounded-lg"
        />
      </div>
    </div>
  );
};
