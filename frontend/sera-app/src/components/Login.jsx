import React from "react";

export default function Login() {
  return (
    <div className="login-container">
      <h1>WELCOME TO SERAFIN!</h1>
      <p>Please log in or Create a new User</p>
      <form className="container">
        <input placeholder="Type username" />
        <input placeholder="Type password" />
        <select>
          <option>Choose Role</option>
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
