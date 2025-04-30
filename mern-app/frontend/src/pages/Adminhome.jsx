import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './adminhome.css'; // Unified CSS

const AdminCRUD = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [category, setCategory] = useState('');
  const [topN, setTopN] = useState(5);
  const [shortlistedCandidates, setShortlistedCandidates] = useState([]);
  const [loadingShortlist, setLoadingShortlist] = useState(false);
  const [shortlistMessage, setShortlistMessage] = useState('');
  const [mode, setMode] = useState('jd'); // 'jd' or 'category'

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [employees, setEmployees] = useState([]);
  const [crudMessage, setCrudMessage] = useState('');

  const navigate = useNavigate();

  const CAPI = "http://localhost:5001/api/candidates";
  const EAPI = "http://localhost:5001/api/employee";

  // JD-based Shortlisting
  const shortlistCandidates = async () => {
    setLoadingShortlist(true);
    setShortlistMessage('Shortlisting candidates by Job Description...');

    try {
      const response = await fetch(`${CAPI}/shortlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, topN }),
      });
      const data = await response.json();
      if (response.ok) {
        setShortlistedCandidates(data);
        setShortlistMessage('Job Description-based Shortlisting successful!');
      } else {
        setShortlistMessage('Job Description-based Shortlisting failed!');
      }
    } catch (error) {
      console.error(error);
      setShortlistMessage('An error occurred during shortlisting.');
    } finally {
      setLoadingShortlist(false);
    }
  };

  // Category-based Shortlisting
  const shortlistByCategory = async () => {
    setLoadingShortlist(true);
    setShortlistMessage('Shortlisting Candidates by Category...');

    try {
      const response = await fetch(`${CAPI}/rank`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, topN }),
      });
      const data = await response.json();
      if (response.ok) {
        setShortlistedCandidates(data);
        setShortlistMessage('Category-based shortlisting successful!');
      } else {
        setShortlistMessage('Category-based shortlisting failed!');
      }
    } catch (error) {
      console.error(error);
      setShortlistMessage('An error occurred during category shortlisting.');
    } finally {
      setLoadingShortlist(false);
    }
  };

  // CRUD Operations
  const createEmployee = async () => {
    const res = await fetch(`${EAPI}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    setCrudMessage(data.message || data.error);
  };

  const getAllEmployees = async () => {
    const res = await fetch(`${EAPI}/all`);
    const data = await res.json();
    setEmployees(data);
    setCrudMessage("Fetched employees");
  };

  const updatePassword = async () => {
    const res = await fetch(`${EAPI}/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    setCrudMessage(data.message || data.error);
  };

  const deleteEmployee = async () => {
    const res = await fetch(`${EAPI}/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    setCrudMessage(data.message || data.error);
  };

  return (
    <div className="homepage">
      {/* Header */}
      <header className="header">
        <span className="logo" onClick={() => navigate("/")}>Automated HR</span>
      </header>

      {/* Panels Container */}
      <div className="panels-container">

        {/* Shortlisting Panel */}
        <div className="admin-panel">
          <div className="admin-header">
            <h2>Shortlist Candidates</h2>
          </div>

          {/* Toggle Buttons */}
          <div className="toggle-container">
            <button
              className={`toggle-button ${mode === 'jd' ? 'active' : ''}`}
              onClick={() => setMode('jd')}
            >
              Rank by JD
            </button>
            <button
              className={`toggle-button ${mode === 'category' ? 'active' : ''}`}
              onClick={() => setMode('category')}
            >
              Rank by Category
            </button>
          </div>

          {/* JD-based Shortlisting Form */}
          {mode === 'jd' && (
            <div className="form-container">
              <textarea
                placeholder="Enter Job Description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="input-field"
                rows={5}
              />
              <input
                type="number"
                placeholder="Top N Candidates"
                value={topN}
                onChange={(e) => setTopN(parseInt(e.target.value, 10) || 1)}
                className="input-field"
                min={1}
              />
              <button
                onClick={shortlistCandidates}
                className="action-button"
                disabled={loadingShortlist || !jobDescription.trim()}
              >
                {loadingShortlist ? "Shortlisting..." : "Shortlist"}
              </button>
              {shortlistMessage && <div className="message-box">{shortlistMessage}</div>}
            </div>
          )}

          {/* Category-based Shortlisting Form */}
          {mode === 'category' && (
            <div className="form-container">
              <input
                type="text"
                placeholder="Enter Category (e.g., developer)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field"
              />
              <input
                type="number"
                placeholder="Top N Candidates"
                value={topN}
                onChange={(e) => setTopN(parseInt(e.target.value, 10) || 1)}
                className="input-field"
                min={1}
              />
              <button
                onClick={shortlistByCategory}
                className="action-button"
                disabled={loadingShortlist || !category.trim()}
              >
                {loadingShortlist ? "Shortlisting..." : "Rank by Category"}
              </button>
              {shortlistMessage && <div className="message-box">{shortlistMessage}</div>}
            </div>
          )}

          {/* Shortlisted Candidates Table */}
          {shortlistedCandidates.length > 0 && (
            <div className="shortlist-results">
              <h3>Shortlisted Candidates:</h3>
              <table className="candidate-table">
                <thead>
                  <tr>
                    <th>Candidate Name</th>
                    <th>Filename</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {shortlistedCandidates.map((cand, index) => (
                    <tr key={index}>
                      <td>{cand.candidate_name}</td>
                      <td>{cand.filename}</td>
                      <td>{cand.score.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* CRUD Panel */}
        <div className="admin-panel">
          <div className="admin-header">
            <h2>Manage Employees</h2>
          </div>

          <div className="form-container">
            <input
              type="email"
              placeholder="Employee Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
            <input
              type="password"
              placeholder="Password (for Create/Update)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />

            <div className="buttons-container">
              <button onClick={createEmployee} className="action-button">Create</button>
              <button onClick={getAllEmployees} className="action-button">Read All</button>
              <button onClick={updatePassword} className="action-button">Update</button>
              <button onClick={deleteEmployee} className="action-button">Delete</button>
            </div>
            {crudMessage && <div className="message-box">{crudMessage}</div>}
          </div>

          {/* Employees List */}
          {employees.length > 0 && (
            <div className="employee-list">
              <h3>Employee List:</h3>
              <ul>
                {employees.map((emp) => (
                  <li key={emp._id} className="employee-item">{emp.email}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

      </div>

      {/* Footer */}
      <footer className="footer">
        &copy; {new Date().getFullYear()} Automated HR. All rights reserved.
      </footer>
    </div>
  );
};

export default AdminCRUD;
