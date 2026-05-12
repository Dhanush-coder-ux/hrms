import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, CheckCircle, Clock, MapPin, Link, Users, User, Send } from "lucide-react";
import type { Candidate } from "../../../../../Types/typesOnboarding";
import { CustomDatePicker } from "../../../../../Components/Common/CustomDatePicker";
import { FormFiled } from "../../../../../Components/Common/FormFiled";
import { Selection } from "../../../../../Components/Common/Selection";

interface SchedulingModalProps {
  mode: "Individual" | "Group" | null;
  onClose: () => void;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  candidates: Candidate[];
  candidateSearch: string;
  setCandidateSearch: (s: string) => void;
  isScheduling: boolean;
  formDetails: any;
  setFormDetails: (d: any) => void;
  onSchedule: (e: React.FormEvent) => void;
  isEligible: (c: Candidate) => boolean;
}

const AVATAR_COLORS = [
  ["#ede9fe", "#7c3aed"],
  ["#dbeafe", "#1d4ed8"],
  ["#dcfce7", "#15803d"],
  ["#fef9c3", "#a16207"],
  ["#ffe4e6", "#be123c"],
  ["#e0f2fe", "#0369a1"],
];
const getAvatarColor = (name: string) => AVATAR_COLORS[(name?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];

export const SchedulingModal = ({
  mode, onClose, selectedIds, setSelectedIds, candidates,
  candidateSearch, setCandidateSearch, isScheduling,
  formDetails, setFormDetails, onSchedule, isEligible,
}: SchedulingModalProps) => {
  const eligibleCandidates = candidates.filter(isEligible);
  const filteredForSelection = candidates.filter(
    (c) =>
      c.Candidate_name.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      c.Job_title.toLowerCase().includes(candidateSearch.toLowerCase())
  );

  const inputStyle: React.CSSProperties = {
    width: "100%", height: 46,
    padding: "0 16px",
    borderRadius: 12,
    border: "1.5px solid #e2e8f0",
    background: "#fafbff",
    fontSize: 13, fontWeight: 600, color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'Inter', system-ui, sans-serif",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 10, fontWeight: 800,
    letterSpacing: "0.09em", textTransform: "uppercase",
    color: "#94a3b8", marginBottom: 8, display: "block",
  };

  return (
    <AnimatePresence>
      {mode && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'Inter', system-ui, sans-serif" }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)" }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            style={{
              position: "relative",
              width: "100%", maxWidth: 980,
              height: "min(860px, calc(100vh - 48px))",
              background: "#fff",
              borderRadius: 24,
              display: "flex",
              overflow: "hidden",
              boxShadow: "0 40px 80px rgba(0,0,0,0.18)",
            }}
          >
            {/* ── LEFT: Candidate Picker ── */}
            <div style={{ width: "42%", borderRight: "1.5px solid #f1f5f9", display: "flex", flexDirection: "column", background: "#fafbff" }}>
              {/* Header */}
              <div style={{ padding: "24px 24px 16px", borderBottom: "1px solid #f1f5f9", background: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1" }}>
                      {mode === "Group" ? <Users size={16} /> : <User size={16} />}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#0f172a" }}>
                        {mode === "Group" ? "Select Group" : "Select Candidate"}
                      </p>
                      <p style={{ margin: 0, fontSize: 10, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.04em" }}>
                        {selectedIds.length} selected
                      </p>
                    </div>
                  </div>
                  {mode === "Group" && (
                    <button
                      onClick={() => setSelectedIds(eligibleCandidates.map((c) => c.Candidate_id))}
                      style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", background: "#eef2ff", border: "none", padding: "5px 10px", borderRadius: 8, cursor: "pointer" }}
                    >
                      All Eligible
                    </button>
                  )}
                </div>

                {/* Search */}
                <div style={{ position: "relative" }}>
                  <Search size={14} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
                  <input
                    placeholder="Search name or role…"
                    value={candidateSearch}
                    onChange={(e) => setCandidateSearch(e.target.value)}
                    style={{ ...inputStyle, paddingLeft: 38, height: 40 }}
                  />
                </div>
              </div>

              {/* List */}
              <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
                {filteredForSelection.map((cand) => {
                  const eligible = isEligible(cand);
                  const isSelected = selectedIds.includes(cand.Candidate_id);
                  const [bgC, fgC] = getAvatarColor(cand.Candidate_name);
                  const initials = cand.Candidate_name?.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

                  return (
                    <div
                      key={cand.Candidate_id}
                      onClick={() => {
                        if (!eligible) return;
                        if (mode === "Individual") {
                          setSelectedIds([cand.Candidate_id]);
                        } else {
                          setSelectedIds((prev) =>
                            isSelected ? prev.filter((id) => id !== cand.Candidate_id) : [...prev, cand.Candidate_id]
                          );
                        }
                      }}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "12px 14px", borderRadius: 14, marginBottom: 6,
                        border: `1.5px solid ${isSelected ? "#c7d2fe" : "#f1f5f9"}`,
                        background: isSelected ? "#eef2ff" : eligible ? "#fff" : "#f8fafc",
                        cursor: eligible ? "pointer" : "not-allowed",
                        opacity: eligible ? 1 : 0.5,
                        transition: "all 0.12s",
                        boxShadow: isSelected ? "0 0 0 3px rgba(99,102,241,0.10)" : "none",
                      }}
                    >
                      {/* Checkbox */}
                      <div style={{
                        width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                        border: `2px solid ${isSelected ? "#6366f1" : "#cbd5e1"}`,
                        background: isSelected ? "#6366f1" : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {isSelected && <CheckCircle size={12} style={{ color: "#fff" }} />}
                      </div>

                      {/* Avatar */}
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, background: bgC, color: fgC,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 800, flexShrink: 0,
                      }}>
                        {initials}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {cand.Candidate_name}
                        </p>
                        <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>
                          {cand.Job_title}
                        </p>
                      </div>

                      {eligible ? (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 8, background: "#f0fdf4", color: "#16a34a", flexShrink: 0 }}>
                          Eligible
                        </span>
                      ) : (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 8, background: "#f8fafc", color: "#94a3b8", flexShrink: 0 }}>
                          {cand.Status}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── RIGHT: Form ── */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff" }}>
              {/* Header */}
              <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
                    Invitation Details
                  </h3>
                  <p style={{ margin: "4px 0 0", fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>
                    Configure the {mode?.toLowerCase()} interview session
                  </p>
                </div>
                <button
                  onClick={onClose}
                  style={{
                    width: 34, height: 34, borderRadius: "50%",
                    border: "1.5px solid #e2e8f0", background: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: "#94a3b8",
                  }}
                >
                  <X size={15} />
                </button>
              </div>

              {/* Form body */}
              <form
                onSubmit={onSchedule}
                style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}
              >
                {mode === "Group" && (
                  <div>
                    <label style={labelStyle}>Group Name</label>
                    <input
                      required
                      placeholder="e.g. Q3 Engineering Batch"
                      value={formDetails.Group_name || ""}
                      onChange={(e) => setFormDetails({ ...formDetails, Group_name: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <Selection
                      label="Interview Round"
                      name="Interview_round"
                      value={formDetails.Interview_round}
                      options={[
                        { label: "Technical",   value: "Technical" },
                        { label: "HR Round",    value: "HR Round" },
                        { label: "Design",      value: "Design" },
                        { label: "Management",  value: "Management" },
                      ]}
                      onChange={(e: any) => setFormDetails({ ...formDetails, Interview_round: e.target.value })}
                    />
                  </div>
                  <div>
                    <Selection
                      label="Interview Mode"
                      name="Interview_mode"
                      value={formDetails.Interview_mode}
                      options={[
                        { label: "Online",  value: "Online" },
                        { label: "Offline", value: "Offline" },
                      ]}
                      onChange={(e: any) => setFormDetails({ ...formDetails, Interview_mode: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <CustomDatePicker
                      Lable="Interview Date"
                      name="Interview_date"
                      value={formDetails.Interview_date}
                      onChange={(e: any) => setFormDetails({ ...formDetails, Interview_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <FormFiled
                      Lable="Interview Time"
                      type="time"
                      in_PlaceHolder="Select time"
                      name="Interview_time"
                      value={formDetails.Interview_time}
                      icon={<Clock size={15} />}
                      onChange={(e: any) => setFormDetails({ ...formDetails, Interview_time: e.target.value })}
                    />
                  </div>
                </div>

                {/* Location / Link */}
                <div>
                  <label style={labelStyle}>
                    {formDetails.Interview_mode === "Online" ? "Meeting Link" : "Venue / Location"}
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", display: "flex" }}>
                      {formDetails.Interview_mode === "Online" ? <Link size={15} /> : <MapPin size={15} />}
                    </span>
                    <input
                      required
                      placeholder={formDetails.Interview_mode === "Online" ? "https://meet.google.com/…" : "Floor 4, Conference Room B"}
                      style={{ ...inputStyle, paddingLeft: 40 }}
                      value={formDetails.Interview_mode === "Online" ? (formDetails.Meeting_link || "") : (formDetails.Location || "")}
                      onChange={(e) => setFormDetails({
                        ...formDetails,
                        [formDetails.Interview_mode === "Online" ? "Meeting_link" : "Location"]: e.target.value,
                      })}
                    />
                  </div>
                </div>

                {/* Panel */}
                <div>
                  <label style={labelStyle}>Panel Members</label>
                  <input
                    placeholder="Comma separated names…"
                    style={inputStyle}
                    value={formDetails.Panel_members || ""}
                    onChange={(e) => setFormDetails({ ...formDetails, Panel_members: e.target.value })}
                  />
                </div>

                {/* Submit */}
                <div style={{ marginTop: "auto", paddingTop: 8, borderTop: "1px solid #f1f5f9" }}>
                  {/* Selected summary */}
                  {selectedIds.length > 0 && (
                    <div style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "10px 14px", borderRadius: 12,
                      background: "#eef2ff", border: "1.5px solid #c7d2fe",
                      marginBottom: 14,
                    }}>
                      <CheckCircle size={14} style={{ color: "#6366f1", flexShrink: 0 }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#4338ca" }}>
                        {selectedIds.length} candidate{selectedIds.length > 1 ? "s" : ""} selected
                      </span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isScheduling || selectedIds.length === 0}
                    style={{
                      width: "100%", height: 52,
                      borderRadius: 16, border: "none",
                      background: selectedIds.length === 0 ? "#e2e8f0" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      color: selectedIds.length === 0 ? "#94a3b8" : "#fff",
                      fontSize: 14, fontWeight: 800, letterSpacing: "0.01em",
                      cursor: selectedIds.length === 0 ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                      transition: "opacity 0.12s, transform 0.1s",
                      opacity: isScheduling ? 0.85 : 1,
                    }}
                    onMouseDown={(e) => { if (selectedIds.length > 0) (e.currentTarget as HTMLElement).style.transform = "scale(0.98)"; }}
                    onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                  >
                    {isScheduling ? (
                      <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", animation: "spin 0.7s linear infinite" }} />
                    ) : (
                      <>
                        <Send size={16} />
                        Send Invitations
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </AnimatePresence>
  );
};