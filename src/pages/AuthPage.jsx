import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import "../components/Auth.css";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-left">
          <div className="auth-logo-container">
            <svg viewBox="0 0 300 300" className="auth-logo">
              <circle cx="150" cy="150" r="140" fill="#6BA3D8" />
              <circle cx="150" cy="150" r="120" fill="#4A8CCF" />
              <circle cx="150" cy="150" r="100" fill="#3674B8" />

              {/* Person */}
              <ellipse cx="150" cy="120" rx="25" ry="30" fill="#2C3E50" />
              <path
                d="M 130 140 Q 130 160 150 165 Q 170 160 170 140"
                fill="#F8E0E6"
                stroke="#2C3E50"
                strokeWidth="2"
              />

              {/* Books */}
              <rect
                x="160"
                y="100"
                width="20"
                height="30"
                fill="#E74C3C"
                rx="2"
              />
              <rect
                x="163"
                y="100"
                width="14"
                height="4"
                fill="#fff"
                opacity="0.3"
              />

              {/* Tablet */}
              <rect
                x="115"
                y="130"
                width="25"
                height="35"
                fill="#34495E"
                rx="3"
              />
              <rect x="118" y="133" width="19" height="25" fill="#3498DB" />

              {/* Shopping cart */}
              <path
                d="M 80 200 L 90 200 L 100 240 L 200 240 L 210 200 L 220 200"
                stroke="#E74C3C"
                strokeWidth="4"
                fill="none"
              />
              <rect
                x="100"
                y="200"
                width="100"
                height="40"
                fill="none"
                stroke="#E74C3C"
                strokeWidth="4"
              />
              <line
                x1="120"
                y1="180"
                x2="130"
                y2="200"
                stroke="#E74C3C"
                strokeWidth="3"
              />
              <line
                x1="150"
                y1="180"
                x2="160"
                y2="200"
                stroke="#E74C3C"
                strokeWidth="3"
              />
              <line
                x1="180"
                y1="180"
                x2="190"
                y2="200"
                stroke="#E74C3C"
                strokeWidth="3"
              />
              <circle cx="120" cy="250" r="8" fill="#2C3E50" />
              <circle cx="180" cy="250" r="8" fill="#2C3E50" />

              {/* Person's legs in cart */}
              <path d="M 140 165 L 135 200" stroke="#4A5568" strokeWidth="6" />
              <path d="M 160 165 L 165 200" stroke="#4A5568" strokeWidth="6" />
            </svg>
          </div>
          <h1 className="auth-title">ONLINE BOOK SHOPPING</h1>
        </div>

        <div className="auth-right">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
              onClick={() => setActiveTab("login")}
            >
              LOGIN
            </button>
            <button
              className={`auth-tab ${activeTab === "signup" ? "active" : ""}`}
              onClick={() => setActiveTab("signup")}
            >
              SIGNUP
            </button>
          </div>

          {activeTab === "login" ? (
            <LoginForm onSwitchToSignup={() => setActiveTab("signup")} />
          ) : (
            <SignupForm onSwitchToLogin={() => setActiveTab("login")} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
