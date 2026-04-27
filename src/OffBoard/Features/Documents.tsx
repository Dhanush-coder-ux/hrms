import { useEffect, useState } from "react";
import { FileText, Download, UploadCloud, AlertCircle, UserCircle, FileCheck, Search } from "lucide-react";

type DocItem = {
  id: string;
  name: string;
  category: "Policy" | "Exit Letter" | "Experience" | "Tax";
  status: "Generated" | "Pending" | "Signed";
  updatedAt: string;
};

type EmployeeDocs = {
  emp_id: string;
  emp_name: string;
  department: string;
  documents: DocItem[];
};

export const Documents = () => {
  const [data, setData] = useState<EmployeeDocs[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData([
        {
          emp_id: "EMP001",
          emp_name: "Arun Kumar",
          department: "Engineering",
          documents: [
            { id: "d1", name: "Resignation Acceptance", category: "Exit Letter", status: "Signed", updatedAt: "Apr 20, 2026" },
            { id: "d2", name: "Relieving Letter", category: "Exit Letter", status: "Generated", updatedAt: "Apr 25, 2026" },
            { id: "d3", name: "Experience Certificate", category: "Experience", status: "Pending", updatedAt: "—" },
            { id: "d4", name: "Form 16 (Part A)", category: "Tax", status: "Generated", updatedAt: "Apr 26, 2026" },
          ],
        },
        {
          emp_id: "EMP002",
          emp_name: "Priya Sharma",
          department: "Product",
          documents: [
            { id: "d5", name: "Exit Interview Summary", category: "Exit Letter", status: "Signed", updatedAt: "Apr 22, 2026" },
          ],
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Signed": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Generated": return "bg-blue-50 text-blue-600 border-blue-100";
      default: return "bg-amber-50 text-amber-600 border-amber-100";
    }
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen text-slate-900">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Document <span className="text-blue-600">Repository</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Issue and manage legal exit documentation.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input type="text" placeholder="Search employee..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
            <button className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center gap-2 whitespace-nowrap">
                <UploadCloud size={18} /> Upload Bulk
            </button>
        </div>
      </div>

      <div className="space-y-10">
        {loading ? (
          <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-tighter animate-pulse">Accessing Secure Vault...</div>
        ) : (
          data.map((emp) => (
            <div key={emp.emp_id}>
              {/* Employee Info Label */}
              <div className="flex items-center gap-3 mb-4 px-2">
                <UserCircle size={24} className="text-slate-300" />
                <h2 className="font-bold text-slate-800">{emp.emp_name}</h2>
                <span className="text-[10px] font-black bg-slate-200 text-slate-500 px-2 py-0.5 rounded uppercase tracking-widest">{emp.emp_id}</span>
              </div>

              {/* Document Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {emp.documents.map((doc) => (
                  <div key={doc.id} className="bg-white border border-slate-200 rounded-[1.5rem] p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 rounded-2xl transition-colors">
                        <FileText size={24} />
                      </div>
                      <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${getStatusBadge(doc.status)}`}>
                        {doc.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-800 mb-1 truncate" title={doc.name}>
                        {doc.name}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-6">
                        {doc.category} • {doc.updatedAt}
                    </p>

                    <div className="flex gap-2">
                        {doc.status === "Pending" ? (
                             <button className="w-full flex items-center justify-center gap-2 py-2 bg-slate-900 text-white rounded-xl text-[11px] font-bold hover:bg-blue-600 transition-all">
                                <FileCheck size={14} /> Generate
                             </button>
                        ) : (
                            <>
                                <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-xl text-[11px] font-bold hover:bg-blue-100 transition-all">
                                    <Download size={14} /> Download
                                </button>
                                <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all">
                                    <AlertCircle size={14} />
                                </button>
                            </>
                        )}
                    </div>
                  </div>
                ))}

                {/* Add Document Action Card */}
                <div className="border-2 border-dashed border-slate-200 rounded-[1.5rem] p-5 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-2 group-hover:bg-blue-50">
                        <UploadCloud size={20} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest">Add Document</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};