const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { authMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Create Appointment
router.post('/book', authMiddleware, upload.array('documents', 5), async (req, res) => {
    try {
        const { doctorId, date, timeSlot, reason } = req.body;
        const patientId = req.user.id;

        const documents = req.files.map(file => ({
            name: file.originalname,
            url: `/uploads/${file.filename}`
        }));

        const appointment = new Appointment({
            patient: patientId,
            doctor: doctorId,
            date,
            timeSlot,
            reason,
            documents
        });

        await appointment.save();

        // Update doctor stats (simplified)
        await Doctor.findByIdAndUpdate(doctorId, { $inc: { 'stats.totalAppointments': 1 } });

        res.status(201).json(appointment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Patient Appointments
router.get('/patient', authMiddleware, async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user.id })
            .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
            .sort({ date: -1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
