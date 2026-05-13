import { useState, useEffect, useMemo } from "react";

import {
  Calendar,
  XCircle, Users,
  Play, CheckCircle,
  Search
} from "lucide-react";
import { Api_URL } from "../../../APILINK";
import type { InterviewRecord } from "../../../Types/typesOnboarding";

import { toast, Toaster } from "react-hot-toast";
import { InterviewTable } from "./Candidate/Components/InterviewTable";
import StageFilter from "../../../Components/Common/StageFilter";
import StatCard from "../../../Components/Common/StatCard";
import { InterviewDrawer } from "./Candidate/Components/InterviewDrawer";

const API_URL = `${Api_URL}/candidates`;

// These should ideally come from backend Stage Master, but keeping for filter UI
const STAGES = ["Screening", "Technical Round 1", "Technical Round 2", "HR Round", "Final Round"];
const STAGE_STATUSES = ["Pending", "In Progress", "Completed"];

export const Interview = () => {
  const [interviews, setInterviews] = useState<InterviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [selectedInterview, setSelectedInterview] = useState<InterviewRecord | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/interviews/active`);
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setInterviews(data);
    } catch (err) {
      console.error("Failed to sync pipeline");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCompleteRound = async (interview: InterviewRecord) => {
    setIsUpdating(true);
    const loadingToast = toast.loading("Processing assessment...");
    try {
      await fetch(`${API_URL}/UpdateInterview/${interview.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Interview_status: "Completed",
          Final_decision: "Selected",
          Interview_score: interview.Interview_score,
          Interview_feedback: interview.Interviewer_feedback
        }),
      });
      await fetchData();
      toast.success("Round completed. Pipeline updated.", { id: loadingToast });
      setSelectedInterview(null);
    } catch (err) {
      toast.error("Action failed", { id: loadingToast });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async (interview: InterviewRecord) => {
    setIsUpdating(true);
    const loadingToast = toast.loading("Processing rejection...");
    try {
      await fetch(`${API_URL}/UpdateInterview/${interview.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Final_decision: "Rejected",
          Interview_status: "Rejected"
        }),
      });
      await fetchData();
      toast.success("Candidate Rejected", { id: loadingToast });
      setSelectedInterview(null);
    } catch (err) {
      toast.error("Action failed", { id: loadingToast });
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredInterviews = useMemo(() => {
    return interviews.filter(int => {
      const name = int.candidate_name?.toLowerCase() || "";
      const cid = int.Candidate_id?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();

      const matchesSearch = name.includes(search) || cid.includes(search);
      const matchesStatus = !statusFilter || int.Stage_status === statusFilter;
      const matchesStage = !stageFilter || int.Stage_name === stageFilter;

      return matchesSearch && matchesStatus && matchesStage;
    });
  }, [interviews, searchTerm, statusFilter, stageFilter]);

  const stats = useMemo(() => ({
    total: interviews.length,
    active: interviews.filter(i => i.Interview_status === "Scheduled").length,
    completed: interviews.filter(i => i.Interview_status === "Completed").length,
    rejected: interviews.filter(i => i.Interview_status === "Rejected").length
  }), [interviews]);


  return (
    <div className="h-full bg-slate-50/50 p-10 font-sans custom-scrollbar">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-6 mb-8 flex-wrap">
        <div className="flex flex-col">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full mb-2.5 w-fit">
            <Calendar size={12} />
            <span>Interview Pipeline</span>
          </div>
          <h1 className="text-[2rem] font-extrabold text-slate-900 tracking-tight mb-1.5 leading-none">Interview Hub</h1>
          <p className="text-sm text-slate-400 font-medium">
            Currently tracking {stats.total} candidates in the recruitment workflow.
          </p>
        </div>

        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            className="h-[42px] w-[280px] pl-10 pr-3.5 rounded-xl border-[1.5px] border-slate-200 bg-white text-sm font-medium text-slate-900 outline-none transition-all focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-300 shadow-sm"
            placeholder="Search by candidate name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Pipeline", value: stats.total, icon: Users, bg: "bg-blue-50", color: "text-blue-500", text: "text-blue-600", sub: "Total candidates" },
          { label: "Active", value: stats.active, icon: Play, bg: "bg-emerald-50", color: "text-emerald-500", text: "text-emerald-600", sub: "Scheduled rounds" },
          { label: "Completed", value: stats.completed, icon: CheckCircle, bg: "bg-indigo-50", color: "text-indigo-500", text: "text-indigo-600", sub: "Assessment done" },
          { label: "Rejected", value: stats.rejected, icon: XCircle, bg: "bg-rose-50", color: "text-rose-500", text: "text-rose-600", sub: "Not qualified" },
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
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Filter by Recruitment Round</p>
        <StageFilter
          stages={STAGES}
          selectedStage={stageFilter}
          onStageChange={setStageFilter}
          totalCount={interviews.length}
          counts={STAGES.reduce((acc, s) => ({
            ...acc,
            [s]: interviews.filter(i => i.Stage_name === s).length
          }), {})}
        />

        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Filter by Status</p>
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

      <div className="bg-white rounded-[20px] border-[1.5px] border-slate-100 overflow-hidden shadow-sm shadow-slate-100 mb-10">
        <div className="flex items-center justify-between p-[18px_24px] border-b border-slate-50 bg-slate-50/30">
          <div className="flex items-center gap-2 font-extrabold text-[12px] tracking-wider uppercase text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            Interview Schedule
          </div>
          <span className="text-[11px] font-bold text-slate-400 bg-white px-2.5 py-1 rounded-full border border-slate-100 shadow-sm">
            {filteredInterviews.length} Round{filteredInterviews.length !== 1 ? "s" : ""}
          </span>
        </div>
        <InterviewTable
          data={filteredInterviews} loading={loading}
          onRowClick={setSelectedInterview}
        />
      </div>

      <InterviewDrawer
        interview={selectedInterview}
        onClose={() => setSelectedInterview(null)}
        onComplete={handleCompleteRound}
        onReject={handleReject}
        stages={STAGES}
        isUpdating={isUpdating}
      />
      <Toaster position="top-right" />
    </div>
  );
};
