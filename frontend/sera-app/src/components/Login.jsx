import React from "react";

export default function Login() {
  return (
    <div className="login-container">
      <h1>WELCOME TO SERA!</h1>
      <form className="container">
        <label htmlFor="username">Please log in or Create a new User:</label>
        <input id = "username" placeholder="Type username" />
        <input placeholder="Type password" />
        <label htmlFor="role">Select a role: </label>
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
