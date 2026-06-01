const express = require('express');
const router = express.Router();
const MedicalRecord = require('../models/MedicalRecord');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Create Record (Doctor only)
router.post('/', authMiddleware, roleMiddleware(['Doctor']), upload.array('attachments', 5), async (req, res) => {
    try {
        const { patientId, diagnosis, prescription } = req.body;
        const doctor = await Doctor.findOne({ user: req.user.id });

        const attachments = req.files.map(file => ({
            name: file.originalname,
            url: `/uploads/${file.filename}`
        }));

        const record = new MedicalRecord({
            patient: patientId,
            doctor: doctor._id,
            diagnosis,
            prescription: JSON.parse(prescription),
            attachments
        });

        await record.save();
        res.status(201).json(record);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get My Records (Patient only)
router.get('/my-records', authMiddleware, roleMiddleware(['Patient']), async (req, res) => {
    try {
        const records = await MedicalRecord.find({ patient: req.user.id })
            .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
            .sort({ date: -1 });
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
