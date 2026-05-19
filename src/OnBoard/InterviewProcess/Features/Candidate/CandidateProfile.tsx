import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Mail, 
  Phone, 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Briefcase,
  Globe,
  Loader2,
  Paperclip,
  MapPin,
  Cpu,
  Sparkles,
  Award
} from "lucide-react";
import { pageTheme } from "../../../../Themes/PageThems/pageConfig";
import { getUserTheme } from "../../../../Components/Common/UserAvatar";
import { Api_URL } from "../../../../APILINK";
import toast, { Toaster } from "react-hot-toast";
import { DocumentViewer } from "../../../../Components/Common/DocumentViewer";

const CANDIDATE_API = `${Api_URL}/candidates`;

const STATUS_CONFIG: Record<string, { label: string; dot: string; badge: string; text: string; bg: string }> = {
  recruited:  { label: "Recruited",  dot: "bg-emerald-500", badge: "bg-emerald-50", text: "text-emerald-600", bg: "bg-emerald-600" },
  rejected:  { label: "Rejected",  dot: "bg-rose-500", badge: "bg-rose-50", text: "text-rose-600", bg: "bg-rose-600" },
  selected:  { label: "Selected",  dot: "bg-blue-500", badge: "bg-blue-50", text: "text-blue-600", bg: "bg-blue-600" },
  applied:   { label: "Applied",   dot: "bg-slate-400", badge: "bg-slate-50", text: "text-slate-600", bg: "bg-slate-600" },
  default:   { label: "Applied",   dot: "bg-slate-400", badge: "bg-slate-50", text: "text-slate-600", bg: "bg-slate-600" },
};

export const CandidateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showResume, setShowResume] = useState(false);

  // Custom states for dynamic ATS & Job Matching
  const [atsScore, setAtsScore] = useState<any>(null);
  const [atsLoading, setAtsLoading] = useState(false);
  const [matchedJob, setMatchedJob] = useState<any>(null);

  // Selection & Rejection Actions States
  const [latestInterview, setLatestInterview] = useState<any>(null);
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [scheduleDetails, setScheduleDetails] = useState({
    date: "",
    time: "",
  });

  const fetchActiveInterview = async () => {
    try {
      const res = await fetch(`${Api_URL}/candidates/interviews/active`);
      if (res.ok) {
        const activeList = await res.json();
        const activeInt = activeList.find((x: any) => x.candidate_id.toString() === id);
        if (activeInt) {
          setLatestInterview(activeInt);
        } else {
          setLatestInterview(null);
        }
      }
    } catch (e) {
      console.error("Failed to fetch active interview", e);
    }
  };

  const fetchCandidateAndDetails = async () => {
    try {
      setLoading(true);
      // 1. Fetch Candidate Details
      const response = await fetch(`${CANDIDATE_API}/${id}`);
      if (!response.ok) throw new Error("Candidate not found");
      const candData = await response.json();
      setCandidate(candData);

      // 2. Fetch all jobs to match Job_title
      const jobsRes = await fetch(`${Api_URL}/jobpost/details/all`);
      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        const list = jobsData.data || [];
        const matched = list.find((j: any) => j.title.trim().toLowerCase() === candData.Job_title.trim().toLowerCase());
        if (matched) {
          setMatchedJob(matched);
        }
      }

      // 3. Fetch ATS Score if exists
      const atsRes = await fetch(`${Api_URL}/ats_score/candidate/${id}`);
      if (atsRes.ok) {
        const atsData = await atsRes.json();
        if (atsData.has_score) {
          setAtsScore(atsData);
        } else {
          setAtsScore(null);
        }
      }
    } catch (error) {
      console.error("Failed to fetch candidate details", error);
      toast.error("Failed to load profile details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCandidateAndDetails();
      fetchActiveInterview();
    }
  }, [id]);

  const handleCalculateAts = async () => {
    if (!matchedJob) {
      toast.error("No matching job template found in database to compare against!");
      return;
    }
    try {
      setAtsLoading(true);
      const loadingToast = toast.loading("Analyzing resume semantic match against job requirements...");
      const res = await fetch(`${Api_URL}/ats_score/calculate/candidate?candidate_id=${id}&post_id=${matchedJob.PostId}`, {
        method: "POST"
      });
      if (res.ok) {
        toast.dismiss(loadingToast);
        toast.success("Semantic ATS Score calculated successfully!");
        
        // Reload ATS Score and details to show Screening Completed
        fetchCandidateAndDetails();
        fetchActiveInterview();
      } else {
        const err = await res.json();
        toast.dismiss(loadingToast);
        toast.error(`Analysis failed: ${err.detail || "Unknown error"}`);
      }
    } catch (e) {
      console.error(e);
      toast.dismiss();
      toast.error("Network error during semantic analysis.");
    } finally {
      setAtsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!latestInterview) {
      toast.error("No active interview round found for this candidate to reject.");
      return;
    }
    const loadId = toast.loading("Processing candidate rejection...");
    try {
      const res = await fetch(`${Api_URL}/candidates/UpdateInterview/${latestInterview.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Final_decision: "Rejected",
          Interview_status: "Rejected"
        })
      });
      if (res.ok) {
        toast.dismiss(loadId);
        toast.success("Candidate has been rejected.");
        setShowRejectModal(false);
        fetchCandidateAndDetails();
        fetchActiveInterview();
      } else {
        toast.dismiss(loadId);
        toast.error("Failed to process rejection.");
      }
    } catch (e) {
      toast.dismiss(loadId);
      console.error(e);
      toast.error("Network error.");
    }
  };

  const handleSelectAndSchedule = async () => {
    if (!latestInterview) {
      toast.error("No active interview round found to progress.");
      return;
    }
    if (!scheduleDetails.date || !scheduleDetails.time) {
      toast.error("Please provide both Date and Time for scheduling the next round.");
      return;
    }
    
    const loadId = toast.loading("Advancing candidate and scheduling next round...");
    try {
      // Step 1: Complete current round with Selected
      const res1 = await fetch(`${Api_URL}/candidates/UpdateInterview/${latestInterview.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Final_decision: "Selected",
          Interview_status: "Completed"
        })
      });
      
      if (!res1.ok) {
        toast.dismiss(loadId);
        toast.error("Failed to advance candidate to the next stage.");
        return;
      }
      
      // Step 2: Fetch active interviews again to find the newly created round
      const activeRes = await fetch(`${Api_URL}/candidates/interviews/active`);
      if (activeRes.ok) {
        const activeList = await activeRes.json();
        const newActiveInt = activeList.find((x: any) => x.candidate_id.toString() === id);
        
        if (newActiveInt) {
          // Step 3: Update the new scheduled interview's date & time
          const res2 = await fetch(`${Api_URL}/candidates/UpdateInterview/${newActiveInt.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              Interview_date: scheduleDetails.date,
              Interview_time: scheduleDetails.time,
              Interview_status: "Scheduled"
            })
          });
          
          if (!res2.ok) {
            console.warn("Advanced candidate, but failed to apply custom schedule details directly.");
          }
        }
      }
      
      toast.dismiss(loadId);
      toast.success("Candidate successfully selected and next round scheduled!");
      setShowSelectModal(false);
      
      // Refresh candidate details & active interview
      fetchCandidateAndDetails();
      fetchActiveInterview();
    } catch (e) {
      toast.dismiss(loadId);
      console.error(e);
      toast.error("Failed to schedule stage transition.");
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Retrieving Profile...</p>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50">
        <XCircle className="text-rose-500 mb-4" size={48} />
        <p className="text-lg font-bold text-slate-700">Profile Not Found</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-primary font-bold">Return Back</button>
      </div>
    );
  }

  const currentStatus = candidate.Candidate_status?.toLowerCase() || "";
  const sc = STATUS_CONFIG[currentStatus] ?? STATUS_CONFIG.default;
  const theme = getUserTheme(candidate.Candidate_name || "");
  const initials = candidate.Candidate_name
    ?.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();

  // Dynamic progress array from Database or Fallback
  const progressStages = candidate.stages_list && candidate.stages_list.length > 0 
    ? candidate.stages_list 
    : [
        { Stage_name: "Applied", Stage_status: "Completed" },
        { Stage_name: "Technical Interview", Stage_status: "In Progress" },
        { Stage_name: "HR Round", Stage_status: "Pending" },
        { Stage_name: "Selection Gatekeeper", Stage_status: "Pending" }
      ];

  const isPermanentlyClosed = currentStatus === "rejected" || currentStatus === "recruited";

  return (
    <div className={pageTheme.layout.mainContainer}>
      <Toaster position="top-right" />
      
      {/* Navigation */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] mb-8"
      >
        <ArrowLeft size={14} /> Back to Pipeline
      </button>

      {/* Profile Header Card */}
      <div className="mb-10">
        <div className="flex items-center justify-between gap-6 flex-wrap bg-white p-8 rounded-[40px] shadow-xl shadow-slate-200/40 border border-slate-100/50">
          <div className="flex items-center gap-8">
            <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center text-2xl font-extrabold flex-shrink-0 tracking-tighter border-4 border-white shadow-lg ${theme.bg} text-white`}>
              {initials}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${sc.badge} ${sc.text} border-primary/10`}>
                  {sc.label}
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  ID: {candidate.Candidate_ID}
                </span>
              </div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-1 uppercase">
                {candidate.Candidate_name}
              </h1>
              <div className="flex items-center gap-4 text-slate-500 font-medium">
                <p className="flex items-center gap-1.5"><Briefcase size={16} className="text-primary/60" /> {candidate.Job_title}</p>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <p className="flex items-center gap-1.5"><MapPin size={16} className="text-primary/60" /> Remote / On-site</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             {isPermanentlyClosed ? (
               <div className={`h-14 px-8 rounded-2xl flex items-center justify-center text-[11px] font-black uppercase tracking-widest border ${sc.badge} ${sc.text}`}>
                 {sc.label} Profile Closed
               </div>
             ) : (
               <>
                 <button 
                   onClick={() => setShowRejectModal(true)}
                   className="h-14 px-6 rounded-2xl border border-rose-200 text-rose-600 font-black text-[11px] uppercase tracking-widest hover:bg-rose-50 transition-all active:scale-95"
                 >
                   Reject Candidate
                 </button>
                 <button 
                   onClick={() => setShowSelectModal(true)}
                   className="h-14 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] uppercase tracking-widest hover:shadow-2xl transition-all active:scale-95 shadow-lg shadow-emerald-605/20"
                 >
                   Select / Next Round
                 </button>
               </>
             )}
          </div>
        </div>
      </div>

      {/* AI Decision Alert Box if ATS is very low */}
      {atsScore && atsScore.final_score < 40 && !isPermanentlyClosed && (
        <div className="mb-8 p-5 rounded-[24px] bg-amber-50/70 border border-amber-200/60 flex items-start gap-4 text-left animate-fadeIn">
          <span className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-200/50 shadow-sm">
            <Award size={18} className="animate-pulse" />
          </span>
          <div>
            <h4 className="text-[11px] font-black text-amber-800 uppercase tracking-widest mb-0.5">⚠️ AI Placement Alert</h4>
            <p className="text-xs font-bold text-amber-700 leading-relaxed">
              This candidate has a very low overall semantic match ratio of <span className="font-extrabold">{atsScore.final_score}%</span>. 
              We suggest <span className="underline font-extrabold">Rejecting</span> this candidate, but you can choose to select and advance them anyway if you wish.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Details, Resume & Applied Job */}
        <div className="lg:col-span-4 space-y-8">
          {/* Contact Information */}
          <div className={pageTheme.section.card}>
            <div className={pageTheme.section.header}>
              <div className={pageTheme.section.title}>
                <span className={pageTheme.section.titleDot} />
                Contact Details
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shadow-sm">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 text-left">Email Address</p>
                  <p className="text-[14px] font-bold text-slate-700 text-left">{candidate.Candidate_Email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-sm">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 text-left">Phone Number</p>
                  <p className="text-[14px] font-bold text-slate-700 text-left">{candidate.Candidate_Phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-500 flex items-center justify-center shadow-sm">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 text-left">Source</p>
                  <p className="text-[14px] font-bold text-slate-700 text-left">{candidate.Candidate_Source || "Direct Application"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Resume Section */}
          <div className={pageTheme.section.card}>
             <div className={pageTheme.section.header}>
              <div className={pageTheme.section.title}>
                <span className={pageTheme.section.titleDot} />
                Documents
              </div>
            </div>
            <div className="p-8">
              <div className={`p-6 rounded-[32px] border flex items-center justify-between transition-all duration-300 ${candidate.Resume_path ? "bg-primary/5 border-primary/20" : "bg-rose-50 border-rose-100"}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${candidate.Resume_path ? "bg-primary text-white" : "bg-rose-500 text-white"}`}>
                    <Paperclip size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Curriculum Vitae</h4>
                    <span className={`text-[12px] font-bold block text-left ${candidate.Resume_path ? "text-primary" : "text-rose-600"}`}>
                      {candidate.Resume_path ? "Attached" : "Missing"}
                    </span>
                  </div>
                </div>
                {candidate.Resume_path && (
                  <button 
                    onClick={() => setShowResume(true)}
                    className="p-3 rounded-xl bg-white text-primary border border-primary/10 hover:bg-primary hover:text-white transition-all shadow-sm flex-shrink-0"
                  >
                    <ExternalLink size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Applied Job Details Card */}
          <div className={pageTheme.section.card}>
            <div className={pageTheme.section.header}>
              <div className={pageTheme.section.title}>
                <span className={pageTheme.section.titleDot} />
                Job Applied Profile
              </div>
            </div>
            <div className="p-8 space-y-6">
              {matchedJob ? (
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-1.5">
                    <span className="text-[9px] font-black text-primary uppercase tracking-widest text-left">Target Position</span>
                    <span className="text-sm font-black text-slate-800 uppercase text-left">{matchedJob.title}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">
                      {matchedJob.department} • {matchedJob.location}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100/50">
                      <span className="text-[8px] font-bold text-slate-400 uppercase block tracking-wider mb-0.5 text-left">Exp Required</span>
                      <span className="text-xs font-extrabold text-slate-700 block text-left">{matchedJob.experience || "Not Specified"}</span>
                    </div>
                    <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100/50">
                      <span className="text-[8px] font-bold text-slate-400 uppercase block tracking-wider mb-0.5 text-left">Offered Salary</span>
                      <span className="text-xs font-extrabold text-slate-700 block text-left">{matchedJob.salary || "Not Specified"}</span>
                    </div>
                  </div>

                  {matchedJob.stack && (
                    <div className="flex flex-col gap-2">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Required Tech Stack:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {matchedJob.stack.split(",").map((tech: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 bg-white border border-slate-150 rounded-lg text-[10px] font-extrabold text-slate-600 shadow-sm uppercase tracking-wide">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {matchedJob.education && (
                    <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-3">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Education Gateway:</span>
                      <span className="text-xs font-bold text-slate-500 block text-left">{matchedJob.education}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Briefcase className="text-slate-300 mx-auto mb-2" size={28} />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">No matching job template found</p>
                  <p className="text-[10px] text-slate-400 mt-1">Comparing to plain title: {candidate.Job_title}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: ATS Match, Pipeline & Experience */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* ATS Semantic Match Card */}
          <div className={pageTheme.section.card}>
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-white/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10 text-primary shadow-sm">
                  <Cpu size={16} />
                </span>
                <div className="text-left">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">AI Semantic ATS Score</h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Gemini Neural Matching Engine</p>
                </div>
              </div>
              
              {atsScore && (
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Sparkles size={11} className="animate-pulse text-emerald-500" /> Verified Score
                </span>
              )}
            </div>
            
            <div className="p-8">
              {atsScore ? (
                <div className="space-y-8">
                  {/* Top Row: Circular Progress Ring & Metric Bars */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    
                    {/* Ring score wrapper */}
                    <div className="md:col-span-4 flex flex-col items-center justify-center">
                      <div className="relative w-36 h-36 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          {/* Background Ring */}
                          <circle
                            className="text-slate-100"
                            strokeWidth="8"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                          />
                          {/* Progress Ring */}
                          <circle
                            className={`transition-all duration-1000 ${
                              atsScore.final_score >= 80 
                                ? "text-emerald-500" 
                                : atsScore.final_score >= 60 
                                  ? "text-blue-500" 
                                  : atsScore.final_score >= 40 
                                    ? "text-amber-500" 
                                    : "text-rose-500"
                            }`}
                            strokeWidth="8"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - atsScore.final_score / 100)}`}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-3xl font-black text-slate-800 tracking-tighter">
                            {atsScore.final_score}%
                          </span>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                            Match Ratio
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Horizontal Breakdowns */}
                    <div className="md:col-span-8 space-y-3.5">
                      {[
                        { name: "Technical Skills", val: atsScore.skills_score },
                        { name: "Soft Skills & Communication", val: atsScore.semantic_score },
                        { name: "Experience Alignment", val: atsScore.experience_score },
                        { name: "Educational Eligibility", val: atsScore.education_score },
                        { name: "Core Methodologies", val: atsScore.methodologies_score },
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-wide">
                            <span>{item.name}</span>
                            <span className="text-slate-800">{item.val}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-550 ${
                                item.val >= 80 
                                  ? "bg-emerald-500" 
                                  : item.val >= 60 
                                    ? "bg-blue-500" 
                                    : item.val >= 40 
                                      ? "bg-amber-500" 
                                      : "bg-rose-500"
                              }`}
                              style={{ width: `${item.val}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills Matching Lists */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                    <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-100/50">
                      <h4 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-3 flex items-center gap-1.5 text-left">
                        <CheckCircle size={14} className="text-emerald-500" /> Matched Keywords
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {atsScore.matched_skills ? (
                          atsScore.matched_skills.split(",").map((s: string, i: number) => (
                            <span key={i} className="px-2.5 py-1 bg-white border border-emerald-100 rounded-lg text-[10px] font-bold text-emerald-600 shadow-sm uppercase tracking-wide">
                              {s.trim()}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] font-medium text-slate-400 italic">No matched keywords extracted.</span>
                        )}
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-100/50">
                      <h4 className="text-[10px] font-black text-rose-700 uppercase tracking-widest mb-3 flex items-center gap-1.5 text-left">
                        <XCircle size={14} className="text-rose-500" /> Missing Keywords
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {atsScore.missing_skills ? (
                          atsScore.missing_skills.split(",").map((s: string, i: number) => (
                            <span key={i} className="px-2.5 py-1 bg-white border border-rose-150 rounded-lg text-[10px] font-bold text-rose-600 shadow-sm uppercase tracking-wide">
                              {s.trim()}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] font-medium text-slate-400 italic">No missing critical keywords.</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hiring AI Suggestions Box */}
                  {atsScore.suggestions && (
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100/80 flex items-start gap-3 text-left">
                      <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex-shrink-0 shadow-sm border border-amber-100/50 mt-0.5">
                        <Award size={16} />
                      </span>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">AI Placement Suggestions</span>
                        <p className="text-xs font-bold text-slate-600 leading-relaxed">{atsScore.suggestions}</p>
                      </div>
                    </div>
                  )}

                  {/* Re-calculate Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleCalculateAts}
                      disabled={atsLoading}
                      className="px-5 py-2.5 bg-slate-800 text-white hover:bg-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-md shadow-slate-800/10 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Sparkles size={12} />
                      {atsLoading ? "Re-Analyzing..." : "Re-Calculate Match"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-[24px] bg-slate-100 text-slate-400 flex items-center justify-center shadow-inner">
                    <Sparkles size={28} className="text-primary/40 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-700 uppercase tracking-tight">ATS Semantic Score Missing</h4>
                    <p className="text-xs text-slate-400 font-medium max-w-sm mt-1 mx-auto leading-relaxed">
                      This candidate has not been matching-analyzed yet. Perform a neural Gemini keyword extraction and requirements cross-reference match.
                    </p>
                  </div>
                  <button
                    onClick={handleCalculateAts}
                    disabled={atsLoading || !matchedJob}
                    className="h-12 px-6 rounded-2xl bg-primary text-white hover:bg-primary/95 text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Sparkles size={14} />
                    {atsLoading ? "Analyzing Resume..." : "Calculate AI ATS Score"}
                  </button>
                  {!matchedJob && (
                    <span className="text-[9px] font-bold text-rose-500 uppercase tracking-wider">
                      ⚠️ Please create a matching job posting first!
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

           {/* Progress Line */}
           <div className={pageTheme.section.card}>
            <div className={pageTheme.section.header}>
              <div className={pageTheme.section.title}>
                <span className={pageTheme.section.titleDot} />
                Application Progress
              </div>
            </div>
            <div className="p-8">
               
               {/* Completed Count & Milestone Header */}
               <div className="flex justify-between items-center mb-10 border-b border-slate-100 pb-5 flex-wrap gap-2 text-left">
                 <div className="flex items-center gap-2">
                   <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                   <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                     Rounds Progress: {candidate.completed_stages_count ?? 0} / {candidate.total_stages_count ?? 4} Completed
                   </span>
                 </div>
                 <span className="text-[10px] font-black text-primary bg-primary/5 border border-primary/10 px-2.5 py-1 rounded-md uppercase tracking-wider">
                   Active Milestone: {candidate.current_candidate_stage || "Applied"}
                 </span>
               </div>

               <div className="flex items-center justify-between mb-6 px-4 relative overflow-x-auto gap-8 py-4">
                  {/* Pipeline line */}
                  <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-100 -translate-y-1/2 -z-10" />
                  
                  {progressStages.map((step: any, i: number) => {
                    const isCompleted = step.Stage_status === "Completed";
                    const isCurrent = step.Stage_status === "In Progress";
                    return (
                      <div key={i} className="flex flex-col items-center gap-3 min-w-[85px]">
                        <div className={`w-10 h-10 rounded-full border-4 border-white flex items-center justify-center shadow-md transition-all ${
                          isCompleted 
                            ? "bg-primary text-white" 
                            : isCurrent 
                              ? "bg-blue-500 text-white animate-pulse" 
                              : "bg-slate-50 text-slate-300"
                        }`}>
                          {isCompleted ? <CheckCircle size={18} /> : i + 1}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          isCompleted || isCurrent ? "text-slate-800" : "text-slate-400"
                        }`}>
                          {step.Stage_name}
                        </span>
                      </div>
                    );
                  })}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                  <div className="p-6 rounded-[32px] bg-slate-50/50 border border-slate-100 text-left">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Top Skills</h4>
                    <div className="flex flex-wrap gap-2">
                       {(candidate.Candidate_Skills || "React, TypeScript, Node.js, Tailwind, Figma").split(",").map((skill: string, i: number) => (
                         <span key={i} className="px-3 py-1.5 rounded-xl bg-white border border-slate-100 text-[12px] font-bold text-slate-600 shadow-sm">
                           {skill.trim()}
                         </span>
                       ))}
                    </div>
                  </div>

                  <div className="p-6 rounded-[32px] bg-slate-50/50 border border-slate-100 text-left">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Current Status</h4>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${sc.dot} text-white`}>
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-slate-700">Interview Stage</p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Active Round: {candidate.current_candidate_stage || "Screening"}</p>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          <div className={pageTheme.section.card}>
            <div className={pageTheme.section.header}>
              <div className={pageTheme.section.title}>
                <span className={pageTheme.section.titleDot} />
                Application History
              </div>
            </div>
            <div className="p-8">
               <div className="space-y-6">
                 {[
                   { event: "Application Submitted", date: "May 12, 2026", status: "Done" },
                   { event: "Resume Screening", date: "May 13, 2026", status: "Done" },
                   { event: "Technical Interview", date: "May 15, 2026", status: "In-Progress" }
                 ].map((h, i) => (
                   <div key={i} className="flex items-center justify-between group text-left">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <div>
                          <p className="text-[14px] font-bold text-slate-700">{h.event}</p>
                          <p className="text-[11px] font-bold text-slate-400">{h.date}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${h.status === 'Done' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                        {h.status}
                      </span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>

      <DocumentViewer 
        isOpen={showResume} 
        onClose={() => setShowResume(false)} 
        filePath={candidate.Resume_path}
        title="Candidate Resume"
        subTitle={candidate.Candidate_name}
      />

      {/* Reject Confirmation Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full border border-slate-100 shadow-2xl space-y-6">
            <div className="flex flex-col items-center text-center gap-3">
              <span className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center shadow-sm">
                <XCircle size={28} />
              </span>
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Reject Candidate?</h3>
              <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-wider">
                Are you sure you want to reject {candidate.Candidate_name}? This will clear all active recruitment stages.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="h-12 rounded-xl bg-slate-50 border border-slate-200 text-slate-550 hover:bg-slate-100 font-black text-[10px] uppercase tracking-wider transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="h-12 rounded-xl bg-rose-600 text-white hover:bg-rose-700 font-black text-[10px] uppercase tracking-wider transition-all shadow-md shadow-rose-600/10"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Select / Stage Progression Modal */}
      {showSelectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full border border-slate-100 shadow-2xl space-y-6">
            <div className="flex flex-col items-center text-center gap-3">
              <span className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-500 flex items-center justify-center shadow-sm">
                <CheckCircle size={28} />
              </span>
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Advance Candidate</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider leading-relaxed">
                Select and schedule the next round details for {candidate.Candidate_name}.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] font-black text-slate-450 uppercase tracking-wider">Interview Date</label>
                <input
                  type="date"
                  value={scheduleDetails.date}
                  onChange={(e) => setScheduleDetails(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] font-black text-slate-450 uppercase tracking-wider">Interview Time</label>
                <input
                  type="time"
                  value={scheduleDetails.time}
                  onChange={(e) => setScheduleDetails(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 outline-none focus:border-primary transition-all"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowSelectModal(false)}
                className="h-12 rounded-xl bg-slate-50 border border-slate-200 text-slate-550 hover:bg-slate-100 font-black text-[10px] uppercase tracking-wider transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSelectAndSchedule}
                className="h-12 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-black text-[10px] uppercase tracking-wider transition-all shadow-md shadow-emerald-600/10"
              >
                Confirm Select
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
