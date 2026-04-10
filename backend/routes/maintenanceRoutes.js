const express = require('express');
const router = express.Router();
const Maintenance = require('../models/Maintenance');
const Machine = require('../models/Machine');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware(['Admin', 'Staff']), async (req, res) => {
    try {
        const maintenanceRecords = await Maintenance.find().populate('machineId');
        res.json(maintenanceRecords);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', authMiddleware(['Admin', 'Staff']), async (req, res) => {
    try {
        const newMaintenance = new Maintenance(req.body);
        await newMaintenance.save();

        await Machine.findByIdAndUpdate(req.body.machineId, { status: 'Maintenance' });

        res.status(201).json(newMaintenance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
