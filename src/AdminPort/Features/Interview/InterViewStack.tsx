import React, { useState, useEffect } from "react";
import {
    ListOrdered,
    Plus,
    Trash2,
    ArrowUp,
    ArrowDown,
    Edit3,
    Check,
    X,
    Clock,
    Play,
    Award
} from "lucide-react";
import { Api_URL } from "../../../APILINK";
import { pageTheme } from "../../../Themes/PageThems/pageConfig";
import toast, { Toaster } from "react-hot-toast";

interface Stage {
    id: number;
    Stage_name: string;
    Stage_index: number;
}

export const InterView = () => {
    const [stages, setStages] = useState<Stage[]>([]);
    const [loadingStages, setLoadingStages] = useState<boolean>(true);

    // Form states for Stage CRUD
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [newStageName, setNewStageName] = useState<string>("");
    const [newStageIndex, setNewStageIndex] = useState<number>(1);
    const [editingStageId, setEditingStageId] = useState<number | null>(null);
    const [editingStageName, setEditingStageName] = useState<string>("");

    const API_URL = `${Api_URL}/candidates`;

    // Fetch master stages from FastAPI database
    const fetchStages = async () => {
        try {
            setLoadingStages(true);
            const res = await fetch(`${API_URL}/stages/master`);
            if (!res.ok) throw new Error("Failed to load stage master list.");
            const data = await res.json();
            // Sort by stage index
            const sorted = data.sort((a: Stage, b: Stage) => a.Stage_index - b.Stage_index);
            setStages(sorted);
        } catch (err: any) {
            console.error(err);
            toast.error("Could not sync Stage Master dataset.");
        } finally {
            setLoadingStages(false);
        }
    };

    useEffect(() => {
        fetchStages();
    }, []);

    // Create a new Master Stage
    const handleAddStage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStageName.trim()) {
            toast.error("Please enter a valid Stage Name.");
            return;
        }

        const toastId = toast.loading("Configuring recruitment stage...");
        try {
            const res = await fetch(`${API_URL}/stages/master`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Stage_name: newStageName.trim(),
                    Stage_index: newStageIndex
                })
            });

            if (!res.ok) throw new Error();
            toast.success("Recruitment stage created successfully!", { id: toastId });
            setShowAddModal(false);
            setNewStageName("");
            fetchStages();
        } catch {
            toast.error("Failed to configure stage. Index might be duplicated.", { id: toastId });
        }
    };

    // Rename an existing Stage
    const handleUpdateStageName = async (stage: Stage) => {
        if (!editingStageName.trim()) {
            toast.error("Stage name cannot be empty.");
            return;
        }

        const toastId = toast.loading("Updating stage description...");
        try {
            const res = await fetch(`${API_URL}/stages/master/${stage.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Stage_name: editingStageName.trim(),
                    Stage_index: stage.Stage_index
                })
            });

            if (!res.ok) throw new Error();
            toast.success("Stage renamed successfully!", { id: toastId });
            setEditingStageId(null);
            fetchStages();
        } catch {
            toast.error("Failed to rename recruitment stage.", { id: toastId });
        }
    };

    // Delete a Stage from Master
    const handleDeleteStage = async (stageId: number) => {
        if (!window.confirm("Are you sure you want to delete this stage? Candidates currently assigned to this stage will lose progress!")) return;

        const toastId = toast.loading("Deleting recruitment stage...");
        try {
            const res = await fetch(`${API_URL}/stages/master/${stageId}`, {
                method: "DELETE"
            });

            if (!res.ok) throw new Error();
            toast.success("Recruitment stage deleted.", { id: toastId });
            fetchStages();
        } catch {
            toast.error("Failed to delete stage.", { id: toastId });
        }
    };

    // Shift stage positions up or down
    const handleShiftOrder = async (index: number, direction: "up" | "down") => {
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= stages.length) return;

        const newStages = [...stages];
        const temp = newStages[index];
        newStages[index] = newStages[targetIndex];
        newStages[targetIndex] = temp;

        // Re-assign indexes sequentially to prevent collisions
        const updatedStages = newStages.map((stage, idx) => ({
            ...stage,
            Stage_index: idx + 1
        }));

        setStages(updatedStages);

        const toastId = toast.loading("Updating stage priority order...");
        try {
            await Promise.all(
                updatedStages.map(stage =>
                    fetch(`${API_URL}/stages/master/${stage.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            Stage_name: stage.Stage_name,
                            Stage_index: stage.Stage_index
                        })
                    })
                )
            );
            toast.success("Recruitment pipeline sequence updated!", { id: toastId });
            fetchStages();
        } catch {
            toast.error("Failed to save updated pipeline sequence.", { id: toastId });
            fetchStages();
        }
    };

    // Compute Stage Master Metrics
    const totalStages = stages.length;
    const entryRound = stages[0]?.Stage_name || "None Configured";
    const intermediateCount = totalStages > 2 ? totalStages - 2 : 0;
    const finalMilestone = totalStages > 1 ? stages[totalStages - 1]?.Stage_name : totalStages === 1 ? stages[0]?.Stage_name : "None Configured";

    return (
        <div className={pageTheme.layout.mainContainer}>
            <Toaster position="top-right" />

            {/* HEADER */}
            <div className={pageTheme.header.wrapper}>
                <div className="flex flex-col">
                    <div className={pageTheme.header.pill}>
                        <ListOrdered size={12} />
                        <span>Recruitment Stages Control</span>
                    </div>
                    <h1 className={pageTheme.header.title}>Stage Master Console</h1>
                    <p className={pageTheme.header.subtitle}>
                        Configure active interview steps, prioritize recruitment stage sequences, and define corporate onboarding entry milestones.
                    </p>
                </div>

                <button
                    onClick={() => {
                        setNewStageIndex(stages.length + 1);
                        setShowAddModal(true);
                    }}
                    className="px-4 py-2.5 bg-primary text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-0.5 hover:shadow-primary/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                    <Plus size={14} /> Add Master Stage
                </button>
            </div>

            {/* PIPELINE STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {[
                    { label: "Total Stages Configured", value: totalStages, sub: "Sequential levels", bg: "bg-indigo-50", text: "text-indigo-600", color: "text-indigo-500", icon: ListOrdered },
                    { label: "Entry Round Gateway", value: entryRound, sub: "First assessment step", bg: "bg-emerald-50", text: "text-emerald-600", color: "text-emerald-500", icon: Play },
                    { label: "Intermediate Levels", value: intermediateCount, sub: "Screenings & tech interviews", bg: "bg-amber-50", text: "text-amber-600", color: "text-amber-500", icon: Clock },
                    { label: "Final Stage Milestone", value: finalMilestone, sub: "Recruitment completion target", bg: "bg-rose-50", text: "text-rose-600", color: "text-rose-500", icon: Award },
                ].map((s, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                        <div className="flex flex-col gap-1 min-w-0 flex-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block truncate">{s.label}</span>
                            <span className={`text-lg font-black truncate block ${s.text}`}>{s.value}</span>
                            <span className="text-[9px] text-slate-400 font-medium block truncate">{s.sub}</span>
                        </div>
                        <div className={`p-3 rounded-xl shrink-0 ml-3 ${s.bg} ${s.color}`}>
                            <s.icon size={20} />
                        </div>
                    </div>
                ))}
            </div>

            {/* FULL WIDTH CONFIGURATION WORKSPACE */}
            <div className="w-full">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    
                    {/* Panel Header */}
                    <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-black text-slate-600 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            Recruitment Stages Sequence Flow
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-white px-2 py-0.5 rounded border">
                            FastAPI Synced Master List
                        </span>
                    </div>

                    {/* Stage Table List */}
                    <div className="p-6">
                        {loadingStages ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-2">
                                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Syncing Stage Master...</span>
                            </div>
                        ) : stages.length === 0 ? (
                            <div className="text-center py-20 border border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
                                <ListOrdered className="mx-auto text-slate-300 mb-3" size={32} />
                                <span className="text-slate-400 text-xs font-semibold block">No recruitment stages configured.</span>
                                <p className="text-[10px] text-slate-400 mt-1 max-w-sm mx-auto">
                                    Create stages (e.g. screening, system architecture, hr panel) to construct your recruitment tracking pipeline.
                                </p>
                                <button
                                    onClick={() => {
                                        setNewStageIndex(stages.length + 1);
                                        setShowAddModal(true);
                                    }}
                                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-lg shadow-primary/10 transition-all hover:bg-primary/95 cursor-pointer"
                                >
                                    <Plus size={12} /> Configure First Stage
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {stages.map((stage, idx) => (
                                    <div 
                                        key={stage.id} 
                                        className="group flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-100 hover:border-primary/20 hover:bg-white rounded-xl shadow-sm hover:shadow transition-all duration-200"
                                    >
                                        {/* Stage info and inline renaming */}
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xs font-black shrink-0 shadow-sm border border-primary/5">
                                                {stage.Stage_index}
                                            </div>
                                            
                                            {editingStageId === stage.id ? (
                                                <div className="flex items-center gap-2 flex-1 min-w-0 max-w-md">
                                                    <input
                                                        type="text"
                                                        value={editingStageName}
                                                        onChange={(e) => setEditingStageName(e.target.value)}
                                                        className="flex-1 px-3 py-1.5 text-xs border border-primary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/15 text-slate-800 bg-white"
                                                        autoFocus
                                                    />
                                                    <button 
                                                        onClick={() => handleUpdateStageName(stage)}
                                                        className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl border border-emerald-200 transition-all flex items-center justify-center cursor-pointer"
                                                        title="Confirm Rename"
                                                    >
                                                        <Check size={13} />
                                                    </button>
                                                    <button 
                                                        onClick={() => setEditingStageId(null)}
                                                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl border border-rose-200 transition-all flex items-center justify-center cursor-pointer"
                                                        title="Cancel Rename"
                                                    >
                                                        <X size={13} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-0.5 min-w-0">
                                                    <span className="text-xs font-black text-slate-700 truncate">
                                                        {stage.Stage_name}
                                                    </span>
                                                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                                                        {idx === 0 
                                                            ? "📍 Active Gateway Step" 
                                                            : idx === stages.length - 1 
                                                                ? "🏆 Onboarding Completion Stage" 
                                                                : `Round ${stage.Stage_index} of Evaluation`}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action priority tools */}
                                        {editingStageId !== stage.id && (
                                            <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleShiftOrder(idx, "up")}
                                                    disabled={idx === 0}
                                                    className="p-2 text-slate-400 hover:text-slate-600 disabled:text-slate-200 disabled:pointer-events-none hover:bg-slate-100 rounded-xl border border-transparent hover:border-slate-200/50 transition-all cursor-pointer"
                                                    title="Move Up (Increase Priority)"
                                                >
                                                    <ArrowUp size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleShiftOrder(idx, "down")}
                                                    disabled={idx === stages.length - 1}
                                                    className="p-2 text-slate-400 hover:text-slate-600 disabled:text-slate-200 disabled:pointer-events-none hover:bg-slate-100 rounded-xl border border-transparent hover:border-slate-200/50 transition-all cursor-pointer"
                                                    title="Move Down (Decrease Priority)"
                                                >
                                                    <ArrowDown size={14} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingStageId(stage.id);
                                                        setEditingStageName(stage.Stage_name);
                                                    }}
                                                    className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl border border-transparent hover:border-indigo-100 transition-all cursor-pointer"
                                                    title="Rename Stage"
                                                >
                                                    <Edit3 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteStage(stage.id)}
                                                    className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-100 transition-all cursor-pointer"
                                                    title="Delete Stage"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ADD MASTER STAGE MODAL DRAWER */}
            {showAddModal && (
                <>
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-all animate-fade-in" onClick={() => setShowAddModal(false)} />
                    <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl z-50 border-l border-slate-100 p-8 flex flex-col justify-between animate-slide-left">
                        <div className="flex flex-col gap-6">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-2 bg-primary/5 text-primary rounded-xl">
                                        <ListOrdered size={16} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Configure Recruitment</span>
                                        <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide">Add Master Stage</h2>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowAddModal(false)} 
                                    className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 border border-slate-100 transition-all cursor-pointer"
                                >
                                    <X size={15} />
                                </button>
                            </div>

                            <form onSubmit={handleAddStage} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Stage Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Technical Round 2, HR Round, Culture Fit"
                                        value={newStageName}
                                        onChange={(e) => setNewStageName(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 text-sm focus:outline-none focus:ring-2 ring-primary/10 transition-all shadow-inner"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Sequence Priority (Index)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={newStageIndex}
                                        onChange={(e) => setNewStageIndex(parseInt(e.target.value) || 1)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 text-sm focus:outline-none focus:ring-2 ring-primary/10 transition-all shadow-inner"
                                        required
                                    />
                                    <span className="text-[9px] text-slate-400 font-medium leading-relaxed">
                                        Determines where this step falls in the interview tracking pipeline. Index "1" represents the entry-level gateway.
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    className="mt-4 w-full py-3 bg-primary hover:bg-primary/95 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-0.5 hover:shadow-primary/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <Plus size={14} /> Add Recruitment Stage
                                </button>
                            </form>
                        </div>

                        <div className="pt-6 border-t border-slate-100/60 text-[9px] font-semibold text-slate-400 uppercase tracking-widest text-center">
                            Apex Solutions HRMS OS • Pipeline Configuration
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
