import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <h1 className="page-title">Καλώς ήρθατε στο FitTrack</h1>
      <div className="home-content">
        <div className="card">
          <h2>Σχετικά με το FitTrack</h2>
          <p>
            Το FitTrack είναι μια πλατφόρμα οργάνωσης προπονήσεων, ραντεβού με personal trainers 
            και παρακολούθησης προόδου. Εξερευνήστε διαθέσιμους trainers, κλείστε ραντεβού 
            και παρακολουθήστε την πρόοδό σας.
          </p>
        </div>

        <div className="card">
          <h2>Ξεκινήστε τώρα</h2>
          <div className="home-actions">
            <Link to="/trainers" className="btn">
              Προβολή Trainers
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Εγγραφή
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Σύνδεση
            </Link>
          </div>
        </div>

        <div className="card">
          <h2>Λειτουργίες</h2>
          <ul className="features-list">
            <li>Προβολή διαθέσιμων trainers με ειδίκευση και περιοχή</li>
            <li>Κλείσιμο ραντεβού με trainers</li>
            <li>Διαχείριση προφίλ και στόχων</li>
            <li>Καταγραφή προόδου (βάρος, χρόνος τρεξίματος, κ.λπ.)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;



