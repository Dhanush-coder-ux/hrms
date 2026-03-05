import { useNavigate } from "react-router-dom";
import { UserPlus, UserMinus } from "lucide-react";

export const ModuleSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-12">
        Select Module
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* ONBOARD CARD */}
        <div
          onClick={() => navigate("/onboard")}
          className="w-64 cursor-pointer bg-white shadow-md rounded-2xl p-8 text-center 
          hover:shadow-xl hover:-translate-y-1 transition duration-300"
        >
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-green-100 rounded-full">
              <UserPlus size={36} className="text-green-600" />
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-800">
            Onboard
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            Employee onboarding process
          </p>
        </div>

        {/* OFFBOARD CARD */}
        <div
          onClick={() => navigate("/dashboard")}
          className="w-64 cursor-pointer bg-white shadow-md rounded-2xl p-8 text-center 
          hover:shadow-xl hover:-translate-y-1 transition duration-300"
        >
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-100 rounded-full">
              <UserMinus size={36} className="text-blue-600" />
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-800">
            Offboard
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            HR management dashboard
          </p>
        </div>

      </div>

    </div>
  );
};