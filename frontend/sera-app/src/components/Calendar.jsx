import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import Tooltip from "./Tooltip";
import "../css/Calendar.css";

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    start: new Date(),
    end: new Date(new Date().getTime() + 60 * 60 * 1000),
    allDay: false,
  });
  const formatDateInput = (date) => {
    if (!date || isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    const savedEvents = localStorage.getItem("calendarEvents");
    if (savedEvents) {
      setEvents(
        JSON.parse(savedEvents).map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }))
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const handleDateSelect = (selectInfo) => {
    setEventForm({
      title: "",
      description: "",
      start: selectInfo.start,
      end: selectInfo.end,
      allDay: false,
    });
    setSelectedEvent(null);
    setShowEventModal(true);
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setEventForm({
      title: clickInfo.title,
      description: clickInfo.description || "",
      start: clickInfo.start,
      end: clickInfo.end,
      allDay: clickInfo.allDay,
    });
    setShowEventModal(true);
  };

  const handleSaveEvent = () => {
    if (!eventForm.title.trim()) {
      alert("Please enter an event title");
      return;
    }

    const newEvent = {
      id: selectedEvent ? selectedEvent.id : Date.now().toString(),
      title: eventForm.title,
      description: eventForm.description,
      start: eventForm.start,
      end: eventForm.end,
      allDay: eventForm.allDay,
    };

    if (selectedEvent) {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id ? newEvent : event
        )
      );
    } else {
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }

    resetForm();
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== selectedEvent.id)
      );
      resetForm();
    }
  };
  const handleCancel = () => {
    resetForm();
  };

  const resetForm = () => {
    setSelectedEvent(null);
    setShowEventModal(false);
    setEventForm({
      title: "",
      description: "",
      start: new Date(),
      end: new Date(new Date().getTime() + 60 * 60 * 1000),
    });
  };

  const clearAllEvents = () => {
    if (window.confirm("Are you sure you want to clear all events?")) {
      setEvents([]);
    }
  };
  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h1> Event Scheduler</h1>
        <p>
          Click on a time slot to add an event, or click on an exisiting event
          to edit
        </p>

        <div className="calendar-actions">
          <button className="btn-danger" onClick={clearAllEvents}>
            Clear All Events
          </button>
          <Tooltip />
        </div>
      </div>

      <div className="calendar-wrapper">
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            listPlugin,
          ]}
          headerToolbar={{
            left: "prev, next, today",
            center: "title",
            right: "dayGridMonth, timeGridWeek, timeGridDay, listWeek",
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={events}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={(arg) => (
            <div className="event-content">
              <div className="event-title">{arg.event.title}</div>
              {arg.event.extendedProps.description && (
                <div className="event-description">
                  {arg.event.extendedProps.description}
                </div>
              )}
            </div>
          )}
        />
      </div>

      {showEventModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{selectedEvent ? "Edit Event" : "Add New Event"}</h2>

            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={eventForm.title || ""}
                onChange={(e) =>
                  setEventForm({ ...eventForm, title: e.target.value })
                }
                placeholder="Enter event title"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                value={eventForm.description}
                onChange={(e) =>
                  setEventForm({ ...eventForm, description: e.target.value })
                }
                placeholder="Enter event description"
                rows="3"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date & Time</label>
                <input
                  type="datetime-local"
                  value={eventForm.start ? formatDateInput(eventForm.start) : ""}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    if(!isNaN(newDate.getTime())){
                      setEventForm({
                      ...eventForm,
                      start: newDate,
                    });
                    }
                  }}
                />
              </div>
              <div className="form-group">
                <label>End Date & Time</label>
                <input
                  type="datetime-local"
                  value={eventForm.end ? formatDateInput(eventForm.end) : ""}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    if(!isNaN(newDate.getTime())){
                      setEventForm({
                      ...eventForm,
                      end: newDate,
                    });
                    }
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={eventForm.allDay}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, allDay: e.target.checked })
                  }
                />
                All Day Event
              </label>
            </div>
            <div className="modal-actions">
              <button className="btn-primary" onClick={handleSaveEvent}>
                {selectedEvent ? "Update Event" : "Add Event"}
              </button>
              {selectedEvent && (
                <button className="btn-danger" onClick={handleDeleteEvent}>
                  Delete
                </button>
              )}
              <button className="btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
