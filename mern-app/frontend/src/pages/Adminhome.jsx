import React, { useState , useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './adminhome.css';




const AdminCRUD = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [category, setCategory] = useState('');
  const [topN, setTopN] = useState(5);
  const [shortlistedCandidates, setShortlistedCandidates] = useState([]);
  const [loadingShortlist, setLoadingShortlist] = useState(false);
  const [shortlistMessage, setShortlistMessage] = useState('');
  const [mode, setMode] = useState('jd');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [employees, setEmployees] = useState([]);
  const [crudMessage, setCrudMessage] = useState('');
  const [showEmployeePopup, setShowEmployeePopup] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const navigate = useNavigate();

  const CAPI = "http://localhost:5001/api/candidates";
  const EAPI = "http://localhost:5001/api/employee";
  const AAPI = "http://localhost:5001/api/admin";

 // Reset shortlisted candidates and message when switching modes
 const handleModeChange = (newMode) => {
  setMode(newMode);
  setShortlistedCandidates([]); // Clear shortlisted candidates
  setShortlistMessage(''); // Clear message
 };

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

  const sendInterviewEmail = async (candidateData) => {
    try {
      const candidate = {
        name: candidateData.candidate_name,
        email: candidateData.email,
      };
      const res = await fetch(`${AAPI}/send-interview-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidates: [candidate] }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Email sent to ${candidate.name}`);
      } else {
        alert(`Failed to send email: ${data.error}`);
      }
    } catch (err) {
      console.error("Error sending email:", err);
      alert("Something went wrong while sending the email.");
    }
  };

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

  const logout = () => {
    navigate('/');
  };

  const adminMenuRef = useRef(null); // Ref for the dropdown menu

   // Close the dropdown menu if clicking outside
   useEffect(() => {
    const handleClickOutside = (event) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target)) {
        setShowAdminMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div className="homepage">
      <header className="header">
        <span className="logo" onClick={() => navigate("/")}>Automated HR</span>
      </header>
      

      
  
      <div className="admin-actions">
          <button className="action-button" onClick={() => setShowAdminMenu(prev => !prev)}>Admin Actions ▾</button>
          {showAdminMenu && (
            <div className="dropdown-menu" ref={adminMenuRef}>
              <button onClick={() => { setShowEmployeePopup(true); setShowAdminMenu(false); }}> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="#d8a353">
    <path d="M14.133 8c0-.328-.033-.647-.083-.961L16 5.333l-1.656-2.719-2.325.759a6.125 6.125 0 0 0-1.903-1.125L9.6 0H6.4l-.516 2.249a6.109 6.109 0 0 0-1.903 1.126l-2.325-.76L0 5.333l1.949 1.706c-.049.314-.082.633-.082.961s.033.647.082.961L0 10.667l1.657 2.719 2.324-.759a6.1 6.1 0 0 0 1.904 1.125L6.4 16h3.2l.515-2.249a6.083 6.083 0 0 0 1.903-1.125l2.324.759L16 10.667l-1.95-1.705c.05-.315.083-.634.083-.962zM8 10a2 2 0 1 1 .001-4.001A2 2 0 0 1 8 10z" />
  </svg>  Manage Employees</button>
              <button onClick={logout}>🚪 Logout</button>
            </div>
          )}
        </div>

      <div className="shortlist-panel-wrapper">
      
        <div className="admin-panel">
          <div className="admin-header">
            <h2>Shortlist Candidates</h2>
          </div>
          
          <div className="toggle-container">
            <button className={`toggle-button ${mode === 'jd' ? 'active' : ''}`} onClick={() => handleModeChange('jd')}>Rank by Job Description</button>
            <button className={`toggle-button ${mode === 'category' ? 'active' : ''}`} onClick={() => handleModeChange('category')}>Rank by Category</button>
          </div>

          {mode === 'jd' && (
            <div className="form-container">
              <textarea placeholder="Enter Job Description here..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} className="input-field" rows={5} />
              <input type="number" placeholder="Top N Candidates" value={topN} onChange={(e) => setTopN(parseInt(e.target.value, 10) || 1)} className="input-field" min={1} />
              <button onClick={shortlistCandidates} className="action-button" disabled={loadingShortlist || !jobDescription.trim()}>{loadingShortlist ? "Shortlisting..." : "Shortlist by Job Description"}</button>
              {shortlistMessage && <div className="message-box">{shortlistMessage}</div>}
            </div>
          )}

          {mode === 'category' && (
            <div className="form-container">
              <input type="text" placeholder="Enter Category (e.g., developer)" value={category} onChange={(e) => setCategory(e.target.value)} className="input-field" />
              <input type="number" placeholder="Top N Candidates" value={topN} onChange={(e) => setTopN(parseInt(e.target.value, 10) || 1)} className="input-field" min={1} />
              <button onClick={shortlistByCategory} className="action-button" disabled={loadingShortlist || !category.trim()}>{loadingShortlist ? "Shortlisting..." : "Shortlist by Category"}</button>
              {shortlistMessage && <div className="message-box">{shortlistMessage}</div>}
            </div>
          )}

          {shortlistedCandidates.length > 0 && (
            <div className="shortlist-results">
              <h3>Shortlisted Candidates:</h3>
              <table className="candidate-table">
                <thead>
                  <tr>
                    <th>Candidate Name</th>
                    <th>Email</th>
                    <th>Filename</th>
                    <th>Score</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {shortlistedCandidates.map((cand, index) => (
                    <tr key={index}>
                      <td>{cand.candidate_name}</td>
                      <td>{cand.email}</td>
                      <td>{cand.filename}</td>
                      <td>{cand.score.toFixed(2)}%</td>
                      <td>
                        <button className="action-button" onClick={() => sendInterviewEmail(cand)}>Send Email</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </div>
        {/* Popup Modal for Manage Employees */}
        {showEmployeePopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <button className="close-button" onClick={() => setShowEmployeePopup(false)}>×</button>
              <div className="admin-header">
                <h2>Manage Employees</h2>
              </div>

              <div className="form-container">
                <input type="email" placeholder="Employee Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
                <input type="password" placeholder="Password (for Create/Update)" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" />

                <div className="buttons-container">
                  <button onClick={createEmployee} className="action-button">Create</button>
                  <button onClick={getAllEmployees} className="action-button">Read All</button>
                  <button onClick={updatePassword} className="action-button">Update</button>
                  <button onClick={deleteEmployee} className="action-button">Delete</button>
                </div>
                {crudMessage && <div className="message-box">{crudMessage}</div>}
              </div>

              {employees.length > 0 && (
                <div className="employee-list">
                  <h3 color='white'>Employee List:</h3>
                  <ul>
                    {employees.map((emp) => (
                      <li key={emp._id} className="employee-item">{emp.email}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      

      <footer className="footer">
        &copy; {new Date().getFullYear()} Automated HR. All rights reserved.
      </footer>
    </div>
  );
};

export default AdminCRUD;
