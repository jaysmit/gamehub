const express = require('express');
const router = express.Router();
const User = require('../models/User');
const GameHistory = require('../models/GameHistory');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// GET /api/users - Get all users (public)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('name avatar level stats.gamesPlayed stats.wins');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/me - Get current user profile (requires auth)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/me - Update current user profile (requires auth)
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const { name, avatar, theme } = req.body;
    const updates = {};

    if (name !== undefined) {
      // Check if name is taken by another user
      const existingUser = await User.findOne({ name, _id: { $ne: req.user._id } });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      updates.name = name;
    }

    if (avatar !== undefined) updates.avatar = avatar;
    if (theme !== undefined) updates.theme = theme;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/me/settings - Update user settings (requires auth)
router.put('/me/settings', authenticateToken, async (req, res) => {
  try {
    const { soundEnabled, musicVolume, notificationsEnabled, friendRequestsEnabled } = req.body;
    const settings = {};

    if (soundEnabled !== undefined) settings['settings.soundEnabled'] = soundEnabled;
    if (musicVolume !== undefined) settings['settings.musicVolume'] = Math.max(0, Math.min(100, musicVolume));
    if (notificationsEnabled !== undefined) settings['settings.notificationsEnabled'] = notificationsEnabled;
    if (friendRequestsEnabled !== undefined) settings['settings.friendRequestsEnabled'] = friendRequestsEnabled;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: settings },
      { new: true }
    ).select('settings');

    res.json(user.settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/me/game-history - Get current user's game history (requires auth)
router.get('/me/game-history', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [history, total] = await Promise.all([
      GameHistory.find({ userId: req.user._id })
        .sort({ playedAt: -1 })
        .skip(skip)
        .limit(limit),
      GameHistory.countDocuments({ userId: req.user._id })
    ]);

    res.json({
      history,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/:id/profile - Get public user profile
router.get('/:id/profile', optionalAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name avatar theme level xp stats medals unlockedCharacters createdAt');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get recent game history (public)
    const recentGames = await GameHistory.find({ userId: user._id })
      .sort({ playedAt: -1 })
      .limit(5)
      .select('gameType position totalPlayers pointsEarned playedAt');

    res.json({
      user,
      recentGames
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/search - Search users by name
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query || query.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const users = await User.find({
      name: { $regex: query, $options: 'i' }
    })
      .select('name avatar level')
      .limit(20);

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Legacy routes for backward compatibility

// GET /api/users/:name - Get a single user by name
router.get('/by-name/:name', async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.name }).select('-passwordHash -__v');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users - Create or update a user (upsert - for guest accounts)
router.post('/', async (req, res) => {
  try {
    const { name, avatar, theme } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const user = await User.findOneAndUpdate(
      { name },
      { avatar, theme },
      { new: true, upsert: true, runValidators: true }
    ).select('-passwordHash -__v');

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/users/:name - Delete a user by name
router.delete('/by-name/:name', async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ name: req.params.name });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
