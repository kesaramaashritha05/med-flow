const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    reason: { type: String },
    status: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'], 
        default: 'Pending' 
    },
    documents: [{ 
        name: { type: String },
        url: { type: String }
    }],
    paymentStatus: { type: String, enum: ['Unpaid', 'Paid'], default: 'Unpaid' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
