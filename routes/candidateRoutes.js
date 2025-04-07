const express = require('express');
const router = express.Router();
// Importing User model
const User = require('.././models/User');
const Candidate = require('.././models/candidate');
const { jwtAuthMiddleware } = require('../jwt');


const checkAdminRole = async (userID) => {
    try {
        // console.log(userID);
        const user = await User.findById(userID);
        // console.log(user);
        if (user.role === 'admin') {
            return true;
        }
        return false;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}

// Create a new candidate.
router.post('/', jwtAuthMiddleware, async (req, res) => {
    try {
        const userData = req.user;
        // console.log(userData.user.id);
        // Check if user is admin
        const isAdmin = await checkAdminRole(userData.user.id);
        if (!isAdmin) {
            return res.status(403).json({ message: 'Unauthorized. Only admin can create a candidate.' });
        }
        const candidate = req.body
        console.log(candidate);

        const existingParty = await Candidate.findOne({ party: candidate.party })

        if (existingParty) {
            return res.status(400).json({ message: 'Candidate with the same party already exists.' });
        }

        const newCandidate = new Candidate(candidate);
        // console.log(newCandidate);
        const savedCandidate = await newCandidate.save();
        res.status(200).json({ response: savedCandidate });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//Update an existing candidate.
router.put('/:candidateId', jwtAuthMiddleware, async (req, res) => {
    try {
        const userData = req.user;
        // Check if user is admin
        const isAdmin = await checkAdminRole(userData.user.id);

        if (!isAdmin) {
            return res.status(403).json({ message: 'Unauthorized. Only admin can update a candidate.' });
        }
        const candidateId = req.params.candidateId;
        const updateCandidateData = req.body;

        const response = await Candidate.findByIdAndUpdate(candidateId, updateCandidateData, {
            new: true,
            runValidators: true
        });

        if (!response) return res.status(404).json({ message: 'Candidate not found.' });
        console.log("updaed the candidate")
        res.status(200).json({ response: response });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:candidateId', jwtAuthMiddleware, async (req, res) => {
    try {
        const userData = req.user;
        // Check if user is admin
        const isAdmin = await checkAdminRole(userData.user.id);

        if (!isAdmin) {
            return res.status(403).json({ message: 'Unauthorized. Only admin can update a candidate.' });
        }
        const candidateId = req.params.candidateId;

        const response = await Candidate.findByIdAndDelete(candidateId);

        if (!response) return res.status(404).json({ message: 'Candidate not found.' });

        console.log("deleted the candidate")
        res.status(200).json({ response: response });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//Lets start a voting

router.post('/vote/:candidateId', jwtAuthMiddleware, async (req, res) => {

    const userData = req.user;
    const candidateId = req.params.candidateId;
    const userId = userData.user.id
    try {
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) return res.status(404).json({ message: 'Candidate not found.' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'user not found' });

        if (user.isVoted) {
            return res.status(400).json({ message: 'User has already voted for this candidate.' });
        }
        if (user.role == 'admin') {
            return res.status(403).json({ message: 'Only user can vote.' });
        }

        candidate.votes.push({ user: userId });
        candidate.voteCount++;
        await candidate.save();

        user.isVoted = true;
        await user.save();

        res.status(200).json({ message: 'Vote recorded successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//vote count

router.get('/vote/count', async (req, res) => {
    try {
        const candidates = await Candidate.find().sort({ voteCount: -1 });
        
        //Map the candidates to only return their name am=nd votecount
        const voteRecord = candidates.map((data) => {
            return { 
                party: data.party, 
                voteCount: data.voteCount 
            };
        });
        res.status(200).json(voteRecord);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//get all candidates

router.get('/all_candidates', jwtAuthMiddleware, async (req, res) => {
    try {
        // Check if user is admin
        const userData  = req.user;
        const isAdmin = await checkAdminRole(userData.user.id);
        if (!isAdmin) {
            return res.status(403).json({ message: 'Unauthorized. Only admin can view all candidates.' });
        }
        // Fetch all candidates from the database.

        const candidates = await Candidate.find();
        res.status(200).json(candidates);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;