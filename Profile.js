import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    goals: user.goals || []
  });
  const [newGoal, setNewGoal] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
      goals: user.goals || []
    });
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setFormData({
        ...formData,
        goals: [...formData.goals, newGoal.trim()]
      });
      setNewGoal('');
    }
  };

  const handleRemoveGoal = (index) => {
    setFormData({
      ...formData,
      goals: formData.goals.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update user in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return { ...u, name: formData.name, goals: formData.goals };
      }
      return u;
    });
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Update current user state
    const updatedUser = { ...user, name: formData.name, goals: formData.goals };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    setMessage('Το προφίλ ενημερώθηκε επιτυχώς!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="profile">
      <h1 className="page-title">Προφίλ Χρήστη</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          {message && (
            <div className="message success">
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
              disabled
            />
            <small>Το email δεν μπορεί να αλλάξει</small>
          </div>

          <div className="form-group">
            <label>Στόχοι:</label>
            <div className="goals-section">
              {formData.goals.length > 0 && (
                <ul className="goals-list">
                  {formData.goals.map((goal, index) => (
                    <li key={index} className="goal-item">
                      {goal}
                      <button
                        type="button"
                        onClick={() => handleRemoveGoal(index)}
                        className="remove-goal-btn"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="add-goal">
                <input
                  type="text"
                  placeholder="Προσθέστε νέο στόχο (π.χ. Απώλεια βάρους, Μυϊκή ενδυνάμωση)"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddGoal();
                    }
                  }}
                />
                <button type="button" onClick={handleAddGoal} className="btn btn-secondary">
                  Προσθήκη
                </button>
              </div>
            </div>
          </div>

          <button type="submit" className="btn">Αποθήκευση Αλλαγών</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;



