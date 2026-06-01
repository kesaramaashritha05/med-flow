import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, User, MessageSquare, AlertCircle } from 'lucide-react';

const PatientAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/appointments/patient');
                setAppointments(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    if (loading) return <div>Loading appointments...</div>;

    return (
        <div className="appointments-list">
            {appointments.length === 0 ? (
                <div className="empty-state">
                    <AlertCircle size={48} color="var(--text-muted)" />
                    <p>No appointments found. Start by finding a doctor!</p>
                </div>
            ) : (
                <div className="table-card">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Doctor</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th>Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(app => (
                                <tr key={app._id}>
                                    <td>
                                        <div className="user-info-cell">
                                            <div className="avatar-xs">{app.doctor.user.name[0]}</div>
                                            <span>{app.doctor.user.name}</span>
                                        </div>
                                    </td>
                                    <td>{new Date(app.date).toLocaleDateString()}</td>
                                    <td>{app.timeSlot}</td>
                                    <td><span className={`status-pill ${app.status.toLowerCase()}`}>{app.status}</span></td>
                                    <td className="reason-cell">{app.reason}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PatientAppointments;
