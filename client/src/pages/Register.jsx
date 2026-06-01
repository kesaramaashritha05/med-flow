import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import { Mail, Lock, User, Briefcase, DollarSign, Loader } from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import './Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [step, setStep] = useState(1);
    const [role, setRole] = useState('Patient');
    const [formData, setFormData] = useState({
        name: '', email: '', password: '',
        specialization: '', experience: '', fees: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:5001/api/auth/register', { ...formData, role });
            showToast('Registration successful! Please login.');
            navigate('/login');
            login(res.data.user, res.data.token);
            navigate(`/${res.data.user.role.toLowerCase()}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <Navbar />
            <div className="auth-card-wrapper">
                <form className="auth-card" onSubmit={handleSubmit}>
                    <h2>Create Account</h2>
                    <p>Join MedFlow Pro as a {role}</p>

                    {error && <div className="auth-error">{error}</div>}

                    {step === 1 ? (
                        <div className="role-selector">
                            <label>I am a:</label>
                            <div className="role-options">
                                <div 
                                    className={`role-option ${role === 'Patient' ? 'active' : ''}`}
                                    onClick={() => setRole('Patient')}
                                >Patient</div>
                                <div 
                                    className={`role-option ${role === 'Doctor' ? 'active' : ''}`}
                                    onClick={() => setRole('Doctor')}
                                >Doctor</div>
                                <div 
                                    className={`role-option ${role === 'Admin' ? 'active' : ''}`}
                                    onClick={() => setRole('Admin')}
                                >Admin</div>
                            </div>
                            <button type="button" className="btn-auth" onClick={() => setStep(2)}>Continue</button>
                        </div>
                    ) : (
                        <>
                            <div className="input-group">
                                <label>Full Name</label>
                                <div className="input-with-icon">
                                    <User size={20} />
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Email Address</label>
                                <div className="input-with-icon">
                                    <Mail size={20} />
                                    <input 
                                        type="email" 
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
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    />
                                </div>
                            </div>

                            {role === 'Doctor' && (
                                <div className="doctor-fields">
                                    <div className="input-group">
                                        <label>Specialization</label>
                                        <div className="input-with-icon">
                                            <Briefcase size={20} />
                                            <input 
                                                type="text" 
                                                placeholder="e.g. Cardiologist"
                                                required
                                                value={formData.specialization}
                                                onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-group">
                                            <label>Experience (Yrs)</label>
                                            <input 
                                                type="number" 
                                                required
                                                value={formData.experience}
                                                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>Fees ($)</label>
                                            <div className="input-with-icon">
                                                <DollarSign size={20} />
                                                <input 
                                                    type="number" 
                                                    required
                                                    value={formData.fees}
                                                    onChange={(e) => setFormData({...formData, fees: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="auth-btns">
                                <button type="button" className="btn-back" onClick={() => setStep(1)}>Back</button>
                                <button type="submit" className="btn-auth" disabled={loading}>
                                    {loading ? <Loader className="spin" /> : 'Create Account'}
                                </button>
                            </div>
                        </>
                    )}

                    <p className="auth-footer">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
