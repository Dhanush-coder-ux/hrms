import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, User, Briefcase, TrendingUp, Info } from "lucide-react";
import { useEffect, useState } from "react";
import PageLoading from "../../../Components/Common/PageLoading";
import type{ Department } from "./types";

export const DepartmentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dept, setDept] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(`http://localhost:3001/departments`);
        const data = await response.json();
        // ID Comparison logic: both to string
        const found = data.find((d: any) => String(d.id) === String(id));
        setDept(found);
      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <PageLoading />;
  if (!dept) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-xl font-bold text-gray-400">Department {id} not found.</h2>
      <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 font-bold underline">Go Back</button>
    </div>
  );

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-gray-900 mb-8 font-black transition-all">
        <ArrowLeft size={20} /> Back to Directory
      </button>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Card */}
        <div className="lg:col-span-1 bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm h-fit">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white mb-8 shadow-xl shadow-blue-100">
            <Briefcase size={36} />
          </div>
          <h1 className="text-4xl font-black text-gray-900">{dept.dep_name}</h1>
          <span className="inline-block mt-4 px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black text-gray-500 uppercase">
            ID: {dept.id}
          </span>
          
          <div className="mt-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400"><User size={18}/></div>
              <div>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Head of Dept</p>
                <p className="font-bold text-gray-700">{dept.head_of_dep}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400"><MapPin size={18}/></div>
              <div>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Location</p>
                <p className="font-bold text-gray-700">{dept.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Info Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <Info size={20} className="text-blue-600"/> Operational Details
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Status</p>
                <p className="text-xl font-black text-blue-700">{dept.Task_status}</p>
              </div>
              <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Budget Efficiency</p>
                <p className="text-xl font-black text-emerald-700">{dept.budget_utilization}</p>
              </div>
            </div>
            <div className="mt-8">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">Strategy Note</p>
              <p className="text-gray-600 font-bold leading-relaxed bg-gray-50 p-6 rounded-3xl border border-gray-100">
                {dept.extral_info}
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 text-white shadow-xl shadow-blue-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Workforce Capacity</p>
                <h4 className="text-3xl font-black mt-1">{dept.emp_count} Total Employees</h4>
              </div>
              <TrendingUp size={48} className="text-blue-400/50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};