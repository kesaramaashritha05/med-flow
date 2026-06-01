import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import { Mail, Lock, Loader } from 'lucide-react';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:5001/api/auth/login', formData);
            login(res.data.user, res.data.token);
            navigate(`/${res.data.user.role.toLowerCase()}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <Navbar />
            <div className="auth-card-wrapper">
                <form className="auth-card" onSubmit={handleSubmit}>
                    <h2>Welcome Back</h2>
                    <p>Enter your credentials to access your dashboard</p>
                    
                    {error && <div className="auth-error">{error}</div>}

                    <div className="input-group">
                        <label>Email Address</label>
                        <div className="input-with-icon">
                            <Mail size={20} />
                            <input 
                                type="email" 
                                placeholder="name@example.com"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <div className="input-with-icon">
                            <Lock size={20} />
                            <input 
                                type="password" 
                                placeholder="••••••••"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-auth" disabled={loading}>
                        {loading ? <Loader className="spin" /> : 'Login'}
                    </button>

                    <p className="auth-footer">
                        Don't have an account? <Link to="/register">Create one</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
