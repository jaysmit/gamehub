const express = require('express');
const router = express.Router();
const Friend = require('../models/Friend');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// GET /api/friends - Get friends list
router.get('/', async (req, res) => {
  try {
    const userId = req.user._id;

    // Find accepted friendships where user is either requester or recipient
    const friendships = await Friend.find({
      $or: [
        { requester: userId, status: 'accepted' },
        { recipient: userId, status: 'accepted' }
      ]
    }).populate('requester recipient', 'name avatar level lastLoginAt');

    // Map to friend user objects
    const friends = friendships.map(f => {
      const friend = f.requester._id.equals(userId) ? f.recipient : f.requester;
      return {
        id: friend._id,
        name: friend.name,
        avatar: friend.avatar,
        level: friend.level,
        lastLoginAt: friend.lastLoginAt,
        friendshipId: f._id,
        friendsSince: f.updatedAt
      };
    });

    res.json(friends);
  } catch (err) {
    console.error('Get friends error:', err);
    res.status(500).json({ error: 'Failed to get friends list' });
  }
});

// GET /api/friends/pending - Get pending friend requests
router.get('/pending', async (req, res) => {
  try {
    const userId = req.user._id;

    // Incoming requests (where user is recipient)
    const incoming = await Friend.find({
      recipient: userId,
      status: 'pending'
    }).populate('requester', 'name avatar level');

    // Outgoing requests (where user is requester)
    const outgoing = await Friend.find({
      requester: userId,
      status: 'pending'
    }).populate('recipient', 'name avatar level');

    res.json({
      incoming: incoming.map(f => ({
        requestId: f._id,
        user: {
          id: f.requester._id,
          name: f.requester.name,
          avatar: f.requester.avatar,
          level: f.requester.level
        },
        sentAt: f.createdAt
      })),
      outgoing: outgoing.map(f => ({
        requestId: f._id,
        user: {
          id: f.recipient._id,
          name: f.recipient.name,
          avatar: f.recipient.avatar,
          level: f.recipient.level
        },
        sentAt: f.createdAt
      }))
    });
  } catch (err) {
    console.error('Get pending requests error:', err);
    res.status(500).json({ error: 'Failed to get pending requests' });
  }
});

// POST /api/friends/request/:userId - Send friend request
router.post('/request/:userId', async (req, res) => {
  try {
    const requesterId = req.user._id;
    const recipientId = req.params.userId;

    if (requesterId.equals(recipientId)) {
      return res.status(400).json({ error: 'Cannot send friend request to yourself' });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if recipient has friend requests enabled
    if (!recipient.settings.friendRequestsEnabled) {
      return res.status(403).json({ error: 'User has disabled friend requests' });
    }

    // Check if friendship already exists (in either direction)
    const existingFriendship = await Friend.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId }
      ]
    });

    if (existingFriendship) {
      if (existingFriendship.status === 'accepted') {
        return res.status(400).json({ error: 'Already friends' });
      }
      if (existingFriendship.status === 'pending') {
        // If there's a pending request from the other person, accept it
        if (existingFriendship.requester.equals(recipientId)) {
          existingFriendship.status = 'accepted';
          await existingFriendship.save();
          return res.json({ message: 'Friend request accepted', friendship: existingFriendship });
        }
        return res.status(400).json({ error: 'Friend request already sent' });
      }
      if (existingFriendship.status === 'blocked') {
        return res.status(403).json({ error: 'Cannot send friend request' });
      }
    }

    // Create new friend request
    const friendship = await Friend.create({
      requester: requesterId,
      recipient: recipientId,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Friend request sent',
      requestId: friendship._id
    });
  } catch (err) {
    console.error('Send friend request error:', err);
    res.status(500).json({ error: 'Failed to send friend request' });
  }
});

// POST /api/friends/accept/:requestId - Accept friend request
router.post('/accept/:requestId', async (req, res) => {
  try {
    const userId = req.user._id;

    const friendship = await Friend.findOne({
      _id: req.params.requestId,
      recipient: userId,
      status: 'pending'
    });

    if (!friendship) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    friendship.status = 'accepted';
    await friendship.save();

    res.json({ message: 'Friend request accepted' });
  } catch (err) {
    console.error('Accept friend request error:', err);
    res.status(500).json({ error: 'Failed to accept friend request' });
  }
});

// POST /api/friends/reject/:requestId - Reject friend request
router.post('/reject/:requestId', async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Friend.findOneAndDelete({
      _id: req.params.requestId,
      recipient: userId,
      status: 'pending'
    });

    if (!result) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    res.json({ message: 'Friend request rejected' });
  } catch (err) {
    console.error('Reject friend request error:', err);
    res.status(500).json({ error: 'Failed to reject friend request' });
  }
});

// DELETE /api/friends/:friendId - Remove friend
router.delete('/:friendId', async (req, res) => {
  try {
    const userId = req.user._id;
    const friendId = req.params.friendId;

    // Find and delete the friendship
    const result = await Friend.findOneAndDelete({
      $or: [
        { requester: userId, recipient: friendId },
        { requester: friendId, recipient: userId }
      ],
      status: 'accepted'
    });

    if (!result) {
      return res.status(404).json({ error: 'Friendship not found' });
    }

    res.json({ message: 'Friend removed' });
  } catch (err) {
    console.error('Remove friend error:', err);
    res.status(500).json({ error: 'Failed to remove friend' });
  }
});

// POST /api/friends/block/:userId - Block user
router.post('/block/:userId', async (req, res) => {
  try {
    const blockerId = req.user._id;
    const blockedId = req.params.userId;

    if (blockerId.equals(blockedId)) {
      return res.status(400).json({ error: 'Cannot block yourself' });
    }

    // Remove any existing friendship first
    await Friend.findOneAndDelete({
      $or: [
        { requester: blockerId, recipient: blockedId },
        { requester: blockedId, recipient: blockerId }
      ]
    });

    // Create block record
    await Friend.create({
      requester: blockerId,
      recipient: blockedId,
      status: 'blocked'
    });

    res.json({ message: 'User blocked' });
  } catch (err) {
    console.error('Block user error:', err);
    res.status(500).json({ error: 'Failed to block user' });
  }
});

module.exports = router;
