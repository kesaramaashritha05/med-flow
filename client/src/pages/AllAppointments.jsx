import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/admin/appointments');
                setAppointments(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    if (loading) return <div>Loading all appointments...</div>;

    return (
        <div className="all-appointments">
            <div className="table-card">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map(app => (
                            <tr key={app._id}>
                                <td>{app.patient?.name}</td>
                                <td>Dr. {app.doctor?.user?.name}</td>
                                <td>{new Date(app.date).toLocaleDateString()}</td>
                                <td><span className={`status-pill ${app.status.toLowerCase()}`}>{app.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllAppointments;
