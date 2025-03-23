import React, { useState } from 'react';
import axios from 'axios';

const CandidateForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    qualification: '',
    gender: '',
    position: ''
  });
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('qualification', formData.qualification);
    data.append('gender', formData.gender);
    data.append('position', formData.position);
    
    if (resume) {
      data.append('resume', resume);
    }

    try {
        const response = await axios.post('http://localhost:5000/api/candidates/form', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          
      setMessage('Candidate submitted successfully!');
      // Optionally, reset the form here
      setFormData({
        name: '',
        email: '',
        qualification: '',
        gender: '',
        position: ''
      });
      setResume(null);
    } catch (error) {
      setMessage('Error submitting candidate: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div>
      <h2>Candidate Application Form</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Name:</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Qualification:</label>
          <input 
            type="text" 
            name="qualification" 
            value={formData.qualification} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <label>Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label>Position to Apply:</label>
          <input 
            type="text" 
            name="position" 
            value={formData.position} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Resume (PDF/DOC/DOCX):</label>
          <input 
            type="file" 
            name="resume" 
            onChange={handleFileChange} 
            accept=".pdf,.doc,.docx" 
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CandidateForm;
