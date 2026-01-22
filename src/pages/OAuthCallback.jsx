import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      // Fetch user profile and store name/email for UI
      api
        .get("/profile")
        .then((res) => {
          const user = res.data.user;
          if (user?.name) localStorage.setItem("userName", user.name);
          if (user?.email) localStorage.setItem("userEmail", user.email);
        })
        .catch(() => {
          // ignore profile fetch errors
        })
        .finally(() => {
          navigate("/books");
        });
    } else {
      // If no token, send to login
      navigate("/");
    }
  }, [navigate]);

  return <div>Signing you in...</div>;
};

export default OAuthCallback;
