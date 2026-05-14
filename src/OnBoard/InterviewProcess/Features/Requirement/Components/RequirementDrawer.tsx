import { motion, AnimatePresence } from "framer-motion";
import { 
  X, FileText,  CheckCircle2, 
  Monitor, Unlock, 
  ExternalLink as OpenIcon, Fingerprint, 
} from "lucide-react";
import { pageTheme } from "../../../../../Themes/PageThems/pageConfig";
import { getUserTheme } from "../../../../../Components/Common/UserAvatar";

interface RequirementDrawerProps {
  data: any | null;
  onClose: () => void;
  onOpenProfile: (id: string) => void;
}


export const RequirementDrawer = ({ data, onClose, onOpenProfile }: RequirementDrawerProps) => {
  if (!data) return null;

  const theme = getUserTheme(data.name || "");
  const initials = data.name?.split(" ").slice(0, 2).map((w: any) => w[0]).join("").toUpperCase();
  
  const docs = data.marks_sheets || [];
  const assets = data.assets || [];
  const access = data.access || [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-end p-4 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        {/* Drawer Container */}
        <motion.div
          initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className={`relative w-full max-w-[440px] h-[calc(100vh-32px)] ${pageTheme.section.cardBgColor} rounded-[32px] flex flex-col overflow-hidden shadow-2xl font-sans`}
        >
          {/* Header */}
          <div className={`p-8 pb-10 ${theme.bg} text-white relative`}>
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer text-white/80 transition-all hover:bg-white/20 active:scale-90"
            >
              <X size={18} />
            </button>

            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-2xl font-black border border-white/10 shadow-inner">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-[9px] font-black uppercase tracking-widest border border-white/10">
                    {data.department}
                  </span>
                </div>
                <h2 className="text-xl font-black tracking-tight leading-tight uppercase truncate text-white">
                  {data.name}
                </h2>
                <p className="text-[11px] font-bold text-white uppercase tracking-wider mt-1">
                  {data.position}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-0 -mt-6">
            <div className="space-y-8">
              
              {/* ID Card */}
              <div className="p-5 mt-10 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Registry ID</p>
                  <p className="text-sm font-black text-slate-700 flex items-center gap-2">
                    <Fingerprint size={14} className="text-primary" /> {data.Temp_Id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Status</p>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                    Active
                  </span>
                </div>
              </div>

              {/* Documents Quick View */}
              <Section title="Document Status">
                <div className="grid grid-cols-1 gap-2.5">
                  {docs.map((doc: any) => (
                    <div key={doc.doc_type} className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                      doc.status === "Received" ? "bg-emerald-50/30 border-emerald-100" : "bg-slate-50 border-slate-100"
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          doc.status === "Received" ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"
                        }`}>
                          <FileText size={14} />
                        </div>
                        <span className="text-[12px] font-bold text-slate-700">{doc.doc_type}</span>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                        doc.status === "Received" ? "text-emerald-600" : "text-slate-400"
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Assets Provisioned */}
              <Section title="Assets Provisioned">
                <div className="space-y-2">
                  {assets.length > 0 ? assets.map((item: any) => (
                    <div key={item.ass_id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <Monitor size={14} className="text-primary/40 group-hover:text-primary transition-colors" />
                        <div>
                          <p className="text-[12px] font-bold text-slate-700 leading-none mb-1">{item.Ass_name}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{item.ass_id} • {item.Type}</p>
                        </div>
                      </div>
                      {item.status === "true" && <CheckCircle2 size={16} className="text-emerald-500" />}
                    </div>
                  )) : (
                    <p className="text-[11px] font-bold text-slate-400 text-center py-4 italic">No assets assigned yet.</p>
                  )}
                </div>
              </Section>

              {/* Security Access */}
              <Section title="Security Access">
                <div className="grid grid-cols-2 gap-2">
                  {access.map((acc: any) => (
                    <div key={acc.AccsesName} className={`p-3 rounded-xl border flex items-center gap-3 bg-emerald-50/50 border-emerald-100`}>
                      <Unlock size={14} className="text-emerald-500" />
                      <span className={`text-[11px] font-bold truncate text-emerald-700`}>{acc.AccsesName}</span>
                    </div>
                  ))}
                </div>
              </Section>

            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-8 border-t border-slate-100 bg-white flex flex-col gap-3">
            <button
              onClick={() => onOpenProfile(data.id)}
              className="w-full py-4 rounded-2xl bg-primary text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <OpenIcon size={14} /> Full Requirement Profile
            </button>
            <button
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] border border-slate-100 hover:bg-slate-100 transition-all active:scale-95"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <div className="flex items-center gap-2 mb-4">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</h3>
    </div>
    {children}
  </div>
);
