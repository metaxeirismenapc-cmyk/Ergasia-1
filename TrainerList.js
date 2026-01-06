import React from 'react';
import { trainers } from '../data/mockData';
import './TrainerList.css';

const TrainerList = () => {
  return (
    <div className="trainer-list">
      <h1 className="page-title">Διαθέσιμοι Trainers</h1>
      <div className="trainer-grid">
        {trainers.map(trainer => (
          <div key={trainer.id} className="trainer-card">
            <h3>{trainer.name}</h3>
            <p><strong>Ειδίκευση:</strong> {trainer.specialization}</p>
            <p><strong>Περιοχή:</strong> {trainer.area}</p>
            <p><strong>Email:</strong> {trainer.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerList;



