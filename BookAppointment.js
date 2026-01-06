import React, { useState, useEffect } from 'react';
import { trainers, getAppointments, saveAppointment } from '../data/mockData';
import './BookAppointment.css';

const BookAppointment = ({ user }) => {
  const [formData, setFormData] = useState({
    trainerId: '',
    date: '',
    time: '',
    workoutType: ''
  });
  const [message, setMessage] = useState('');
  const [userAppointments, setUserAppointments] = useState([]);

  useEffect(() => {
    const allAppointments = getAppointments();
    const userApts = allAppointments.filter(apt => apt.userId === user.id);
    setUserAppointments(userApts);
  }, [user.id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateAppointment = () => {
    const selectedDate = new Date(formData.date + 'T' + formData.time);
    const now = new Date();

    // Check if date is in the past
    if (selectedDate <= now) {
      setMessage('Δεν μπορείτε να κλείσετε ραντεβού σε παρελθοντική ημερομηνία');
      return false;
    }

    // Check maximum active appointments (limit: 5)
    const activeAppointments = userAppointments.filter(apt => {
      const aptDate = new Date(apt.date + 'T' + apt.time);
      return aptDate > now;
    });

    if (activeAppointments.length >= 5) {
      setMessage('Έχετε φτάσει το όριο των 5 ενεργών ραντεβού');
      return false;
    }

    // Check for overlapping appointments for the same trainer
    const allAppointments = getAppointments();
    const trainerAppointments = allAppointments.filter(
      apt => apt.trainerId === parseInt(formData.trainerId)
    );

    const hasOverlap = trainerAppointments.some(apt => {
      const aptDate = new Date(apt.date + 'T' + apt.time);
      const timeDiff = Math.abs(selectedDate - aptDate);
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      return hoursDiff < 1; // 1 hour minimum gap
    });

    if (hasOverlap) {
      setMessage('Υπάρχει ήδη ραντεβού για αυτόν τον trainer σε αυτή την ώρα');
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');

    if (!validateAppointment()) {
      return;
    }

    const appointment = {
      id: Date.now(),
      userId: user.id,
      trainerId: parseInt(formData.trainerId),
      date: formData.date,
      time: formData.time,
      workoutType: formData.workoutType,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    saveAppointment(appointment);
    setMessage('Το ραντεβού κλείστηκε επιτυχώς!');
    
    // Reset form
    setFormData({
      trainerId: '',
      date: '',
      time: '',
      workoutType: ''
    });

    // Update user appointments
    setUserAppointments([...userAppointments, appointment]);
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="book-appointment">
      <h1 className="page-title">Κλείσιμο Ραντεβού</h1>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          {message && (
            <div className={`message ${message.includes('επιτυχώς') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="trainerId">Trainer:</label>
            <select
              id="trainerId"
              name="trainerId"
              value={formData.trainerId}
              onChange={handleChange}
              required
            >
              <option value="">Επιλέξτε Trainer</option>
              {trainers.map(trainer => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.name} - {trainer.specialization} ({trainer.area})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Ημερομηνία:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={getMinDate()}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Ώρα:</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="workoutType">Τύπος Προπόνησης:</label>
            <select
              id="workoutType"
              name="workoutType"
              value={formData.workoutType}
              onChange={handleChange}
              required
            >
              <option value="">Επιλέξτε Τύπο</option>
              <option value="Απώλεια Βάρους">Απώλεια Βάρους</option>
              <option value="Μυϊκή Ενδυνάμωση">Μυϊκή Ενδυνάμωση</option>
              <option value="Cardio">Cardio</option>
              <option value="Yoga">Yoga</option>
              <option value="Pilates">Pilates</option>
              <option value="CrossFit">CrossFit</option>
              <option value="Outdoor">Outdoor</option>
              <option value="Άλλο">Άλλο</option>
            </select>
          </div>

          <button type="submit" className="btn">Κλείσιμο Ραντεβού</button>
        </form>
      </div>

      <div className="card">
        <h2>Τα Ραντεβού μου</h2>
        {userAppointments.length > 0 ? (
          <ul className="appointment-list">
            {userAppointments
              .sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time))
              .map(apt => {
                const trainer = trainers.find(t => t.id === apt.trainerId);
                const aptDate = new Date(apt.date + 'T' + apt.time);
                const isPast = aptDate < new Date();
                
                return (
                  <li key={apt.id} className="appointment-item">
                    <h4>{trainer ? trainer.name : 'Άγνωστος Trainer'}</h4>
                    <p><strong>Ημερομηνία:</strong> {apt.date}</p>
                    <p><strong>Ώρα:</strong> {apt.time}</p>
                    <p><strong>Τύπος:</strong> {apt.workoutType}</p>
                    <p><strong>Κατάσταση:</strong> {apt.status}</p>
                    {isPast && <p className="past-badge">Παρελθόν</p>}
                  </li>
                );
              })}
          </ul>
        ) : (
          <div className="empty-state">
            <p>Δεν έχετε ραντεβού</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;



