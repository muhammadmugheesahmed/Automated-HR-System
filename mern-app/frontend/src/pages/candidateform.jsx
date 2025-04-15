import React, { useState } from 'react';
import axios from 'axios';
import './candidateform.css';

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
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (resume) data.append('resume', resume);

    try {
      await axios.post('http://localhost:5001/api/candidates/form', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('✅ Candidate submitted successfully!');
      
      // Alert on successful submission
      alert('Your application has been submitted successfully!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        qualification: '',
        gender: '',
        position: ''
      });
      setResume(null);
    } catch (error) {
      setMessage('❌ Error: ' + (error.response?.data?.error || error.message));
      
      // Alert on error
      alert('There was an error submitting your application. Please try again.');
    }
  };

  return (
    <div className="candidate-form-wrapper">
      <div className="candidate-form-container">
        <h2>Apply for a Position</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <label>Name <span className="required">*</span>:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label>Email <span className="required">*</span>:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>Qualification:<span className="required">*</span></label>
          <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} />

          <label>Gender:<span className="required">*</span></label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label>Position Applied For <span className="required">*</span>:</label>
          <input type="text" name="position" value={formData.position} onChange={handleChange} required />

          <label>Upload Resume (PDF/DOC/DOCX):</label>
          <input type="file" name="resume" onChange={handleFileChange} accept=".pdf,.doc,.docx" />

          <button type="submit">Submit Application</button>
        </form>
      </div>
    </div>
  );
};

export default CandidateForm;