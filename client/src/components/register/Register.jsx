import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "./register.css";
import Footer from "../footer/Footer";
import { API_LINK } from "../../utility/config";

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setError(""); // clear error when typing
  };

  const submitForm = async (e) => {
    e.preventDefault();

    // Basic validation
    if (user.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_LINK}/auth/register`, user);

      // Store token in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Success toast
      toast.success(response.data.message, { position: "top-right" });

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      toast.error(err.response?.data?.message || "Registration failed", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <h1>&lt;The CRUD Data-Base System/&gt;</h1>
      </div>

      <div className="register-form-container">
        <div className="register-form-header">
          <h2>📝 Create New Account</h2>
        </div>

        {error && <div className="error-message">❌ {error}</div>}

        <form className="register-form" onSubmit={submitForm}>
          <div className="input-group">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Full Name: John Doe"
              value={user.name}
              onChange={inputHandler}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email: user@example.com"
              value={user.email}
              onChange={inputHandler}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password: ••••••••"
              value={user.password}
              onChange={inputHandler}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Creating Account..." : "🚀 Create Account"}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Already have an account?
            <Link to="/login" className="auth-link">
              Login Here
            </Link>
          </p>
        </div>
      </div>
      <Footer
        style={{
          marginTop: "2rem",
          padding: "1rem",
          borderTop: "1px solid #ccc",
          fontWeight: 700,
        }}
      >
        <p>
          <a style={{ color: "blue" }} href="mailto:apurbadutta2099@gmail.com">
            apurbadutta
          </a>
          ©{new Date().getFullYear()}. All rights reserved.
        </p>
      </Footer>
    </div>
  );
};

export default Register;
