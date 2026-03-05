import { useNavigate } from "react-router-dom";
import { UserPlus, UserMinus } from "lucide-react";

export const ModuleSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      
      <div className="grid grid-cols-2 gap-10">

        {/* ONBOARD CARD */}
        <div
          onClick={() => navigate("/onboard")}
          className="cursor-pointer bg-white shadow-lg rounded-xl p-10 text-center hover:shadow-xl transition"
        >
          <UserPlus size={40} className="mx-auto text-green-600 mb-4" />
          <h2 className="text-xl font-semibold">Onboard</h2>
          <p className="text-gray-500 text-sm">Employee onboarding</p>
        </div>

        {/* OFFBOARD CARD */}
        <div
          onClick={() => navigate("/dashboard")}
          className="cursor-pointer bg-white shadow-lg rounded-xl p-10 text-center hover:shadow-xl transition"
        >
          <UserMinus size={40} className="mx-auto text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold">Offboard</h2>
          <p className="text-gray-500 text-sm">HR Management System</p>
        </div>

      </div>

    </div>
  );
};