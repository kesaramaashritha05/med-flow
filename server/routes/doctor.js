const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Get Doctor Profile
router.get('/profile', authMiddleware, roleMiddleware(['Doctor']), async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ user: req.user.id }).populate('user', 'name email avatar');
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Availability
router.put('/availability', authMiddleware, roleMiddleware(['Doctor']), async (req, res) => {
    try {
        const { availability } = req.body;
        const doctor = await Doctor.findOneAndUpdate(
            { user: req.user.id },
            { availability },
            { new: true }
        );
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Doctor Appointments
router.get('/appointments', authMiddleware, roleMiddleware(['Doctor']), async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ user: req.user.id });
        const appointments = await Appointment.find({ doctor: doctor._id })
            .populate('patient', 'name email phone')
            .sort({ date: 1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Manage Appointment Status
router.put('/appointments/:id', authMiddleware, roleMiddleware(['Doctor']), async (req, res) => {
    try {
        const { status } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(appointment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
