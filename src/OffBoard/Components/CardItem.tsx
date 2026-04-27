type CardItemProps = {
  title: string;
  sub: string;
  description: string;
  status: string;
  actionLabel: string;
  onClick: () => void;
};

export const CommonCard = ({
  title,
  sub,
  description,
  status,
  actionLabel,
  onClick,
}: CardItemProps) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center hover:shadow-md transition">
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-xs text-gray-500">{sub}</p>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>

      <div className="flex items-center gap-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            status === "Done"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {status}
        </span>

        {status !== "Done" ? (
          <button
            onClick={onClick}
            className="bg-blue-500 text-white px-4 py-1.5 rounded-lg hover:bg-blue-600"
          >
            {actionLabel}
          </button>
        ) : (
          <span className="text-green-600 text-sm font-medium">
            Completed ✔
          </span>
        )}
      </div>
    </div>
  );
};