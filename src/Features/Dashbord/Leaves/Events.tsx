import { useEffect, useState } from "react";
import CalendarView from "../../../Components/Common/Calander/CalendarView";
import { Plus, Calendar as CalIcon, Gift, Coffee, User } from "lucide-react";

const API_URL = "http://localhost:3001/Events";

export const Events = () => {
  const [eventDatas, setEventDatas] = useState<EventFormData[]>([]);

  const fetchEvents = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      setEventDatas(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleDateClick = (arg: any) => console.log(arg.dateStr);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100-h-14)] bg-[#f8f9fa] overflow-hidden">
      
      {/* Left Sidebar: Google Workspace Style */}
      <aside className="lg:w-72 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
        
        {/* Create Button Section */}
        <div className="p-5">
          <button 
            onClick={() => alert("Add Event")}
            className="flex items-center gap-3 px-5 py-3 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all text-sm font-medium text-gray-700 group"
          >
            <Plus size={24} className="text-blue-600 group-hover:rotate-90 transition-transform" />
            <span>Create Event</span>
          </button>
        </div>

        {/* Event Navigation / Categories */}
        <div className="px-4 space-y-6 pb-10">
          
          {/* Section: Upcoming */}
          <div>
            <h3 className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Upcoming</h3>
            <div className="space-y-1">
              {eventDatas.slice(0, 2).map((evt, idx) => (
                <div key={idx} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">{evt.event_title}</p>
                    <p className="text-[10px] text-gray-400">{evt.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: My Calendars (Toggles) */}
          <div>
            <h3 className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Calendars</h3>
            <div className="space-y-1">
              <CalendarToggle label="Company Holidays" color="bg-emerald-400" icon={Coffee} />
              <CalendarToggle label="Team Events" color="bg-blue-400" icon={CalIcon} />
              <CalendarToggle label="Celebrations" color="bg-purple-400" icon={Gift} />
              <CalendarToggle label="Personal" color="bg-pink-400" icon={User} />
            </div>
          </div>

          {/* Section: Mini Info Card */}
          <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
            <p className="text-[11px] text-blue-600 font-bold uppercase mb-1">Notice</p>
            <p className="text-xs text-blue-700 leading-relaxed">
              Company-wide holiday on 15th August for Independence Day.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Calendar View */}
      <main className="flex-1 bg-white p-4">
        <div className="h-full border border-gray-100 rounded-xl shadow-sm overflow-hidden bg-white">
          <CalendarView
            events={eventDatas.map((event) => ({
              title: event.event_title,
              start: event.time ? `${event.date}T${event.time}` : event.date,
              backgroundColor: event.category === "holidays" ? "#10b981" : "#3b82f6",
              borderColor: 'transparent'
            }))}
            handleDateClick={handleDateClick}
            EventColor="#3b82f6"
          />
        </div>
      </main>
    </div>
  );
};

// Sub-component for clean toggles
const CalendarToggle = ({ label, color, icon: Icon }: any) => (
  <label className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
    <div className="flex items-center gap-3">
      <div className={`p-1.5 rounded-md ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
        <Icon size={14} />
      </div>
      <span className="text-xs font-medium text-gray-600">{label}</span>
    </div>
    <input type="checkbox" defaultChecked className="w-3 h-3 rounded text-blue-600 border-gray-300 focus:ring-0 focus:ring-offset-0" />
  </label>
);