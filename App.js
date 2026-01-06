import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import TrainerList from './components/TrainerList';
import Register from './components/Register';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import Profile from './components/Profile';
import BookAppointment from './components/BookAppointment';
import ProgressTracking from './components/ProgressTracking';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="logo">FitTrack</h1>
            <div className="nav-links">
              {!user ? (
                <>
                  <Link to="/">Αρχική</Link>
                  <Link to="/trainers">Trainers</Link>
                  <Link to="/register">Εγγραφή</Link>
                  <Link to="/login">Σύνδεση</Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard">Πίνακας Ελέγχου</Link>
                  <Link to="/profile">Προφίλ</Link>
                  <Link to="/book-appointment">Κλείσιμο Ραντεβού</Link>
                  <Link to="/progress">Πρόοδος</Link>
                  <button onClick={handleLogout} className="logout-btn">Αποσύνδεση</button>
                </>
              )}
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trainers" element={<TrainerList />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
            />
            <Route 
              path="/dashboard" 
              element={user ? <UserDashboard user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile" 
              element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/book-appointment" 
              element={user ? <BookAppointment user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/progress" 
              element={user ? <ProgressTracking user={user} /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

