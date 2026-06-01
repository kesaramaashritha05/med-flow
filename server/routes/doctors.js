const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// Get All Approved Doctors
router.get('/', async (req, res) => {
    try {
        const { specialization } = req.query;
        let query = { isApproved: true };
        if (specialization && specialization !== 'All') {
            query.specialization = new RegExp(specialization, 'i');
        }

        const doctors = await Doctor.find(query).populate('user', 'name email avatar');
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Unique Specializations
router.get('/specializations', async (req, res) => {
    try {
        const specs = await Doctor.distinct('specialization', { isApproved: true });
        res.json(specs.filter(Boolean));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// One-time: Approve all existing doctors (migration)
router.put('/approve-all', async (req, res) => {
    try {
        const result = await Doctor.updateMany({ isApproved: false }, { $set: { isApproved: true } });
        res.json({ message: `Approved ${result.modifiedCount} doctors` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Single Doctor
router.get('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate('user', 'name email avatar phone');
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
