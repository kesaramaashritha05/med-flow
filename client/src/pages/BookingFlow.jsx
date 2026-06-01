import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, FileText, Upload, CheckCircle, ChevronRight, ChevronLeft, Loader } from 'lucide-react';
import './BookingFlow.css';

const BookingFlow = () => {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [doctor, setDoctor] = useState(null);
    
    // Form data
    const [date, setDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [reason, setReason] = useState('');
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/api/doctors-list/${doctorId}`);
                setDoctor(res.data);
            } catch (err) {
                console.error("Failed to fetch doctor for booking", err);
            }
        };
        fetchDoctor();
    }, [doctorId]);

    const handleSubmit = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('doctorId', doctorId);
        formData.append('date', date);
        formData.append('timeSlot', timeSlot);
        formData.append('reason', reason);
        files.forEach(file => formData.append('documents', file));

        try {
            await axios.post('http://localhost:5001/api/appointments/book', formData);
            setStep(4); // Success step
        } catch (err) {
            alert('Booking failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const slots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

    const renderStep = () => {
        switch(step) {
            case 1:
                return (
                    <div className="step-content">
                        <h3>Select Date & Time</h3>
                        <div className="input-group">
                            <label><Calendar size={18} /> Choose Date</label>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                        </div>
                        <div className="slots-grid">
                            {slots.map(slot => (
                                <button 
                                    key={slot} 
                                    className={`slot-btn ${timeSlot === slot ? 'active' : ''}`}
                                    onClick={() => setTimeSlot(slot)}
                                >
                                    <Clock size={16} /> {slot}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="step-content">
                        <h3>Reason for Visit</h3>
                        <textarea 
                            placeholder="Briefly describe your symptoms or reason for visit..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>
                );
            case 3:
                return (
                    <div className="step-content">
                        <h3>Upload Documents (Optional)</h3>
                        <p className="hint">PDF, JPG, PNG (Max 10MB per file)</p>
                        <div className="file-upload-area">
                            <Upload size={32} />
                            <input 
                                type="file" 
                                multiple 
                                onChange={(e) => setFiles([...files, ...Array.from(e.target.files)])} 
                            />
                            <span>Click to browse or drag and drop</span>
                        </div>
                        <div className="file-list">
                            {files.map((f, i) => (
                                <div key={i} className="file-item">
                                    <FileText size={16} />
                                    <span>{f.name}</span>
                                    <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))}>&times;</button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="success-content">
                        <CheckCircle size={64} color="var(--success)" />
                        <h2>Booking Confirmed!</h2>
                        <p>Your appointment with Dr. {doctor.user?.name} has been scheduled.</p>
                        <button className="btn-primary" onClick={() => navigate('/patient/appointments')}>View Appointments</button>
                    </div>
                );
            default: return null;
        }
    };

    if (!doctor) return <div>Loading doctor...</div>;

    return (
        <div className="booking-container">
            <div className="booking-card">
                <div className="booking-header">
                    <div className="steps-indicator">
                        {[1, 2, 3].map(s => (
                            <div key={s} className={`step-dot ${step >= s ? 'active' : ''} ${step === 4 ? 'done' : ''}`}>{s}</div>
                        ))}
                    </div>
                    {step < 4 && (
                        <div className="doctor-sm-card">
                            <h4>Dr. {doctor.user?.name}</h4>
                            <span>{doctor.specialization} • ${doctor.fees}</span>
                        </div>
                    )}
                </div>

                {renderStep()}

                {step < 4 && (
                    <div className="booking-footer">
                        {step > 1 && (
                            <button className="btn-secondary" onClick={() => setStep(step - 1)}>
                                <ChevronLeft size={20} /> Back
                            </button>
                        )}
                        <button 
                            className="btn-primary" 
                            disabled={loading || (step === 1 && (!date || !timeSlot)) || (step === 2 && !reason)}
                            onClick={() => step === 3 ? handleSubmit() : setStep(step + 1)}
                        >
                            {loading ? <Loader className="spin" size={20} /> : (
                                <>
                                    {step === 3 ? 'Confirm Booking' : 'Next'}
                                    {step < 3 && <ChevronRight size={20} />}
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingFlow;
