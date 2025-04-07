const express = require('express');
const router = express.Router();
// Importing User model
const User = require('.././models/User');
const Candidate = require('.././models/candidate');
// Middleware for JWT authentication
const { jwtAuthMiddleware, generateToken } = require('../jwt') ;

// Registering a new user
router.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        const newUser = new User(data);
        if(newUser.aadharCardNumber.length!=12){
            return res.status(400).json({ error: 'Invalid Aadhar Card Number' });
        }
        const userExists = await User.findOne({ aadharCardNumber: newUser.aadharCardNumber });
        if (userExists) {
            return res.status(400).json({ error: 'Aadhar Card Number already exists' });
        }
        //check if admin alrady exists
        const existingAdmin  = await User.findOne({ role: newUser.role});
        if(existingAdmin && existingAdmin.role==='admin'){
            return res.status(400).json({ error: 'Admin already exists' });
        }
               
        const response = await newUser.save();
        console.log(response);
        // Generate JWT token for the user
        const payload = {
            id: response._id,
            // aadharCardNumber: response.aadharCardNumber,
        }
        const token = generateToken(payload);
        res.json({ user: response, token });
        // if (response.success) {
        //     res.json({ user: response, token });
        // }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login a user
router.post('/login', async (req, res) => {
    try {
        const { aadharCardNumber, password } = req.body;
        const user = await User.findOne({ aadharCardNumber: aadharCardNumber });
        
        if (!user ||!(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Generate JWT token for the user
        const payload = {
            id: user.id,
            // aadharCardNumber: user.aadharCardNumber,
        }
        const token = generateToken(payload);
        res.json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get user details
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({user});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//creating a new vote by candidate

router.post('/vote/:candidateId', jwtAuthMiddleware, async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.candidateId);
        if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
        const user = await User.findById(req.user.id);
        user.votes.push(candidate._id);
        await user.save();
        res.json({ message: 'Vote cast successfully' });
        candidate.voteCount++;
        await candidate.save();
        console.log(candidate);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//change password of user
router.put('/profile/change_password', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        const{currentPassword, newPassword} = req.body;

        const oldUser = await User.findById(userId);
        
        if (!oldUser) return res.status(404).json({ error: 'User not found' });
        
        if (!(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ error: 'Invalid old password' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;