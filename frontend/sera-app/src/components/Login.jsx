import React, { useState } from "react";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "parent",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json;

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      setIsLoggedIn(true);
      setUser(data.user);

      setFormData({
        username: "",
        password: "",
        role: "parent",
      });
    } catch (error) {
      setMessage(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json;

      if (!response.ok) {
        throw new Error(
          data.message || "Sign up failed username taken already"
        );
      }

      setMessage(data.message);
      setIsLoggedIn(true);
      setUser(data.user);

      setFormData({
        username: "",
        password: "",
        role: "parent",
      });
    } catch (error) {
      setMessage(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json;

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setUser(null);
      setIsLoggedIn(false);
      setMessage("Logged out successfully");
    } catch (error) {
      setMessage("Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>WELCOME TO SERA!</h1>
      <form className="container">
        <label htmlFor="username">Please log in or Create a new User:</label>
        <input
          id="username"
          name="username"
          placeholder="Type username"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
        <input
          name="password"
          placeholder="Type password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="role">Select a role: </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleInputChange}
        >
          <option value="parent">Parent</option>
          <option value="student">Student</option>
          <option value="organize">Organizer</option>
        </select>
        <button
          name="register"
          onClick={handleSignup}
          disabled={isLoading || !formData.username || !formData.password}
        >
          {isLoading ? "Creating..." : "Register"}
        </button>
        <button
          name="login"
          onClick={handleLogin}
          disabled={isLoading || !formData.username || !formData.password}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="logout-btn"
        >
          {isLoading ? "Logging out..." : "Logout"}
        </button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}
