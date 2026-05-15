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
  TrendingUp,
  MapPin
} from "lucide-react";
import { pageTheme } from "../../../../Themes/PageThems/pageConfig";
import { getUserTheme } from "../../../../Components/Common/UserAvatar";
import { Api_URL } from "../../../../APILINK";
import type { Candidate } from "../../../../Types/typesOnboarding";
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
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [showResume, setShowResume] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${CANDIDATE_API}/all`);
        const data: Candidate[] = await response.json();
        const found = data.find(c => c.id.toString() === id);
        if (found) {
          setCandidate(found);
        } else {
          toast.error("Candidate not found");
        }
      } catch (error) {
        console.error("Failed to fetch candidate", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCandidate();
  }, [id]);

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
    ?.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

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
            <div>
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
             <button className="h-14 px-8 rounded-2xl bg-primary text-white font-black text-[11px] uppercase tracking-widest hover:shadow-2xl transition-all active:scale-95 shadow-lg shadow-primary/20">
               Schedule Interview
             </button>
             <button className="w-14 h-14 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all">
                <TrendingUp size={20} />
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Details & Resume */}
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
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Email Address</p>
                  <p className="text-[14px] font-bold text-slate-700">{candidate.Candidate_Email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-sm">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Phone Number</p>
                  <p className="text-[14px] font-bold text-slate-700">{candidate.Candidate_Phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-500 flex items-center justify-center shadow-sm">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Source</p>
                  <p className="text-[14px] font-bold text-slate-700">{candidate.Candidate_Source || "Direct Application"}</p>
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
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Curriculum Vitae</h4>
                    <span className={`text-[12px] font-bold ${candidate.Resume_path ? "text-primary" : "text-rose-600"}`}>
                      {candidate.Resume_path ? "Attached" : "Missing"}
                    </span>
                  </div>
                </div>
                {candidate.Resume_path && (
                  <button 
                    onClick={() => setShowResume(true)}
                    className="p-3 rounded-xl bg-white text-primary border border-primary/10 hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    <ExternalLink size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pipeline & Experience */}
        <div className="lg:col-span-8 space-y-8">
           <div className={pageTheme.section.card}>
            <div className={pageTheme.section.header}>
              <div className={pageTheme.section.title}>
                <span className={pageTheme.section.titleDot} />
                Application Progress
              </div>
            </div>
            <div className="p-8">
               <div className="flex items-center justify-between mb-10 px-4 relative">
                  {/* Pipeline line */}
                  <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-100 -translate-y-1/2 -z-10" />
                  
                  {["Applied", "Technical", "HR Round", "Selection"].map((step, i) => {
                    const isCompleted = i < 2; // Mock progress
                    const isCurrent = i === 2;
                    return (
                      <div key={i} className="flex flex-col items-center gap-3">
                        <div className={`w-10 h-10 rounded-full border-4 border-white flex items-center justify-center shadow-md transition-all ${isCompleted ? "bg-primary text-white" : isCurrent ? "bg-blue-500 text-white animate-pulse" : "bg-slate-50 text-slate-300"}`}>
                          {isCompleted ? <CheckCircle size={18} /> : i + 1}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${isCompleted || isCurrent ? "text-slate-800" : "text-slate-400"}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                  <div className="p-6 rounded-[32px] bg-slate-50/50 border border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Top Skills</h4>
                    <div className="flex flex-wrap gap-2">
                       {(candidate.Candidate_Skills || "React, TypeScript, Node.js, Tailwind, Figma").split(",").map((skill, i) => (
                         <span key={i} className="px-3 py-1.5 rounded-xl bg-white border border-slate-100 text-[12px] font-bold text-slate-600 shadow-sm">
                           {skill.trim()}
                         </span>
                       ))}
                    </div>
                  </div>

                  <div className="p-6 rounded-[32px] bg-slate-50/50 border border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Current Status</h4>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${sc.dot} text-white`}>
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-slate-700">Interview Scheduled</p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Today at 2:30 PM</p>
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
                   <div key={i} className="flex items-center justify-between group">
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
    </div>
  );
};
