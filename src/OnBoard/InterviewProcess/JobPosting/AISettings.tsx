import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { pageTheme } from "../../../Themes/PageThems/pageConfig";
import { Checkbox } from "../../../Components/Common/CheckBox";
import { createAvatar } from "@dicebear/core";
import { bottts, identicon, pixelArt, shapes, thumbs } from "@dicebear/collection";
import { Api_URL } from "../../../APILINK";

interface AISettingsProps {
    tone: string;
    options: any;
    onToneChange: (tone: string) => void;
    onOptionsChange: React.Dispatch<React.SetStateAction<any>>;
    selectedModel: any;
    onModelChange: (model: any) => void;
}

const getAvatarUrl = (styleName: string, seed: string) => {
    let styleModule: any = bottts;
    if (styleName === "identicon") styleModule = identicon;
    else if (styleName === "pixel-art") styleModule = pixelArt;
    else if (styleName === "shapes") styleModule = shapes;
    else if (styleName === "thumbs") styleModule = thumbs;

    const avatar = createAvatar(styleModule, {
        seed: seed || "bot",
        size: 40,
    });
    return avatar.toDataUri();
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

const ICON_TONE_MAP: Record<string, string> = {
    "Bot": "Balanced, standard, professional, structured, and recruiter-friendly tone.",
    "Brain": "Deeply analytical, thought-provoking, precise, data-driven, and detail-oriented tone.",
    "Sparkles": "Highly engaging, vibrant, exciting, modern, and catchy tone.",
    "Wand2": "Creative, persuasive, storytelling, copywriter-style, and highly converting tone.",
    "Terminal": "Developer-centric, technical, direct, code-inspired, and geeky tone.",
    "Flame": "High-energy, passionate, bold, urgent, and motivational tone.",
    "MessageSquare": "Conversational, approachable, friendly, collaborative, and peer-to-peer tone."
};
const ICON_NAME_MAP: Record<string, string> = {
    "Bot": "Professional Assistant Bot",
    "Brain": "Analytical Genius",
    "Sparkles": "Vibrant Recruiter",
    "Wand2": "Creative Wordsmith",
    "Terminal": "Tech Advocate",
    "Flame": "Passionate Builder",
    "MessageSquare": "Friendly Peer"
};

export const AISettings: React.FC<AISettingsProps> = ({
    options,
    onToneChange,
    onOptionsChange,
    selectedModel,
    onModelChange
}) => {
    const [dbModels, setDbModels] = useState<any[]>([]);
    const [dbChecklist, setDbChecklist] = useState<any[]>([]);
    const [dbTones, setDbTones] = useState<any[]>([]);
    const [, setLoading] = useState<boolean>(false);

    // Fetch AI Models & Modifiers Checklist directly from the FastAPI Backend
    useEffect(() => {
        const fetchAiSettings = async () => {
            setLoading(true);
            try {
                // 0. Fetch Registered AI Models/Bots
                const modelRes = await fetch(`${Api_URL}/jobpost/aimodel/all`);
                if (modelRes.ok) {
                    const data = await modelRes.json();
                    const list = data.data || [];
                    setDbModels(list);
                    if (list.length > 0 && !selectedModel) {
                        onModelChange(list[0]);
                    }
                }

                // 1. Fetch AI Modes / Tones
                const toneRes = await fetch(`${Api_URL}/jobpost/aimode/all`);
                if (toneRes.ok) {
                    const data = await toneRes.json();
                    setDbTones(data.data || []);
                }

                // 2. Fetch Checklists (Prompt Rules)
                const checkRes = await fetch(`${Api_URL}/jobpost/checklist/all`);
                if (checkRes.ok) {
                    const data = await checkRes.json();
                    const list = data.data || [];
                    setDbChecklist(list);

                    // Auto-initialize checkboxes matching whatever rules exist in Postgres database!
                    const initialOptions: any = {};
                    list.forEach((item: any) => {
                        initialOptions[item.CheckList_Name] = item.enable;
                    });
                    onOptionsChange((prev: any) => ({
                        ...initialOptions,
                        ...prev
                    }));
                }
            } catch (err) {
                console.error("Failed to load backend AI settings:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAiSettings();
    }, []);

    // Filter checklist rules based on the active selected model
    const activeChecklist = dbChecklist.filter(c => !c.model_id || c.model_id === selectedModel?.id);

    // Dynamic tone change based on the active selected model's linked custom tone
    useEffect(() => {
        if (selectedModel) {
            const linkedTone = dbTones.find(t => t.id === selectedModel.Tone_Id);
            if (linkedTone) {
                onToneChange(`${linkedTone.Mode_Type} (${linkedTone.Prompt || ""})`);
            } else {
                const icon = selectedModel.Icon || "Bot";
                const toneDesc = ICON_TONE_MAP[icon] || ICON_TONE_MAP["Bot"];
                const toneName = ICON_NAME_MAP[icon] || ICON_NAME_MAP["Bot"];
                onToneChange(`${toneName} (${toneDesc})`);
            }
        }
    }, [selectedModel, dbTones]);

    return (
        <div className={pageTheme.section.card}>
            <div className={pageTheme.section.header}>
                <div className={pageTheme.section.title}>
                    <span className={pageTheme.section.titleDot} />
                    AI Settings
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-primary bg-primary/5 px-2 py-1 rounded-md uppercase tracking-wider">
                    <Sparkles size={10} className="animate-pulse" />
                    <span>Auto Tone Enabled</span>
                </div>
            </div>

            <div className="p-6 space-y-6">
                
                {/* 0. Active AI Bot / Model fetched from Postgres DB */}
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Active AI Bot / Model</label>
                    {dbModels.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {dbModels.map((m: any) => {
                                const isSelected = selectedModel?.id === m.id;
                                const linkedTone = dbTones.find(t => t.id === m.Tone_Id);
                                return (
                                    <button
                                        key={m.id}
                                        type="button"
                                        onClick={() => onModelChange(m)}
                                        className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${
                                            isSelected
                                                ? "border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary/20"
                                                : "border-slate-100 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-200"
                                        }`}
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                                            <img 
                                                src={getAvatarUrl(m.Avatar || "bottts", m.Model_Name)} 
                                                alt={m.Model_Name} 
                                                className="w-8 h-8 object-contain"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className={`text-xs font-black truncate ${isSelected ? "text-primary" : "text-slate-800"}`}>
                                                {m.Model_Name}
                                            </div>
                                            {linkedTone && (
                                                <div className="mt-1 text-[8px] font-black uppercase text-indigo-500 bg-indigo-50/50 px-1.5 py-0.5 rounded border border-indigo-100/50 inline-block">
                                                    <span>{getModeIconByIcon(linkedTone.Icon || "Bot")} {linkedTone.Mode_Type}</span>
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-xs text-slate-400 italic">
                            No AI bots registered. Go to Admin &gt; Poster Stacks to register a bot!
                        </div>
                    )}
                </div>

                {/* 1. Dynamic Tones dynamically bound to bot icon */}
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Copy Style Tone</label>
                    {selectedModel ? (
                        (() => {
                            const linkedTone = dbTones.find(t => t.id === selectedModel.Tone_Id);
                            return (
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                                    <span className="text-2xl">
                                        {linkedTone ? getModeIconByIcon(linkedTone.Icon || "Bot") : "🤖"}
                                    </span>
                                    <div>
                                        <div className="text-xs font-black text-slate-700 uppercase flex items-center gap-1.5">
                                            <span>
                                                {linkedTone ? linkedTone.Mode_Type : "Balanced Assistant"}
                                            </span>
                                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 tracking-wider">Active</span>
                                        </div>
                                        <div className="text-[10px] font-medium text-slate-400 mt-1 leading-relaxed">
                                            {linkedTone ? (
                                                <span>💬 Custom system prompt: "{linkedTone.Prompt}"</span>
                                            ) : (
                                                <span>This copywriting tone is dynamically bound to the bot's default style.</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })()
                    ) : (
                        <div className="text-xs text-slate-400 italic">No active model selected.</div>
                    )}
                </div>

                {/* 2. Dynamic Modifier Checklists filtered for Active Bot */}
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Sections Checklist</label>
                    {activeChecklist.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {activeChecklist.map((opt: any) => (
                                <Checkbox
                                    key={opt.id}
                                    label={opt.CheckList_Name}
                                    checked={!!options[opt.CheckList_Name]}
                                    onChange={(checked) =>
                                        onOptionsChange((prev: any) => ({ 
                                            ...prev, 
                                            [opt.CheckList_Name]: checked 
                                        }))
                                    }
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-xs text-slate-400 italic">No checklist modifiers registered for this bot.</div>
                    )}
                </div>

            </div>
        </div>
    );
};
