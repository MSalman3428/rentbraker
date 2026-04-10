const express = require('express');
const router = express.Router();
const Rental = require('../models/Rental');
const Machine = require('../models/Machine');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware(['Admin', 'Staff']), async (req, res) => {
    try {
        const rentals = await Rental.find().populate('machineId').populate('customerId');
        res.json(rentals);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', authMiddleware(['Admin', 'Staff']), async (req, res) => {
    try {
        const { machineId, customerId, startDate, endDate, totalRent, advancePayment, remainingBalance } = req.body;
        const newRental = new Rental({ machineId, customerId, startDate, endDate, totalRent, advancePayment, remainingBalance });
        await newRental.save();

        await Machine.findByIdAndUpdate(machineId, { status: 'Rented' });

        res.status(201).json(newRental);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/:id', authMiddleware(['Admin', 'Staff']), async (req, res) => {
    try {
        const updatedRental = await Rental.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (req.body.status === 'Completed') {
            await Machine.findByIdAndUpdate(updatedRental.machineId, { status: 'Available' });
        }
        res.json(updatedRental);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
