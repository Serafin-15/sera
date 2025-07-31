import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  getCarpoolRoutes, 
  getOptimalCarpoolRoute, 
  getCarpoolParticipants,
  canViewCarpoolParticipants,
} from '../api/api';
import '../css/Carpool.css';

const Carpool = () => {
  const { eventId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [optimalRoute, setOptimalRoute] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [canView, setCanView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    const fetchCarpoolData = async () => {
      if (!user) {
        setError('Please log in to view carpool options');
        setLoading(false);
        return;
      }
      
      if (!eventId) {
        setError('No event ID provided');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        const viewPermission = await canViewCarpoolParticipants(eventId);
        setCanView(viewPermission);
        
        if (viewPermission) {
          const participantsData = await getCarpoolParticipants(eventId);
          setParticipants(participantsData.participants || []);
        }
        
        const routesData = await getCarpoolRoutes(eventId, user.id);
        setRoutes(routesData);
        
        const optimalData = await getOptimalCarpoolRoute(eventId, user.id);
        setOptimalRoute(optimalData);
        
        if (routesData.length > 0) {
          setSelectedRoute(routesData[0]);
        }
        
      } catch (err) {
          setError('Failed to load carpool information. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCarpoolData();
  }, [eventId, user]);

  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50'; 
    if (score >= 60) return '#FF9800'; 
    return '#F44336';
  };

  const formatDistance = (distance) => {
    if (distance === Infinity || distance === null || distance === undefined) return 'N/A';
    return `${distance.toFixed(1)} km`;
  };

  const formatDuration = (duration) => {
    if (duration === Infinity || duration === null || duration === undefined) return 'N/A';
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  if (loading) {
    return (
      <div className="carpool-container">
        <div className="loading">Loading carpool information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="carpool-container">
        <div className="carpool-header">
          <button 
            className="back-button"
            onClick={() => navigate('/carpool')}
          >
            ← Back to Events
          </button>
          <h1>Carpool Options</h1>
        </div>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="carpool-container">
      <div className="carpool-header">
        <button 
          className="back-button"
          onClick={() => navigate('/carpool')}
        >
          ← Back to Events
        </button>
        <h1>Carpool Options</h1>
      </div>
      
      {!canView && (
        <div className="permission-warning">
          <p>You don't have permission to view carpool participants for this event.</p>
        </div>
      )}

      {optimalRoute && (
        <div className="optimal-route-section">
          <h2> Recommended Route</h2>
          <div className="route-card optimal">
            <div className="route-header">
              <h3>Best Option</h3>
              <div 
                className="total-score"
                style={{ backgroundColor: getScoreColor(optimalRoute.score.totalScore) }}
              >
                {optimalRoute.score.totalScore}
              </div>
            </div>
            
            <div className="route-details">
              <div className="driver-info">
                <strong>Driver:</strong> {optimalRoute.driver.username}
              </div>
              
              <div className="passengers-info">
                <strong>Passengers:</strong> {optimalRoute.passengers.length}
                <ul>
                  {optimalRoute.passengers.map((passenger, index) => (
                    <li key={index}>{passenger.username}</li>
                  ))}
                </ul>
              </div>
              
              <div className="route-metrics">
                <div className="metric">
                  <span>Distance:</span> {formatDistance(optimalRoute.route.distance)}
                </div>
                <div className="metric">
                  <span>Duration:</span> {formatDuration(optimalRoute.route.duration)}
                </div>
              </div>
              
              <div className="score-breakdown">
                <h4>Score Breakdown:</h4>
                <div className="score-item">
                  <span>Distance Score:</span>
                  <div className="score-bar">
                    <div 
                      className="score-fill"
                      style={{ 
                        width: `${optimalRoute.score.distanceScore}%`,
                        backgroundColor: getScoreColor(optimalRoute.score.distanceScore)
                      }}
                    ></div>
                    <span>{optimalRoute.score.distanceScore} ({getScoreLabel(optimalRoute.score.distanceScore)})</span>
                  </div>
                </div>
                <div className="score-item">
                  <span>Duration Score:</span>
                  <div className="score-bar">
                    <div 
                      className="score-fill"
                      style={{ 
                        width: `${optimalRoute.score.durationScore}%`,
                        backgroundColor: getScoreColor(optimalRoute.score.durationScore)
                      }}
                    ></div>
                    <span>{optimalRoute.score.durationScore} ({getScoreLabel(optimalRoute.score.durationScore)})</span>
                  </div>
                </div>
                <div className="score-item">
                  <span>Passenger Score:</span>
                  <div className="score-bar">
                    <div 
                      className="score-fill"
                      style={{ 
                        width: `${optimalRoute.score.passengerScore}%`,
                        backgroundColor: getScoreColor(optimalRoute.score.passengerScore)
                      }}
                    ></div>
                    <span>{optimalRoute.score.passengerScore} ({getScoreLabel(optimalRoute.score.passengerScore)})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {routes.length > 0 && (
        <div className="all-routes-section">
          <h2>All Available Routes</h2>
          <div className="routes-grid">
            {routes.map((route, index) => (
              <div 
                key={index} 
                className={`route-card ${selectedRoute === route ? 'selected' : ''}`}
                onClick={() => setSelectedRoute(route)}
              >
                <div className="route-header">
                  <h3>Option {index + 1}</h3>
                  <div 
                    className="total-score"
                    style={{ backgroundColor: getScoreColor(route.score.totalScore) }}
                  >
                    {route.score.totalScore}
                  </div>
                </div>
                
                <div className="route-details">
                  <div className="driver-info">
                    Driver: {route.driver.username}
                  </div>
                  
                  <div className="passengers-info">
                    Passengers: {route.passengers.length}
                  </div>
                  
                  <div className="route-metrics">
                    <div className="metric">
                      <span>Distance:</span> {formatDistance(route.route.distance)}
                    </div>
                    <div className="metric">
                      <span>Duration:</span> {formatDuration(route.route.duration)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {canView && participants.length > 0 && (
        <div className="participants-section">
          <h2>Event Participants</h2>
          <div className="participants-grid">
            {participants.map((participant, index) => (
              <div key={index} className="participant-card">
                <div className="participant-info">
                  {participant.username}
                  <span className="participant-role">
                    {participant.role === 'driver' ? '🚗 Driver' : '👤 Passenger'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {routes.length === 0 && !loading && (
        <div className="no-routes">
          <p>No carpool routes available for this event.</p>
        </div>
      )}
    </div>
  );
};

export default Carpool; 