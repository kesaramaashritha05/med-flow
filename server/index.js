const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointment');
const doctorRoutes = require('./routes/doctor');
const adminRoutes = require('./routes/admin');
const doctorsRoutes = require('./routes/doctors');
const recordsRoutes = require('./routes/records');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// DB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medflow')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctors-list', doctorsRoutes);
app.use('/api/records', recordsRoutes);

app.get('/', (req, res) => {
    res.send('MedFlow Pro API is running...');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
