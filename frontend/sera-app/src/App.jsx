import { useState } from "react";
import "./css/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import Login from "./components/Login";
import EventList from "./components/EventList";
import Calendar from "./components/Calendar";
import Profile from "./components/Profile";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="banner">
          <div className="link-container">
            <EventList></EventList>
            <Calendar></Calendar>
            <Profile></Profile>
          </div>
          {/* <Routes>
            <Route path="/events" element={<EventList />}></Route>
            <Route path="/calendar" element={<Calendar />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
          </Routes> */}
        </header>
        <Routes>
          <Route path="/" element={<Login />}></Route>
        </Routes>
        <footer>Serafin for a better future</footer>
      </div>
    </Router>
  );
}

export default App;
