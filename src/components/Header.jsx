import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Clear token and user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");

    // Redirect to login page
    navigate("/");
  };

  return (
    <header className="header">
      <div className="container-fluid">
        <div className="header-content">
          <Link to="/books" className="logo">
            <i className="bi bi-book"></i>
            <span>Bookstore</span>
          </Link>

          <div className="search-bar">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
            />
          </div>

          <div className="header-actions">
            <div className="user-profile-wrapper" ref={dropdownRef}>
              <div
                className="user-profile"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <i className="bi bi-person-circle"></i>
                <span>{userName}</span>
              </div>

              {showDropdown && (
                <div className="profile-dropdown">
                  <div>
                    <div className="dropdown-header">Hello {userName},</div>
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      <i className="bi bi-person"></i>
                      <span>Profile</span>
                    </Link>
                    <div
                      className="dropdown-item"
                      onClick={() => {
                        setShowDropdown(false);
                        navigate("/orders");
                      }}
                    >
                      <i className="bi bi-bag"></i>
                      <span>My Orders</span>
                    </div>
                    <Link
                      to="/wishlist"
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      <i className="bi bi-heart"></i>
                      <span>My Wishlist</span>
                    </Link>
                    <button
                      className="dropdown-item logout-btn"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
            <Link to="/cart" className="cart-icon">
              <i className="bi bi-cart3"></i>
              <span>Cart</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
