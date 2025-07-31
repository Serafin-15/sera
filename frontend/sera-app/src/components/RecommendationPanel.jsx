import React, { useState, useEffect } from "react";
import { getRecommendedEvents } from "../api/api";
import { useAuth } from "../context/AuthContext";
import "../css/RecommendationPanel.css";

export default function RecommendationsPanel({
  onEventSelect,
  isVisible,
  onToggle,
}) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.id) {
      loadRecommendations();
    }
  }, [user]);

  const loadRecommendations = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);

    try {
      const recommendedEvents = await getRecommendedEvents(user.id, parent.id);
      setRecommendations(recommendedEvents);
    } catch (err) {
      setError("Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (event) => {
    if (onEventSelect) {
      onEventSelect(event);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "high-score";
    if (score >= 60) return "medium-score";
    return "low-score";
  };

  if (!isVisible) return null;

  return (
    <div className="recommendations-panel">
      <div className="recommendations-header">
        <h3>Recommended Events</h3>
        <button className="close-btn" onClick={onToggle}>
          x
        </button>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading Recommendations...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={loadRecommendations} className="retry-btn">
            Try again
          </button>
        </div>
      )}

      {!loading && !error && recommendations.length > 0 && (
        <div className="recommendations-list">
          {recommendations.map((event) => (
            <div
              key={event.id}
              className="recommendation-item"
              onClick={() => handleEventClick(event)}
            >
              <div className="recommendation-header">
                <h4 className="event-title">{event.title}</h4>
                {event.scores && (
                  <span
                    className={`score-badge ${getScoreColor(
                      event.scores.total
                    )}`}
                  >
                    {Math.round(event.scores.total)}%
                  </span>
                )}
              </div>
              <div className="event-details">
                <p className="event-description">{event.description}</p>
                <div className="event-meta">
                  <span className="event-time">
                    📅 {formatEventTime(event.start_date)}
                  </span>
                  <span className="event-location">📍 {event.location}</span>
                </div>
              </div>

              {event.scores && (
                <div className="score-breakdown">
                  <div className="score-item">
                    <span className="score-label">Availability:</span>
                    <span className="score-value">
                      {Math.round(event.score.availability)}%
                    </span>
                  </div>
                  <div className="score-item">
                    <span className="score-label">Distance:</span>
                    <span className="score-value">
                      {Math.round(event.score.distance)}%
                    </span>
                  </div>
                  <div className="score-item">
                    <span className="score-label">Interest:</span>
                    <span className="score-value">
                      {Math.round(event.score.interest)}%
                    </span>
                  </div>
                </div>
              )}
              <button className="add-to-calendar">Add to Calendar</button>
            </div>
          ))}
        </div>
      )}
      <div className="recommendations-footer">
        <button onClick={loadRecommendations} className="refresh-btn">
          Refresh Recommendations
        </button>
      </div>
    </div>
  );
}
