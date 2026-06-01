import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity, LogOut, User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <Activity size={32} color="var(--primary)" />
        <span>MedFlow Pro</span>
      </Link>
      
      <div className="navbar-links">
        {user ? (
          <>
            <Link to={`/${user.role.toLowerCase()}`} className="nav-link">
              <User size={20} />
              <span>Dashboard</span>
            </Link>
            <button onClick={logout} className="btn-logout">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn-primary">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
