import React from "react";
import { Link } from "react-router-dom";
export default function EventList() {
  return (
    <div className="event-container">
      <h1 className="title">Events</h1>
      <div className="event-board">
        <div className="event-card">
          <h2>Event header</h2>
          <img
            className="event-image"
            src={"./public/logo.jpg"}
            alt="holder"
          ></img>
          <button className="detail">
            details
          </button>
        </div>
      </div>
    </div>
  );
}
