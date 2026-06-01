import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <header className="hero-section">
        <div className="hero-content">
          <h1>Modern Healthcare <br /><span>Simplified.</span></h1>
          <p>Book appointments, manage medical records, and connect with top specialists in minutes.</p>
          <div className="hero-btns">
            <Link to="/register" className="btn-primary-large">Start Journey</Link>
            <Link to="/login" className="btn-secondary-large">Existing User</Link>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <h3>500+</h3>
            <p>Verified Doctors</p>
          </div>
          <div className="stat-card">
            <h3>10k+</h3>
            <p>Happy Patients</p>
          </div>
          <div className="stat-card">
            <h3>24/7</h3>
            <p>Support</p>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Home;
