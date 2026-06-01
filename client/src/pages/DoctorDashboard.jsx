import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Clock, User, BarChart3, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './DoctorDashboard.css';

import AvailabilityManager from './AvailabilityManager';
import './DoctorDashboard.css';
import './Availability.css';

const DoctorDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [doctorData, setDoctorData] = useState(null);

    useEffect(() => {
        const fetchDoctorProfile = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/doctors/profile');
                setDoctorData(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchDoctorProfile();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { path: '/doctor', icon: <LayoutDashboard size={20} />, label: 'Overview' },
        { path: '/doctor/appointments', icon: <Calendar size={20} />, label: 'Appointments' },
        { path: '/doctor/availability', icon: <Clock size={20} />, label: 'Availability' },
        { path: '/doctor/stats', icon: <BarChart3 size={20} />, label: 'Statistics' },
    ];

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>MedFlow Pro</h2>
                    <span>Doctor Panel</span>
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
                        <div className="avatar-sm">{user?.name ? user.name[0] : 'D'}</div>
                        <span>Dr. {user?.name || 'Doctor'}</span>
                    </div>
                </header>
                
                <section className="page-view">
                    <Routes>
                        <Route path="/" element={<DoctorOverview doctor={doctorData} />} />
                        <Route path="/appointments" element={<AppointmentManager />} />
                        <Route path="/availability" element={<AvailabilityManager />} />
                        <Route path="/stats" element={<StatsView />} />
                    </Routes>
                </section>
            </main>
        </div>
    );
};

const DoctorOverview = ({ doctor }) => {
    const [weeklyData, setWeeklyData] = useState([
        { name: 'Mon', apps: 0 },
        { name: 'Tue', apps: 0 },
        { name: 'Wed', apps: 0 },
        { name: 'Thu', apps: 0 },
        { name: 'Fri', apps: 0 },
        { name: 'Sat', apps: 0 },
        { name: 'Sun', apps: 0 },
    ]);

    useEffect(() => {
        const fetchWeekly = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/doctors/appointments');
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const counts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
                res.data.forEach(app => {
                    const day = days[new Date(app.date).getDay()];
                    if (counts[day] !== undefined) counts[day]++;
                });
                setWeeklyData(Object.entries(counts).map(([name, apps]) => ({ name, apps })));
            } catch (err) {
                console.error(err);
            }
        };
        fetchWeekly();
    }, []);

    return (
        <div className="overview-grid">
            <div className="stats-row">
                <div className="stat-box">
                    <h4>Total Appointments</h4>
                    <p>{doctor?.stats?.totalAppointments || 0}</p>
                </div>
                <div className="stat-box">
                    <h4>Total Patients</h4>
                    <p>{doctor?.stats?.totalPatients || 0}</p>
                </div>
                <div className="stat-box">
                    <h4>Average Rating</h4>
                    <p>{doctor?.rating || 0} ★</p>
                </div>
            </div>

            <div className="chart-card">
                <h3>Weekly Appointments (This Week)</h3>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}
                            />
                            <Line type="monotone" dataKey="apps" stroke="var(--primary)" strokeWidth={3} dot={{ r: 6, fill: 'var(--primary)', strokeWidth: 2, stroke: '#fff' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

const AppointmentManager = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/doctors/appointments');
                setAppointments(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:5001/api/doctors/appointments/${id}`, { status });
            setAppointments(appointments.map(a => a._id === id ? { ...a, status } : a));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <p>Loading appointments...</p>;

    return (
        <div className="appointment-manager">
            <div className="table-card">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map(app => (
                            <tr key={app._id}>
                                <td>{app.patient.name}</td>
                                <td>{new Date(app.date).toLocaleDateString()}</td>
                                <td>{app.timeSlot}</td>
                                <td>{app.reason}</td>
                                <td><span className={`status-pill ${app.status.toLowerCase()}`}>{app.status}</span></td>
                                <td className="actions-cell">
                                    {app.status === 'Pending' && (
                                        <>
                                            <button className="btn-approve" onClick={() => updateStatus(app._id, 'Confirmed')}>Approve</button>
                                            <button className="btn-reject" onClick={() => updateStatus(app._id, 'Cancelled')}>Reject</button>
                                        </>
                                    )}
                                    {app.documents?.length > 0 && (
                                        <div className="docs-dropdown">
                                            {app.documents.map((doc, i) => (
                                                <a key={i} href={`http://localhost:5001${doc.url}`} target="_blank" rel="noreferrer" className="doc-mini-link">
                                                    Doc {i+1}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const StatsView = () => {
    const [data, setData] = useState([
        { name: 'Week 1', apps: 0, earnings: 0 },
        { name: 'Week 2', apps: 0, earnings: 0 },
        { name: 'Week 3', apps: 0, earnings: 0 },
        { name: 'Week 4', apps: 0, earnings: 0 },
    ]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/doctors/appointments');
                const weeks = [
                    { name: 'Week 1', apps: 0, earnings: 0 },
                    { name: 'Week 2', apps: 0, earnings: 0 },
                    { name: 'Week 3', apps: 0, earnings: 0 },
                    { name: 'Week 4', apps: 0, earnings: 0 },
                ];
                res.data.forEach(app => {
                    const day = new Date(app.date).getDate();
                    const weekIdx = Math.min(Math.floor((day - 1) / 7), 3);
                    weeks[weekIdx].apps++;
                    weeks[weekIdx].earnings += app.fees || 0;
                });
                setData(weeks);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <p>Loading statistics...</p>;

    return (
        <div className="stats-view-container">
            <div className="admin-charts-grid">
                <div className="chart-card single-chart">
                    <h3>Monthly Appointments</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="apps" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
