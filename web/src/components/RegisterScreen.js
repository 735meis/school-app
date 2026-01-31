import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import './RegisterScreen.css';

const RegisterScreen = () => {
  const navigate = useNavigate();
  const [registrationType, setRegistrationType] = useState('school');
  const [schools, setSchools] = useState([]);

  const [schoolName, setSchoolName] = useState('');
  const [address, setAddress] = useState('');
  const [schoolType, setSchoolType] = useState('Elementary');
  const [gradesOffered, setGradesOffered] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [grade, setGrade] = useState('');

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await api.get('/schools');
      setSchools(response.data);
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  const handleRegisterSchool = async (e) => {
    e.preventDefault();
    if (!schoolName || !address || !gradesOffered) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await api.post('/schools', {
        name: schoolName,
        address,
        type: schoolType,
        gradesOffered: gradesOffered.split(',').map(g => g.trim()),
      });

      alert('School registered successfully');
      fetchSchools();
      setSchoolName('');
      setAddress('');
      setGradesOffered('');
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Failed to register school'));
    }
  };

  const handleRegisterStaff = async (e) => {
    e.preventDefault();
    if (!email || !password || !name || !selectedSchool) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await api.post('/users', {
        email,
        password,
        name,
        role: 'staff',
        school: selectedSchool,
      });

      alert('Staff registered successfully');
      setEmail('');
      setPassword('');
      setName('');
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Failed to register staff'));
    }
  };

  const handleRegisterStudent = async (e) => {
    e.preventDefault();
    if (!email || !password || !name || !selectedSchool || !grade) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await api.post('/users', {
        email,
        password,
        name,
        role: 'student',
        school: selectedSchool,
        grade,
      });

      alert('Student registered successfully');
      setEmail('');
      setPassword('');
      setName('');
      setGrade('');
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Failed to register student'));
    }
  };

  return (
    <div className="register-container">
      <div className="header">
        <button onClick={() => navigate('/')} className="back-button">← Back to Home</button>
        <h2 className="page-title">Register</h2>
      </div>

      <div className="content">
        <div className="type-selector">
          <button
            className={`type-button ${registrationType === 'school' ? 'active' : ''}`}
            onClick={() => setRegistrationType('school')}
          >
            New School
          </button>
          <button
            className={`type-button ${registrationType === 'staff' ? 'active' : ''}`}
            onClick={() => setRegistrationType('staff')}
          >
            New Staff
          </button>
          <button
            className={`type-button ${registrationType === 'student' ? 'active' : ''}`}
            onClick={() => setRegistrationType('student')}
          >
            New Student
          </button>
        </div>

        <div className="form-container">
          {registrationType === 'school' && (
            <form onSubmit={handleRegisterSchool}>
              <label className="label">School Name</label>
              <input
                className="input"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Enter school name"
              />

              <label className="label">Address</label>
              <input
                className="input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter address"
              />

              <label className="label">Type</label>
              <select className="input" value={schoolType} onChange={(e) => setSchoolType(e.target.value)}>
                <option value="Elementary">Elementary</option>
                <option value="Middle">Middle</option>
                <option value="High">High</option>
              </select>

              <label className="label">Grades Offered (comma-separated)</label>
              <input
                className="input"
                value={gradesOffered}
                onChange={(e) => setGradesOffered(e.target.value)}
                placeholder="e.g., K, 1, 2, 3, 4, 5"
              />

              <button className="submit-button" type="submit">Register School</button>
            </form>
          )}

          {registrationType === 'staff' && (
            <form onSubmit={handleRegisterStaff}>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />

              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />

              <label className="label">Name</label>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
              />

              <label className="label">School</label>
              <select className="input" value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)}>
                <option value="">Select a school</option>
                {schools.map((school) => (
                  <option key={school._id} value={school._id}>{school.name}</option>
                ))}
              </select>

              <button className="submit-button" type="submit">Register Staff</button>
            </form>
          )}

          {registrationType === 'student' && (
            <form onSubmit={handleRegisterStudent}>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />

              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />

              <label className="label">Name</label>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
              />

              <label className="label">School</label>
              <select className="input" value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)}>
                <option value="">Select a school</option>
                {schools.map((school) => (
                  <option key={school._id} value={school._id}>{school.name}</option>
                ))}
              </select>

              <label className="label">Grade</label>
              <input
                className="input"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="Enter grade"
              />

              <button className="submit-button" type="submit">Register Student</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
