const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
    machineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Machine', required: true },
    date: { type: Date, required: true },
    issue: { type: String, required: true },
    cost: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);
