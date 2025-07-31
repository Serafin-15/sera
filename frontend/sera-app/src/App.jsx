import { useState } from "react";
import "./css/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import Login from "./components/Login";
import EventList from "./components/EventList";
import Calendar from "./components/Calendar";
import Profile from "./components/Profile";
import Carpool from "./components/Carpool";
import CarpoolSelection from "./components/CarpoolSelection";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <header className="banner">
            <div className="link-container">
              <Link to={`/calendar`}>Calendar Page</Link>
              <Link to={`/events`}>Eventlist Page</Link>
              <Link to={`/profile`}>Profile Page</Link>
              <Link to={`/carpool`}>Carpool Page</Link>
              <Link to={`/`}>Return to Login</Link>
            </div>
          </header>
          <Routes>
            <Route path="/" element={<Login />}></Route>
            <Route path="/events" element={<EventList />}></Route>
            <Route path="/calendar" element={<Calendar />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/carpool" element={<CarpoolSelection />}></Route>
            <Route path="/carpool/:eventId" element={<Carpool />}></Route>
          </Routes>
          <footer>Sera for a better future</footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
