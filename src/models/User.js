const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Basic info
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  avatar: {
    type: String,
    default: 'cyber-knight'
  },
  theme: {
    type: String,
    enum: ['tron', 'kids', 'scary'],
    default: 'tron'
  },

  // Auth fields
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    select: false // Don't include in queries by default
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  discordId: {
    type: String,
    unique: true,
    sparse: true
  },

  // Stats
  stats: {
    gamesPlayed: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    favoriteGame: { type: String, default: null }
  },

  // Level system
  level: {
    type: Number,
    default: 1
  },
  xp: {
    type: Number,
    default: 0
  },

  // Medals earned
  medals: [{
    medalId: String,
    earnedAt: { type: Date, default: Date.now }
  }],

  // Settings
  settings: {
    soundEnabled: { type: Boolean, default: true },
    musicVolume: { type: Number, default: 50, min: 0, max: 100 },
    notificationsEnabled: { type: Boolean, default: true },
    friendRequestsEnabled: { type: Boolean, default: true }
  },

  // Unlocked characters
  unlockedCharacters: {
    type: [String],
    default: ['cyber-knight', 'neon-ninja', 'pixel-punk']
  },

  // Account status
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLoginAt: {
    type: Date
  }
}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

// Method to check if user has password auth
userSchema.methods.hasPasswordAuth = function() {
  return !!this.passwordHash;
};

// Method to calculate XP needed for next level
userSchema.methods.xpForNextLevel = function() {
  return this.level * 100;
};

// Method to add XP and handle level ups
userSchema.methods.addXP = async function(amount) {
  this.xp += amount;
  let levelsGained = 0;

  while (this.xp >= this.xpForNextLevel()) {
    this.xp -= this.xpForNextLevel();
    this.level += 1;
    levelsGained += 1;
  }

  await this.save();
  return levelsGained;
};

module.exports = mongoose.model('User', userSchema);
