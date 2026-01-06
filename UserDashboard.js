import React, { useState, useEffect } from 'react';
import { getAppointments } from '../data/mockData';
import { trainers } from '../data/mockData';
import './UserDashboard.css';

const UserDashboard = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    const allAppointments = getAppointments();
    const userAppointments = allAppointments.filter(apt => apt.userId === user.id);
    setAppointments(userAppointments);

    // Filter upcoming appointments
    const now = new Date();
    const upcoming = userAppointments
      .filter(apt => new Date(apt.date + 'T' + apt.time) > now)
      .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time))
      .slice(0, 3);
    setUpcomingAppointments(upcoming);
  }, [user.id]);

  const getTrainerName = (trainerId) => {
    const trainer = trainers.find(t => t.id === trainerId);
    return trainer ? trainer.name : 'Άγνωστος Trainer';
  };

  return (
    <div className="user-dashboard">
      <h1 className="page-title">Πίνακας Ελέγχου</h1>
      
      <div className="dashboard-content">
        <div className="card">
          <h2>Καλώς ήρθατε, {user.name}!</h2>
          <p>Αυτός είναι ο προσωπικός σας πίνακας ελέγχου.</p>
        </div>

        <div className="card">
          <h2>Επερχόμενα Ραντεβού</h2>
          {upcomingAppointments.length > 0 ? (
            <ul className="appointment-list">
              {upcomingAppointments.map(apt => (
                <li key={apt.id} className="appointment-item">
                  <h4>{getTrainerName(apt.trainerId)}</h4>
                  <p><strong>Ημερομηνία:</strong> {apt.date}</p>
                  <p><strong>Ώρα:</strong> {apt.time}</p>
                  <p><strong>Τύπος Προπόνησης:</strong> {apt.workoutType}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <p>Δεν έχετε επερχόμενα ραντεβού</p>
            </div>
          )}
        </div>

        <div className="card">
          <h2>Στατιστικά</h2>
          <div className="stats">
            <div className="stat-item">
              <strong>Συνολικά Ραντεβού:</strong> {appointments.length}
            </div>
            <div className="stat-item">
              <strong>Επερχόμενα:</strong> {upcomingAppointments.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;



