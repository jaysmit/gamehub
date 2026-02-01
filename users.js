const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-__v');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single user by name
router.get('/:name', async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.name }).select('-__v');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create or update a user (upsert — keeps it simple for login/signup)
router.post('/', async (req, res) => {
  try {
    const { name, avatar, theme } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const user = await User.findOneAndUpdate(
      { name },
      { avatar, theme },
      { new: true, upsert: true, runValidators: true }
    ).select('-__v');

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a user by name
router.delete('/:name', async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ name: req.params.name });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
