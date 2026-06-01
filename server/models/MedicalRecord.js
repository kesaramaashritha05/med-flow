const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    diagnosis: { type: String, required: true },
    prescription: [{ 
        medicine: { type: String },
        dosage: { type: String },
        duration: { type: String }
    }],
    attachments: [{ 
        name: { type: String },
        url: { type: String }
    }],
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
