// Script to unlock avatars for a user
// Run with: node scripts/unlock-avatars.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

async function unlockAvatars() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find user jake (case-insensitive)
        const user = await User.findOne({ name: { $regex: /^jake$/i } });

        if (!user) {
            console.log('User "jake" not found');
            process.exit(1);
        }

        console.log(`Found user: ${user.name}`);
        console.log(`Current unlocked characters: ${user.unlockedCharacters?.join(', ') || 'none'}`);

        // Add epic and legendary avatars
        const avatarsToUnlock = ['prism-knight', 'quantum-dragon'];
        const currentUnlocked = user.unlockedCharacters || [];
        const newUnlocked = [...new Set([...currentUnlocked, ...avatarsToUnlock])];

        await User.findByIdAndUpdate(user._id, {
            $set: { unlockedCharacters: newUnlocked }
        });

        console.log(`\nUnlocked avatars: ${avatarsToUnlock.join(', ')}`);
        console.log(`Updated unlocked characters: ${newUnlocked.join(', ')}`);

        await mongoose.disconnect();
        console.log('\nDone!');
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

unlockAvatars();
