import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./Auth.css";

const SignupForm = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobileNo: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Enter full name";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.mobileNo.trim()) {
      newErrors.mobileNo = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNo)) {
      newErrors.mobileNo = "Mobile number must be 10 digits";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/signup", formData);

      if (response.data.success) {
        // Show success message and switch to login
        alert("Account created successfully! Please login.");
        onSwitchToLogin();
      }
    } catch (err) {
      setErrors({
        submit: err.response?.data?.message || "Signup failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errors.submit && (
        <div className="alert alert-danger" role="alert">
          {errors.submit}
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          className={`form-control ${errors.name ? "is-invalid" : ""}`}
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter full name"
        />
        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Id</label>
        <input
          type="email"
          className={`form-control ${errors.email ? "is-invalid" : ""}`}
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className={`form-control ${errors.password ? "is-invalid" : ""}`}
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
        />
        {errors.password && (
          <div className="invalid-feedback">{errors.password}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="mobileNo">Mobile Number</label>
        <input
          type="text"
          className={`form-control ${errors.mobileNo ? "is-invalid" : ""}`}
          id="mobileNo"
          name="mobileNo"
          value={formData.mobileNo}
          onChange={handleChange}
          placeholder="Enter mobile number"
        />
        {errors.mobileNo && (
          <div className="invalid-feedback">{errors.mobileNo}</div>
        )}
      </div>

      <button type="submit" className="btn btn-signup w-100" disabled={loading}>
        {loading ? "Creating account..." : "Signup"}
      </button>
    </form>
  );
};

export default SignupForm;
