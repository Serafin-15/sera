import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2>Not logged In</h2>
          <p> Please login to view profile</p>
        </div>
      </div>
    );
  }
  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <span>{user.username?.charAt(0).toUpperCase()}</span>
          </div>
          <h1> Welcome to Sera, {user.username} !</h1>
        </div>
        <div className="profile-info">
          <div className="info-item">
            <label>Role: </label>
            <span className="role-badge">{user.role}</span>
          </div>
          <div className="info-item">
            <label>User Id: </label>
            <span>{user.id}</span>
          </div>
          {user.createdAt && (
            <div className="info-item">
              <label>created: </label>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        <div className="profile-actions">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
