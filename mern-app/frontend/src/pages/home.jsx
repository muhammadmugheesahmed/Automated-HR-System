import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="homepage">
      {/* Header */}
      <header className="header">
        <span className="logo" onClick={() => handleNavigation("/")}>
          Automated HR
        </span>
      </header>

      {/* Main Content */}
      <div className="main-content">
        {/* Login Section (Now on full left) */}
        <div className="login-side">
          <div className="login-container">
            <div className="login-card">
              <h3>Candidate</h3>
              <button onClick={() => handleNavigation("/candidate-form")}>
                Click Here
              </button>
            </div>
            <div className="login-card">
              <h3>Admin</h3>
              <button onClick={() => handleNavigation("/adminlogin")}>
                Sign In
              </button>
            </div>
            <div className="login-card">
              <h3>Employee</h3>
              <button onClick={() => handleNavigation("/employee")}>
                Sign In
              </button>
            </div>
          </div>
        </div>

        {/* Text Section */}
        <div className="info-side">
          <h1><div class="typing-container">
  Automated Hr...
</div>
          </h1>
          <p>
            Streamline your hiring and employee management with our powerful,
            easy-to-use HR automation platform. From candidate onboarding to
            employee self-service, everything is just a click away.
          </p>
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