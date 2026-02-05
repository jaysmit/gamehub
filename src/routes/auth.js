const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const {
  authenticateToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} = require('../middleware/auth');

// POST /api/auth/register - Email/password registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Check if name already exists
    const existingName = await User.findOne({ name });
    if (existingName) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      name,
      email: email.toLowerCase(),
      passwordHash
    });

    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token
    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip
    });

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        theme: user.theme,
        level: user.level,
        xp: user.xp
      },
      accessToken,
      refreshToken
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login - Email/password login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user with password hash
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.passwordHash) {
      return res.status(401).json({ error: 'This account uses social login' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token
    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip
    });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        theme: user.theme,
        level: user.level,
        xp: user.xp,
        stats: user.stats
      },
      accessToken,
      refreshToken
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/logout - Invalidate refresh token
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await RefreshToken.findOneAndDelete({ token: refreshToken });
    }

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// POST /api/auth/refresh - Get new access token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    // Check if token exists in database
    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken) {
      return res.status(403).json({ error: 'Refresh token revoked' });
    }

    // Get user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(403).json({ error: 'User not found' });
    }

    // Generate new access token
    const accessToken = generateAccessToken(user._id);

    res.json({ accessToken });
  } catch (err) {
    console.error('Token refresh error:', err);
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

// GET /api/auth/google - Initiate Google OAuth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// GET /api/auth/google/callback - Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=google_auth_failed' }),
  async (req, res) => {
    try {
      const user = req.user;

      // Update last login
      user.lastLoginAt = new Date();
      await user.save();

      // Generate tokens
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Store refresh token
      await RefreshToken.create({
        userId: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip
      });

      // Redirect to frontend with tokens
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      res.redirect(`${clientUrl}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`);
    } catch (err) {
      console.error('Google callback error:', err);
      res.redirect('/login?error=auth_failed');
    }
  }
);

// GET /api/auth/discord - Initiate Discord OAuth
router.get('/discord',
  passport.authenticate('discord', { scope: ['identify', 'email'] })
);

// GET /api/auth/discord/callback - Discord OAuth callback
router.get('/discord/callback',
  passport.authenticate('discord', { session: false, failureRedirect: '/login?error=discord_auth_failed' }),
  async (req, res) => {
    try {
      const user = req.user;

      // Update last login
      user.lastLoginAt = new Date();
      await user.save();

      // Generate tokens
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Store refresh token
      await RefreshToken.create({
        userId: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip
      });

      // Redirect to frontend with tokens
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      res.redirect(`${clientUrl}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`);
    } catch (err) {
      console.error('Discord callback error:', err);
      res.redirect('/login?error=auth_failed');
    }
  }
);

module.exports = router;
