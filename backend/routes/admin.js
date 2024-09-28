const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Get All Users (Admin Only)
router.get('/users', authMiddleware, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Only admin can view users' });
    }

    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Certify a Farmer (Admin Only)
router.put('/certify/:farmerId', authMiddleware, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Only admin can certify farmers' });
    }

    try {
        const farmer = await User.findByIdAndUpdate(req.params.farmerId, { isCertified: true }, { new: true });
        res.json(farmer);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
