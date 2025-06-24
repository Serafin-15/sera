import React from "react";

export default function Login() {
  return (
    <div className="login-container">
      <h1>WELCOME TO SERA!</h1>
      <h3>Please log in or Create a new User</h3>
      <form className="container">
        <input placeholder="Type username" />
        <input placeholder="Type password" />
        <h3>Please select a Role below</h3>
        <select id="role" name="role">
          <option value="parent">Parent</option>
          <option value="student">Student</option>
          <option value="organize">Organizer</option>
        </select>
        <button name="register">Register</button>
        <button name="login">Login</button>
        <button name="logout">Logout</button>
      </form>
    </div>
  );
}
