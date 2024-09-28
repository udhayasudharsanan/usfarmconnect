const express = require('express');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Add Product (Farmer Only)
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
        res.json(newProduct);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get All Products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate('farmer', 'name');
        res.json(products);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
