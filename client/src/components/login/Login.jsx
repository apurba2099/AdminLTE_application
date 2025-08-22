import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import axios from "axios";
import toast from "react-hot-toast";
import { API_LINK } from "../../utility/config";
export default function Login() {
  //Navigating forwar or backward
  const navigate = useNavigate();

  //set the userlogin email and password
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  //loading
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //Input Handler Function
  function inputHandler(e) {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
    setError(""); //Clear error when user start typing
  }

  //Submit the submitform Function
  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${API_LINK}/auth/login`,
        user, //axios automatically stringifies JSON
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = response.data;

      if (response.status === 200) {
        //Store token + user in localStorage
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        //Toast message
        toast.success(response.data.message, { position: "top-right" });

        navigate("/dashboard");
      }
    } catch (error) {
      setError("Network error. Please try again!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-container">
      <div className="login-header">
        <h1>&lt;The CRUD Data-Base System/&gt;</h1>
      </div>

      <div className="login-form-container">
        <div className="login-form-header">
          <h2>🔐Login to Your Account</h2>
        </div>

        {error && <div className="error-message">❌{error}</div>}

        <form className="login-form" onSubmit={submitForm}>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Email: user@example.com"
            value={user.email}
            onChange={inputHandler}
            required={true}
          />
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="Password: ••••••••"
            value={user.password}
            onChange={inputHandler}
            required
          />
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "🚀 Login"}
          </button>
        </form>
        <div className="auth-links">
          <p>
            Don't have an account?
            <Link to="/register" className="auth-link">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Input({
  type = "text",
  id,
  name,
  placeholder,
  value,
  onChange,
  required,
}) {
  return (
    <div className="input-group">
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}
