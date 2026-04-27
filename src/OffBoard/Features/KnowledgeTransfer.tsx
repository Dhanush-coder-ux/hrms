import { useEffect, useState } from "react";
import { BookOpen, Link, CheckCircle, Video, UserPlus, FileText } from "lucide-react";

type KTTask = {
  id: string;
  task_name: string;
  successor: string;
  status: "In Progress" | "Completed";
  link: string;
};

type EmployeeKTGroup = {
  emp_id: string;
  emp_name: string;
  kt_tasks: KTTask[];
};

export const KnowledgeTransfer = () => {
  const [data, setData] = useState<EmployeeKTGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData([
        {
          emp_id: "EMP001",
          emp_name: "Arun Kumar",
          kt_tasks: [
            { id: "kt1", task_name: "Frontend Codebase Walkthrough", successor: "Suresh M", status: "Completed", link: "https://docs.link/1" },
            { id: "kt2", task_name: "API Documentation Handover", successor: "Suresh M", status: "In Progress", link: "https://docs.link/2" },
            { id: "kt3", task_name: "Admin Panel Credentials", successor: "Deepika R", status: "In Progress", link: "N/A" },
          ],
        },
        {
          emp_id: "EMP002",
          emp_name: "Priya Sharma",
          kt_tasks: [
            { id: "kt4", task_name: "Client Relationship Transition", successor: "Rahul V", status: "Completed", link: "https://docs.link/4" },
          ],
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const handleComplete = (empId: string, ktId: string) => {
    setData((prev) =>
      prev.map((emp) => {
        if (emp.emp_id === empId) {
          return {
            ...emp,
            kt_tasks: emp.kt_tasks.map((t) =>
              t.id === ktId ? { ...t, status: "Completed" } : t
            ),
          };
        }
        return emp;
      })
    );
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen text-slate-900">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Knowledge <span className="text-indigo-600">Transfer</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">Ensure smooth handovers and work continuity.</p>
      </div>

      <div className="space-y-8">
        {loading ? (
          <div className="text-center py-20 font-medium text-slate-400 animate-pulse">
            Syncing Handover Progress...
          </div>
        ) : (
          data.map((emp) => (
            <div key={emp.emp_id} className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              {/* Employee Info Header */}
              <div className="px-6 py-5 bg-indigo-50/50 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-xl shadow-sm">
                    <BookOpen className="text-indigo-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{emp.emp_name}</h3>
                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">{emp.emp_id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full uppercase tracking-tighter">
                    {emp.kt_tasks.filter(t => t.status === 'Completed').length} / {emp.kt_tasks.length} KT Tasks Finished
                  </span>
                </div>
              </div>

              {/* KT Tasks List */}
              <div className="p-4 space-y-3">
                {emp.kt_tasks.map((task) => (
                  <div key={task.id} className="flex flex-col md:flex-row items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all bg-white group">
                    <div className="flex items-center gap-4 w-full">
                      <div className={`p-3 rounded-xl ${task.status === 'Completed' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>
                        {task.task_name.toLowerCase().includes('video') ? <Video size={20} /> : <FileText size={20} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-700">{task.task_name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] flex items-center gap-1 text-slate-400 font-bold uppercase">
                            <UserPlus size={12} /> Successor: {task.successor}
                          </span>
                          {task.link !== "N/A" && (
                            <a href={task.link} className="text-[10px] flex items-center gap-1 text-blue-500 hover:underline font-bold uppercase">
                              <Link size={12} /> Resource Link
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                      {task.status === "Completed" ? (
                        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
                          <CheckCircle size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Handed Over</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleComplete(emp.emp_id, task.id)}
                          className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition-all text-xs font-bold shadow-lg shadow-indigo-100 whitespace-nowrap"
                        >
                          Complete KT
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};