import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../data/mockData';
import './Login.css';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    const users = getUsers();
    const user = users.find(
      u => u.email === formData.email && u.password === formData.password
    );

    if (user) {
      // Remove password from user object before storing
      const { password, ...userWithoutPassword } = user;
      onLogin(userWithoutPassword);
      navigate('/dashboard');
    } else {
      setMessage('Λάθος email ή κωδικός πρόσβασης');
    }
  };

  return (
    <div className="login">
      <h1 className="page-title">Σύνδεση</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          {message && (
            <div className="message error">
              {message}
            </div>
          )}
          
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

          <button type="submit" className="btn">Σύνδεση</button>
        </form>
      </div>
    </div>
  );
};

export default Login;



