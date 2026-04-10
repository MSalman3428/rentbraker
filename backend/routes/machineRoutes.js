const express = require('express');
const router = express.Router();
const Machine = require('../models/Machine');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware(['Admin', 'Staff']), async (req, res) => {
    try {
        const machines = await Machine.find();
        res.json(machines);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', authMiddleware(['Admin']), async (req, res) => {
    try {
        const newMachine = new Machine(req.body);
        await newMachine.save();
        res.status(201).json(newMachine);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/:id', authMiddleware(['Admin']), async (req, res) => {
    try {
        const updatedMachine = await Machine.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedMachine);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id', authMiddleware(['Admin']), async (req, res) => {
    try {
        await Machine.findByIdAndDelete(req.params.id);
        res.json({ message: 'Machine deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
