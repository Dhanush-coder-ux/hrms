import { useState, useEffect, useMemo } from "react";

import { 
  Calendar, 
  XCircle, Users, 
  Play, CheckCircle,
  Search, ChevronDown
} from "lucide-react";
import { Api_URL } from "../../../APILINK";
import type { Candidate } from "../../../Types/typesOnboarding";

import { toast, Toaster } from "react-hot-toast";
import { InterviewTable } from "./Candidate/Components/InterviewTable";
import StageFilter from "../../../Components/Common/StageFilter";
import StatCard from "../../../Components/Common/StatCard";
import { InterviewDrawer } from "./Candidate/Components/InterviewDrawer";

const API_URL = `${Api_URL}/candidates`;

interface InterviewRecord {
  id: number;
  Interview_id: string;
  Candidate_id: string;
  Interview_date: string;
  Interview_time: string;
  Interview_status: string;
  Stage_status: string;
  Interviewer_name: string | null;
  Interview_score: number | null;
  Interviewer_feedback: string | null;
  Final_decision: string | null;
  Rejection_reason: string | null;
  Selected_date: string | null;
  created_at: string;
  candidate_name?: string;
  candidate_role?: string;
  current_candidate_stage?: string;
}

const STAGES = ["Applied", "Screening", "HR Round", "Technical Round", "Final Round", "Recruited", "Rejected"];
const STAGE_STATUSES = ["Pending", "In Progress", "Completed"];

export const Interview = () => {
  const [interviews, setInterviews] = useState<InterviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [selectedInterview, setSelectedInterview] = useState<InterviewRecord | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [inviteMenuOpen, setInviteMenuOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [intRes, canRes] = await Promise.all([
        fetch(`${API_URL}/GetAllInterviews`),
        fetch(`${API_URL}/all`)
      ]);
      
      const intData = await intRes.json();
      const canData = await canRes.json();
      
      const enrichedInterviews = intData.map((int: InterviewRecord) => {
        const cand = canData.find((c: Candidate) => c.Candidate_id === int.Candidate_id);
        return {
          ...int,
          candidate_name: cand?.Candidate_name || "Unknown",
          candidate_role: cand?.Job_title || "N/A",
          current_candidate_stage: cand?.Current_Stage || "Applied"
        };
      });

      setInterviews(enrichedInterviews);
    } catch (err) {
      toast.error("Failed to sync pipeline");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCompleteRound = async (interview: InterviewRecord) => {
    setIsUpdating(true);
    const loadingToast = toast.loading("Finalizing round...");
    try {
      await fetch(`${API_URL}/UpdateInterview/${interview.Interview_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Stage_status: "Completed", Final_decision: "Passed" }),
      });
      await fetchData();
      toast.success("Round marked as Completed", { id: loadingToast });
      setSelectedInterview(null);
    } catch (err) {
      toast.error("Failed to complete round");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMoveToNext = async (interview: InterviewRecord) => {
    if (interview.Stage_status !== "Completed") {
      toast.error("Please complete the current stage before moving to the next round.");
      return;
    }

    const currentIndex = STAGES.indexOf(interview.current_candidate_stage || "Applied");
    if (currentIndex >= STAGES.indexOf("Final Round")) {
       toast.error("Final Round reached. Use Recruit button after completion.");
       return;
    }

    const nextStage = STAGES[currentIndex + 1];
    setIsUpdating(true);
    const loadingToast = toast.loading(`Moving to ${nextStage}...`);
    try {
      // Update Candidate Current_Stage
      await fetch(`${API_URL}/Update/${interview.Candidate_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Current_Stage: nextStage, Status: "Interview" }),
      });
      
      await fetchData();
      toast.success(`Candidate advanced to ${nextStage}`, { id: loadingToast });
      setSelectedInterview(null);
    } catch (err) {
      toast.error("Advancement failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRecruit = async (interview: InterviewRecord) => {
    if (interview.current_candidate_stage !== "Final Round" || interview.Stage_status !== "Completed") {
      toast.error("Can only recruit after completing the Final Round.");
      return;
    }

    setIsUpdating(true);
    const loadingToast = toast.loading("Recruiting candidate...");
    try {
      await fetch(`${API_URL}/Update/${interview.Candidate_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Status: "Recruited", Current_Stage: "Recruited" }),
      });
      await fetchData();
      toast.success("Candidate successfully Recruited!", { id: loadingToast });
      setSelectedInterview(null);
    } catch (err) {
      toast.error("Recruitment failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async (interview: InterviewRecord) => {
    setIsUpdating(true);
    const loadingToast = toast.loading("Rejecting candidate...");
    try {
      // 1. Update Interview Record
      await fetch(`${API_URL}/UpdateInterview/${interview.Interview_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Stage_status: "Completed", Final_decision: "Failed" }),
      });

      // 2. Update Candidate status
      await fetch(`${API_URL}/Update/${interview.Candidate_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Status: "Rejected", Current_Stage: "Rejected" }),
      });

      await fetchData();
      toast.success("Candidate Rejected", { id: loadingToast });
      setSelectedInterview(null);
    } catch (err) {
      toast.error("Rejection failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredInterviews = useMemo(() => {
    return interviews.filter(int => {
      const matchesSearch = (int.candidate_name?.toLowerCase() || "").includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || int.Stage_status === statusFilter;
      const matchesStage = !stageFilter || int.current_candidate_stage === stageFilter;
      return matchesSearch && matchesStatus && matchesStage;
    });
  }, [interviews, searchTerm, statusFilter, stageFilter]);

  const stats = useMemo(() => ({
    total: interviews.length,
    active: interviews.filter(i => i.Stage_status === "In Progress").length,
    completed: interviews.filter(i => i.Stage_status === "Completed").length,
    rejected: interviews.filter(i => i.Final_decision === "Failed").length
  }), [interviews]);

  const getProgressPercentage = (stage: string) => {
    const idx = STAGES.indexOf(stage);
    return idx === -1 ? 0 : Math.round(((idx + 1) / STAGES.length) * 100);
  };

  return (
    <div className="h-screen overflow-y-auto bg-slate-50/50 p-10 font-sans custom-scrollbar">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-6 mb-8 flex-wrap">
        <div className="flex flex-col">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full mb-2.5 w-fit">
            <Calendar size={12} />
            <span>Interview Management</span>
          </div>
          <h1 className="text-[2rem] font-extrabold text-slate-900 tracking-tight mb-1.5 leading-none">Interview Hub</h1>
          <p className="text-sm text-slate-400 font-medium">
            Managing {stats.active} active recruitment rounds.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              className="h-[42px] w-[240px] pl-10 pr-3.5 rounded-xl border-[1.5px] border-slate-200 bg-white text-sm font-medium text-slate-900 outline-none transition-all focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-300"
              placeholder="Search name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Schedule dropdown */}
          <div className="relative">
            <button
              className="inline-flex items-center gap-2 h-[42px] px-[18px] bg-indigo-600 text-white border-none rounded-xl text-sm font-bold tracking-tight cursor-pointer transition-all hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-100"
              onClick={() => setInviteMenuOpen((p) => !p)}
            >
              <Calendar size={15} />
              Schedule Interview
              <ChevronDown size={13} className={`transition-transform duration-200 ${inviteMenuOpen ? "rotate-180" : ""}`} />
            </button>
            {inviteMenuOpen && (
              <div className="absolute top-[calc(100%+8px)] right-0 bg-white border-[1.5px] border-slate-200 rounded-2xl p-2 min-w-[180px] z-50 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  className="flex items-center gap-2.5 w-full p-2.5 border-none bg-transparent rounded-xl text-[13px] font-semibold text-slate-700 cursor-pointer text-left transition-colors hover:bg-slate-50"
                  onClick={() => {
                    // setSchedulingMode("Individual");
                    // setSelectedIds([]);
                    setInviteMenuOpen(false);
                  }}
                >
                  <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Users size={13} />
                  </span>
                  Single Round
                </button>
                <button
                  className="flex items-center gap-2.5 w-full p-2.5 border-none bg-transparent rounded-xl text-[13px] font-semibold text-slate-700 cursor-pointer text-left transition-colors hover:bg-slate-50"
                  onClick={() => {
                    // setSchedulingMode("Group");
                    // setSelectedIds([]);
                    setInviteMenuOpen(false);
                  }}
                >
                  <span className="w-7 h-7 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center flex-shrink-0">
                    <Users size={13} />
                  </span>
                  Bulk Batch
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Pipeline", value: stats.total, icon: Users, bg: "bg-blue-50", color: "text-blue-500", text: "text-blue-600", sub: "Total candidates" },
          { label: "Active", value: stats.active, icon: Play, bg: "bg-emerald-50", color: "text-emerald-500", text: "text-emerald-600", sub: "Interviewing now" },
          { label: "Hired", value: stats.completed, icon: CheckCircle, bg: "bg-indigo-50", color: "text-indigo-500", text: "text-indigo-600", sub: "Ready for onboarding" },
          { label: "Rejected", value: stats.rejected, icon: XCircle, bg: "bg-rose-50", color: "text-rose-500", text: "text-rose-600", sub: "Not a match" },
        ].map((s, i) => (
          <StatCard 
            key={i}
            icon={s.icon}
            label={s.label}
            value={s.value}
            subText={s.sub}
            iconBgClass={s.bg}
            iconColorClass={s.color}
            valueColorClass={s.text}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2 mb-8">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Filter by Pipeline Stage</p>
        <StageFilter 
          stages={STAGES}
          selectedStage={stageFilter}
          onStageChange={setStageFilter}
          totalCount={interviews.length}
          counts={STAGES.reduce((acc, s) => ({
            ...acc,
            [s]: interviews.filter(i => i.current_candidate_stage === s).length
          }), {})}
        />
        
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Filter by Round Status</p>
        <StageFilter 
          stages={STAGE_STATUSES}
          selectedStage={statusFilter}
          onStageChange={setStatusFilter}
          totalCount={interviews.length}
          counts={STAGE_STATUSES.reduce((acc, s) => ({
            ...acc,
            [s]: interviews.filter(i => i.Stage_status === s).length
          }), {})}
        />
      </div>

      <div className="bg-white rounded-[20px] border-[1.5px] border-slate-100 overflow-hidden shadow-sm shadow-slate-100">
        <div className="flex items-center justify-between p-[18px_24px] border-b border-slate-50 bg-slate-50/30">
          <div className="flex items-center gap-2 font-extrabold text-[12px] tracking-wider uppercase text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            Interview Schedule
          </div>
          <span className="text-[11px] font-bold text-slate-400 bg-white px-2.5 py-1 rounded-full border border-slate-100 shadow-sm">
            {filteredInterviews.length} active round{filteredInterviews.length !== 1 ? "s" : ""}
          </span>
        </div>
        <InterviewTable 
          data={filteredInterviews} loading={loading}
          onRowClick={setSelectedInterview} onMoveToNext={handleMoveToNext}
          getProgressPercentage={getProgressPercentage}
        />
      </div>

      <InterviewDrawer 
        interview={selectedInterview}
        onClose={() => setSelectedInterview(null)}
        onComplete={handleCompleteRound}
        onMoveToNext={handleMoveToNext}
        onRecruit={handleRecruit}
        onReject={handleReject}
        stages={STAGES}
        isUpdating={isUpdating}
      />
      <Toaster position="top-right" />
    </div>
  );
};
