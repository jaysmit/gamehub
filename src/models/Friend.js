const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'blocked'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Compound index to ensure unique friendships
friendSchema.index({ requester: 1, recipient: 1 }, { unique: true });

// Index for querying friend lists efficiently
friendSchema.index({ requester: 1, status: 1 });
friendSchema.index({ recipient: 1, status: 1 });

module.exports = mongoose.model('Friend', friendSchema);
