const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Predefined Admin Credentials
const adminCredentials = {
    email: 'admin@farmconnect.com',
    password: 'AdminPass123'  // Use a strong password
};

// Signup Route (For Farmers and Consumers Only)
router.post('/signup', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Prevent public signup for the admin role
        if (role === 'admin') {
            return res.status(403).json({ msg: 'Cannot signup as admin' });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ name, email, password, role });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token, role: user.role });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Admin Login - Predefined Credentials Only
router.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        if (email === adminCredentials.email && password === adminCredentials.password) {
            const token = jwt.sign({ role: 'admin' }, 'your_jwt_secret', { expiresIn: '1h' });
            return res.json({ token, role: 'admin' });
        } else {
            return res.status(400).json({ msg: 'Invalid admin credentials' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Login Route for Farmers and Consumers
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token, role: user.role });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

