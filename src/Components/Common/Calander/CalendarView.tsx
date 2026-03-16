import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./calendar.css"; // We will create this file below

export type CalendarEvent = {
  title: string;
  start: string;
  
  end?: string;
  className?: string; // Allow custom classes for specific events
};

type CalendarViewProps = {
  events: CalendarEvent[];
  handleDateClick: (arg: any) => void;
  handleEventClick?: (arg: any) => void;
  EventColor?: string;
};

const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  handleDateClick,
  handleEventClick,
  EventColor
}) => {
  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek",
        }}
        
        // Modern UI tweaks
        dayMaxEvents={2}
        height="600px"
        fixedWeekCount={false}
        nowIndicator={true}
        eventColor={EventColor} // Use event-specific colors
        
        // Customizing the event display
        eventClassNames="custom-event-card"
        slotLabelFormat={{
          hour: 'numeric',
          minute: '2-digit',
          omitZeroMinute: true,
          meridiem: 'short'
        }}
      />
    </div>
  );
};

export default CalendarView;