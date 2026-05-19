import React, { useState, useEffect } from "react";
import {
    Share2,
    Copy,
    Check,
    Plus,
    Download,
    Linkedin,
    Twitter,
    MessageCircle,
    Globe,
    Image,
    X
} from "lucide-react";
import { pageTheme } from "../../../Themes/PageThems/pageConfig";

import toast, { Toaster } from "react-hot-toast";

// Import custom common components
import { FormFiled } from "../../../Components/Common/FormFiled";
import { Selection } from "../../../Components/Common/Selection";
import { TextEditor, renderMarkdown } from "../../../Components/Common/TextEditor";

import { AISettings } from "../JobPosting/AISettings";

import { Api_URL } from "../../../APILINK";

const FASTAPI_URL = `${Api_URL}/jobpost`;

// Still use json-server for any legacy data if needed

export const JobPostings = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [educationOptions, setEducationOptions] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);

    const [selectedJobId, setSelectedJobId] = useState<string>("");
    const [, setLoading] = useState<boolean>(false);
    const [generating, setGenerating] = useState<boolean>(false);

    // Form states for active job details
    const [jobForm, setJobForm] = useState<any>({});

    // Load jobs from FastAPI on mount
    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${FASTAPI_URL}/details/all`);
                if (res.ok) {
                    const data = await res.json();
                    const list = data.data || [];
                    if (list.length > 0) {
                        setJobs(list);
                        setSelectedJobId(list[0].PostId);
                        setJobForm({ ...list[0] });
                    }
                }
            } catch (err) {
                console.warn("Backend not reachable.", err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    // Load active Education registry options from FastAPI
    useEffect(() => {
        const fetchEducation = async () => {
            try {
                const res = await fetch(`${FASTAPI_URL}/education/all`);
                if (res.ok) {
                    const data = await res.json();
                    setEducationOptions(data.data || []);
                }
            } catch (err) {
                console.error("Failed to load education options from FastAPI", err);
            }
        };
        fetchEducation();
    }, []);

    // Load active departments list from database
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await fetch(`${Api_URL}/departments/`);
                if (res.ok) {
                    const data = await res.json();
                    setDepartments(data || []);
                }
            } catch (err) {
                console.error("Failed to load departments from database", err);
            }
        };
        fetchDepartments();
    }, []);

    // Update active form values when selection changes
    useEffect(() => {
        const active = jobs.find(j => j.PostId === selectedJobId);
        if (active) setJobForm({ ...active });
    }, [selectedJobId, jobs]);

    const [keywords, setKeywords] = useState<string[]>([]);

    // Fetch and load previously generated AI content and keywords when selected template changes
    useEffect(() => {
        if (!selectedJobId) return;
        const fetchSavedAIContent = async () => {
            try {
                // 1. Fetch saved AI social post
                const aiRes = await fetch(`${FASTAPI_URL}/ai_job_post/all`);
                if (aiRes.ok) {
                    const aiData = await aiRes.json();
                    const matchedPost = (aiData.data || []).find((item: any) => item.PostId === selectedJobId);
                    if (matchedPost) {
                        setGeneratedText(matchedPost.Poster || "");
                    } else {
                        setGeneratedText("");
                    }
                }

                // 2. Fetch saved ATS Key Skills
                const atsRes = await fetch(`${FASTAPI_URL}/ats_keyskills/all`);
                if (atsRes.ok) {
                    const atsData = await atsRes.json();
                    const matchedAts = (atsData.data || []).find((item: any) => item.PostId === selectedJobId);
                    if (matchedAts) {
                        const skills = matchedAts.Skills ? matchedAts.Skills.split(",").map((s: string) => s.trim()) : [];
                        const abilities = matchedAts.Abilities ? matchedAts.Abilities.split(",").map((s: string) => s.trim()) : [];
                        const mergedKeywords = Array.from(new Set([...skills, ...abilities].filter(Boolean)));
                        setKeywords(mergedKeywords);
                        setJobForm((prev: any) => ({
                            ...prev,
                            Weight_Tech: matchedAts.Weight_Tech ?? 30,
                            Weight_Abilities: matchedAts.Weight_Abilities ?? 20,
                            Weight_Experience: matchedAts.Weight_Experience ?? 20,
                            Weight_Education: matchedAts.Weight_Education ?? 15,
                            Weight_Soft: matchedAts.Weight_Soft ?? 15
                        }));
                    } else {
                        setKeywords([]);
                    }
                }
            } catch (err) {
                console.warn("Failed to load saved AI job posting details", err);
            }
        };
        fetchSavedAIContent();
    }, [selectedJobId]);

    // AI generation toggles
    const [tone, setTone] = useState<string>("excited"); // excited, professional, techy, casual, punchy
    const [options, setOptions] = useState<any>({
        stack: true,
        education: true,
        experience: true,
        salary: true,
        perks: true,
        emojis: true,
        hashtags: true
    });
    const [selectedModel, setSelectedModel] = useState<any>(null);

    const [generatedText, setGeneratedText] = useState<string>("");
    const [copied, setCopied] = useState<boolean>(false);
    const [feedTab, setFeedTab] = useState<string>("preview"); // preview, raw
    const [showShareDropdown, setShowShareDropdown] = useState<boolean>(false);
    const [attachedImage, setAttachedImage] = useState<string>("");
    const [showImageInput, setShowImageInput] = useState<boolean>(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                toast.error("Please select a valid image file!");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image file size exceeds the 5MB limit!");
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result as string;
                setAttachedImage(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleShare = async (platform: string) => {
        if (!generatedText) {
            toast.error("Please generate or enter content first!");
            return;
        }

        if (platform === "linkedin") {
            const loadingToast = toast.loading("Publishing job post directly to LinkedIn...");
            try {
                const res = await fetch(`${FASTAPI_URL}/share/linkedin`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        text: generatedText,
                        title: jobForm?.title || "Job Posting Draft",
                        imageUrl: attachedImage || null
                    })
                });

                if (res.ok) {
                    const result = await res.json();
                    toast.dismiss(loadingToast);
                    toast.success("Successfully published to LinkedIn!");
                    
                    toast(() => (
                        <div className="flex flex-col gap-1 text-[10px] font-bold text-slate-700">
                            <span className="text-primary uppercase tracking-widest font-black text-[9px] block">
                                LinkedIn UGC API Broadcast
                            </span>
                            <span className="font-mono bg-slate-50 border border-slate-100 p-1 rounded mt-1 overflow-x-auto text-[9px] block select-all">
                                {result.linkedin_post_id}
                            </span>
                            <span className="text-slate-400 font-medium block">Lifecycle State: {result.payload.lifecycleState}</span>
                            {attachedImage && (
                                <span className="text-emerald-600 block text-[8px] font-extrabold uppercase tracking-wider">
                                    🖼️ Image Attached
                                </span>
                            )}
                        </div>
                    ), { duration: 6000 });
                } else {
                    const errData = await res.json();
                    toast.dismiss(loadingToast);
                    toast.error(`LinkedIn API Error: ${errData.detail || "Failed to publish"}`);
                }
            } catch (err) {
                toast.dismiss(loadingToast);
                toast.error("Network error connecting to direct LinkedIn Share API.");
            }
            setShowShareDropdown(false);
            return;
        }

        const textToShare = attachedImage 
            ? `${generatedText}\n\n🖼️ Recruiting Banner: ${attachedImage}`
            : generatedText;
        const text = encodeURIComponent(textToShare);
        let url = "";
        if (platform === "twitter") {
            url = `https://twitter.com/intent/tweet?text=${text}`;
        } else if (platform === "whatsapp") {
            url = `https://api.whatsapp.com/send?text=${text}`;
        } else if (platform === "native") {
            if (navigator.share) {
                navigator.share({
                    title: jobForm?.title || "Job Posting Draft",
                    text: textToShare
                }).then(() => {
                    toast.success("Shared successfully!");
                }).catch((err) => {
                    console.error("Web Share failed:", err);
                });
                return;
            } else {
                toast.error("Native sharing is not supported on this browser.");
                return;
            }
        }
        if (url) {
            window.open(url, "_blank", "noopener,noreferrer");
            toast.success(`Opening ${platform} share dialog...`);
        }
        setShowShareDropdown(false);
    };



    // Add Job Modal
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [newJobForm, setNewJobForm] = useState<any>({
        title: "",
        department: "Engineering",
        location: "Remote (India)",
        stack: "",
        salary: "",
        experience: "",
        education: "",
        perks: "",
        methods: "",
        description: "",
        applyLink: "",
        expire_date: "",
        interview_date: "",
        is_active: true,
        Weight_Tech: 30,
        Weight_Abilities: 20,
        Weight_Experience: 20,
        Weight_Education: 15,
        Weight_Soft: 15
    });

    // Handle standard text updates and auto-sync changes to FastAPI backend
    const handleFormChange = (key: string, value: string) => {
        setJobForm((prev: any) => {
            // Update both Description and description to stay synced regardless of key casing
            const updated = { ...prev, [key]: value };
            if (key === "description") {
                updated.Description = value;
            } else if (key === "Description") {
                updated.description = value;
            }
            setJobs(prevJobs => prevJobs.map(j => j.PostId === selectedJobId ? updated : j));

            // Sync in real-time to FastAPI backend
            fetch(`${FASTAPI_URL}/details/${selectedJobId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    PostId: updated.PostId,
                    title: updated.title || "",
                    department: updated.department || "",
                    location: updated.location || "",
                    stack: updated.stack || "",
                    salary: updated.salary || "",
                    experience: updated.experience || "",
                    education: updated.education || "",
                    methods: updated.methods || "",
                    perks: updated.perks || "",
                    Description: updated.Description || updated.description || "",
                    applyLink: updated.applyLink || "",
                    expire_date: updated.expire_date || null,
                    interview_date: updated.interview_date || null,
                    is_active: updated.is_active ?? true
                })
            }).catch(err => {
                console.warn("Failed to auto-sync job changes to FastAPI database", err);
            });

            return updated;
        });
    };

    // Sync ATS category weight changes to FastAPI database
    const handleWeightChange = (key: string, value: number) => {
        setJobForm((prev: any) => {
            const updated = { ...prev, [key]: value };
            
            fetch(`${Api_URL}/jobpost/ats_keyskills/${selectedJobId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    PostId: selectedJobId,
                    Title: updated.title || "",
                    Skills: updated.stack || "",
                    Education: updated.education || "",
                    Experience: updated.experience || "",
                    Abilities: updated.methods || "",
                    Weight_Tech: updated.Weight_Tech ?? 30,
                    Weight_Abilities: updated.Weight_Abilities ?? 20,
                    Weight_Experience: updated.Weight_Experience ?? 20,
                    Weight_Education: updated.Weight_Education ?? 15,
                    Weight_Soft: updated.Weight_Soft ?? 15
                })
            }).catch(err => {
                console.warn("Failed to auto-sync weight changes to backend", err);
            });

            return updated;
        });
    };



    const handleGeneratePost = async () => {
        if (!jobForm.PostId) {
            toast.error("Please select a job opening first!");
            return;
        }

        setGenerating(true);
        const toastId = toast.loading("Generating AI Job Post & ATS Data...");

        try {
            const payload = {
                JobDetails: {
                    PostId: jobForm.PostId.toString(),
                    title: jobForm.title || "",
                    department: jobForm.department || "",
                    location: jobForm.location || "",
                    stack: jobForm.stack || "",
                    salary: jobForm.salary || "",
                    experience: jobForm.experience || "",
                    education: jobForm.education || "",
                    methods: jobForm.methods || "",
                    perks: jobForm.perks || "",
                    Description: jobForm.Description || jobForm.description || "",
                    applyLink: jobForm.applyLink || ""
                },
                AI_Model: selectedModel ? [{ 
                    Model_Name: selectedModel.Model_Name, 
                    Avatar: selectedModel.Avatar,
                    Tone_Id: selectedModel.Tone_Id || null,
                    Bot_Type: selectedModel.Bot_Type || null,
                    Icon: selectedModel.Icon || null,
                    Tone_Prompt: selectedModel.Tone_Prompt || null
                }] : [],
                AIMode: [{ Mode_Type: tone, Prompt: "" }],
                SelectionCheckList: Object.entries(options).map(([key, val]) => ({
                    CheckList_Name: key,
                    enable: Boolean(val)
                }))
            };

            const response = await fetch(`${FASTAPI_URL}/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to generate from backend");

            const data = await response.json();

            if (data.data?.linkedin_post) {
                setGeneratedText(data.data.linkedin_post);
                const req = data.data.ats_requirements || {};
                const skills = req.technical_skills || [];
                const soft = req.soft_skills || [];
                const kw = req.keywords || [];
                const mergedKeywords = Array.from(new Set([...skills, ...soft, ...kw].filter(Boolean)));
                setKeywords(mergedKeywords);
                setFeedTab("preview");
                toast.success("✅ AI Content Generated & Saved!", { id: toastId });
            } else {
                toast.error("Generation returned empty response.", { id: toastId });
            }
        } catch (error) {
            console.error("AI Generation Error:", error);
            toast.error("Failed to generate post.", { id: toastId });
        } finally {
            setGenerating(false);
        }
    };

    // Tone update helper
    const handleToneChange = (newTone: string) => {
        setTone(newTone);
    };

    // Copy to clipboard
    const handleCopyText = () => {
        navigator.clipboard.writeText(generatedText);
        setCopied(true);
        toast.success("Text copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    // Download Social Post as Text file
    const handleDownloadText = () => {
        const element = document.createElement("a");
        const file = new Blob([generatedText], { type: 'text/plain;charset=utf-8' });
        element.href = URL.createObjectURL(file);
        element.download = `${(jobForm?.title || "job").replace(/\s+/g, '_')}_social_post.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        toast.success("Draft downloaded!");
    };



    // Form submit to register a new job opening to the FastAPI backend
    const handleAddNewJob = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newJobForm.title || !newJobForm.applyLink) {
            toast.error("Job Title and Apply Link are mandatory!");
            return;
        }
        const postId = `JP-${Date.now()}`;
        const toastId = toast.loading("Creating Job Opening...");
        try {
            const res = await fetch(`${FASTAPI_URL}/details/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    PostId: postId,
                    title: newJobForm.title,
                    department: newJobForm.department,
                    location: newJobForm.location,
                    stack: newJobForm.stack,
                    salary: newJobForm.salary,
                    experience: newJobForm.experience,
                    education: newJobForm.education,
                    methods: newJobForm.methods || "",
                    perks: newJobForm.perks,
                    Description: newJobForm.description,
                    applyLink: newJobForm.applyLink,
                    expire_date: newJobForm.expire_date || null,
                    interview_date: newJobForm.interview_date || null,
                    is_active: newJobForm.is_active ?? true,
                    Weight_Tech: newJobForm.Weight_Tech ?? 30,
                    Weight_Abilities: newJobForm.Weight_Abilities ?? 20,
                    Weight_Experience: newJobForm.Weight_Experience ?? 20,
                    Weight_Education: newJobForm.Weight_Education ?? 15,
                    Weight_Soft: newJobForm.Weight_Soft ?? 15
                })
            });
            if (!res.ok) throw new Error();
            const created = (await res.json()).data;
            toast.success("🆕 Job Opening created!", { id: toastId });
            setJobs(prev => [created, ...prev]);
            setSelectedJobId(created.PostId);
            
            // Populate weights into jobForm state immediately
            setJobForm({
                ...created,
                Weight_Tech: newJobForm.Weight_Tech ?? 30,
                Weight_Abilities: newJobForm.Weight_Abilities ?? 20,
                Weight_Experience: newJobForm.Weight_Experience ?? 20,
                Weight_Education: newJobForm.Weight_Education ?? 15,
                Weight_Soft: newJobForm.Weight_Soft ?? 15
            });
            
            setShowAddModal(false);
            setNewJobForm({ 
                title: "", 
                department: "Engineering", 
                location: "Remote (India)", 
                stack: "", 
                salary: "", 
                experience: "", 
                education: "", 
                perks: "", 
                methods: "", 
                description: "", 
                applyLink: "", 
                expire_date: "", 
                interview_date: "", 
                is_active: true,
                Weight_Tech: 30,
                Weight_Abilities: 20,
                Weight_Experience: 20,
                Weight_Education: 15,
                Weight_Soft: 15
            });
        } catch {
            toast.error("Failed to create job opening.", { id: toastId });
        }
    };




    return (
        <div className={pageTheme.layout.mainContainer}>
            <Toaster position="top-right" />

            {/* HEADER SECTION */}
            <div className={pageTheme.header.wrapper}>
                <div className="flex flex-col">
                    <div className={pageTheme.header.pill}>
                        <Share2 size={12} />
                        <span>Social Post & Design Studio</span>
                    </div>
                    <h1 className={pageTheme.header.title}>Social Job Postings</h1>
                    <p className={pageTheme.header.subtitle}>
                        Use AI copywriting and an integrated graphics canvas to write job posts, generate brand images, and see simulated social feeds.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 pb-20">

                {/* LEFT COLUMN: CONTROLS & FORM INPUTS (45% width equivalent) */}
                <div className="xl:col-span-5 space-y-8">

                    {/* Select Opening Dropdown */}
                    <div className={pageTheme.section.card}>
                        <div className={pageTheme.section.header}>
                            <div className={pageTheme.section.title}>
                                <span className={pageTheme.section.titleDot} />
                                Job Openings Registry
                            </div>
                            <span className={pageTheme.section.countBadge}>{jobs.length} Available</span>
                        </div>

                        <div className="p-6 flex flex-col gap-4">
                            <Selection
                                label="Active Core Template"
                                name="jobSelect"
                                value={selectedJobId}
                                options={jobs.map((j) => ({ label: `${j.title} (${j.department})`, value: j.PostId }))}
                                onChange={(e) => setSelectedJobId(e.target.value)}
                            />

                            <button
                                onClick={() => setShowAddModal(true)}
                                className="w-full py-3 border border-dashed border-primary/30 text-primary hover:bg-primary/5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
                            >
                                <Plus size={14} /> Create Completely New Opening
                            </button>
                        </div>
                    </div>

                    {/* Standard Form Inputs using the project's FormFiled */}
                    <div className={pageTheme.section.card}>
                        <div className={pageTheme.section.header}>
                            <div className={pageTheme.section.title}>
                                <span className={pageTheme.section.titleDot} />
                                Customize Posting Core
                            </div>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <FormFiled
                                    Lable="Job Title"
                                    in_PlaceHolder="e.g. Senior React Developer"
                                    value={jobForm.title}
                                    onChange={(e) => handleFormChange("title", e.target.value)}
                                />
                                <Selection
                                    label="Department"
                                    name="department"
                                    value={jobForm.department}
                                    options={departments.map((dept: any) => ({
                                        label: dept.Dep_name,
                                        value: dept.Dep_name
                                    }))}
                                    onChange={(e) => handleFormChange("department", e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormFiled
                                    Lable="Location/Workplace"
                                    in_PlaceHolder="e.g. Remote (India)"
                                    value={jobForm.location}
                                    onChange={(e) => handleFormChange("location", e.target.value)}
                                />
                                <FormFiled
                                    Lable="Required Experience"
                                    in_PlaceHolder="e.g. 3+ Years"
                                    value={jobForm.experience}
                                    onChange={(e) => handleFormChange("experience", e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Selection
                                    label="Minimum Education"
                                    name="education"
                                    value={jobForm.education}
                                    options={educationOptions.map((opt: any) => ({
                                        label: opt.Edu_name,
                                        value: opt.Edu_name
                                    }))}
                                    onChange={(e) => handleFormChange("education", e.target.value)}
                                />
                                <FormFiled
                                    Lable="Remuneration/Salary"
                                    in_PlaceHolder="e.g. ₹15L - ₹25L"
                                    value={jobForm.salary}
                                    onChange={(e) => handleFormChange("salary", e.target.value)}
                                />

                            </div>

                            <FormFiled
                                Lable="Tech Stack (comma separated)"
                                in_PlaceHolder="e.g. React, TypeScript, Tailwind"
                                value={jobForm.stack}
                                onChange={(e) => handleFormChange("stack", e.target.value)}
                            />

                            <FormFiled
                                Lable="Development Methodology"
                                in_PlaceHolder="e.g. Agile/Scrum, Kanban, DevOps"
                                value={jobForm.methods || ""}
                                onChange={(e) => handleFormChange("methods", e.target.value)}
                            />

                            <div className="flex flex-col">
                                <label className="text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Brief Job Scope</label>
                                <textarea
                                    value={jobForm.Description || jobForm.description || ""}
                                    onChange={(e) => handleFormChange("Description", e.target.value)}
                                    rows={2}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 text-sm focus:outline-none focus:ring-2 ring-primary/10 resize-none transition-all"
                                    placeholder="Describe main goals..."
                                />
                            </div>

                            <FormFiled
                                Lable="Perks & Benefits (comma separated)"
                                in_PlaceHolder="e.g. Apple gear, Free meals"
                                value={jobForm.perks}
                                onChange={(e) => handleFormChange("perks", e.target.value)}
                            />

                            <FormFiled
                                Lable="Apply Link URL"
                                in_PlaceHolder="e.g. https://..."
                                value={jobForm.applyLink}
                                onChange={(e) => handleFormChange("applyLink", e.target.value)}
                            />

                            {/* ATS Weightage Configuration Section */}
                            <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">ATS Category Weightages</h4>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Customize score weightages</p>
                                    </div>
                                    <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                                        ((jobForm.Weight_Tech ?? 30) + (jobForm.Weight_Abilities ?? 20) + (jobForm.Weight_Experience ?? 20) + (jobForm.Weight_Education ?? 15) + (jobForm.Weight_Soft ?? 15)) === 100 
                                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                                            : "bg-amber-50 text-amber-600 border border-amber-100"
                                    }`}>
                                        Total: {((jobForm.Weight_Tech ?? 30) + (jobForm.Weight_Abilities ?? 20) + (jobForm.Weight_Experience ?? 20) + (jobForm.Weight_Education ?? 15) + (jobForm.Weight_Soft ?? 15))}%
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    {[
                                        { key: "Weight_Tech", name: "Technical Skills", val: jobForm.Weight_Tech ?? 30 },
                                        { key: "Weight_Abilities", name: "Abilities / Methodologies", val: jobForm.Weight_Abilities ?? 20 },
                                        { key: "Weight_Experience", name: "Professional Experience", val: jobForm.Weight_Experience ?? 20 },
                                        { key: "Weight_Education", name: "Education / Qualifications", val: jobForm.Weight_Education ?? 15 },
                                        { key: "Weight_Soft", name: "Soft Skills", val: jobForm.Weight_Soft ?? 15 },
                                    ].map((cat) => (
                                        <div key={cat.key} className="flex flex-col gap-1">
                                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                                                <span>{cat.name}</span>
                                                <span className="text-primary font-black">{cat.val}%</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={cat.val}
                                                onChange={(e) => handleWeightChange(cat.key, parseInt(e.target.value) || 0)}
                                                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Lifecycle fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Application Expiry Date</label>
                                    <input
                                        type="date"
                                        value={jobForm.expire_date || ""}
                                        onChange={(e) => handleFormChange("expire_date", e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 text-sm focus:outline-none focus:ring-2 ring-primary/10 transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Interview Date</label>
                                    <input
                                        type="date"
                                        value={jobForm.interview_date || ""}
                                        onChange={(e) => handleFormChange("interview_date", e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 text-sm focus:outline-none focus:ring-2 ring-primary/10 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Active status toggle */}
                            <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 bg-slate-50">
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Post Status</span>
                                    <span className="text-[10px] text-slate-400 mt-0.5">
                                        {jobForm.is_active ? "Active — visible to candidates" : "Inactive — hidden from candidates"}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newStatus = !jobForm.is_active;
                                        handleFormChange("is_active", newStatus as any);
                                        fetch(`${FASTAPI_URL}/details/${selectedJobId}/toggle`, { method: "PATCH" })
                                            .then(() => toast.success(`Post ${newStatus ? "activated" : "deactivated"}`))
                                            .catch(() => toast.error("Failed to toggle status"));
                                    }}
                                    className={`relative w-11 h-6 rounded-full transition-all duration-200 focus:outline-none ${
                                        jobForm.is_active ? "bg-emerald-500" : "bg-slate-300"
                                    }`}
                                >
                                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                                        jobForm.is_active ? "translate-x-5" : "translate-x-0"
                                    }`} />
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button type="button" className="flex-1 py-3 bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-slate-800/20 transition-all hover:-translate-y-0.5">
                                Job Description
                            </button>
                        </div>
                    </div>

                    {/* AI Settings block */}
                    <AISettings
                        tone={tone}
                        options={options}
                        onToneChange={handleToneChange}
                        onOptionsChange={setOptions}
                        selectedModel={selectedModel}
                        onModelChange={setSelectedModel}
                    />

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={handleGeneratePost}
                            disabled={generating}
                            className="flex-1 py-3 bg-primary text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                        >
                            {generating ? "Generating..." : "AI Post Generate"}
                        </button>
                    </div>

                </div>

                {/* RIGHT COLUMN: SIMULATORS & WORKSPACES (55% width equivalent) */}
                <div className="xl:col-span-7 space-y-8">
                    <div className={pageTheme.section.card}>

                        {/* Tab Header */}
                        <div className="flex items-center justify-between p-[12px_24px] bg-slate-50/50 border-b border-slate-100 flex-wrap gap-2">
                            <div className="flex gap-2">
                                {[
                                    { id: "preview", name: "Job Post Preview", color: "text-primary" },
                                    { id: "raw", name: "Copy Editor", color: "text-slate-600" }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setFeedTab(tab.id)}
                                        className={`px-4 py-3 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${feedTab === tab.id
                                            ? "bg-white shadow-sm border border-slate-100 text-primary"
                                            : "text-slate-500 hover:text-slate-800"
                                            }`}
                                    >
                                        <span className={`mr-1.5 ${tab.color}`}>●</span>
                                        {tab.name}
                                    </button>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 relative">
                                <button
                                    onClick={handleDownloadText}
                                    className="p-2.5 rounded-lg border border-slate-100 bg-white text-slate-600 hover:bg-slate-50 shadow-sm transition-all"
                                    title="Download Draft Text"
                                >
                                    <Download size={15} />
                                </button>
                                <button
                                    onClick={handleCopyText}
                                    className="px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg border border-slate-100 bg-white text-slate-700 hover:bg-slate-50 shadow-sm flex items-center gap-1.5 transition-all"
                                >
                                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                    {copied ? "Copied" : "Copy"}
                                </button>

                                {/* Image Attachment Button */}
                                <button
                                    onClick={() => setShowImageInput(!showImageInput)}
                                    className={`p-2.5 rounded-lg border flex items-center justify-center transition-all shadow-sm
                                        ${attachedImage 
                                            ? "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100" 
                                            : showImageInput
                                                ? "border-primary bg-primary/5 text-primary"
                                                : "border-slate-100 bg-white text-slate-500 hover:bg-slate-50"
                                        }`}
                                    title="Attach Recruiting Banner / Image"
                                >
                                    <Image size={15} />
                                </button>

                                {/* Share Post Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowShareDropdown(!showShareDropdown)}
                                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg border flex items-center gap-1.5 shadow-sm transition-all
                                            ${showShareDropdown 
                                                ? "bg-primary text-white border-primary" 
                                                : "bg-white border-slate-100 text-slate-700 hover:bg-slate-50"
                                            }`}
                                    >
                                        <Share2 size={14} />
                                        Share
                                    </button>

                                    {showShareDropdown && (
                                        <>
                                            {/* Click outside backdrop */}
                                            <div 
                                                className="fixed inset-0 z-40" 
                                                onClick={() => setShowShareDropdown(false)} 
                                            />
                                            <div className="absolute right-0 mt-2.5 w-48 bg-white/95 backdrop-blur-md border border-slate-100 rounded-xl shadow-xl p-1.5 z-50 animate-fade-in flex flex-col gap-0.5">
                                                <button
                                                    onClick={() => handleShare("linkedin")}
                                                    className="w-full text-left px-3.5 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-600 hover:bg-slate-50 hover:text-slate-800 rounded-lg flex items-center gap-2.5 transition-all"
                                                >
                                                    <Linkedin size={13} className="text-[#0A66C2]" />
                                                    LinkedIn
                                                </button>
                                                <button
                                                    onClick={() => handleShare("twitter")}
                                                    className="w-full text-left px-3.5 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-600 hover:bg-slate-50 hover:text-slate-800 rounded-lg flex items-center gap-2.5 transition-all"
                                                >
                                                    <Twitter size={13} className="text-slate-900" />
                                                    Twitter / X
                                                </button>
                                                <button
                                                    onClick={() => handleShare("whatsapp")}
                                                    className="w-full text-left px-3.5 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-600 hover:bg-slate-50 hover:text-slate-800 rounded-lg flex items-center gap-2.5 transition-all"
                                                >
                                                    <MessageCircle size={13} className="text-[#25D366]" />
                                                    WhatsApp
                                                </button>
                                                <button
                                                    onClick={() => handleShare("native")}
                                                    className="w-full text-left px-3.5 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-600 hover:bg-slate-50 hover:text-slate-800 rounded-lg flex items-center gap-2.5 transition-all border-t border-slate-100/50 mt-1 pt-2"
                                                >
                                                    <Globe size={13} className="text-slate-500" />
                                                    System Share
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Image Attachment Input Panel */}
                        {showImageInput && (
                            <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex flex-col gap-4 animate-fade-in">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        Attach Social Recruiting Banner
                                    </span>
                                    {attachedImage && (
                                        <button 
                                            onClick={() => setAttachedImage("")}
                                            className="text-[9px] font-black text-rose-500 bg-rose-50 hover:bg-rose-100 border border-rose-100 px-2 py-0.5 rounded transition-all uppercase tracking-wider flex items-center gap-1"
                                        >
                                            <X size={10} /> Remove Attached Image
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Column 1: Local Image Upload Drag & Drop */}
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                            Upload Local Image Flyer:
                                        </span>
                                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-primary/50 bg-white hover:bg-slate-50/50 rounded-2xl p-5 cursor-pointer transition-all shadow-inner group">
                                            <div className="flex flex-col items-center gap-1.5 text-center">
                                                <div className="p-2 bg-slate-50 rounded-xl group-hover:scale-105 transition-all">
                                                    <Image size={18} className="text-slate-400" />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                                                    Choose Image File
                                                </span>
                                                <span className="text-[8px] text-slate-400">
                                                    PNG, JPG or WEBP (Max 5MB)
                                                </span>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>

                                    {/* Column 2: Custom URL Paste and Preview */}
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                            Or Paste Image URL Address:
                                        </span>
                                        <input
                                            type="url"
                                            placeholder="Paste custom image URL here..."
                                            value={attachedImage && !attachedImage.startsWith("data:") ? attachedImage : ""}
                                            onChange={(e) => setAttachedImage(e.target.value)}
                                            className="px-3 py-2 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 text-slate-700 shadow-inner"
                                        />

                                        {attachedImage && (
                                            <div className="flex flex-col gap-1 mt-1 animate-fade-in">
                                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                                                    Attached Image Preview:
                                                </span>
                                                <div className="relative w-full h-16 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                                                    <img 
                                                        src={attachedImage} 
                                                        alt="Attached recruiting flyer" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Preset Recruiting Banner Banners */}
                                <div className="flex flex-col gap-1.5 mt-1">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                        Or Choose a Premium Preset Recruiting Banner:
                                    </span>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[
                                            { name: "We Are Hiring", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop" },
                                            { name: "Tech Workplace", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop" },
                                            { name: "Office Banner", url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop" },
                                            { name: "Join Our Team", url: "https://images.unsplash.com/photo-1521791136368-1a8ac2f8b2c5?w=800&auto=format&fit=crop" }
                                        ].map((banner, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setAttachedImage(banner.url);
                                                }}
                                                className={`p-1.5 border rounded-xl bg-white hover:bg-slate-50 transition-all flex flex-col items-center gap-1 text-center group
                                                    ${attachedImage === banner.url 
                                                        ? "border-primary ring-2 ring-primary/10 shadow-sm" 
                                                        : "border-slate-100"
                                                    }`}
                                            >
                                                <img 
                                                    src={banner.url} 
                                                    alt={banner.name} 
                                                    className="w-full h-12 object-cover rounded-lg group-hover:scale-[1.03] transition-all"
                                                />
                                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-wide truncate w-full">
                                                    {banner.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB WRAPPER */}
                        <div className="p-8 min-h-[520px] bg-slate-50/30">

                            {/* RAW EDITOR */}
                            {feedTab === "raw" && (
                                <TextEditor
                                    value={generatedText}
                                    onChange={setGeneratedText}
                                    rows={14}
                                    fontFamily="mono"
                                    warningLength={280}
                                    warningMessage="This text exceeds the 280 character limit of Twitter/X. Consider switching to the 'Punchy' AI tone."
                                    downloadFileName={`${(jobForm?.title || "job").replace(/\s+/g, '_')}_social_post.txt`}
                                    showCopy={false}
                                    showDownload={false}
                                    showClear={false}
                                    keywords={keywords}
                                />
                            )}

                            {/* JOB POST PREVIEW */}
                            {feedTab === "preview" && (
                                <div className="max-w-2xl mx-auto bg-white/70 backdrop-blur-md rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
                                    {/* Premium Glass Header */}
                                    <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50/40 to-white/40 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-sm shadow-sm border border-primary/10">
                                                {((jobForm?.department || "HR")[0] || "H").toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-xs font-black text-slate-800 uppercase tracking-wide">
                                                    {jobForm?.title || "Select Job Position"}
                                                </div>
                                                <div className="text-[10px] font-semibold text-slate-400">
                                                    {jobForm?.department || "Human Resources"} • {jobForm?.location || "Remote"}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 border border-slate-100 px-2.5 py-1 rounded-md">
                                            Active Draft
                                        </div>
                                    </div>

                                    {/* Styled Text Content */}
                                    <div className="p-8">
                                        <div 
                                            className="whitespace-pre-line text-sm text-slate-700 leading-relaxed font-sans bg-slate-50/50 p-6 rounded-2xl border border-slate-100/50"
                                            dangerouslySetInnerHTML={{ __html: renderMarkdown(generatedText || "No content generated yet. Select a job opening and click 'AI Post Generate' above!") }}
                                        />
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>


                </div>
            </div>


            {/* Add the job new detial  */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-lg rounded-[28px] overflow-hidden shadow-2xl my-8">

                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                                    <Plus size={20} className="text-primary" /> Create Job Opening
                                </h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                    Add custom opening parameters
                                </p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleAddNewJob}>
                            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">

                                <FormFiled
                                    Lable="Job Title *"
                                    in_PlaceHolder="e.g. Senior Frontend Engineer"
                                    value={newJobForm.title}
                                    onChange={(e) => setNewJobForm({ ...newJobForm, title: e.target.value })}
                                    required
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Selection
                                        label="Department"
                                        name="newDepartment"
                                        value={newJobForm.department}
                                        options={departments.map((dept: any) => ({
                                            label: dept.Dep_name,
                                            value: dept.Dep_name
                                        }))}
                                        onChange={(e) => setNewJobForm({ ...newJobForm, department: e.target.value })}
                                    />
                                    <FormFiled
                                        Lable="Location"
                                        in_PlaceHolder="Remote (India)"
                                        value={newJobForm.location}
                                        onChange={(e) => setNewJobForm({ ...newJobForm, location: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormFiled
                                        Lable="Salary Details"
                                        in_PlaceHolder="e.g. ₹15,00,000 - ₹25,00,000"
                                        value={newJobForm.salary}
                                        onChange={(e) => setNewJobForm({ ...newJobForm, salary: e.target.value })}
                                    />
                                    <FormFiled
                                        Lable="Experience Required"
                                        in_PlaceHolder="e.g. 3+ Years"
                                        value={newJobForm.experience}
                                        onChange={(e) => setNewJobForm({ ...newJobForm, experience: e.target.value })}
                                    />
                                </div>

                                <Selection
                                    label="Education Requirement"
                                    name="newEducation"
                                    value={newJobForm.education}
                                    options={educationOptions.map((opt: any) => ({
                                        label: opt.Edu_name,
                                        value: opt.Edu_name
                                    }))}
                                    onChange={(e) => setNewJobForm({ ...newJobForm, education: e.target.value })}
                                />

                                <FormFiled
                                    Lable="Core Tech Stack"
                                    in_PlaceHolder="e.g. React, Node.js, SQL"
                                    value={newJobForm.stack}
                                    onChange={(e) => setNewJobForm({ ...newJobForm, stack: e.target.value })}
                                />

                                <FormFiled
                                    Lable="Development Methodology"
                                    in_PlaceHolder="e.g. Agile/Scrum, Kanban, DevOps"
                                    value={newJobForm.methods || ""}
                                    onChange={(e) => setNewJobForm({ ...newJobForm, methods: e.target.value })}
                                />

                                <div className="flex flex-col">
                                    <label className="text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Brief Job Scope</label>
                                    <textarea
                                        value={newJobForm.description}
                                        rows={2}
                                        onChange={(e) => setNewJobForm({ ...newJobForm, description: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 text-sm focus:outline-none focus:ring-2 ring-primary/10 resize-none transition-all"
                                        placeholder="We are seeking..."
                                    />
                                </div>

                                <FormFiled
                                    Lable="Perks & Benefits"
                                    in_PlaceHolder="e.g. Health cover, Flexible hours"
                                    value={newJobForm.perks}
                                    onChange={(e) => setNewJobForm({ ...newJobForm, perks: e.target.value })}
                                />

                                <FormFiled
                                    Lable="Application URL *"
                                    in_PlaceHolder="e.g. https://careers.apex.io/apply"
                                    value={newJobForm.applyLink}
                                    onChange={(e) => setNewJobForm({ ...newJobForm, applyLink: e.target.value })}
                                    required
                                />

                                {/* ATS Weightages Configuration in Modal */}
                                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">ATS Category Weightages</label>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Customize score weightages</p>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                                            ((newJobForm.Weight_Tech ?? 30) + (newJobForm.Weight_Abilities ?? 20) + (newJobForm.Weight_Experience ?? 20) + (newJobForm.Weight_Education ?? 15) + (newJobForm.Weight_Soft ?? 15)) === 100 
                                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                                                : "bg-amber-50 text-amber-600 border border-amber-100"
                                        }`}>
                                            Total: {((newJobForm.Weight_Tech ?? 30) + (newJobForm.Weight_Abilities ?? 20) + (newJobForm.Weight_Experience ?? 20) + (newJobForm.Weight_Education ?? 15) + (newJobForm.Weight_Soft ?? 15))}%
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            { key: "Weight_Tech", name: "Technical Skills", val: newJobForm.Weight_Tech ?? 30 },
                                            { key: "Weight_Abilities", name: "Abilities / Methodologies", val: newJobForm.Weight_Abilities ?? 20 },
                                            { key: "Weight_Experience", name: "Professional Experience", val: newJobForm.Weight_Experience ?? 20 },
                                            { key: "Weight_Education", name: "Education / Qualifications", val: newJobForm.Weight_Education ?? 15 },
                                            { key: "Weight_Soft", name: "Soft Skills", val: newJobForm.Weight_Soft ?? 15 },
                                        ].map((cat) => (
                                            <div key={cat.key} className="flex flex-col gap-1">
                                                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                                                    <span>{cat.name}</span>
                                                    <span className="text-primary font-black">{cat.val}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={cat.val}
                                                    onChange={(e) => setNewJobForm({ ...newJobForm, [cat.key]: parseInt(e.target.value) || 0 })}
                                                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Expiry Date</label>
                                        <input
                                            type="date"
                                            value={newJobForm.expire_date || ""}
                                            onChange={(e) => setNewJobForm({ ...newJobForm, expire_date: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 text-sm focus:outline-none focus:ring-2 ring-primary/10 transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Interview Date</label>
                                        <input
                                            type="date"
                                            value={newJobForm.interview_date || ""}
                                            onChange={(e) => setNewJobForm({ ...newJobForm, interview_date: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 text-sm focus:outline-none focus:ring-2 ring-primary/10 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 bg-slate-50">
                                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Post Active</span>
                                    <button
                                        type="button"
                                        onClick={() => setNewJobForm({ ...newJobForm, is_active: !newJobForm.is_active })}
                                        className={`relative w-11 h-6 rounded-full transition-all duration-200 focus:outline-none ${
                                            newJobForm.is_active ? "bg-emerald-500" : "bg-slate-300"
                                        }`}
                                    >
                                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                                            newJobForm.is_active ? "translate-x-5" : "translate-x-0"
                                        }`} />
                                    </button>
                                </div>

                            </div>

                            {/* Actions */}
                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-4 rounded-xl bg-white border border-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all"
                                >
                                    Create Opening
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}

        </div>
    );
};
