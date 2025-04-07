const express = require('express');
const router = express.Router();
// Importing User model
const User = require('../../models/User');
const Candidate = require('../../models/candidate');

// Create a new candidate.
router.post('/', async (req, res) => {
    try {
        const candidate = new Candidate({
            name: req.body.name,
            age: req.body.age,
            party: req.body.party,
            voteCount: 0,
            createdBy: req.user._id
        });

        const savedCandidate = await candidate.save();
        res.status(201).json(savedCandidate);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});