import { useNavigate } from "react-router-dom";
import { UserPlus, UserMinus, UserCheck } from "lucide-react";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

export const ModuleSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full  flex flex-col items-center justify-center">

      {/* Title */}
      <h1 className="text-3xl font-bold text-slate-800 mb-12 tracking-tight">
        Select <span className="text-primary">Module</span>
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* ONBOARD CARD */}
        <div
          onClick={() => navigate("/onboard")}
          className="w-64 cursor-pointer bg-white shadow-sm rounded-[24px] p-8 text-center group
          hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 hover:border-primary/30"
        >
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
              <UserPlus size={36} className="text-primary" />
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-800">
            Onboard
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            Employee onboarding process
          </p>
        </div>

        {/* Employee management */}
        <div
          onClick={() => navigate("/EmployeeManagement")}
          className="w-64 cursor-pointer bg-white shadow-sm rounded-[24px] p-8 text-center group
          hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 hover:border-primary/30"
        >
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
              <UserCheck size={36} className="text-primary" />
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-800">
            Employee Management
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            HR management dashboard
          </p>
        </div>

        {/* Offboard CARD */}
        <div
          onClick={() => navigate("/offboard")}
          className="w-64 cursor-pointer bg-white shadow-sm rounded-[24px] p-8 text-center group
          hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 hover:border-primary/30"
        >
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
              <UserMinus size={36} className="text-primary" />
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-800">
            Offboard
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            Employee offboarding process
          </p>
        </div>

        {/* Admin Login */}
        <div
          onClick={() => navigate("/Admin")}
          className="w-64 cursor-pointer bg-white shadow-sm rounded-[24px] p-8 text-center group
          hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 hover:border-primary/30"
        >
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
              <MdOutlineAdminPanelSettings size={36} className="text-primary" />
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-800">
            Admin
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            Tools Fix & Update process
          </p>
        </div>

      </div>

    </div>
  );
};