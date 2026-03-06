import { useEffect, useState } from "react";
import CalendarView from "../../../Components/Common/Calander/CalendarView.tsx";
import { Button } from "../../../Components/Common/Button.tsx";
import { FormFiled } from "../../../Components/Common/FormFiled.tsx";
import { Selection } from "../../../Components/Common/Selection.tsx";
import { CustomDatePicker } from "../../../Components/Common/CustomDatePicker.tsx";

export interface EventFormData {
  event_id: string;
  category: string;
  event_title: string;
  date: string;
  time: string | null;
  plan: {
    plan_type: string;
    details: string;
  };
  description: string;
}

const API_URL = "http://localhost:3001/Events";

export const Events = () => {
  const [EventDatas, setEventDatas] = useState<EventFormData[]>([]);
  const [ShowEdit, setShowEdit] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventFormData | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>("");

  const initialFormState: EventFormData = {
    event_id: "",
    category: "",
    event_title: "",
    date: "",
    time: null,
    plan: { plan_type: "", details: "" },
    description: "",
  };

  const [formData, setformData] = useState<EventFormData>(initialFormState);

  // 1. Fetch Events from JSON Server
  const fetchEvents = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setEventDatas(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // 2. Handle Save Logic
  const handleSave = async () => {
    // Generate a unique ID if it doesn't exist
    const newEvent = {
      ...formData,
      event_id: formData.event_id || crypto.randomUUID(),
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        await fetchEvents(); // Refresh calendar data
        setShowEdit(false); // Close popup
        setformData(initialFormState); // Reset form
      }
    } catch (error) {
      console.error("Failed to save event:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setformData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleDateClick = (arg: any) => {
  const clickedDate = arg.dateStr;

  setSelectedDate(clickedDate);

  const eventsOnDate = EventDatas.filter(
    (event) => event.date === clickedDate
  );

  if (eventsOnDate.length > 0) {
    setSelectedEvent(eventsOnDate[0]); // show first event
  } else {
    setSelectedEvent(null);
  }

  setShowEdit(false);
};

  const getEventColor = (category: string) => {
    switch (category) {
      case "holidays": return "#34D399";
      case "Festival": return "#F59E0B";
      case "birthday": return "#EC4899";
      case "meeting":  return "#6366F1";
      case "Party":    return "#9e1fda";
      default:         return "#60A5FA";
    }
  };

  const Event_option = [
    { label: "Festival", value: "Festival" },
    { label: "Birthday", value: "birthday" },
    { label: "Meeting", value: "meeting" },
    { label: "Party", value: "Party" },
    { label: "Holiday", value: "holidays" },
    { label: "Others", value: "Others" },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto">
      {/* Left Sidebar */}
      <div className="lg:w-1/3 space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Event Schedules</h1>
          <Button ClickToAction={() => setShowEdit(true)} B_name="Add Event" />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Upcoming Events</h2>
          <ul className="text-sm text-gray-600">
            {EventDatas.slice(0, 5).map(ev => <li key={ev.event_id} className="mb-1">• {ev.event_title}</li>)}
          </ul>
        </div>
      </div>

      {/* Calendar */}
      <div className="lg:w-2/3 bg-white rounded-lg shadow-sm p-4">
        <CalendarView
          events={EventDatas.map((event) => ({
            title: event.event_title,
            start: event.time ? `${event.date}T${event.time}` : event.date,
            backgroundColor: getEventColor(event.category),
          }))}
          handleDateClick={handleDateClick}
          EventColor="#88aeeb"
        />
      </div>

      {/* Popup Form */}
      {ShowEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Add Event</h3>
            
            <FormFiled
              Lable="Title Name"
              name="event_title"
              in_PlaceHolder="Enter Event Title"
              value={formData.event_title}
              onChange={handleChange}
            />

            <CustomDatePicker
              Lable="Event Date"
              name="date"
              value={formData.date}
              onChange={(e: any) => setformData(p => ({ ...p, date: e.target.value }))}
            />

            <Selection
              label="Select Event"
              name="category"
              value={formData.category}
              options={Event_option}
              placeholder="Choose event type"
              onChange={(e: any) => setformData(prev => ({ ...prev, category: e.target.value }))}
            />

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => { setShowEdit(false); setformData(initialFormState); }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.event_title || !formData.date}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                Save Event
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedDate && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">

      <h3 className="text-lg font-semibold mb-4">
        Events on {selectedDate}
      </h3>

      {EventDatas.filter(ev => ev.date === selectedDate).length > 0 ? (

        <ul className="space-y-2">
          {EventDatas
            .filter(ev => ev.date === selectedDate)
            .map(ev => (
              <li
                key={ev.event_id}
                className="p-3 border rounded-lg"
              >
                <p className="font-semibold">{ev.event_title}</p>
                <p className="text-sm text-gray-500">{ev.category}</p>
              </li>
            ))}
        </ul>

      ) : (

        <p className="text-gray-500 text-sm">
          No events for this date
        </p>

      )}

      <div className="flex justify-between mt-6">

        <button
          onClick={() => {
            setSelectedDate(null);
            setShowEdit(true);
            setformData(p => ({ ...p, date: selectedDate }));
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Add Event
        </button>

        <button
          onClick={() => setSelectedDate(null)}
          className="px-4 py-2 bg-gray-200 rounded-lg"
        >
          Close
        </button>

      </div>

    </div>
  </div>
)}

    </div>
  );
};
