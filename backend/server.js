const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// 1. IMPROVED CORS CONFIGURATION
// This allows your specific Vercel frontend and local development
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'https://rentbraker-chi.vercel.app',
        /\.vercel\.app$/ 
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// 2. DATABASE CONNECTION
// Connect outside of a function for better performance on Vercel
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ ERROR: MONGODB_URI is not defined in .env file');
} else {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log(`✅ Connected to MongoDB: ${mongoose.connection.name}`))
        .catch(err => console.error('❌ MongoDB Connection Error:', err.message));
}

// 3. ROUTES
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/machines', require('./routes/machineRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/rentals', require('./routes/rentalRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));

// 4. ROOT ROUTE (To check if backend is alive)
app.get('/', (req, res) => {
    res.send('RentBreaker API is running...');
});

// 5. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app; // Required for Vercel