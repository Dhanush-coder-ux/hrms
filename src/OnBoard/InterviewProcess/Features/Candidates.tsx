import { useEffect, useState } from "react";
import {
  Users, CheckCircle, User, Calendar, Clock, Play,
  TrendingUp, Search, ChevronDown
} from "lucide-react";
import { CandidateTable } from "./Candidate/CandidatesTable";
import type { Candidate } from "../../../Types/typesOnboarding";
import { toast, Toaster } from "react-hot-toast";
import { Api_URL } from "../../../APILINK";
import { CandidateDrawer } from "./Candidate/Components/CandidateDrawer";
import { SchedulingModal } from "./Candidate/Components/SchedulingModal";
import StatCard from "../../../Components/Common/StatCard";
import StageFilter from "../../../Components/Common/StageFilter";

const CANDIDATE_API = `${Api_URL}/candidates`;

const PIPELINE_STAGES = ["Applied", "Interview", "Selected", "Rejected"];

export const Candidates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [schedulingMode, setSchedulingMode] = useState<"Individual" | "Group" | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [formDetails, setFormDetails] = useState({
    Interview_round: "Technical",
    Interview_mode: "Online",
    Interview_date: new Date().toISOString().split("T")[0],
    Interview_time: "10:00",
  });
  const [candidateSearch, setCandidateSearch] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);
  const [inviteMenuOpen, setInviteMenuOpen] = useState(false);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${CANDIDATE_API}/all`);
      const data = await response.json();
      setCandidates(data);
    } catch {
      setError("Failed to fetch candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    setIsSaving(true);
    const loadingToast = toast.loading(`Moving candidate to ${status}...`);
    try {
      const response = await fetch(`${CANDIDATE_API}/Update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Status: status }),
      });
      if (!response.ok) throw new Error("Update failed");
      await fetchCandidates();
      toast.success(`Candidate ${status}`, { id: loadingToast });
      setSelectedCandidate(null);
    } catch {
      toast.error("Failed to update status", { id: loadingToast });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBulkSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) return;
    setIsScheduling(true);
    const loadingToast = toast.loading(`Scheduling ${selectedIds.length} interviews...`);
    try {
      const response = await fetch(`${CANDIDATE_API}/BulkSchedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Candidate_ids: selectedIds,
          Interview_date: formDetails.Interview_date,
          Interview_time: formDetails.Interview_time,
          Interview_status: formDetails.Interview_round,
          Interviewer_name: "HR Team",
          Stage_status: "Pending",
        }),
      });
      if (!response.ok) throw new Error("Bulk schedule failed");
      const result = await response.json();
      setCandidates((prev) =>
        prev.map((c) =>
          selectedIds.includes(c.Candidate_id) ? { ...c, Status: "Interview" } : c
        )
      );
      toast.success(`${result.count} Candidates moved to Interview`, { id: loadingToast });
      setSchedulingMode(null);
      setSelectedIds([]);
    } catch {
      toast.error("Failed to schedule some interviews", { id: loadingToast });
    } finally {
      setIsScheduling(false);
    }
  };

  const isEligible = (c: Candidate) => {
    const status = c.Status?.toLowerCase() || "";
    return !["interview scheduled", "interview in progress", "completed"].includes(status);
  };

  const filteredCandidates = candidates.filter((c) => {
    const searchStr = searchTerm.toLowerCase();
    const matchesSearch =
      c.Candidate_name?.toLowerCase().includes(searchStr) ||
      c.Candidate_Email?.toLowerCase().includes(searchStr);
    return matchesSearch && (!statusFilter || c.Status === statusFilter);
  });

  const stats = [
    {
      label: "Total Pipeline",
      value: candidates.length,
      icon: Users,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
      textColor: "text-blue-600",
      sub: "Active candidates",
    },
    {
      label: "New Applied",
      value: candidates.filter((c) => c.Status === "Applied").length,
      icon: Play,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-500",
      textColor: "text-emerald-600",
      sub: "Awaiting review",
    },
    {
      label: "In Interviews",
      value: candidates.filter((c) => c.Status === "Interview").length,
      icon: Clock,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-500",
      textColor: "text-amber-600",
      sub: "Active rounds",
    },
    {
      label: "Offers Made",
      value: candidates.filter((c) => c.Status === "Selected").length,
      icon: CheckCircle,
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-500",
      textColor: "text-indigo-600",
      sub: "Ready to onboard",
    },
  ];

  return (
    <div className="h-screen overflow-y-auto bg-slate-50/50 p-10 font-sans custom-scrollbar">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-6 mb-8 flex-wrap">
        <div className="flex flex-col">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full mb-2.5 w-fit">
            <TrendingUp size={12} />
            <span>Recruitment Hub</span>
          </div>
          <h1 className="text-[2rem] font-extrabold text-slate-900 tracking-tight mb-1.5 leading-none">Candidate Pipeline</h1>
          <p className="text-sm text-slate-400 font-medium">
            {candidates.length} candidates across {PIPELINE_STAGES.length} stages
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              className="h-[42px] w-[240px] pl-10 pr-3.5 rounded-xl border-[1.5px] border-slate-200 bg-white text-sm font-medium text-slate-900 outline-none transition-all focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-300"
              placeholder="Search name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Invite dropdown */}
          <div className="relative">
            <button
              className="inline-flex items-center gap-2 h-[42px] px-[18px] bg-indigo-600 text-white border-none rounded-xl text-sm font-bold tracking-tight cursor-pointer transition-all hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-100"
              onClick={() => setInviteMenuOpen((p) => !p)}
            >
              <Calendar size={15} />
              Invite to Interview
              <ChevronDown size={13} className={`transition-transform duration-200 ${inviteMenuOpen ? "rotate-180" : ""}`} />
            </button>
            {inviteMenuOpen && (
              <div className="absolute top-[calc(100%+8px)] right-0 bg-white border-[1.5px] border-slate-200 rounded-2xl p-2 min-w-[180px] z-50 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  className="flex items-center gap-2.5 w-full p-2.5 border-none bg-transparent rounded-xl text-[13px] font-semibold text-slate-700 cursor-pointer text-left transition-colors hover:bg-slate-50"
                  onClick={() => {
                    setSchedulingMode("Individual");
                    setSelectedIds([]);
                    setInviteMenuOpen(false);
                  }}
                >
                  <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                    <User size={13} />
                  </span>
                  Individual
                </button>
                <button
                  className="flex items-center gap-2.5 w-full p-2.5 border-none bg-transparent rounded-xl text-[13px] font-semibold text-slate-700 cursor-pointer text-left transition-colors hover:bg-slate-50"
                  onClick={() => {
                    setSchedulingMode("Group");
                    setSelectedIds([]);
                    setInviteMenuOpen(false);
                  }}
                >
                  <span className="w-7 h-7 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center flex-shrink-0">
                    <Users size={13} />
                  </span>
                  Group Batch
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <StatCard 
            key={i}
            icon={s.icon}
            label={s.label}
            value={s.value}
            subText={s.sub}
            iconBgClass={s.bgColor}
            iconColorClass={s.iconColor}
            valueColorClass={s.textColor}
          />
        ))}
      </div>

      {/* STAGE BAR */}
      <StageFilter 
        stages={PIPELINE_STAGES}
        selectedStage={statusFilter}
        onStageChange={setStatusFilter}
        totalCount={candidates.length}
        counts={PIPELINE_STAGES.reduce((acc, s) => ({
          ...acc,
          [s]: candidates.filter(c => c.Status === s).length
        }), {})}
      />

      {/* TABLE CARD */}
      <div className="bg-white rounded-[20px] border-[1.5px] border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between p-[18px_24px] border-b border-slate-50">
          <div className="flex items-center gap-2 font-extrabold text-[12px] tracking-wider uppercase text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            {statusFilter || "All Candidates"}
          </div>
          <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
            {filteredCandidates.length} result{filteredCandidates.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3.5 py-20 text-slate-400 text-xs font-semibold uppercase tracking-widest">
            <div className="w-8 h-8 border-[3px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            <p>Loading candidates...</p>
          </div>
        ) : (
          <CandidateTable
            columns={[
              { header: "Candidate", accessor: "Candidate_name" },
              { header: "Role", accessor: "Job_title" },
              { header: "Contact", accessor: "Candidate_Email" },
              { header: "Status", accessor: "Status" },
              { header: "", type: "action" },
            ]}
            data={filteredCandidates}
            onRowClick={(row) => setSelectedCandidate(row as Candidate)}
          />
        )}
      </div>

      {/* MODALS */}
      <SchedulingModal
        mode={schedulingMode}
        onClose={() => setSchedulingMode(null)}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        candidates={candidates}
        candidateSearch={candidateSearch}
        setCandidateSearch={setCandidateSearch}
        isScheduling={isScheduling}
        formDetails={formDetails}
        setFormDetails={setFormDetails}
        onSchedule={handleBulkSchedule}
        isEligible={isEligible}
      />

      <CandidateDrawer
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        isSaving={isSaving}
        onUpdateStatus={handleUpdateStatus}
        onInvite={(c) => {
          setSchedulingMode("Individual");
          setSelectedIds([c.Candidate_id]);
          setSelectedCandidate(null);
        }}
      />

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "12px",
            fontSize: "13px",
            fontWeight: 600,
            background: "#0f172a",
            color: "#f8fafc",
            border: "1px solid rgba(255,255,255,0.08)",
          },
        }}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};
