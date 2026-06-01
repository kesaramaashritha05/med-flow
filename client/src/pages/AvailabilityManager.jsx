import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Plus, Trash2, CheckCircle } from 'lucide-react';
import { useToast } from '../components/ui/Toast';

const AvailabilityManager = () => {
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/doctors/profile');
                setAvailability(res.data.availability || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAvailability();
    }, []);

    const handleAddSlot = (day) => {
        const newAvailability = [...availability];
        const dayIdx = newAvailability.findIndex(d => d.day === day);
        if (dayIdx > -1) {
            newAvailability[dayIdx].slots.push('09:00 AM');
        } else {
            newAvailability.push({ day, slots: ['09:00 AM'] });
        }
        setAvailability(newAvailability);
    };

    const handleRemoveSlot = (day, slotIdx) => {
        const newAvailability = [...availability];
        const dayIdx = newAvailability.findIndex(d => d.day === day);
        newAvailability[dayIdx].slots.splice(slotIdx, 1);
        setAvailability(newAvailability);
    };

    const handleUpdateSlot = (day, slotIdx, value) => {
        const newAvailability = [...availability];
        const dayIdx = newAvailability.findIndex(d => d.day === day);
        newAvailability[dayIdx].slots[slotIdx] = value;
        setAvailability(newAvailability);
    };

    const handleSave = async () => {
        try {
            await axios.put('http://localhost:5001/api/doctors/availability', { availability });
            showToast('Availability updated successfully');
        } catch (err) {
            showToast('Failed to update availability', 'error');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="availability-manager">
            <div className="availability-grid">
                {days.map(day => {
                    const dayData = availability.find(d => d.day === day);
                    return (
                        <div key={day} className="day-card">
                            <div className="day-header">
                                <h4>{day}</h4>
                                <button className="btn-icon-sm" onClick={() => handleAddSlot(day)}>
                                    <Plus size={16} />
                                </button>
                            </div>
                            <div className="slots-list-managed">
                                {dayData?.slots.map((slot, idx) => (
                                    <div key={idx} className="slot-item-managed">
                                        <input 
                                            type="text" 
                                            value={slot} 
                                            onChange={(e) => handleUpdateSlot(day, idx, e.target.value)} 
                                        />
                                        <button onClick={() => handleRemoveSlot(day, idx)}>
                                            <Trash2 size={14} color="var(--danger)" />
                                        </button>
                                    </div>
                                ))}
                                {(!dayData || dayData.slots.length === 0) && <p className="no-slots">No slots</p>}
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="manager-footer">
                <button className="btn-primary" onClick={handleSave}>
                    <CheckCircle size={18} /> Save Changes
                </button>
            </div>
        </div>
    );
};

export default AvailabilityManager;
