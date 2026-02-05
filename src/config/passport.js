const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const DiscordStrategy = require('passport-discord').Strategy;
const User = require('../models/User');

const configurePassport = () => {
  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        // Find existing user by googleId
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        // Check if user exists with same email
        const email = profile.emails?.[0]?.value;
        if (email) {
          user = await User.findOne({ email: email.toLowerCase() });
          if (user) {
            // Link Google account to existing user
            user.googleId = profile.id;
            await user.save();
            return done(null, user);
          }
        }

        // Create new user
        user = new User({
          name: profile.displayName || `User${Date.now()}`,
          email: email?.toLowerCase(),
          googleId: profile.id,
          avatar: 'cyber-knight',
          isVerified: true // Google accounts are verified
        });

        await user.save();
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }));
  }

  // Discord OAuth Strategy
  if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET) {
    passport.use(new DiscordStrategy({
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: '/api/auth/discord/callback',
      scope: ['identify', 'email']
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        // Find existing user by discordId
        let user = await User.findOne({ discordId: profile.id });

        if (user) {
          return done(null, user);
        }

        // Check if user exists with same email
        const email = profile.email;
        if (email) {
          user = await User.findOne({ email: email.toLowerCase() });
          if (user) {
            // Link Discord account to existing user
            user.discordId = profile.id;
            await user.save();
            return done(null, user);
          }
        }

        // Create new user
        user = new User({
          name: profile.username || `User${Date.now()}`,
          email: email?.toLowerCase(),
          discordId: profile.id,
          avatar: 'cyber-knight',
          isVerified: !!profile.verified
        });

        await user.save();
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }));
  }

  // Serialize/deserialize for session (not used with JWT, but required by passport)
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};

module.exports = configurePassport;
