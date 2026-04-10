const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    capacity: { type: String, required: true },
    rentalPricePerDay: { type: Number, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ['Available', 'Rented', 'Maintenance'], default: 'Available' }
}, { timestamps: true });

module.exports = mongoose.model('Machine', machineSchema);
