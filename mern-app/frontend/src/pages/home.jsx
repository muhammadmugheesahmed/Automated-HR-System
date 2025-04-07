import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div>
      {/* Header */}
      <header>
        <span onClick={() => handleNavigation("/")}>AUTOMATED HR</span>
      </header>

      {/* Main Content */}
      <div className="container">
        <div className="grid">
          <div className="card" style={{ backgroundColor: "#0056b3" }}>
            <h2>Candidate Form</h2>
            <button onClick={() => handleNavigation("/candidate-form")}>Click Here</button>
          </div>
          <div className="card" style={{ backgroundColor: "#6c757d" }}>
            <h2>Admin</h2>
            <button onClick={() => handleNavigation("/adminlogin")}>Sign In</button>
          </div>
          <div className="card" style={{ backgroundColor: "#007bff" }}>
            <h2>Employee</h2>
            <button onClick={() => handleNavigation("/employee")}>Sign In</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        &copy; {new Date().getFullYear()} Automated HR. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;