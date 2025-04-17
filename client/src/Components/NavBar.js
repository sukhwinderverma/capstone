// src/Components/NavBar.js
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from '../../public/assets/images/job-logo.png';

export default function NavBar() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };

    window.addEventListener("storage", handleStorageChange);
    setUser(JSON.parse(localStorage.getItem("user")));

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  return (
    <nav
      style={{
        height: "80px",
        width: "100%",
        backgroundColor: "#0277bd",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        boxSizing: "border-box",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        opacity: 0.9,
        transition: "opacity 0.5s",
      }}
      onMouseEnter={() => (document.querySelector('nav').style.opacity = 1)}
      onMouseLeave={() => (document.querySelector('nav').style.opacity = 0.9)}
    >
      <img
        src={logo}
        alt="Logo"
        style={{
          height: "50px",
          objectFit: "contain",
        }}
      />
      <div style={{ display: "flex", gap: "30px" }}>
        <NavLink
          to="/"
          style={{
            textDecoration: "none",
            color: "white",
            fontSize: "18px",
            fontWeight: "500",
            transition: "color 0.3s",
          }}
          activeStyle={{ color: "#ffb74d" }}
        >
          Home
        </NavLink>

        {!user ? (
          <NavLink
            to="/login"
            style={{
              textDecoration: "none",
              color: "white",
              fontSize: "18px",
              fontWeight: "500",
              transition: "color 0.3s",
            }}
            activeStyle={{ color: "#ffb74d" }}
          >
            Login
          </NavLink>
        ) : (
          <>
            {user.userType === "admin" ? (
              <NavLink
                to="/admin"
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "500",
                  transition: "color 0.3s",
                }}
                activeStyle={{ color: "#ffb74d" }}
              >
                Admin Dashboard
              </NavLink>
            ) : (
              <NavLink
                to={user.userType === "jobSeeker" ? "/job-seeker-dashboard" : "/employer-dashboard"}
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "500",
                  transition: "color 0.3s",
                }}
                activeStyle={{ color: "#ffb74d" }}
              >
                {user.userType === "jobSeeker" ? "Job Seeker Dashboard" : "Employer Dashboard"}
              </NavLink>
            )}

            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "white",
                fontSize: "18px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "color 0.3s",
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
