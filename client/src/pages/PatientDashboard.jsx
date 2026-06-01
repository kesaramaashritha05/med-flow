import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Calendar, FileText, Settings, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import DoctorList from './DoctorList';
import BookingFlow from './BookingFlow';
import PatientAppointments from './PatientAppointments';
import MedicalRecords from './MedicalRecords';
import './PatientDashboard.css';
import './RecordsStyles.css';

const PatientDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({ appointments: 0, records: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [appRes, recRes] = await Promise.all([
                    axios.get('http://localhost:5001/api/appointments/patient'),
                    axios.get('http://localhost:5001/api/records/my-records')
                ]);
                setStats({
                    appointments: appRes.data.length,
                    records: recRes.data.length
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) return <div className="loading-container">Loading Dashboard...</div>;

    const menuItems = [
        { path: '/patient', icon: <LayoutDashboard size={20} />, label: 'Overview' },
        { path: '/patient/doctors', icon: <Search size={20} />, label: 'Find Doctors' },
        { path: '/patient/appointments', icon: <Calendar size={20} />, label: 'Appointments' },
        { path: '/patient/records', icon: <FileText size={20} />, label: 'My Records' }
    ];

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>MedFlow</h2>
                </div>
                <nav className="sidebar-nav">
                    {menuItems.map(item => (
                        <Link 
                            key={item.path} 
                            to={item.path} 
                            className={`side-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                    <button onClick={handleLogout} className="side-link logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </nav>
            </aside>
            
            <main className="dashboard-content">
                <header className="content-header">
                    <h1>{menuItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}</h1>
                    <div className="user-profile-sm">
                        <div className="avatar-sm">{user?.name ? user.name[0] : 'P'}</div>
                        <span>{user?.name || 'Patient'}</span>
                    </div>
                </header>
                
                <section className="page-view">
                    <Routes>
                        <Route path="/" element={<PatientOverview stats={stats} user={user} />} />
                        <Route path="/doctors" element={<DoctorList />} />
                        <Route path="/book/:doctorId" element={<BookingFlow />} />
                        <Route path="/appointments" element={<PatientAppointments />} />
                        <Route path="/records" element={<MedicalRecords />} />
                    </Routes>
                </section>
            </main>

            <nav className="mobile-tab-bar">
                {menuItems.slice(0, 4).map(item => (
                    <Link 
                        key={item.path} 
                        to={item.path} 
                        className={`tab-link ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        {item.icon}
                    </Link>
                ))}
            </nav>
        </div>
    );
};

const PatientOverview = ({ stats, user }) => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/doctors-list');
                setDoctors(res.data.slice(0, 3)); // Show top 3
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    return (
        <div className="overview-container">
            <div className="overview-grid">
                <div className="welcome-banner">
                    <div className="banner-text">
                        <h2>Welcome back, {user?.name}!</h2>
                        <p>You have {stats.appointments} appointments scheduled in total.</p>
                    </div>
                    <Link to="/patient/doctors" className="btn-primary-sm">Book New Appointment</Link>
                </div>
                <div className="stats-row">
                    <div className="stat-box">
                        <Calendar className="stat-icon" size={24} />
                        <div>
                            <h4>Total Bookings</h4>
                            <p>{stats.appointments}</p>
                        </div>
                    </div>
                    <div className="stat-box">
                        <FileText className="stat-icon" size={24} />
                        <div>
                            <h4>Medical Records</h4>
                            <p>{stats.records}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section-header">
                <h3>Available Doctors</h3>
                <Link to="/patient/doctors" className="view-all">View All</Link>
            </div>

            {loading ? (
                <div className="loading-sm">Loading doctors...</div>
            ) : (
                <div className="doctor-preview-grid">
                    {doctors.map(doctor => (
                        <div key={doctor._id} className="preview-card">
                            <div className="preview-avatar">
                                {doctor.user?.name?.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="preview-info">
                                <h4>Dr. {doctor.user?.name}</h4>
                                <p>{doctor.specialization}</p>
                                <div className="preview-footer">
                                    <span className="preview-rating">⭐ {doctor.rating || 'New'}</span>
                                    <Link to={`/patient/book/${doctor._id}`} className="btn-book-xs">Book</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                    {doctors.length === 0 && <p className="empty-text">No doctors available at the moment.</p>}
                </div>
            )}
        </div>
    );
};

export default PatientDashboard;
