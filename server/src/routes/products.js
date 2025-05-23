const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, authorize } = require('../middleware/auth');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isAvailable: true })
      .populate('vendor', 'name email')
      .sort('-createdAt');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get products by vendor
router.get('/vendor', auth, authorize('vendor'), async (req, res) => {
  try {
    const products = await Product.find({ 
      vendor: req.user._id,
      isAvailable: true 
    }).sort('-createdAt');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get products by specific vendor ID
router.get('/vendor/:vendorId', async (req, res) => {
  try {
    const products = await Product.find({ 
      vendor: req.params.vendorId,
      isAvailable: true 
    }).sort('-createdAt');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendor', 'name email')
      .populate('ratings.user', 'name');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product (vendor only)
router.post('/', auth, authorize('vendor'), async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      vendor: req.user._id
    });
    
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update product (vendor only)
router.put('/:id', auth, authorize('vendor'), async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      vendor: req.user._id
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'description', 'price', 'category', 'image', 'isAvailable', 'preparationTime', 'stock'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }

    updates.forEach(update => product[update] = req.body[update]);
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product (vendor only)
router.delete('/:id', auth, authorize('vendor'), async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      vendor: req.user._id
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add rating to product (customer only)
router.post('/:id/ratings', auth, authorize('customer'), async (req, res) => {
  try {
    const { rating, review } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user has already rated
    const existingRating = product.ratings.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this product' });
    }

    product.ratings.push({
      user: req.user._id,
      rating,
      review
    });

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 