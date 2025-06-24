import React from "react";

export default function Login() {
  return (
    <div className="login-container">
      <form>
        <input placeholder="Type username" />
        <input placeholder="Type password" />
        <button name="register">Register</button>
        <button name="login">Login</button>
        <button name="logout">Logout</button>
      </form>
    </div>
  );
}
