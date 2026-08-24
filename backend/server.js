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
    origin: (origin, callback) => {
        if (!origin || origin === 'http://localhost:5173' || origin === 'https://rentbraker-chi.vercel.app' || /\.vercel\.app$/.test(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Origin is not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

let databasePromise;

// --- ROUTES ---
app.use('/api', async (req, res, next) => {
    if (req.path === '/health') return next();
    try {
        await (databasePromise ||= connectDatabase());
        next();
    } catch (error) {
        res.status(503).json({ message: 'Database unavailable', detail: error.message });
    }
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/machines', require('./routes/machineRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/rentals', require('./routes/rentalRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));

// Health checks make local and hosted connection failures visible immediately.
app.get('/', (req, res) => res.json({ name: 'RentBreaker API', status: 'online' }));
app.get('/api/health', (req, res) => res.json({
    status: mongoose.connection.readyState === 1 ? 'ok' : 'degraded',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
}));

const PORT = process.env.PORT || 5000;

const connectDatabase = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is missing. Add it to backend/.env or your hosting environment.');
    }
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is missing. Add it to backend/.env or your hosting environment.');
    }
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('Connected to MongoDB');
};

const startServer = async () => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    try {
        await (databasePromise ||= connectDatabase());
    } catch (error) {
        console.error(`Database unavailable: ${error.message}`);
    }
};

if (require.main === module) {
    startServer();
}

module.exports = app;