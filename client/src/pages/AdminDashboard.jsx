import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, Calendar, PieChart as PieChartIcon, LogOut } from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell 
} from 'recharts';
import UserManagement from './UserManagement';
import AllAppointments from './AllAppointments';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ 
        totalUsers: 0, 
        totalDoctors: 0, 
        totalAppointments: 0, 
        pendingDoctors: 0,
        statusBreakdown: [],
        specializationData: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/admin/stats');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };



    if (loading) return <div className="loading-container">Loading Dashboard...</div>;

    const menuItems = [
        { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Overview' },
        { path: '/admin/approvals', icon: <UserCheck size={20} />, label: 'Doctor Approvals' },
        { path: '/admin/users', icon: <Users size={20} />, label: 'User Management' },
        { path: '/admin/appointments', icon: <Calendar size={20} />, label: 'All Appointments' },
    ];

    return (
        <div className="dashboard-layout">
            <aside className="sidebar admin-sidebar">
                <div className="sidebar-header">
                    <h2>MedFlow Pro</h2>
                    <span>Admin Panel</span>
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
                    <h1>{menuItems.find(i => i.path === location.pathname)?.label || 'Overview'}</h1>
                    <div className="user-profile-sm">
                        <div className="avatar-sm admin">{user?.name ? user.name[0] : 'A'}</div>
                        <span>{user?.name || 'Admin'}</span>
                    </div>
                </header>
                
                <section className="page-view">
                    <Routes>
                        <Route path="/" element={<AdminOverview stats={stats} statusBreakdown={stats.statusBreakdown} specializationData={stats.specializationData} />} />
                        <Route path="/approvals" element={<DoctorApprovals />} />
                        <Route path="/users" element={<UserManagement />} />
                        <Route path="/appointments" element={<AllAppointments />} />
                    </Routes>
                </section>
            </main>
        </div>
    );
};

const AdminOverview = ({ stats, statusBreakdown, specializationData }) => {
    const barData = specializationData && specializationData.length > 0 ? specializationData : [
        { name: 'No doctors yet', count: 0 }
    ];

    const pieData = statusBreakdown && statusBreakdown.length > 0 ? statusBreakdown : [
        { name: 'No Data', value: 1, color: '#e2e8f0' }
    ];

    return (
        <div className="admin-overview">
            <div className="stats-row">
                <div className="stat-box primary">
                    <h4>Total Doctors</h4>
                    <p>{stats.totalDoctors}</p>
                </div>
                <div className="stat-box success">
                    <h4>Total Users</h4>
                    <p>{stats.totalUsers}</p>
                </div>
                <div className="stat-box warning">
                    <h4>Pending Approvals</h4>
                    <p>{stats.pendingDoctors}</p>
                </div>
            </div>

            <div className="admin-charts-grid">
                <div className="chart-card">
                    <h3>Specialization Distribution</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <h3>Appointment Status</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie 
                                    data={pieData} 
                                    innerRadius={60} 
                                    outerRadius={80} 
                                    paddingAngle={5} 
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="pie-legend">
                            {pieData.map(d => (
                                <div key={d.name} className="legend-item">
                                    <span style={{ background: d.color }}></span>
                                    {d.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DoctorApprovals = () => {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchPending = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/admin/doctors/pending');
                setPending(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPending();
    }, []);

    const handleAction = async (id, status) => {
        try {
            await axios.put(`http://localhost:5001/api/admin/doctors/${id}/approve`, { isApproved: status });
            setPending(pending.filter(doc => doc._id !== id));
            showToast(`Doctor ${status ? 'approved' : 'rejected'} successfully`);
        } catch (err) {
            showToast('Action failed', 'error');
        }
    };

    if (loading) return <p>Loading pending approvals...</p>;

    return (
        <div className="approvals-container">
            <div className="table-card">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Doctor Name</th>
                            <th>Specialization</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pending.map(doc => (
                            <tr key={doc._id}>
                                <td>{doc.user.name}</td>
                                <td>{doc.specialization}</td>
                                <td>{doc.user.email}</td>
                                <td className="actions-cell">
                                    <button className="btn-approve" onClick={() => handleAction(doc._id, true)}>Approve</button>
                                    <button className="btn-reject" onClick={() => handleAction(doc._id, false)}>Reject</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {pending.length === 0 && <p className="empty-msg">No pending approvals</p>}
            </div>
        </div>
    );
};

export default AdminDashboard;
