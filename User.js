const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
  }
}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('User', userSchema);
