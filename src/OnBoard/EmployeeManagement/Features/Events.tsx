import { useEffect, useState } from "react";
import CalendarView from "../../../Components/Common/Calander/CalendarView";
import { motion, AnimatePresence } from "framer-motion"; // <-- Added Framer Motion
import type { EventFormData } from "../../../Types/typesEmployeeManagement";

const API_URL = "http://localhost:3001/Events";

const CAT_COLORS: Record<string, string> = {
  holidays: "#34D399",
  Festival: "#F59E0B",
  birthday: "#EC4899",
  meeting: "#6366F1",
  Party: "#9e1fda",
  Workshop: "#0ea5e9",
  Conference: "#f97316",
  Others: "#60A5FA",
};

const CAT_STYLES: Record<string, string> = {
  Festival: "bg-amber-100 text-amber-800",
  birthday: "bg-pink-100 text-pink-800",
  meeting: "bg-indigo-100 text-indigo-800",
  Party: "bg-purple-100 text-purple-800",
  holidays: "bg-emerald-100 text-emerald-800",
  Workshop: "bg-sky-100 text-sky-800",
  Conference: "bg-orange-100 text-orange-800",
  Others: "bg-blue-100 text-blue-800",
};

const EVENT_OPTIONS = [
  { label: "Festival", value: "Festival" },
  { label: "Birthday", value: "birthday" },
  { label: "Meeting", value: "meeting" },
  { label: "Party", value: "Party" },
  { label: "Holiday", value: "holidays" },
  { label: "Workshop", value: "Workshop" },
  { label: "Conference", value: "Conference" },
  { label: "Others", value: "Others" },
];

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const todayStr = new Date().toISOString().slice(0, 10);

const daysUntil = (dateStr: string): number =>
  Math.ceil(
    (new Date(dateStr + "T00:00:00").getTime() -
      new Date().setHours(0, 0, 0, 0)) /
      86400000,
  );

const fmtDate = (d: string) => {
  if (!d) return "";
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const catColor = (cat: string) => CAT_COLORS[cat] ?? "#60A5FA";
const catStyle = (cat: string) =>
  CAT_STYLES[cat] ?? "bg-blue-100 text-blue-800";

/** Days-until badge */
function DaysChip({ date }: { date: string }) {
  const n = daysUntil(date);
  if (n === 0)
    return (
      <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-700 font-mono">
        Today
      </span>
    );
  if (n > 0 && n <= 3)
    return (
      <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 font-mono">
        +{n}d
      </span>
    );
  if (n > 0)
    return (
      <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 font-mono">
        {n}d
      </span>
    );
  return null;
}

/** Category badge */
function CatBadge({ cat }: { cat: string }) {
  return (
    <span
      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${catStyle(cat)}`}
    >
      {cat}
    </span>
  );
}

/** Upcoming event list item - ANIMATED */
function UpcomingItem({
  ev,
  onClick,
}: {
  ev: EventFormData;
  onClick: () => void;
}) {
  return (
    <motion.li
      layout // Smoothly animates position changes when filtering
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="flex items-start gap-2.5 py-2.5 border-b border-gray-100 last:border-none cursor-pointer hover:bg-gray-50 rounded-lg px-1 transition-colors group"
    >
      <div
        className="w-1 rounded-full self-stretch min-h-9 shrink-0 transition-colors"
        style={{ background: catColor(ev.category) }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
          {ev.event_title}
        </p>
        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
          <span className="text-xs text-gray-400">📅 {fmtDate(ev.date)}</span>
          {ev.time && (
            <span className="text-xs text-gray-400">🕐 {ev.time}</span>
          )}
          {ev.location && (
            <span className="text-xs text-gray-400 truncate max-w-25">
              📍 {ev.location}
            </span>
          )}
          <CatBadge cat={ev.category} />
        </div>
      </div>
      <DaysChip date={ev.date} />
    </motion.li>
  );
}

/** Stat card */
function StatCard({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm text-center">
      <div className={`text-2xl font-bold tracking-tight ${color}`}>
        {value}
      </div>
      <div className="text-[10px] text-gray-400 font-semibold mt-0.5 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export const Events = () => {
  const [eventDatas, setEventDatas] = useState<EventFormData[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [searchQ, setSearchQ] = useState("");
  const [filterCat, setFilterCat] = useState("All");

  const initialForm: EventFormData = {
    event_id: "",
    category: "",
    event_title: "",
    date: "",
    time: null,
    location: "",
    organizer: "",
    description: "",
    plan: { plan_type: "", details: "" },
  };
  const [formData, setFormData] = useState<EventFormData>(initialForm);

  /* ── API ── */
  const fetchEvents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setEventDatas(data);
    } catch (e) {
      console.error("Error fetching events:", e);
    }
  };
  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSave = async () => {
    const newEvent = {
      ...formData,
      event_id: formData.event_id || crypto.randomUUID(),
    };
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });
      if (res.ok) {
        await fetchEvents();
        setShowAdd(false);
        setFormData(initialForm);
      }
    } catch (e) {
      console.error("Failed to save event:", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchEvents();
      } else {
        console.error("Delete failed");
      }
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.dateStr);
    setShowAdd(false);
  };

  /* ── Derived data ── */
  const upcoming = eventDatas
    .filter((e) => e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date));

  const past = eventDatas.filter((e) => e.date < todayStr);
  const todayEvents = eventDatas.filter((e) => e.date === todayStr);

  const allCats = [
    "All",
    ...Array.from(new Set(eventDatas.map((e) => e.category))),
  ];

  const filteredUpcoming = upcoming.filter((e) => {
    const matchCat = filterCat === "All" || e.category === filterCat;
    const matchQ =
      !searchQ ||
      e.event_title.toLowerCase().includes(searchQ.toLowerCase()) ||
      (e.organizer ?? "").toLowerCase().includes(searchQ.toLowerCase()) ||
      (e.location ?? "").toLowerCase().includes(searchQ.toLowerCase());
    return matchCat && matchQ;
  });

  const dateEvents = selectedDate
    ? eventDatas.filter((e) => e.date === selectedDate)
    : [];

  /* ── Render ── */
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Page header */}
      <div className="max-w-7xl mx-auto mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Event Schedules
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={() => {
            setShowAdd(true);
            setSelectedDate(null);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
            <path
              d="M8 2v12M2 8h12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          New Event
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5">
        {/* ══ LEFT SIDEBAR ══ */}
        <aside className="flex flex-col gap-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              value={eventDatas.length}
              label="Total"
              color="text-gray-800"
            />
            <StatCard
              value={upcoming.length}
              label="Upcoming"
              color="text-blue-600"
            />
            <StatCard
              value={past.length}
              label="Done"
              color="text-emerald-600"
            />
          </div>

          {/* Today banner */}
          <AnimatePresence>
            {todayEvents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-blue-600 rounded-2xl p-4 text-white shadow-md"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">
                  Today
                </p>
                <div className="flex flex-col gap-2">
                  {todayEvents.map((ev) => (
                    <div key={ev.event_id} className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full shrink-0 ring-2 ring-white/30"
                        style={{ background: catColor(ev.category) }}
                      />
                      <span className="text-sm font-semibold truncate">
                        {ev.event_title}
                      </span>
                      {ev.time && (
                        <span className="ml-auto text-xs opacity-60 shrink-0">
                          {ev.time}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upcoming events panel */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col max-h-150">
            {/* Panel header */}
            <div className="px-4 pt-4 pb-3 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-gray-800">
                  Upcoming Events
                </h2>
                <motion.span
                  key={filteredUpcoming.length}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-xs font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full"
                >
                  {filteredUpcoming.length}
                </motion.span>
              </div>

              {/* Search */}
              <div className="relative mb-2.5">
                <svg
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <circle
                    cx="7"
                    cy="7"
                    r="5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M11 11l3 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search events…"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-gray-50 placeholder-gray-400 transition"
                />
              </div>

              {/* Category filter chips */}
              <div className="flex flex-wrap gap-1.5">
                {allCats.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCat(cat)}
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                      filterCat === cat
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="px-3 py-1 overflow-y-auto flex-1">
              {filteredUpcoming.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="text-3xl mb-2">📅</div>
                  <p className="text-xs text-gray-400">No upcoming events</p>
                </motion.div>
              ) : (
                <motion.ul layout className="space-y-1">
                  <AnimatePresence mode="popLayout">
                    {filteredUpcoming.map((ev) => (
                      <UpcomingItem
                        key={ev.event_id}
                        ev={ev}
                        onClick={() => setSelectedDate(ev.date)}
                      />
                    ))}
                  </AnimatePresence>
                </motion.ul>
              )}
            </div>
          </div>
        </aside>

        {/* ══ CALENDAR ══ */}
        <div className="bg-white  rounded-2xl border border-gray-100 shadow-sm p-5">
          <CalendarView
            events={eventDatas.map((ev) => ({
              title: ev.event_title,
              start: ev.time ? `${ev.date}T${ev.time}` : ev.date,
              backgroundColor: catColor(ev.category),
              borderColor: catColor(ev.category),
            }))}
            handleDateClick={handleDateClick}
          />
        </div>
      </div>

      {/* ══ ADD EVENT MODAL ══ */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowAdd(false);
                setFormData(initialForm);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Add New Event
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Fill in the event details below
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAdd(false);
                    setFormData(initialForm);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-500 text-sm transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="px-5 py-4 max-h-[65vh] overflow-y-auto space-y-4">
                {/* Form Inputs remain the same as your code */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="event_title"
                    placeholder="Enter event title"
                    value={formData.event_title}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition placeholder-gray-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time ?? ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition bg-white"
                  >
                    <option value="">Select category</option>
                    {EVENT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="Venue or meeting link"
                    value={formData.location ?? ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Organizer
                  </label>
                  <input
                    type="text"
                    name="organizer"
                    placeholder="Your name"
                    value={formData.organizer ?? ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Event details, agenda, notes…"
                    value={formData.description ?? ""}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition resize-none placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => {
                    setShowAdd(false);
                    setFormData(initialForm);
                  }}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={
                    !formData.event_title ||
                    !formData.date ||
                    !formData.category
                  }
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Save Event
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ DATE CLICK MODAL ══ */}
      <AnimatePresence>
        {selectedDate && !showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedDate(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {fmtDate(selectedDate)}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {dateEvents.length} event
                    {dateEvents.length !== 1 ? "s" : ""} scheduled
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-500 text-sm transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Events list */}
              <div className="px-5 py-3 max-h-[55vh] overflow-y-auto">
                {dateEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-3xl mb-2">📭</div>
                    <p className="text-sm text-gray-400">
                      No events on this day
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5 py-2">
                    <AnimatePresence>
                      {dateEvents.map((ev) => (
                        <motion.div
                          key={ev.event_id}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group"
                        >
                          <div
                            className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                            style={{ background: catColor(ev.category) }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">
                              {ev.event_title}
                            </p>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {ev.time && (
                                <span className="text-xs text-gray-400">
                                  🕐 {ev.time}
                                </span>
                              )}
                              {ev.location && (
                                <span className="text-xs text-gray-400 truncate m">
                                  📍 {ev.location}
                                </span>
                              )}
                              {ev.organizer && (
                                <span className="text-xs text-gray-400">
                                  👤 {ev.organizer}
                                </span>
                              )}
                              <CatBadge cat={ev.category} />
                            </div>
                            {ev.description && (
                              <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">
                                {ev.description}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              if (typeof ev.event_id === "string") {
                                handleDelete(ev.event_id);
                              }
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-red-400 hover:text-red-600 font-medium shrink-0"
                          >
                            Delete
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center px-5 py-4 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => {
                    setShowAdd(true);
                    setFormData((p) => ({ ...p, date: selectedDate }));
                    setSelectedDate(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all hover:shadow-md"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
                    <path
                      d="M7 1v12M1 7h12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Add Event
                </button>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
