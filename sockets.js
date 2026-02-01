const { v4: uuidv4 } = require('uuid');

// In-memory room store (rooms are ephemeral — no need to persist them)
const rooms = new Map();

function setupSockets(io) {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // --- Create Room ---
    socket.on('createRoom', (data) => {
      const roomId = uuidv4().substring(0, 6).toUpperCase();
      const room = {
        id: roomId,
        name: data.roomName,
        master: data.playerName,
        players: [{ name: data.playerName, isMaster: true, avatar: data.avatar || 'cyber-knight', socketId: socket.id }],
        selectedGames: []
      };

      rooms.set(roomId, room);
      socket.join(roomId);
      socket.emit('roomCreated', room);
      console.log(`Room ${roomId} created by ${data.playerName}`);
    });

    // --- Join Room ---
    socket.on('joinRoom', (data) => {
      const room = rooms.get(data.roomId);
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      room.players.push({ name: data.playerName, isMaster: false, avatar: data.avatar || 'cyber-knight', socketId: socket.id });
      socket.join(data.roomId);

      // Tell the joining player the full room state
      socket.emit('roomJoined', room);
      // Tell everyone else a new player joined
      socket.to(data.roomId).emit('playerJoined', { roomId: data.roomId, player: data.playerName, avatar: data.avatar });
      console.log(`${data.playerName} joined room ${data.roomId}`);
    });

    // --- Toggle Game Selection ---
    socket.on('toggleGame', (data) => {
      const room = rooms.get(data.roomId);
      if (!room) return;

      const index = room.selectedGames.indexOf(data.gameId);
      if (index > -1) {
        room.selectedGames.splice(index, 1);
      } else {
        room.selectedGames.push(data.gameId);
      }

      io.to(data.roomId).emit('gamesUpdated', { roomId: data.roomId, selectedGames: room.selectedGames });
    });

    // --- Start Game ---
    socket.on('startGame', (data) => {
      io.to(data.roomId).emit('gameStarting', { roomId: data.roomId });
    });

    // --- Disconnect: clean up rooms ---
    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);

      rooms.forEach((room, roomId) => {
        room.players = room.players.filter(p => p.socketId !== socket.id);

        // If room is empty, delete it
        if (room.players.length === 0) {
          rooms.delete(roomId);
          console.log(`Room ${roomId} removed (empty)`);
        }
      });
    });
  });
}

module.exports = { setupSockets };
