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
import { pageTheme } from "../../../Themes/PageThems/pageConfig";

const CANDIDATE_API = `${Api_URL}/candidates`;
const PIPELINE_STAGES = ["Applied", "Selected", "Recruited", "Rejected"];

export const Candidates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
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
      console.error("Failed to fetch candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleUpdateStatus = async (id: number, status: string) => {
    setIsSaving(true);
    const loadingToast = toast.loading(`Updating status to ${status}...`);
    try {
      const response = await fetch(`${CANDIDATE_API}/Update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Candidate_status: status }),
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
      const numericIds = selectedIds.map(id => parseInt(id));
      const response = await fetch(`${CANDIDATE_API}/BulkSchedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Candidate_ids: numericIds,
          Interview_date: formDetails.Interview_date,
          Interview_time: formDetails.Interview_time,
          Stage_name: formDetails.Interview_round,
          Interviewer_name: "HR Team",
        }),
      });
      if (!response.ok) throw new Error("Bulk schedule failed");
      const result = await response.json();
      await fetchCandidates();
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
    const status = c.Candidate_status?.toLowerCase() || "";
    return status === "applied" || status === "selected" || status === "rejected";
  };

  const filteredCandidates = candidates.filter((c) => {
    const searchStr = searchTerm.toLowerCase();
    const name = c.Candidate_name?.toLowerCase() || "";
    const email = c.Candidate_Email?.toLowerCase() || "";
    const cid = c.Candidate_ID?.toLowerCase() || "";
    const matchesSearch = name.includes(searchStr) || email.includes(searchStr) || cid.includes(searchStr);
    if (searchTerm) return matchesSearch;
    if (statusFilter) return matchesSearch && c.Candidate_status === statusFilter;
    return matchesSearch;
  });

  const stats = [
    { label: "Total Pipeline", value: candidates.length, icon: Users, bgColor: "bg-blue-50", iconColor: "text-blue-500", textColor: "text-blue-600", sub: "Active candidates" },
    { label: "New Applied", value: candidates.filter((c) => c.Candidate_status === "Applied").length, icon: Play, bgColor: "bg-emerald-50", iconColor: "text-emerald-500", textColor: "text-emerald-600", sub: "Awaiting review" },
    { label: "In Selected", value: candidates.filter((c) => c.Candidate_status === "Selected").length, icon: Clock, bgColor: "bg-amber-50", iconColor: "text-amber-500", textColor: "text-amber-600", sub: "Active rounds" },
    { label: "Recruited", value: candidates.filter((c) => c.Candidate_status === "Recruited").length, icon: CheckCircle, bgColor: "bg-indigo-50", iconColor: "text-indigo-500", textColor: "text-indigo-600", sub: "Hired candidates" },
  ];

  return (
    <div className={pageTheme.layout.mainContainer}>
      <div className={pageTheme.header.wrapper}>
        <div className="flex flex-col">
          <div className={pageTheme.header.pill}>
            <TrendingUp size={12} />
            <span>Recruitment Hub</span>
          </div>
          <h1 className={pageTheme.header.title}>Candidate Pipeline</h1>
          <p className={pageTheme.header.subtitle}>
            {candidates.length} candidates across active recruitment rounds
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              className="h-[42px] w-[280px] pl-10 pr-3.5 rounded-xl border-[1.5px] border-slate-200 bg-white text-sm font-medium text-slate-900 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 shadow-sm"
              placeholder="Search name, code, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <button
              className="inline-flex items-center gap-2 h-[42px] px-[18px] bg-primary text-white border-none rounded-xl text-sm font-bold tracking-tight cursor-pointer transition-all hover:brightness-110 shadow-lg shadow-primary/20"
              onClick={() => setInviteMenuOpen((p) => !p)}
            >
              <Calendar size={15} />
              Interview Actions
              <ChevronDown size={13} className={`transition-transform duration-200 ${inviteMenuOpen ? "rotate-180" : ""}`} />
            </button>
            {inviteMenuOpen && (
              <div className="absolute top-[calc(100%+8px)] right-0 bg-white border-[1.5px] border-slate-200 rounded-2xl p-2 min-w-[180px] z-50 shadow-2xl">
                <button
                  className="flex items-center gap-2.5 w-full p-2.5 border-none bg-transparent rounded-xl text-[13px] font-semibold text-slate-700 cursor-pointer text-left hover:bg-slate-50"
                  onClick={() => { setSchedulingMode("Individual"); setSelectedIds([]); setInviteMenuOpen(false); }}
                >
                  <span className="w-7 h-7 rounded-lg bg-primary/5 text-primary flex items-center justify-center flex-shrink-0"><User size={13} /></span>
                  Individual
                </button>
                <button
                  className="flex items-center gap-2.5 w-full p-2.5 border-none bg-transparent rounded-xl text-[13px] font-semibold text-slate-700 cursor-pointer text-left hover:bg-slate-50"
                  onClick={() => { setSchedulingMode("Group"); setSelectedIds([]); setInviteMenuOpen(false); }}
                >
                  <span className="w-7 h-7 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center flex-shrink-0"><Users size={13} /></span>
                  Group Batch
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <StatCard key={i} icon={s.icon} label={s.label} value={s.value} subText={s.sub} iconBgClass={s.bgColor} iconColorClass={s.iconColor} valueColorClass={s.textColor} />
        ))}
      </div>

      <StageFilter
        stages={PIPELINE_STAGES}
        selectedStage={statusFilter}
        onStageChange={setStatusFilter}
        totalCount={candidates.length}
        counts={PIPELINE_STAGES.reduce((acc, s) => ({
          ...acc,
          [s]: candidates.filter(c => c.Candidate_status === s).length
        }), {})}
      />

      <div className={pageTheme.section.card}>
        <div className={pageTheme.section.header}>
          <div className={pageTheme.section.title}>
            <span className={pageTheme.section.titleDot} />
            {statusFilter ? `${statusFilter} Pipeline` : "All Applications"}
          </div>
          <span className={pageTheme.section.countBadge}>
            {filteredCandidates.length} Results
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3.5 py-20 text-slate-400 text-xs font-semibold uppercase tracking-widest">
            <div className="w-8 h-8 border-[3px] border-primary/10 border-t-primary rounded-full animate-spin" />
            <p>Syncing candidates...</p>
          </div>
        ) : (
          <CandidateTable
            columns={[
              { header: "Candidate", accessor: "Candidate_name" },
              { header: "ID", accessor: "Candidate_ID" },
              { header: "Role", accessor: "Job_title" },
              { header: "Contact", accessor: "Candidate_Email" },
              { header: "Status", accessor: "Candidate_status" },
              { header: "", type: "action" },
            ]}
            data={filteredCandidates}
            onRowClick={(row) => setSelectedCandidate(row as Candidate)}
          />
        )}
      </div>

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
          setSelectedIds([c.id.toString()]);
          setSelectedCandidate(null);
        }}
      />

      <Toaster position="top-right" />
    </div>
  );
};
