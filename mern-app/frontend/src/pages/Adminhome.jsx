import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './adminhome.css'; // Assuming you want to keep styles in a separate CSS file

const AdminCRUD = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState('');

  const API = "http://localhost:5001/api/employee";

  const navigate = useNavigate();
  const handleNavigation = (path) => {
    navigate(path);
  };
  const createEmployee = async () => {
    const res = await fetch(`${API}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    setMessage(data.message || data.error);
  };

  const getAllEmployees = async () => {
    const res = await fetch(`${API}/all`);
    const data = await res.json();
    setEmployees(data);
    setMessage("Fetched employees");
  };

  const updatePassword = async () => {
    const res = await fetch(`${API}/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    setMessage(data.message || data.error);
  };

  const deleteEmployee = async () => {
    const res = await fetch(`${API}/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    
      <div className="homepage">
      {/* Header */}
      <header className="header">
        <span className="logo" onClick={() => handleNavigation("/")}>
          Automated HR
        </span>
      </header>
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Admin Panel (Employee CRUD)</h2>
      </div>

      <div className="form-container">
        <input
          type="email"
          placeholder="Employee Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password (for create/update)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="input-field"
        />

        <div className="buttons-container">
          <button onClick={createEmployee} className="action-button">Create</button>
          <button onClick={getAllEmployees} className="action-button">Read All</button>
          <button onClick={updatePassword} className="action-button">Update</button>
          <button onClick={deleteEmployee} className="action-button">Delete</button>
        </div>

        {message && <div className="message-box">{message}</div>}
      </div>

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
    <footer className="footer">
        &copy; {new Date().getFullYear()} Automated HR. All rights reserved.
      </footer>
    </div>
  );
};

export default AdminCRUD;