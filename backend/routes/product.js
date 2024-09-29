const express = require('express');
const Product = require('../models/Product');  // Make sure this model exists
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Add Product (Farmers only)
router.post('/add', authMiddleware, async (req, res) => {
    if (req.user.role !== 'farmer') {
        return res.status(403).json({ msg: 'Only farmers can add products' });
    }

    const { name, quantity, price } = req.body;

    try {
        const newProduct = new Product({
            name,
            quantity,
            price,
            farmer: req.user.id
        });

        await newProduct.save();

        // Emit real-time event for new product
        req.io.emit('newProduct', newProduct);

        res.json(newProduct);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Products (Consumers can view)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate('farmer', 'name');
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;



