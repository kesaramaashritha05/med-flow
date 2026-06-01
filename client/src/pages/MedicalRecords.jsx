import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Download, User, Calendar, Plus } from 'lucide-react';

const MedicalRecords = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/records/my-records');
                setRecords(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecords();
    }, []);

    if (loading) return <div>Loading records...</div>;

    return (
        <div className="records-container">
            <div className="records-grid">
                {records.length === 0 ? (
                    <div className="empty-state">
                        <FileText size={48} color="var(--text-muted)" />
                        <p>No medical records found.</p>
                    </div>
                ) : (
                    records.map(record => (
                        <div key={record._id} className="record-card">
                            <div className="record-header">
                                <FileText size={24} color="var(--primary)" />
                                <div>
                                    <h4>{record.diagnosis}</h4>
                                    <span>{new Date(record.date).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="record-body">
                                <p><strong>Doctor:</strong> {record.doctor.user.name}</p>
                                <div className="prescriptions">
                                    <strong>Prescription:</strong>
                                    {record.prescription.map((p, i) => (
                                        <div key={i} className="prescription-item">
                                            {p.medicine} - {p.dosage} ({p.duration})
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {record.attachments.length > 0 && (
                                <div className="record-footer">
                                    {record.attachments.map((file, i) => (
                                        <a 
                                            key={i} 
                                            href={`http://localhost:5001${file.url}`} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="attachment-link"
                                        >
                                            <Download size={14} /> {file.name}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MedicalRecords;
