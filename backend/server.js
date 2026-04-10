const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// --- CORS CONFIGURATION ---
// This is usually the cause of Network Errors. 
// We allow your Vercel frontend and local testing.
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://rentbraker-chi.vercel.app',
        /\.vercel\.app$/ 
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/machines', require('./routes/machineRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/rentals', require('./routes/rentalRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));

// Health Check
app.get('/', (req, res) => res.send('RentBreaker API is Online'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;