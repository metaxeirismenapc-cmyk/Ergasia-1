import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveUser } from '../data/mockData';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setMessage('Οι κωδικοί πρόσβασης δεν ταιριάζουν');
      return;
    }

    if (formData.password.length < 6) {
      setMessage('Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες');
      return;
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === formData.email)) {
      setMessage('Υπάρχει ήδη χρήστης με αυτό το email');
      return;
    }

    const newUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      password: formData.password, // In real app, this should be hashed
      goals: [],
      createdAt: new Date().toISOString()
    };

    saveUser(newUser);
    setMessage('Εγγραφή επιτυχής! Μπορείτε να συνδεθείτε τώρα.');
    
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="register">
      <h1 className="page-title">Εγγραφή Χρήστη</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          {message && (
            <div className={`message ${message.includes('επιτυχής') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="name">Όνομα:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Κωδικός Πρόσβασης:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Επιβεβαίωση Κωδικού:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn">Εγγραφή</button>
        </form>
      </div>
    </div>
  );
};

export default Register;



