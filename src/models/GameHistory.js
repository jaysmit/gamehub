const mongoose = require('mongoose');

const gameHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  gameType: {
    type: String,
    required: true
  },
  roomId: {
    type: String,
    required: true
  },
  position: {
    type: Number,
    required: true
  },
  totalPlayers: {
    type: Number,
    required: true
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  xpEarned: {
    type: Number,
    default: 0
  },
  roundScores: [{
    round: Number,
    points: Number,
    wasDrawer: Boolean
  }],
  playedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Compound index for user game history queries
gameHistorySchema.index({ userId: 1, playedAt: -1 });
gameHistorySchema.index({ userId: 1, gameType: 1 });

module.exports = mongoose.model('GameHistory', gameHistorySchema);
