require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');

const { setupSockets } = require('./src/sockets');
const configurePassport = require('./src/config/passport');
const userRoutes = require('./src/routes/users');
const authRoutes = require('./src/routes/auth');
const friendsRoutes = require('./src/routes/friends');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(express.json());

// --- Passport Setup ---
configurePassport();
app.use(passport.initialize());

// --- Serve the frontend ---
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/friends', friendsRoutes);

// --- Socket.io ---
setupSockets(io);

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// --- Catch-all for SPA (must be after API routes) ---
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// --- Start Server ---
server.listen(PORT, () => {
  console.log(`GameHub server running on port ${PORT}`);
  console.log('Server initialized');
});
