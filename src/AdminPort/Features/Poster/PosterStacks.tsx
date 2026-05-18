import React, { useState, useEffect } from "react";
import { GraduationCap, Cpu, Zap, ListChecks, Trash2, Bot, Brain, Sparkles, Wand2, Terminal, Flame, MessageSquare } from "lucide-react";
import { pageTheme } from "../../../Themes/PageThems/pageConfig";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { Backbutton } from "../../../Components/Common/Backbutton";
import { FormFiled } from "../../../Components/Common/FormFiled";
import { Selection } from "../../../Components/Common/Selection";
import { ConfigTable } from "./ConfigTableProps";
import { ConfigCard } from "./configCardProps";
import { createAvatar } from "@dicebear/core";
import { bottts, identicon, pixelArt, shapes, thumbs } from "@dicebear/collection";
import { Api_URL } from "../../../APILINK";

const getAvatarUrl = (styleName: string, seed: string) => {
    let styleModule: any = bottts;
    if (styleName === "identicon") styleModule = identicon;
    else if (styleName === "pixel-art") styleModule = pixelArt;
    else if (styleName === "shapes") styleModule = shapes;
    else if (styleName === "thumbs") styleModule = thumbs;

    const avatar = createAvatar(styleModule, {
        seed: seed || "bot",
        size: 48,
    });
    return avatar.toDataUri();
};

const IconMap: Record<string, React.ComponentType<any>> = {
    Bot: Bot,
    Brain: Brain,
    Sparkles: Sparkles,
    Wand2: Wand2,
    Terminal: Terminal,
    Cpu: Cpu,
    Flame: Flame,
    MessageSquare: MessageSquare
};

const getModeIconByIcon = (iconName: string) => {
    if (iconName === "Brain") return "🧠";
    if (iconName === "Sparkles") return "✨";
    if (iconName === "Wand2") return "🪄";
    if (iconName === "Terminal") return "💻";
    if (iconName === "Flame") return "🔥";
    if (iconName === "MessageSquare") return "💬";
    return "🤖";
};

// Connect to the new FastAPI Backend
const API_URL =`${Api_URL}/jobpost`


export const PosterStacks = () => {
    // ----------------------------------------------------
    // STATE: Lists
    // ----------------------------------------------------
    const [educationList, setEducationList] = useState<any[]>([]);
    const [modelList, setModelList] = useState<any[]>([]);
    const [modeList, setModeList] = useState<any[]>([]);
    const [checklist, setChecklist] = useState<any[]>([]);

    // ----------------------------------------------------
    // STATE: Forms
    // ----------------------------------------------------
    const [eduForm, setEduForm] = useState({ Edu_name: "" });
    const [modelForm, setModelForm] = useState({ Model_Name: "", Avatar: "bottts", Tone_Id: "" });
    const [modeForm, setModeForm] = useState({ Mode_Type: "", Prompt: "", Icon: "Bot", model_id: "" });
    const [checkForm, setCheckForm] = useState({ CheckList_Name: "", enable: true, model_id: "" });

    // ----------------------------------------------------
    // DATA FETCHING
    // ----------------------------------------------------
    const fetchData = async () => {
        try {
            const eduRes = await fetch(`${API_URL}/education/all`);
            const modelRes = await fetch(`${API_URL}/aimodel/all`);
            const modeRes = await fetch(`${API_URL}/aimode/all`);
            const checkRes = await fetch(`${API_URL}/checklist/all`);

            if(eduRes.ok) setEducationList((await eduRes.json()).data || []);
            if(modelRes.ok) setModelList((await modelRes.json()).data || []);
            if(modeRes.ok) setModeList((await modeRes.json()).data || []);
            if(checkRes.ok) setChecklist((await checkRes.json()).data || []);
        } catch (error) {
            console.error("Failed to fetch poster stacks:", error);
            toast.error("Failed to sync with backend.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ----------------------------------------------------
    // SUBMIT HANDLERS
    // ----------------------------------------------------
    const handleAddEducation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!eduForm.Edu_name) return;
        const toastId = toast.loading("Adding Education Option...");
        try {
            const res = await fetch(`${API_URL}/education/create`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify(eduForm)
            });
            if (res.ok) {
                toast.success("Education Option Added!", { id: toastId });
                setEduForm({ Edu_name: "" });
                fetchData();
            } else throw new Error();
        } catch {
            toast.error("Failed to add option", { id: toastId });
        }
    };

    const handleAddModel = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!modelForm.Model_Name) return;
        const toastId = toast.loading("Adding AI Model...");
        try {
            const res = await fetch(`${API_URL}/aimodel/create`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...modelForm,
                    Tone_Id: modelForm.Tone_Id || null
                })
            });
            if (res.ok) {
                toast.success("AI Model Added!", { id: toastId });
                setModelForm({ Model_Name: "", Avatar: "bottts", Tone_Id: "" });
                fetchData();
            } else throw new Error();
        } catch {
            toast.error("Failed to add model", { id: toastId });
        }
    };

    const handleAddMode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!modeForm.Mode_Type || !modeForm.Prompt) return;
        const toastId = toast.loading("Adding AI Mode...");
        try {
            const res = await fetch(`${API_URL}/aimode/create`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...modeForm,
                    model_id: modeForm.model_id || null
                })
            });
            if (res.ok) {
                 toast.success("AI Mode Added!", { id: toastId });
                setModeForm({ Mode_Type: "", Prompt: "", Icon: "Bot", model_id: "" });
                fetchData();
            } else throw new Error();
        } catch {
            toast.error("Failed to add mode", { id: toastId });
        }
    };

    const handleAddChecklist = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!checkForm.CheckList_Name) return;
        const toastId = toast.loading("Adding Checklist Rule...");
        try {
            const res = await fetch(`${API_URL}/checklist/create`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...checkForm,
                    model_id: checkForm.model_id || null
                })
            });
            if (res.ok) {
                 toast.success("Checklist Rule Added!", { id: toastId });
                setCheckForm({ CheckList_Name: "", enable: true, model_id: "" });
                fetchData();
            } else throw new Error();
        } catch {
            toast.error("Failed to add rule", { id: toastId });
        }
    };

    // ----------------------------------------------------
    // DELETE HANDLERS
    // ----------------------------------------------------
    const handleDelete = async (route: string, id: string, refetch: () => void) => {
        const toastId = toast.loading("Deleting...");
        try {
            const res = await fetch(`${API_URL}/${route}/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Deleted successfully!", { id: toastId });
                refetch();
            } else throw new Error();
        } catch {
            toast.error("Failed to delete item.", { id: toastId });
        }
    };

    // ----------------------------------------------------
    // RENDER UI
    // ----------------------------------------------------
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 lg:p-10 h-full overflow-auto bg-slate-50/50">
            <Toaster position="top-right" />
            <div className="max-w-7xl mx-auto">
                <Backbutton />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 uppercase">Poster Stacks Config</h1>
                        <p className="text-slate-500 text-sm">Manage AI configurations, Job Poster parameters, and global templates.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    
                    {/* 1. Education Options */}
                    <ConfigCard title="Education Qualifications" icon={GraduationCap} count={educationList.length}>
                        <div className="p-6 pb-2">
                            <form onSubmit={handleAddEducation} className="flex items-end gap-3 mb-6">
                                <div className="flex-1">
                                    <FormFiled 
                                        Lable="Qualification Name"
                                        in_PlaceHolder="e.g. Master's in Computer Science"
                                        value={eduForm.Edu_name}
                                        onChange={(e: any) => setEduForm({Edu_name: e.target.value})}
                                    />
                                </div>
                                <button type="submit" className="px-5 py-3 h-[46px] mb-[2px] bg-primary text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
                                    Add
                                </button>
                            </form>
                        </div>
                        <ConfigTable 
                            headers={["Qualification Name", ""]} 
                            isEmpty={educationList.length === 0} 
                            emptyMessage="No education options registered yet."
                        >
                            {educationList.map(item => (
                                <tr key={item.id} className={pageTheme.table.row}>
                                    <td className={`${pageTheme.table.cell} font-medium text-slate-700`}>{item.Edu_name}</td>
                                    <td className={`${pageTheme.table.cell} text-right`}>
                                        <button onClick={() => handleDelete("education", item.id, fetchData)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all">
                                            <Trash2 size={13} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </ConfigTable>
                    </ConfigCard>

                    {/* 2. AI Models */}
                    <ConfigCard title="Registered AI Models" icon={Cpu} count={modelList.length}>
                        <div className="p-6 pb-2">
                            <form onSubmit={handleAddModel} className="flex flex-col gap-4 mb-6">
                                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                                        <img 
                                            src={getAvatarUrl(modelForm.Avatar, modelForm.Model_Name)} 
                                            alt="Bot Preview" 
                                            className="w-12 h-12 object-contain"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avatar Preview</div>
                                        <div className="text-sm font-black text-slate-700 uppercase tracking-tight truncate">
                                            {modelForm.Model_Name || "Bot Seed"}
                                        </div>
                                        {modelForm.Tone_Id && (
                                            (() => {
                                                const linkedTone = modeList.find(t => t.id === modelForm.Tone_Id);
                                                if (linkedTone) {
                                                    return (
                                                        <div className="text-[10px] font-bold text-indigo-500 uppercase flex items-center gap-1.5 mt-0.5 animate-pulse">
                                                            {React.createElement(IconMap[linkedTone.Icon || "Bot"] || Bot, { size: 12 })}
                                                            <span>{linkedTone.Mode_Type}</span>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })()
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormFiled 
                                        Lable="Model Name"
                                        in_PlaceHolder="e.g. gemini-1.5-pro-latest"
                                        value={modelForm.Model_Name}
                                        onChange={(e: any) => setModelForm({...modelForm, Model_Name: e.target.value})}
                                    />
                                    <Selection 
                                        label="Avatar Collection style"
                                        name="avatarStyle"
                                        value={modelForm.Avatar}
                                        onChange={(e: any) => setModelForm({...modelForm, Avatar: e.target.value})}
                                        options={[
                                            { label: "Bottts (Robots)", value: "bottts" },
                                            { label: "Identicon (Geometric)", value: "identicon" },
                                            { label: "Pixel Art (Retro)", value: "pixel-art" },
                                            { label: "Shapes (Colorful)", value: "shapes" },
                                            { label: "Thumbs (Creative)", value: "thumbs" }
                                        ]}
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <Selection 
                                        label="Link AI Tone / Mode"
                                        name="toneId"
                                        value={modelForm.Tone_Id}
                                        onChange={(e: any) => {
                                            const selectedTone = modeList.find(t => t.id === e.target.value);
                                            if (selectedTone) {
                                                setModelForm({
                                                    ...modelForm,
                                                    Tone_Id: selectedTone.id,
                                                });
                                            } else {
                                                setModelForm({
                                                    ...modelForm,
                                                    Tone_Id: "",
                                                });
                                            }
                                        }}
                                        options={[
                                            { label: "Select custom Tone / Mode...", value: "" },
                                            ...modeList.map((t: any) => ({
                                                label: `${getModeIconByIcon(t.Icon || "Bot")} ${t.Mode_Type}`,
                                                value: t.id
                                            }))
                                        ]}
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button type="submit" className="px-6 py-3 h-[46px] bg-primary text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 shrink-0">
                                        Register Bot
                                    </button>
                                </div>
                            </form>
                        </div>
                        <ConfigTable 
                            headers={["Avatar", "Model & Tone Details", ""]} 
                            isEmpty={modelList.length === 0} 
                            emptyMessage="No models registered yet."
                        >
                            {modelList.map(item => (
                                <tr key={item.id} className={pageTheme.table.row}>
                                    <td className={pageTheme.table.cell}>
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                                            <img 
                                                src={getAvatarUrl(item.Avatar || "bottts", item.Model_Name)} 
                                                alt={item.Model_Name} 
                                                className="w-8 h-8 object-contain"
                                            />
                                        </div>
                                    </td>
                                    <td className={`${pageTheme.table.cell} font-medium text-slate-700`}>
                                        <div className="flex flex-col">
                                            <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                                                <span>{item.Model_Name}</span>
                                            </div>
                                            {item.Tone_Id && (
                                                (() => {
                                                    const linkedTone = modeList.find(t => t.id === item.Tone_Id);
                                                    return (
                                                        <div className="text-[10px] font-bold text-teal-600 bg-teal-50 border border-teal-100/50 p-2 rounded-lg max-w-md mt-1 inline-flex items-center gap-1">
                                                            🔗 Linked Tone: {linkedTone ? `${getModeIconByIcon(linkedTone.Icon || "Bot")} ${linkedTone.Mode_Type}` : "Unknown"}
                                                        </div>
                                                    );
                                                })()
                                            )}
                                        </div>
                                    </td>
                                    <td className={`${pageTheme.table.cell} text-right`}>
                                        <button onClick={() => handleDelete("aimodel", item.id, fetchData)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all">
                                            <Trash2 size={13} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </ConfigTable>
                    </ConfigCard>

                    {/* 3. AI Tones & Modes */}
                    <ConfigCard title="AI Tones & Modes" icon={Zap} count={modeList.length}>
                        <div className="p-6 pb-2">
                            <form onSubmit={handleAddMode} className="flex flex-col gap-4 mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormFiled 
                                        Lable="Tone / Mode Name"
                                        in_PlaceHolder="e.g. Sarcastic Professional"
                                        value={modeForm.Mode_Type}
                                        onChange={(e: any) => setModeForm({...modeForm, Mode_Type: e.target.value})}
                                    />
                                    <Selection 
                                        label="Icon Style"
                                        name="modeIcon"
                                        value={modeForm.Icon}
                                        onChange={(e: any) => setModeForm({...modeForm, Icon: e.target.value})}
                                        options={[
                                            { label: "🤖 Bot / Robot Style", value: "Bot" },
                                            { label: "🧠 AI Brain Style", value: "Brain" },
                                            { label: "✨ Magic Sparkles Style", value: "Sparkles" },
                                            { label: "🪄 Copywriting Wand Style", value: "Wand2" },
                                            { label: "💻 Coding Terminal Style", value: "Terminal" },
                                            { label: "🔥 Creative Flame Style", value: "Flame" },
                                            { label: "💬 Chat Bubble Style", value: "MessageSquare" }
                                        ]}
                                    />
                                </div>
                                <div className="flex items-end gap-3">
                                    <div className="flex-1">
                                        <FormFiled 
                                            Lable="System Prompt Instructions"
                                            in_PlaceHolder="e.g. Talk with dry wit, prioritize bullet points, etc."
                                            value={modeForm.Prompt}
                                            onChange={(e: any) => setModeForm({...modeForm, Prompt: e.target.value})}
                                        />
                                    </div>
                                    <button type="submit" className="px-5 py-3 h-[46px] mb-[2px] bg-primary text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 shrink-0">
                                        Create Tone
                                    </button>
                                </div>
                            </form>
                        </div>
                        <ConfigTable 
                            headers={["Mode Name", "Prompt Instruction", ""]} 
                            isEmpty={modeList.length === 0} 
                            emptyMessage="No tones/modes registered yet."
                        >
                            {modeList.map(item => {
                                return (
                                    <tr key={item.id} className={pageTheme.table.row}>
                                        <td className={`${pageTheme.table.cell} font-bold text-slate-800 text-sm whitespace-nowrap`}>
                                            <div className="flex items-center gap-1.5">
                                                {React.createElement(IconMap[item.Icon || "Bot"] || Bot, { size: 14, className: "text-indigo-500 shrink-0" })}
                                                <span>{item.Mode_Type}</span>
                                            </div>
                                        </td>
                                        <td className={`${pageTheme.table.cell} font-medium text-slate-600`}>
                                            {item.Prompt}
                                        </td>
                                        <td className={`${pageTheme.table.cell} text-right`}>
                                            <button onClick={() => handleDelete("aimode", item.id, fetchData)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all">
                                                <Trash2 size={13} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </ConfigTable>
                    </ConfigCard>
                    
                    {/* 4. Selection Checklists */}
                    <ConfigCard title="Prompt Checklist Rules" icon={ListChecks} count={checklist.length}>
                        <div className="p-6 pb-2">
                            <form onSubmit={handleAddChecklist} className="flex flex-col gap-4 mb-6">
                                <div className="grid grid-cols-1 gap-4">
                                    <FormFiled 
                                        Lable="Rule Description"
                                        in_PlaceHolder="e.g. Include Emoji formatting"
                                        value={checkForm.CheckList_Name}
                                        onChange={(e: any) => setCheckForm({...checkForm, CheckList_Name: e.target.value})}
                                    />
                                </div>
                                <div className="flex items-end gap-3">
                                    <div className="flex-1">
                                        <Selection 
                                            label="Default State"
                                            name="enable"
                                            value={checkForm.enable.toString()}
                                            onChange={(e: any) => setCheckForm({...checkForm, enable: e.target.value === "true"})}
                                            options={[
                                                { label: "Default: YES", value: "true" },
                                                { label: "Default: NO", value: "false" }
                                            ]}
                                        />
                                    </div>
                                    <button type="submit" className="px-5 py-3 h-[46px] mb-[2px] bg-primary text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
                                        Add
                                    </button>
                                </div>
                            </form>
                        </div>
                        <ConfigTable 
                            headers={["Rule Description", "Default State", ""]} 
                            isEmpty={checklist.length === 0} 
                            emptyMessage="No checklist rules registered yet."
                        >
                            {checklist.map(item => {
                                return (
                                    <tr key={item.id} className={pageTheme.table.row}>
                                        <td className={`${pageTheme.table.cell} font-medium text-slate-700`}>
                                            {item.CheckList_Name}
                                        </td>
                                        <td className={pageTheme.table.cell}>
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-md ${item.enable ? "bg-teal-100 text-teal-700" : "bg-rose-100 text-rose-700"}`}>
                                                {item.enable ? "Enabled" : "Disabled"}
                                            </span>
                                        </td>
                                        <td className={`${pageTheme.table.cell} text-right`}>
                                            <button onClick={() => handleDelete("checklist", item.id, fetchData)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all">
                                                <Trash2 size={13} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </ConfigTable>
                    </ConfigCard>

                </div>
            </div>
        </motion.div>
    );
};
