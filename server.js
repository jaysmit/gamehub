require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');

const { setupSockets } = require('./src/sockets');
const userRoutes = require('./src/routes/users');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(express.json());

// --- Serve the frontend ---
app.use(express.static(path.join(__dirname, 'public')));

// --- API Routes ---
app.use('/api/users', userRoutes);

// --- Socket.io ---
setupSockets(io);

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// --- Start Server ---
server.listen(PORT, () => {
  console.log(`GameHub server running on port ${PORT}`);
});
