import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, CheckCircle, XCircle, Mail, Phone, X, 
   User, Calendar, ChevronRight, 
  Paperclip, Save, ExternalLink
} from "lucide-react";
import SearchBar from "../../../Components/Common/Searchbar";
import { CandidateTable } from "./Candidate/CandidatesTable";
import StatCard from "../../../Components/Common/StatCard";
import type { Candidate } from "../../../Types/typesOnboarding";

const Api_url = "http://localhost:3001/candidates/";

export const Candidates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  
  // State for Modal and Local Changes
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [localStatus, setLocalStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await fetch(Api_url);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setCandidates(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // Sync local status when a candidate is selected
  useEffect(() => {
    if (selectedCandidate) {
      setLocalStatus(selectedCandidate.status);
    }
  }, [selectedCandidate]);

  const handleSave = async () => {
    if (!selectedCandidate || !localStatus) return;
    
    setIsSaving(true);
    try {
      const response = await fetch(`${Api_url}${selectedCandidate.c_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: localStatus }),
      });

      if (response.ok) {
        await fetchCandidates(); // Refresh list
        setSelectedCandidate(null); // Close panel
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Error saving changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInviteToInterview = async (candidate: Candidate) => {
    try {
      const response = await fetch(`${Api_url}${candidate.c_id}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          candidateId: candidate.c_id,
          email: candidate.email,
          name: candidate.name,
          role: candidate.role,
          invitedAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        alert(`Invitation sent to ${candidate.name}`);
        setSelectedCandidate(null);
      }
    } catch (err) {
      console.error("Invitation error:", err);
    }
  };

  const filteredCandidates = candidates.filter((candidate) =>
    Object.values(candidate).some((val) =>
      val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const rejectedCount = candidates.filter(c => c.status?.toLowerCase() === "rejected").length;
  const selectedCount = candidates.filter(c => c.status?.toLowerCase() === "selected").length;

  const columns = [
    { header: "ID", accessor: "c_id" },
    { header: "Name", accessor: "name" },
    { header: "Phone", accessor: "phone" },
    { header: "Email", accessor: "email" },
    { header: "Reference", accessor: "reference" },
    { header: "Role", accessor: "role" },
    { header: "Status", accessor: "status" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 lg:p-10 bg-[#f8fafc] min-h-screen relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
            Recruitment Funnel
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-1">
            Real-time candidate tracking and management
          </p>
        </div>

        {/* STATS SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <StatCard icon={Users} label="Total Applicants" value={candidates.length} iconBg="#E0E7FF" iconColor="#4F46E5" valueSize="text-2xl" />
          <StatCard icon={CheckCircle} label="Shortlisted" value={selectedCount} iconBg="#D1FAE5" iconColor="#059669" valueSize="text-2xl" />
          <StatCard icon={XCircle} label="Rejected" value={rejectedCount} iconBg="#FEE2E2" iconColor="#DC2626" valueSize="text-2xl" />
        </div>

        {/* SEARCH */}
        <div className="mb-8 max-w-md">
          <SearchBar value={searchTerm} onChange={(value) => setSearchTerm(value)} />
        
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="flex justify-center py-20 text-slate-400 font-bold animate-pulse uppercase tracking-widest">Loading Pipeline...</div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl text-rose-600 text-center">{error}</div>
        ) : (
          <CandidateTable
            columns={columns}
            data={filteredCandidates}
            onRowClick={(row) => setSelectedCandidate(row as Candidate)}
          />
        )}
      </div>

      {/* CENTERED POP-UP PANEL */}
      <AnimatePresence>
        {selectedCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCandidate(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-slate-50/50 px-8 pt-8 pb-6 flex flex-col items-center text-center">
                <button 
                  onClick={() => setSelectedCandidate(null)}
                  className="absolute top-6 right-6 p-2 hover:bg-white rounded-full shadow-sm border border-slate-100 transition-all"
                >
                  <X size={18} className="text-slate-400" />
                </button>
                
                <div className="w-20 h-20 bg-indigo-600 rounded-2xl rotate-3 shadow-xl flex items-center justify-center text-white mb-4">
                  <User size={40} strokeWidth={1.5} className="-rotate-3" />
                </div>
                
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">{selectedCandidate.name}</h2>
                <p className="text-indigo-600 font-bold text-sm uppercase tracking-widest mt-1">{selectedCandidate.role}</p>
              </div>

              {/* Body */}
              <div className="px-8 pb-4 space-y-6 overflow-y-auto max-h-[60vh]">
                <div className="flex flex-wrap gap-2 justify-center">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-slate-600 text-xs font-semibold">
                    <Mail size={14} /> {selectedCandidate.email}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-slate-600 text-xs font-semibold">
                    <Phone size={14} /> {selectedCandidate.phone}
                  </div>
                </div>

                {/* Resume Status (Smart Logic) */}
<div className="pt-2">
  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
    Resume Status
  </p>

  <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
    selectedCandidate.resumeUrl 
      ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
      : "bg-rose-50 border-rose-100 text-rose-700"
  }`}>
    <div className="flex items-center gap-3">
      <Paperclip size={18} className={selectedCandidate.resumeUrl ? "text-emerald-500" : "text-rose-500"} />
      <span className="text-sm font-bold">
        {selectedCandidate.resumeUrl ? "Resume Attached" : "Resume Not Attached"}
      </span>
    </div>

    {/* Only show the link icon if the URL exists */}
    {selectedCandidate.resumeUrl && (
      <button 
        onClick={() => window.open(selectedCandidate.resumeUrl, '_blank')}
        className="p-2 bg-white rounded-lg shadow-sm hover:scale-110 active:scale-90 transition-transform"
      >
        <ExternalLink size={16} className="text-emerald-600" />
      </button>
    )}
  </div>
</div>

                <hr className="border-slate-100" />

                {/* Status Toggle Buttons */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Update Decision</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setLocalStatus("Selected")}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all border ${
                        localStatus === "Selected" 
                        ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-100" 
                        : "bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100"
                      }`}
                    >
                      <CheckCircle size={18} /> Select
                    </button>
                    <button
                      onClick={() => setLocalStatus("Rejected")}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all border ${
                        localStatus === "Rejected" 
                        ? "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-100" 
                        : "bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100"
                      }`}
                    >
                      <XCircle size={18} /> Reject
                    </button>
                  </div>
                </div>

                {/* Primary Action */}
                <button
                  onClick={() => handleInviteToInterview(selectedCandidate)}
                  className="w-full bg-indigo-50 text-indigo-700 p-4 rounded-2xl font-bold flex items-center justify-between group hover:bg-indigo-600 hover:text-white transition-all"
                >
                  <span className="flex items-center gap-3">
                    <Calendar size={20} />
                    Invite to Interview
                  </span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Fixed Footer with Save Button */}
              <div className="p-6 bg-slate-50 border-t border-slate-100">
                <button
                  disabled={isSaving || localStatus === selectedCandidate.status}
                  onClick={handleSave}
                  className="w-full bg-slate-900 disabled:bg-slate-300 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-slate-200"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};