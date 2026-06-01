const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    fees: { type: Number, required: true },
    bio: { type: String },
    availability: [{
        day: { type: String },
        slots: [{ type: String }] // e.g., "09:00 AM"
    }],
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: true },
    stats: {
        totalPatients: { type: Number, default: 0 },
        totalAppointments: { type: Number, default: 0 }
    }
});

module.exports = mongoose.model('Doctor', doctorSchema);
