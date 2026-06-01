const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Get Platform Stats
router.get('/stats', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalDoctors = await Doctor.countDocuments();
        const totalAppointments = await Appointment.countDocuments();
        const pendingDoctors = await Doctor.countDocuments({ isApproved: false });

        const statusBreakdown = await Appointment.aggregate([
            { $group: { _id: "$status", value: { $sum: 1 } } }
        ]);

        const formattedBreakdown = statusBreakdown.map(item => ({
            name: item._id,
            value: item.value,
            color: item._id === 'Confirmed' ? '#10b981' : item._id === 'Pending' ? '#f59e0b' : '#ef4444'
        }));

        // Aggregate doctors by specialization
        const specializationData = await Doctor.aggregate([
            { $group: { _id: "$specialization", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const formattedSpecializations = specializationData.map(item => ({
            name: item._id || 'General',
            count: item.count
        }));

        res.json({
            totalUsers,
            totalDoctors,
            totalAppointments,
            pendingDoctors,
            statusBreakdown: formattedBreakdown,
            specializationData: formattedSpecializations
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Doctors for Approval
router.get('/doctors/pending', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
    try {
        const doctors = await Doctor.find({ isApproved: false }).populate('user', 'name email');
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Approve/Reject Doctor
router.put('/doctors/:id/approve', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
    try {
        const { isApproved } = req.body;
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, { isApproved }, { new: true });
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get All Appointments
router.get('/appointments', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('patient', 'name')
            .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
            .sort({ createdAt: -1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get All Users
router.get('/users', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete User
router.delete('/users/:id', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
