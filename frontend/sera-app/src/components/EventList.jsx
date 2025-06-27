import React, { useState } from "react";
export default function EventList() {
  const [events] = useState([
    {
      id: 1,
      title: "Summer Music Festival",
      description:
        "Join us for a fun-filled evening of music, food, and drinks at our annual Summer Music Festival.",
      date: "2023-07-15",
      time: "18:00",
      location: "City Park, New York",
      image: "https://example.com/event-image.jpg",
      category: "Music",
    },
    {
      id: 2,
      title: "Art Exhibition",
      description:
        "Explore the latest works from local artists at our Art Exhibition.",
      date: "2023-08-01",
      time: "10:00",
      location: "Art Gallery, Los Angeles",
      image: "https://example.com/art-exhibition.jpg",
      category: "Art",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ["All", ...new Set(events.map((event) => event.category))];

  const filteredEvents = events.filter((event) => {
    const matchSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory =
      selectedCategory === "All" || event.category === selectedCategory;

    return matchCategory && matchSearch;
  });

  const openModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleModalClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeModal();
    }
  };

  return (
    <div className="event-container">
      <div className="event-header">
        <h1 className="event-title">Events</h1>
        <p className="event-subtitle">
          Discover and attend exciting school events
        </p>
      </div>
      <div className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for events by name, description, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          ></input>
          <div className="search-icon">🔎</div>
        </div>

        <div className="filter-container">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="event-board">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-image-container">
                <img
                  className="event-image"
                  src={event.image}
                  alt={event.title}
                  onError={(e) => {
                    e.target.src = "../public/logo.jpg";
                  }}
                />
                <div className="event-category">{event.category}</div>
              </div>

              <div className="event-content">
                <h2 className="event-card-title">{event.title}</h2>

                <div className="event-actions">
                  <button
                    className="detail-btn"
                    onClick={() => openModal(event)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-event">
            <p>No events found mathc your search criteria!</p>
            <button
              className="clear-search-btn"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {isModalOpen && selectedEvent && (
        <div className="modal-overlay" onClick={handleModalClick}>
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>
              X
            </button>

            <div className="modal-image-container">
              <img
                className="modal-image"
                src={selectedEvent.image}
                alt={selectedEvent.title}
                onError={(e) => {
                  e.target.src = "../public/logo.jpg";
                }}
              />

              <div className="modal-category">{selectedEvent.category}</div>
            </div>
            <div className="modal-body">
              <h2 className="modal-title">{selectedEvent.title}</h2>
              <p className="modal-description">{selectedEvent.description}</p>

              <div className="modal-details">
                <h3>📅 Date: {selectedEvent.date}</h3>
                <h3>📍 Location: {selectedEvent.location}</h3>
                <h3>⏰ Time: {selectedEvent.time}</h3>
              </div>

              <div className="modal-actions">
                <button className="register-btn">Register for event</button>
                <button className="modal-cancel-btn" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
