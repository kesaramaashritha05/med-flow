import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Star, Filter, Briefcase, DollarSign, Mail, Clock } from 'lucide-react';
import './DoctorList.css';

const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [specialization, setSpecialization] = useState('All');

    // Fetch available specializations for filter
    useEffect(() => {
        axios.get('http://localhost:5001/api/doctors-list/specializations')
            .then(res => setSpecializations(res.data))
            .catch(console.error);
    }, []);

    // Fetch doctors when filter changes
    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            try {
                const res = await axios.get('http://localhost:5001/api/doctors-list', {
                    params: { specialization: specialization !== 'All' ? specialization : undefined }
                });
                setDoctors(res.data);
            } catch (err) {
                console.error('Failed to fetch doctors', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, [specialization]);

    const filteredDoctors = doctors.filter(doctor =>
        doctor.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading-container">Loading doctors...</div>;

    return (
        <div className="doctor-list-container">
            {/* Search & Filter Bar */}
            <div className="search-filters">
                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or specialization..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <Filter size={20} />
                    <select value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
                        <option value="All">All Specializations</option>
                        {specializations.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Results Count */}
            <p className="results-count">
                {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
            </p>

            {/* Doctor Cards */}
            <div className="doctor-grid">
                {filteredDoctors.length === 0 ? (
                    <div className="empty-state">
                        <p>No doctors found. Try a different search or filter.</p>
                    </div>
                ) : (
                    filteredDoctors.map(doctor => (
                        <div key={doctor._id} className="doctor-card">
                            {/* Avatar */}
                            <div className="doctor-avatar-large">
                                {doctor.user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>

                            {/* Info Block */}
                            <div className="doctor-info">
                                <h3>Dr. {doctor.user?.name}</h3>
                                <p className="spec">{doctor.specialization}</p>

                                {/* Rating */}
                                <div className="doctor-meta">
                                    <div className="meta-item">
                                        <Star size={15} fill="#f59e0b" color="#f59e0b" />
                                        <span>{doctor.rating ? doctor.rating.toFixed(1) : 'New'}</span>
                                    </div>
                                    <div className="meta-item">
                                        <Clock size={15} />
                                        <span>{doctor.experience} yr{doctor.experience !== 1 ? 's' : ''} exp</span>
                                    </div>
                                </div>

                                {/* Email */}
                                {doctor.user?.email && (
                                    <div className="meta-item email-meta">
                                        <Mail size={14} />
                                        <span>{doctor.user.email}</span>
                                    </div>
                                )}

                                {/* Approved badge */}
                                <div className="approved-badge">✓ Verified Doctor</div>

                                {/* Footer: Fee + Book */}
                                <div className="doctor-footer">
                                    <div className="fees-badge">
                                        <DollarSign size={14} />
                                        <span>${doctor.fees} / visit</span>
                                    </div>
                                    <Link to={`/patient/book/${doctor._id}`} className="btn-book-sm">
                                        Book Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DoctorList;
