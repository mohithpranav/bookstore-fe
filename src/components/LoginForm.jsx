import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./Auth.css";

const LoginForm = ({ onSwitchToSignup }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/signin", formData);

      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userEmail", formData.email);
        localStorage.setItem("userName", response.data.user.name);

        // Navigate to books page
        navigate("/books");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="email">Email Id</label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="form-control"
          id="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <div className="text-end mt-1">
          <a href="#" className="forgot-password">
            Forgot Password?
          </a>
        </div>
      </div>

      <button type="submit" className="btn btn-login w-100" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      <div className="divider">
        <span>OR</span>
      </div>

      <div className="social-buttons">
        <button
          type="button"
          className="btn btn-facebook"
          onClick={() => {
            window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/facebook`;
          }}
        >
          Facebook
        </button>
        <button
          type="button"
          className="btn btn-google"
          onClick={() => {
            window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
          }}
        >
          Google
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
