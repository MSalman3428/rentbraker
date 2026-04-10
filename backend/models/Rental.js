const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    machineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Machine', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalRent: { type: Number, required: true },
    advancePayment: { type: Number, default: 0 },
    remainingBalance: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Active', 'Completed'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Rental', rentalSchema);
