import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEvents } from '../api/api';
import '../css/CarpoolSelection.css';

const CarpoolSelection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const events = await getAllEvents();
        setEvents(events);
      } catch (err) {
        setError('Failed to load events.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventSelect = (eventId) => {
    navigate(`/carpool/${eventId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="carpool-selection-container">
        <div className="loading">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="carpool-selection-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="carpool-selection-container">
      <h1>🚗 Carpool Options</h1>
      <p className="selection-description">
        Select an event to view available carpool routes and find the best ride-sharing options.
      </p>

      {events.length === 0 ? (
        <div className="no-events">
          <p>No events available for carpooling.</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div 
              key={event.id} 
              className="event-card"
              onClick={() => handleEventSelect(event.id)}
            >
              <div className="event-header">
                <h3>{event.title}</h3>
                <span className="event-date">{formatDate(event.start_date)}</span>
              </div>
              
              <div className="event-details">
                <p className="event-description">
                  {event.description || 'No description available'}
                </p>
                
                {event.location && (
                  <div className="event-location">
                    📍 Location: {event.location}
                  </div>
                )}
                
                {event.category && (
                  <div className="event-category">
                    Category: {event.category}
                  </div>
                )}

                <div className="event-stats">
                  <span>Attendees: {event.num_attending}</span>
                  {event.capacity && (
                    <span>Capacity: {event.capacity}</span>
                  )}
                </div>
              </div>
              
              <div className="event-action">
                <button className="view-carpool-btn">
                  View Carpool Options →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarpoolSelection; 