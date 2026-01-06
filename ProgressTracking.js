import React, { useState, useEffect } from 'react';
import { getProgressEntries, saveProgressEntry } from '../data/mockData';
import './ProgressTracking.css';

const ProgressTracking = ({ user }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    runningTime: '',
    notes: ''
  });
  const [entries, setEntries] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const allEntries = getProgressEntries();
    const userEntries = allEntries
      .filter(entry => entry.userId === user.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    setEntries(userEntries);
  }, [user.id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');

    if (!formData.weight && !formData.runningTime && !formData.notes) {
      setMessage('Συμπληρώστε τουλάχιστον ένα πεδίο');
      return;
    }

    const entry = {
      id: Date.now(),
      userId: user.id,
      date: formData.date,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      runningTime: formData.runningTime || null,
      notes: formData.notes || '',
      createdAt: new Date().toISOString()
    };

    saveProgressEntry(entry);
    setMessage('Η καταγραφή προόδου αποθηκεύτηκε επιτυχώς!');
    
    // Update entries list
    setEntries([entry, ...entries]);

    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      weight: '',
      runningTime: '',
      notes: ''
    });

    setTimeout(() => setMessage(''), 3000);
  };

  const calculateWeightChange = () => {
    if (entries.length < 2) return null;
    
    const sortedEntries = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
    const firstWeight = sortedEntries.find(e => e.weight)?.weight;
    const lastWeight = sortedEntries.reverse().find(e => e.weight)?.weight;
    
    if (firstWeight && lastWeight) {
      const change = lastWeight - firstWeight;
      return change > 0 ? `+${change.toFixed(1)} kg` : `${change.toFixed(1)} kg`;
    }
    return null;
  };

  return (
    <div className="progress-tracking">
      <h1 className="page-title">Καταγραφή Προόδου</h1>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          {message && (
            <div className="message success">
              {message}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="date">Ημερομηνία:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="weight">Βάρος (kg):</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              step="0.1"
              min="0"
              placeholder="π.χ. 75.5"
            />
          </div>

          <div className="form-group">
            <label htmlFor="runningTime">Χρόνος Τρεξίματος (λεπτά):</label>
            <input
              type="number"
              id="runningTime"
              name="runningTime"
              value={formData.runningTime}
              onChange={handleChange}
              min="0"
              placeholder="π.χ. 30"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Σημειώσεις:</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Προαιρετικές σημειώσεις..."
            />
          </div>

          <button type="submit" className="btn">Αποθήκευση</button>
        </form>
      </div>

      <div className="card">
        <h2>Ιστορικό Προόδου</h2>
        {entries.length > 0 ? (
          <>
            {calculateWeightChange() && (
              <div className="weight-summary">
                <strong>Συνολική Μεταβολή Βάρους:</strong> {calculateWeightChange()}
              </div>
            )}
            <div className="progress-entries">
              {entries.map(entry => (
                <div key={entry.id} className="progress-entry">
                  <h4>{entry.date}</h4>
                  {entry.weight && (
                    <p><strong>Βάρος:</strong> {entry.weight} kg</p>
                  )}
                  {entry.runningTime && (
                    <p><strong>Χρόνος Τρεξίματος:</strong> {entry.runningTime} λεπτά</p>
                  )}
                  {entry.notes && (
                    <p><strong>Σημειώσεις:</strong> {entry.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <p>Δεν υπάρχουν καταγραφές προόδου</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTracking;



