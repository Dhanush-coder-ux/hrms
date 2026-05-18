import React, { useState, useEffect } from "react";
import {
    Share2,
    Copy,
    Check,
    Plus,
    Download
} from "lucide-react";
import { pageTheme } from "../../../Themes/PageThems/pageConfig";

import toast, { Toaster } from "react-hot-toast";

// Import custom common components
import { FormFiled } from "../../../Components/Common/FormFiled";
import { Selection } from "../../../Components/Common/Selection";
import { TextEditor } from "../../../Components/Common/TextEditor";

import { AISettings } from "../JobPosting/AISettings";

import { Api_URL } from "../../../APILINK";

const FASTAPI_URL = `${Api_URL}/jobpost`;

// Still use json-server for any legacy data if needed

export const JobPostings = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [educationOptions, setEducationOptions] = useState<any[]>([]);

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
                        toast.success("💼 Loaded job openings from database!");
                    }
                }
            } catch (err) {
                console.warn("Backend not reachable.", err);
                toast.error("Could not connect to backend.");
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

    // Update active form values when selection changes
    useEffect(() => {
        const active = jobs.find(j => j.PostId === selectedJobId);
        if (active) setJobForm({ ...active });
    }, [selectedJobId, jobs]);

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
        applyLink: ""
    });

    // Handle standard text updates and auto-sync changes to FastAPI backend
    const handleFormChange = (key: string, value: string) => {
        setJobForm((prev: any) => {
            const updated = { ...prev, [key]: value };
            setJobs(prevJobs => prevJobs.map(j => j.PostId === selectedJobId ? updated : j));

            // Sync in real-time to FastAPI backend
            fetch(`${FASTAPI_URL}/details/${selectedJobId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    PostId: updated.PostId,
                    title: updated.title || "",
                    department: updated.department || "",
                    stack: updated.stack || "",
                    salary: updated.salary || "",
                    experience: updated.experience || "",
                    education: updated.education || "",
                    methods: updated.methods || "",
                    perks: updated.perks || "",
                    Description: updated.Description || "",
                    applyLink: updated.applyLink || ""
                })
            }).catch(err => {
                console.warn("Failed to auto-sync job changes to FastAPI database", err);
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
                    stack: jobForm.stack || "",
                    salary: jobForm.salary || "",
                    experience: jobForm.experience || "",
                    education: jobForm.education || "",
                    methods: jobForm.methods || "",
                    perks: jobForm.perks || "",
                    Description: jobForm.Description || "",
                    applyLink: jobForm.applyLink || ""
                },
                AI_Model: selectedModel ? [{ 
                    Model_Name: selectedModel.Model_Name, 
                    Avatar: selectedModel.Avatar,
                    Tone_Id: selectedModel.Tone_Id || null
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
        toast.success(`AI tone updated to: ${newTone}`);
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
                    stack: newJobForm.stack,
                    salary: newJobForm.salary,
                    experience: newJobForm.experience,
                    education: newJobForm.education,
                    methods: newJobForm.methods || "",
                    perks: newJobForm.perks,
                    Description: newJobForm.description,
                    applyLink: newJobForm.applyLink
                })
            });
            if (!res.ok) throw new Error();
            const created = (await res.json()).data;
            toast.success("🆕 Job Opening created!", { id: toastId });
            setJobs(prev => [created, ...prev]);
            setSelectedJobId(created.PostId);
            setJobForm(created);
            setShowAddModal(false);
            setNewJobForm({ title: "", department: "Engineering", location: "Remote (India)", stack: "", salary: "", experience: "", education: "", perks: "", methods: "", description: "", applyLink: "" });
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
                                <FormFiled
                                    Lable="Department"
                                    in_PlaceHolder="e.g. Engineering"
                                    value={jobForm.department}
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
                                    value={jobForm.description}
                                    onChange={(e) => handleFormChange("description", e.target.value)}
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
                            <div className="flex items-center gap-2">
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
                            </div>
                        </div>

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
                                        <div className="whitespace-pre-line text-sm text-slate-700 leading-relaxed font-sans bg-slate-50/50 p-6 rounded-2xl border border-slate-100/50">
                                            {generatedText}
                                        </div>
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
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Department</label>
                                        <select
                                            value={newJobForm.department}
                                            onChange={(e) => setNewJobForm({ ...newJobForm, department: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-700 text-sm focus:outline-none focus:ring-2 ring-primary/10"
                                        >
                                            <option>Engineering</option>
                                            <option>Data Science & AI</option>
                                            <option>Product & Design</option>
                                            <option>Human Resources</option>
                                            <option>Operations</option>
                                        </select>
                                    </div>
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
