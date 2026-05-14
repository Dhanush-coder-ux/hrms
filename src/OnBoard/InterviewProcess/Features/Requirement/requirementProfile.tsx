import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  User, 
  FileText, 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle2, 
  XCircle,
  Monitor,
  Fingerprint,
  Upload,
  X,
  FileUp,
  Settings,
  Check,
  Unlock,
  Plus,
  Link,
  Loader2
} from "lucide-react";
import { pageTheme } from "../../../../Themes/PageThems/pageConfig";
import toast, { Toaster } from "react-hot-toast";
import { Api_URL as Base_URL } from "../../../../APILINK";

const Api_URL = `${Base_URL}/requirement`;



interface RequirementDetail {
  id: number;
  Temp_Id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  Resume: string;
  marks_sheets: Array<{
    doc_type: string;
    doc_id: string;
    link: string;
    status: string;
  }>;
  assets: Array<{
    ass_id: string;
    Type: string;
    Ass_name: string;
    status: string;
    Conditon: string;
    handover_date: string;
  }>;
  access: Array<{
    AccsesName: string;
  }>;
}

export const RequirementProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<RequirementDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newAsset, setNewAsset] = useState({ name: "", type: "Laptop", id: "", date: "" });
  const [newAccess, setNewAccess] = useState({ name: "", status: "false" });
  const [newDoc, setNewDoc] = useState({ name: "" });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${Api_URL}/${id}`);
      if (!res.ok) throw new Error("Not found");
      const result = await res.json();
      setData(result);
    } catch (error) {
      try {
        const res = await fetch(`${Api_URL}?Emp_Id=${id}`);
        const result = await res.json();
        if (result && result.length > 0) setData(result[0]);
        else toast.error("Profile not found");
      } catch (e) { toast.error("Failed to load profile"); }
    } finally { setLoading(false); }
  };

  useEffect(() => { if (id) fetchProfile(); }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const handleUpdateDocument = async (docType: string, status: string) => {
    if (!data) return;
    if (status === "Received" && !selectedFile && showUploadModal) {
      toast.error("Please select a file to upload");
      return;
    }
    setIsUpdating(true);
    try {
      const updatedMarksSheets = data.marks_sheets.map(ms => {
        if (ms.doc_type === docType) {
          const filePath = selectedFile ? `/uploads/${selectedFile.name}` : (status === "Received" ? `https://example.com/docs/${data.name.toLowerCase()}_${docType.toLowerCase()}.pdf` : ms.link);
          return { ...ms, status, link: filePath };
        }
        return ms;
      });

      const res = await fetch(`${Api_URL}/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, marks_sheets: updatedMarksSheets })
      });
      if (res.ok) {
        setData({ ...data, marks_sheets: updatedMarksSheets });
        setShowUploadModal(false);
        setSelectedFile(null);
        toast.success(`${docType} updated`);
      }
    } catch (e) { toast.error("Update failed"); } finally { setIsUpdating(false); }
  };

  const handleAddAsset = async () => {
    if (!data || !newAsset.name || !newAsset.id) {
      toast.error("Please fill all details");
      return;
    }
    setIsUpdating(true);
    try {
      const updatedAssets = [...data.assets, {
        ass_id: newAsset.id, Type: newAsset.type, Ass_name: newAsset.name,
        status: "pending", Conditon: "New", handover_date: newAsset.date || new Date().toISOString().split('T')[0]
      }];
      const res = await fetch(`${Api_URL}/${data.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, assets: updatedAssets })
      });
      if (res.ok) {
        setData({ ...data, assets: updatedAssets });
        setShowAssetModal(false);
        setNewAsset({ name: "", type: "Laptop", id: "", date: "" });
        toast.success("Asset added");
      }
    } catch (e) { toast.error("Failed to add asset"); } finally { setIsUpdating(false); }
  };

  const handleAddDocument = async () => {
    if (!data || !newDoc.name) {
      toast.error("Enter document name");
      return;
    }
    setIsUpdating(true);
    try {
      const updatedMarksSheets = [...data.marks_sheets, {
        doc_type: newDoc.name,
        doc_id: (data.marks_sheets.length + 1).toString(),
        link: "",
        status: "Missing"
      }];
      const res = await fetch(`${Api_URL}/${data.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, marks_sheets: updatedMarksSheets })
      });
      if (res.ok) {
        setData({ ...data, marks_sheets: updatedMarksSheets });
        setShowDocModal(false);
        setNewDoc({ name: "" });
        toast.success("Document type added");
      }
    } catch (e) { toast.error("Failed to add document"); } finally { setIsUpdating(false); }
  };

  const handleAddAccess = async () => {
    if (!data || !newAccess.name) {
      toast.error("Enter access name");
      return;
    }
    setIsUpdating(true);
    try {
      const updatedAccess = [...data.access, { AccsesName: newAccess.name }];
      const res = await fetch(`${Api_URL}/${data.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, access: updatedAccess })
      });
      if (res.ok) {
        setData({ ...data, access: updatedAccess });
        setShowAccessModal(false);
        setNewAccess({ name: "", status: "false" });
        toast.success("Access system added");
      }
    } catch (e) { toast.error("Failed to add access"); } finally { setIsUpdating(false); }
  };

  const handleUpdateAssetStatus = async (assetId: string) => {
    if (!data) return;
    setIsUpdating(true);
    try {
      const updatedAssets = data.assets.map(a => a.ass_id === assetId ? { ...a, status: "true" } : a);
      const res = await fetch(`${Api_URL}/${data.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, assets: updatedAssets })
      });
      if (res.ok) { setData({ ...data, assets: updatedAssets }); toast.success("Asset updated"); }
    } catch (e) { toast.error("Update failed"); } finally { setIsUpdating(false); }
  };

  const handleRemoveAccess = async (accessKey: string) => {
    if (!data) return;
    setIsUpdating(true);
    try {
      const updatedAccess = data.access.filter(a => a.AccsesName !== accessKey);
      const res = await fetch(`${Api_URL}/${data.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, access: updatedAccess })
      });
      if (res.ok) { setData({ ...data, access: updatedAccess }); toast.success(`${accessKey} access removed`); }
    } catch (e) { toast.error("Update failed"); } finally { setIsUpdating(false); }
  };

  if (loading || !data) return <div className="h-full flex items-center justify-center bg-[hsl(var(--bg-hsl))]"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  const marksheetList = data.marks_sheets || [];
  const accessList = data.access || [];

  return (
    <div className={pageTheme.layout.mainContainer}>
      <Toaster position="top-right" />
      
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className={`${pageTheme.section.cardBgColor} w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl`}>
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div><h3 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2"><FileUp size={24} className="text-primary" /> Upload Doc</h3><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{selectedDoc}</p></div>
              <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400"><X size={20} /></button>
            </div>
            <div className="p-8">
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
              <div onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-[32px] p-12 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer ${selectedFile ? "border-primary bg-primary/5" : "border-slate-100 bg-[hsl(var(--bg-hsl))] hover:border-primary/50"}`}>
                <div className={`w-20 h-20 rounded-[24px] flex items-center justify-center shadow-sm ${selectedFile ? "bg-primary text-white" : "bg-[hsl(var(--card-hsl))] text-primary/30"}`}>{selectedFile ? <Check size={40} /> : <Upload size={40} />}</div>
                <div className="text-center"><p className="text-md font-black text-slate-700">{selectedFile ? selectedFile.name : "Select File"}</p></div>
              </div>
            </div>
            <div className="p-8 bg-[hsl(var(--bg-hsl))] flex gap-4">
              <button onClick={() => setShowUploadModal(false)} className="flex-1 py-4 rounded-2xl bg-[hsl(var(--card-hsl))] text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all">Cancel</button>
              <button disabled={isUpdating} onClick={() => selectedDoc && handleUpdateDocument(selectedDoc, "Received")} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${selectedFile ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>Confirm & Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Asset Modal */}
      {showAssetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className={`${pageTheme.section.cardBgColor} w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl`}>
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div><h3 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2"><Plus size={24} className="text-primary" /> Add Asset</h3><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Provisioning Registry</p></div>
              <button onClick={() => setShowAssetModal(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Name</label>
                <div className="relative flex items-center"><Monitor size={18} className="absolute left-4 text-primary/40" /><input type="text" value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})} className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-[hsl(var(--bg-hsl))] focus:outline-none focus:ring-2 ring-primary/10 transition-all font-bold text-slate-700" placeholder="e.g. MacBook Pro M3" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label><select value={newAsset.type} onChange={e => setNewAsset({...newAsset, type: e.target.value})} className="w-full px-4 py-4 rounded-2xl border border-slate-100 bg-[hsl(var(--bg-hsl))] font-bold text-slate-700 focus:outline-none focus:ring-2 ring-primary/10"><option>Laptop</option><option>Mobile</option><option>Tablet</option><option>Access Card</option></select></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset ID</label><input type="text" value={newAsset.id} onChange={e => setNewAsset({...newAsset, id: e.target.value})} className="w-full px-4 py-4 rounded-2xl border border-slate-100 bg-[hsl(var(--bg-hsl))] font-bold text-slate-700 focus:outline-none focus:ring-2 ring-primary/10" placeholder="A-000" /></div>
              </div>
            </div>
            <div className="p-8 bg-[hsl(var(--bg-hsl))] flex gap-4">
              <button onClick={() => setShowAssetModal(false)} className="flex-1 py-4 rounded-2xl bg-[hsl(var(--card-hsl))] text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all">Cancel</button>
              <button onClick={handleAddAsset} disabled={isUpdating} className="flex-1 py-4 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all">Add to Registry</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Access Modal */}
      {showAccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className={`${pageTheme.section.cardBgColor} w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl`}>
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div><h3 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2"><Plus size={24} className="text-primary" /> New Access</h3><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">System permission link</p></div>
              <button onClick={() => setShowAccessModal(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System Name</label>
                <div className="relative flex items-center"><Link size={18} className="absolute left-4 text-primary/40" /><input type="text" value={newAccess.name} onChange={e => setNewAccess({...newAccess, name: e.target.value})} className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-[hsl(var(--bg-hsl))] focus:outline-none focus:ring-2 ring-primary/10 transition-all font-bold text-slate-700" placeholder="e.g. AWS Dashboard" /></div>
              </div>
            </div>
            <div className="p-8 bg-[hsl(var(--bg-hsl))] flex gap-4">
              <button onClick={() => setShowAccessModal(false)} className="flex-1 py-4 rounded-2xl bg-[hsl(var(--card-hsl))] text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all">Cancel</button>
              <button onClick={handleAddAccess} disabled={isUpdating} className="flex-1 py-4 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all">Enable System</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Document Modal */}
      {showDocModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className={`${pageTheme.section.cardBgColor} w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl`}>
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div><h3 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2"><Plus size={24} className="text-primary" /> New Document</h3><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Add to requirement list</p></div>
              <button onClick={() => setShowDocModal(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Document Name</label>
                <div className="relative flex items-center"><FileText size={18} className="absolute left-4 text-primary/40" /><input type="text" value={newDoc.name} onChange={e => setNewDoc({...newDoc, name: e.target.value})} className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-[hsl(var(--bg-hsl))] focus:outline-none focus:ring-2 ring-primary/10 transition-all font-bold text-slate-700" placeholder="e.g. Experience Letter" /></div>
              </div>
            </div>
            <div className="p-8 bg-[hsl(var(--bg-hsl))] flex gap-4">
              <button onClick={() => setShowDocModal(false)} className="flex-1 py-4 rounded-2xl bg-[hsl(var(--card-hsl))] text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all">Cancel</button>
              <button onClick={handleAddDocument} disabled={isUpdating} className="flex-1 py-4 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all">Add Document</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="mb-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] mb-8"><ArrowLeft size={14} /> Return to Registry</button>
        <div className={`flex items-center justify-between gap-6 flex-wrap ${pageTheme.section.cardBgColor} p-8 rounded-[40px] shadow-xl shadow-slate-200/40`}>
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 rounded-[32px] bg-primary/5 flex items-center justify-center text-primary border border-primary/10 shadow-sm"><User size={48} strokeWidth={1} /></div>
            <div>
              <div className="flex items-center gap-3 mb-2"><span className="px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10">{data.department}</span><span className="text-slate-300">|</span><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><Fingerprint size={12} className="text-primary/40" /> Registry ID: {data.Temp_Id}</span></div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-1">{data.name}</h1>
              <p className="text-slate-500 font-medium text-lg">{data.position}</p>
            </div>
          </div>
          <button className="h-14 px-8 rounded-2xl bg-primary text-white font-black text-[11px] uppercase tracking-widest hover:shadow-2xl transition-all active:scale-95">Finalize Onboarding</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
        <div className="lg:col-span-8 space-y-8">
          <div className={pageTheme.section.card}>
            <div className={pageTheme.section.header}>
              <div className={pageTheme.section.title}><FileText size={18} className="text-primary mr-2" /> Document Registry</div>
              <button onClick={() => setShowDocModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all active:scale-95"><Plus size={14} /> Add New</button>
            </div>
            <div className="p-8"><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{marksheetList.map((doc) => (<div key={doc.doc_type} className={`p-6 rounded-[32px] border transition-all duration-300 ${doc.status === "Received" ? "bg-primary/5 border-primary/20" : doc.status === "Pending" ? "bg-amber-50 border-amber-100" : `bg-[hsl(var(--bg-hsl))] border-slate-100`}`}><div className="flex items-center justify-between mb-4"><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${doc.status === "Received" ? "bg-primary text-white" : doc.status === "Pending" ? "bg-amber-500 text-white" : "bg-[hsl(var(--card-hsl))] text-primary border border-primary/10"}`}><FileText size={20} /></div><div><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{doc.doc_type}</h4><span className={`text-[10px] font-black uppercase tracking-widest ${doc.status === "Received" ? "text-primary" : doc.status === "Pending" ? "text-amber-600" : "text-rose-600"}`}>{doc.status}</span></div></div>{doc.status === "Received" && <a href={doc.link} target="_blank" rel="noreferrer" className="text-primary hover:scale-110 transition-transform"><ExternalLink size={18} /></a>}</div><div className="flex gap-2">{doc.status === "Missing" && (<><button onClick={() => { setSelectedDoc(doc.doc_type); setShowUploadModal(true); }} className="flex-1 py-2 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all">Upload</button><button onClick={() => handleUpdateDocument(doc.doc_type, "Pending")} className="flex-1 py-2 rounded-xl bg-[hsl(var(--card-hsl))] border border-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-[hsl(var(--bg-hsl))] transition-all">Delay</button></>)}{doc.status === "Pending" && <button onClick={() => { setSelectedDoc(doc.doc_type); setShowUploadModal(true); }} className="w-full py-2 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all flex items-center justify-center gap-2"><CheckCircle2 size={14} /> Mark as Received</button>}{doc.status === "Received" && <div className="w-full py-2 rounded-xl bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-primary/10 overflow-hidden"><span className="truncate max-w-[80%]">{doc.link.split('/').pop()}</span></div>}</div></div>))}</div></div>
          </div>

          <div className={pageTheme.section.card}>
            <div className={pageTheme.section.header}><div className={pageTheme.section.title}><Monitor size={18} className="text-primary mr-2" /> Asset Registry</div><button onClick={() => setShowAssetModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all active:scale-95"><Plus size={14} /> New Asset</button></div>
            <div className="overflow-x-auto"><table className="w-full"><thead><tr className="bg-[hsl(var(--bg-hsl))] border-b border-slate-100 shadow-sm text-left"><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Details</th><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-50">{data.assets.map((item) => (<tr key={item.ass_id} className="hover:bg-primary/5 transition-all group"><td className="px-8 py-6"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary transition-colors"><Monitor size={20} /></div><div className="flex flex-col"><span className="font-bold text-slate-700">{item.Ass_name}</span><span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{item.ass_id} • {item.Type}</span></div></div></td><td className="px-8 py-6"><span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${item.status === "true" ? "bg-primary/5 text-primary border-primary/20" : "bg-amber-50 text-amber-600 border-amber-100"}`}>{item.status === "true" ? "Received" : "Pending"}</span></td><td className="px-8 py-6 text-right">{item.status !== "true" && <button onClick={() => handleUpdateAssetStatus(item.ass_id)} className="px-4 py-2 rounded-xl bg-[hsl(var(--card-hsl))] border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm">Update to Given</button>}{item.status === "true" && <div className="text-primary flex items-center justify-end gap-1 font-bold text-xs"><CheckCircle2 size={14} /> Completed</div>}</td></tr>))}</tbody></table></div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className={pageTheme.section.card}>
            <div className={pageTheme.section.header}><div className={pageTheme.section.title}><Settings size={16} className="text-primary mr-2" /> Security Access</div><button onClick={() => setShowAccessModal(true)} className="p-2 rounded-lg bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all"><Plus size={16} /></button></div>
            <div className="p-8 space-y-4">{accessList.map((acc) => (<div key={acc.AccsesName} className={`p-6 rounded-[28px] border flex items-center justify-between transition-all group bg-primary/5 border-primary/20`}><div className="flex items-center gap-4"><div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm bg-primary text-white`}><Unlock size={20} /></div><div><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{acc.AccsesName}</h4><p className={`text-xs font-bold text-primary`}>Provisioned</p></div></div><button disabled={isUpdating} onClick={() => handleRemoveAccess(acc.AccsesName)} className={`p-2.5 rounded-xl transition-all bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-100`}><XCircle size={18} /></button></div>))}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
