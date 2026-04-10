const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/machines', require('./routes/machineRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/rentals', require('./routes/rentalRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));

/**
 * Database Connection Logic
 * Priorities: 
 * 1. Use MONGODB_URI from .env (Atlas/Cloud)
 * 2. Fallback to MongoMemoryServer for development/testing
 */
const startServer = async () => {
    try {
        let connectionString = process.env.MONGODB_URI;

        if (!connectionString) {
            console.log('⚠️ No MONGODB_URI found in .env. Launching in-memory database...');
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            connectionString = mongoServer.getUri();
        } else {
            console.log('🌐 Connecting to MongoDB Atlas...');
        }

        // Connect to MongoDB
        await mongoose.connect(connectionString);
        
        console.log(`✅ Connected to MongoDB: ${mongoose.connection.name}`);

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1); // Exit process with failure
    }
};

startServer();