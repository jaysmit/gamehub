const { v4: uuidv4 } = require('uuid');

// In-memory room store (rooms are ephemeral — no need to persist them)
const rooms = new Map();

// In-memory online users tracking: userId -> { socketId, status, roomId }
// status: 'online' | 'inRoom' | 'inGame'
const onlineUsers = new Map();

// Word list for Pictionary
const PICTIONARY_WORDS = [
  'ELEPHANT', 'PIZZA', 'RAINBOW', 'ROCKET', 'CASTLE', 'GUITAR', 'ROBOT',
  'TREASURE', 'UNICORN', 'DRAGON', 'MOUNTAIN', 'AIRPLANE', 'BIRTHDAY',
  'TELESCOPE', 'WATERFALL', 'DINOSAUR', 'BUTTERFLY', 'SNOWMAN', 'PIRATE',
  'VOLCANO', 'BANANA', 'LIGHTHOUSE', 'SKATEBOARD', 'MERMAID', 'TORNADO',
  'SUNFLOWER', 'SPACESHIP', 'CAMPFIRE', 'PENGUIN', 'JELLYFISH'
];

// Track disconnected players in their grace period so we can cancel removal on rejoin
// Key: "roomId:playerName", Value: { timer }
const disconnectedPlayers = new Map();

// Track players who haven't selected an avatar yet
// Key: "roomId:playerName", Value: { timer }
const avatarSelectionTimers = new Map();

// Track which room each master owns (for detecting when master joins another room)
// Key: masterName, Value: roomId
const masterRooms = new Map();

const GRACE_PERIOD_MS = 15000;
const AVATAR_SELECTION_TIMEOUT_MS = 30000;

// --- Multi-round Pictionary helpers ---

function computeDrawingOrder(players) {
  return players
    .map(p => ({ name: p.name, avatar: p.avatar, score: p.score || 0, tiebreaker: Math.random() }))
    .sort((a, b) => b.score - a.score || a.tiebreaker - b.tiebreaker)
    .map(({ name, avatar }) => ({ name, avatar }));
}

function pickWord(usedWords) {
  const available = PICTIONARY_WORDS.filter(w => !usedWords.includes(w));
  const pool = available.length > 0 ? available : PICTIONARY_WORDS;
  return pool[Math.floor(Math.random() * pool.length)];
}

function startRound(io, room, roomId) {
  // Word and drawer are already set on room.game before this is called
  io.to(roomId).emit('gameStarted', {
    drawerName: room.game.drawerName,
    currentRound: room.game.currentRound,
    totalRounds: room.game.totalRounds,
    currentPickValue: room.game.currentPickValue
  });

  const drawerPlayer = room.players.find(p => p.name === room.game.drawerName);
  if (drawerPlayer) {
    io.to(drawerPlayer.socketId).emit('yourWord', { word: room.game.currentWord });
  }

  // After 10s rules countdown, signal all clients to start game timer in sync
  setTimeout(() => {
    if (room.game) {
      const endTime = Date.now() + 60000;
      room.game.timerEndTime = endTime;
      room.game.timerRemainingMs = null;
      io.to(roomId).emit('gameTimerStart', { endTime });
    }
  }, 10000);
}

function advanceRound(io, room, roomId) {
  if (!room.game) return;
  room.game.currentDrawerIndex++;
  room.game.currentRound++;

  // Skip disconnected players
  while (room.game.currentDrawerIndex < room.game.drawingOrder.length) {
    const nextDrawer = room.game.drawingOrder[room.game.currentDrawerIndex];
    const player = room.players.find(p => p.name === nextDrawer.name);

    // If player doesn't exist or is disconnected, skip them
    if (!player || player.connected === false) {
      console.log(`Skipping disconnected drawer: ${nextDrawer.name}`);
      io.to(roomId).emit('drawerSkipped', { playerName: nextDrawer.name, reason: 'disconnected' });
      room.game.currentDrawerIndex++;
      room.game.currentRound++;
    } else {
      break;
    }
  }

  if (room.game.currentDrawerIndex >= room.game.drawingOrder.length) {
    // All players have drawn — game over
    const finalScores = room.players
      .map(p => ({ name: p.name, avatar: p.avatar, score: p.score || 0, connected: p.connected !== false }))
      .sort((a, b) => b.score - a.score);

    // Compile game history entry
    const gameHistoryEntry = {
      game: 'Drawing Game',
      timestamp: Date.now(),
      finalScores,
      roundScores: room.game.roundScores || {}
    };

    if (!room.gameHistory) room.gameHistory = [];
    room.gameHistory.push(gameHistoryEntry);

    io.to(roomId).emit('gameEnded', { finalScores, gameHistory: room.gameHistory });
    room.game = null;
    return;
  }

  const drawer = room.game.drawingOrder[room.game.currentDrawerIndex];
  const word = pickWord(room.game.usedWords);
  room.game.usedWords.push(word);
  room.game.drawerName = drawer.name;
  room.game.currentWord = word;
  room.game.currentPickValue = 100;

  io.to(roomId).emit('nextRound', {
    drawerName: drawer.name,
    currentRound: room.game.currentRound,
    totalRounds: room.game.totalRounds,
    currentPickValue: 100
  });

  const drawerPlayer = room.players.find(p => p.name === drawer.name);
  if (drawerPlayer) {
    io.to(drawerPlayer.socketId).emit('yourWord', { word });
  }

  // After 10s rules countdown, signal all clients to start game timer in sync
  setTimeout(() => {
    if (room.game) {
      const endTime = Date.now() + 60000;
      room.game.timerEndTime = endTime;
      room.game.timerRemainingMs = null;
      io.to(roomId).emit('gameTimerStart', { endTime });
    }
  }, 10000);
}

// Helper to broadcast friend status changes
function broadcastToFriends(io, userId, friendIds, event, data) {
  friendIds.forEach(friendId => {
    const friend = onlineUsers.get(friendId);
    if (friend) {
      io.to(friend.socketId).emit(event, data);
    }
  });
}

function setupSockets(io) {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // --- User Online Status Events ---

    // User comes online (authenticated)
    socket.on('userOnline', ({ userId, friendIds }) => {
      if (!userId) return;

      onlineUsers.set(userId, {
        socketId: socket.id,
        status: 'online',
        roomId: null
      });

      // Store userId on socket for disconnect handling
      socket.userId = userId;
      socket.friendIds = friendIds || [];

      // Notify friends that user is online
      if (friendIds && friendIds.length > 0) {
        broadcastToFriends(io, userId, friendIds, 'friendOnline', {
          userId,
          status: 'online'
        });
      }

      console.log(`User ${userId} is now online`);
    });

    // User enters a room
    socket.on('userInRoom', ({ userId, roomId }) => {
      if (!userId) return;

      const user = onlineUsers.get(userId);
      if (user) {
        user.status = 'inRoom';
        user.roomId = roomId;

        // Notify friends
        if (socket.friendIds && socket.friendIds.length > 0) {
          broadcastToFriends(io, userId, socket.friendIds, 'friendStatusChanged', {
            userId,
            status: 'inRoom',
            roomId
          });
        }
      }
    });

    // User starts a game
    socket.on('userInGame', ({ userId, roomId }) => {
      if (!userId) return;

      const user = onlineUsers.get(userId);
      if (user) {
        user.status = 'inGame';
        user.roomId = roomId;

        // Notify friends
        if (socket.friendIds && socket.friendIds.length > 0) {
          broadcastToFriends(io, userId, socket.friendIds, 'friendStatusChanged', {
            userId,
            status: 'inGame',
            roomId
          });
        }
      }
    });

    // Get status of multiple friends
    socket.on('getFriendsStatus', ({ friendIds }, callback) => {
      const statuses = {};
      friendIds.forEach(friendId => {
        const friend = onlineUsers.get(friendId);
        if (friend) {
          statuses[friendId] = {
            status: friend.status,
            roomId: friend.roomId
          };
        } else {
          statuses[friendId] = { status: 'offline', roomId: null };
        }
      });

      if (typeof callback === 'function') {
        callback(statuses);
      } else {
        socket.emit('friendsStatus', statuses);
      }
    });

    // --- Create Room ---
    socket.on('createRoom', (data) => {
      // Check if this master already has an existing room
      const existingRoomId = masterRooms.get(data.playerName);
      if (existingRoomId && rooms.has(existingRoomId)) {
        const existingRoom = rooms.get(existingRoomId);
        // Close the existing room
        io.to(existingRoomId).emit('roomClosed', {
          roomId: existingRoomId,
          reason: 'Master created a new room'
        });
        // Clean up avatar timers for all players in the old room
        existingRoom.players.forEach(p => {
          const timerKey = `${existingRoomId}:${p.name}`;
          const pending = avatarSelectionTimers.get(timerKey);
          if (pending) {
            clearTimeout(pending.timer);
            avatarSelectionTimers.delete(timerKey);
          }
        });
        rooms.delete(existingRoomId);
        console.log(`Room ${existingRoomId} closed because master ${data.playerName} created a new room`);
      }

      const roomId = uuidv4().substring(0, 6).toUpperCase();
      const room = {
        id: roomId,
        name: data.roomName,
        master: data.playerName,
        players: [{ name: data.playerName, isMaster: true, avatar: data.avatar || 'meta', socketId: socket.id, connected: true, score: 0 }],
        selectedGames: []
      };

      rooms.set(roomId, room);
      masterRooms.set(data.playerName, roomId);
      socket.join(roomId);
      socket.emit('roomCreated', room);
      console.log(`Room ${roomId} created by ${data.playerName}`);

      // Start avatar selection timer if master starts with meta avatar
      const avatar = data.avatar || 'meta';
      if (avatar === 'meta') {
        const timerKey = `${roomId}:${data.playerName}`;
        const timer = setTimeout(() => {
          avatarSelectionTimers.delete(timerKey);
          const currentRoom = rooms.get(roomId);
          if (!currentRoom) return;

          const player = currentRoom.players.find(p => p.name === data.playerName);
          if (!player || player.avatar !== 'meta') return; // Already selected an avatar

          // Remove player and close the room since they are master
          io.to(socket.id).emit('removedForNoAvatar', { roomId });
          masterRooms.delete(data.playerName);
          rooms.delete(roomId);
          console.log(`Master ${data.playerName} removed from room ${roomId} for not selecting an avatar in 30 seconds - room closed`);
        }, AVATAR_SELECTION_TIMEOUT_MS);

        avatarSelectionTimers.set(timerKey, { timer });
      }
    });

    // --- Join Room ---
    socket.on('joinRoom', (data) => {
      const room = rooms.get(data.roomId);
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      // Check if this player is a master of another room
      const existingRoomId = masterRooms.get(data.playerName);
      if (existingRoomId && existingRoomId !== data.roomId && rooms.has(existingRoomId)) {
        const existingRoom = rooms.get(existingRoomId);
        // Close the existing room
        io.to(existingRoomId).emit('roomClosed', {
          roomId: existingRoomId,
          reason: 'Master joined another room'
        });
        // Clean up avatar timers for all players in the old room
        existingRoom.players.forEach(p => {
          const timerKey = `${existingRoomId}:${p.name}`;
          const pending = avatarSelectionTimers.get(timerKey);
          if (pending) {
            clearTimeout(pending.timer);
            avatarSelectionTimers.delete(timerKey);
          }
        });
        rooms.delete(existingRoomId);
        masterRooms.delete(data.playerName);
        console.log(`Room ${existingRoomId} closed because master ${data.playerName} joined another room`);
      }

      // Check for duplicate name (case-insensitive)
      const nameTaken = room.players.some(
        p => p.name.trim().toLowerCase() === data.playerName.trim().toLowerCase()
      );
      if (nameTaken) {
        socket.emit('error', { message: 'Name already taken in this room. Please choose a different name.' });
        return;
      }

      const avatar = data.avatar || 'meta';
      room.players.push({ name: data.playerName, isMaster: false, avatar, socketId: socket.id, connected: true, score: 0 });
      socket.join(data.roomId);

      // Tell the joining player the full room state
      socket.emit('roomJoined', room);
      // Tell everyone else a new player joined
      socket.to(data.roomId).emit('playerJoined', { roomId: data.roomId, player: data.playerName, avatar });
      console.log(`${data.playerName} joined room ${data.roomId}`);

      // Start avatar selection timer if player joined with meta avatar
      if (avatar === 'meta') {
        const timerKey = `${data.roomId}:${data.playerName}`;
        const timer = setTimeout(() => {
          avatarSelectionTimers.delete(timerKey);
          const currentRoom = rooms.get(data.roomId);
          if (!currentRoom) return;

          const player = currentRoom.players.find(p => p.name === data.playerName);
          if (!player || player.avatar !== 'meta') return; // Already selected an avatar

          // Remove player from room
          currentRoom.players = currentRoom.players.filter(p => p.name !== data.playerName);
          io.to(player.socketId).emit('removedForNoAvatar', { roomId: data.roomId });
          io.to(data.roomId).emit('playerLeft', { roomId: data.roomId, playerName: data.playerName, reason: 'noAvatar' });
          console.log(`${data.playerName} removed from room ${data.roomId} for not selecting an avatar in 30 seconds`);

          // Clean up room if empty
          if (currentRoom.players.length === 0) {
            rooms.delete(data.roomId);
            console.log(`Room ${data.roomId} removed (empty)`);
          }
        }, AVATAR_SELECTION_TIMEOUT_MS);

        avatarSelectionTimers.set(timerKey, { timer });
      }
    });

    // --- Rejoin Room (after page refresh) ---
    socket.on('rejoinRoom', (data) => {
      const { roomId, playerName, avatar } = data;
      const room = rooms.get(roomId);

      if (!room) {
        socket.emit('rejoinFailed', { message: 'Room no longer exists' });
        return;
      }

      const player = room.players.find(p => p.name === playerName);
      if (!player) {
        socket.emit('rejoinFailed', { message: 'You are no longer in this room' });
        return;
      }

      // Cancel grace period timer if pending
      const key = `${roomId}:${playerName}`;
      const pending = disconnectedPlayers.get(key);
      if (pending) {
        clearTimeout(pending.timer);
        disconnectedPlayers.delete(key);
        console.log(`Grace period cancelled for ${playerName} in room ${roomId}`);
      }

      // Update player's socket and mark connected
      player.socketId = socket.id;
      player.connected = true;
      socket.join(roomId);

      // Send full room state back to the rejoining player (include gameHistory)
      socket.emit('rejoinSuccess', { ...room, gameHistory: room.gameHistory || [] });

      // If there's an active game, send game sync data to the rejoining player
      if (room.game) {
        const gameSync = {
          drawerName: room.game.drawerName,
          currentRound: room.game.currentRound,
          totalRounds: room.game.totalRounds,
          currentPickValue: room.game.currentPickValue,
          paused: room.game.paused || false,
          timerEndTime: room.game.timerEndTime,
          timerRemainingMs: room.game.timerRemainingMs
        };

        // Send game state sync
        socket.emit('gameSync', gameSync);

        // If this player is the drawer, send them their word
        if (room.game.drawerName === playerName) {
          socket.emit('yourWord', { word: room.game.currentWord });
        }
      }

      // Notify other players
      socket.to(roomId).emit('playerRejoined', { roomId, playerName, avatar: player.avatar });
      console.log(`${playerName} rejoined room ${roomId}`);
    });

    // --- Request Game Sync (for visibility change / tab return / rejoin) ---
    socket.on('requestGameSync', (data) => {
      const { roomId } = data;
      const room = rooms.get(roomId);

      if (!room || !room.game) {
        // No active game, send player back to room
        socket.emit('gameSync', { noActiveGame: true });
        return;
      }

      // Find the requesting player
      const player = room.players.find(p => p.socketId === socket.id);
      if (!player) return;

      const gameSync = {
        drawerName: room.game.drawerName,
        currentRound: room.game.currentRound,
        totalRounds: room.game.totalRounds,
        currentPickValue: room.game.currentPickValue,
        paused: room.game.paused || false,
        timerEndTime: room.game.timerEndTime,
        timerRemainingMs: room.game.timerRemainingMs,
        drawingOrder: room.game.drawingOrder
      };

      socket.emit('gameSync', gameSync);

      // If this player is the drawer, resend their word
      if (room.game.drawerName === player.name) {
        socket.emit('yourWord', { word: room.game.currentWord });
      }
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
      const room = rooms.get(data.roomId);
      if (!room) return;

      const drawingOrder = computeDrawingOrder(room.players);
      const firstWord = pickWord([]);
      room.game = {
        drawingOrder,
        currentDrawerIndex: 0,
        currentRound: 1,
        totalRounds: drawingOrder.length,
        drawerName: drawingOrder[0].name,
        currentWord: firstWord,
        usedWords: [firstWord],
        roundScores: {},
        currentPickValue: 100,
        timerEndTime: null,
        timerRemainingMs: null
      };

      // Emit countdown to all with drawing order info
      io.to(data.roomId).emit('gameStarting', {
        roomId: data.roomId,
        drawingOrder,
        totalRounds: drawingOrder.length,
        currentRound: 1
      });

      // After 4s (PictionaryGame mounts after 3-2-1 countdown), start first round
      setTimeout(() => {
        if (room.game) {
          startRound(io, room, data.roomId);
        }
      }, 4000);
    });

    // --- Draw Line (Pictionary) ---
    socket.on('drawLine', (data) => {
      const room = rooms.get(data.roomId);
      if (!room || !room.game) return;

      // Validate sender is the drawer
      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender || sender.name !== room.game.drawerName) return;

      socket.to(data.roomId).emit('drawLine', {
        x0: data.x0, y0: data.y0,
        x1: data.x1, y1: data.y1,
        color: data.color, size: data.size
      });
    });

    // --- Clear Canvas (Pictionary) ---
    socket.on('clearCanvas', (data) => {
      const room = rooms.get(data.roomId);
      if (!room || !room.game) return;

      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender || sender.name !== room.game.drawerName) return;

      socket.to(data.roomId).emit('clearCanvas');
    });

    // --- Pause Game (drawer picking winner) ---
    socket.on('pauseGame', (data) => {
      const room = rooms.get(data.roomId);
      if (!room || !room.game) return;

      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender || sender.name !== room.game.drawerName) return;

      room.game.paused = true;
      room.game.timerRemainingMs = Math.max(0, room.game.timerEndTime - Date.now());
      room.game.timerEndTime = null;
      io.to(data.roomId).emit('gamePaused', { pickDuration: data.pickDuration || 5 });
    });

    // --- Resume Game (drawer cancelled pick) ---
    socket.on('resumeGame', (data) => {
      const room = rooms.get(data.roomId);
      if (!room || !room.game) return;

      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender || sender.name !== room.game.drawerName) return;

      room.game.paused = false;
      const endTime = Date.now() + (room.game.timerRemainingMs || 0);
      room.game.timerEndTime = endTime;
      room.game.timerRemainingMs = null;
      io.to(data.roomId).emit('gameResumed', { endTime });
    });

    // --- Game Guess (Pictionary) ---
    socket.on('gameGuess', (data) => {
      const room = rooms.get(data.roomId);
      if (!room || !room.game) return;

      // Block guesses while game is paused
      if (room.game.paused) return;

      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender || sender.name === room.game.drawerName) return;

      io.to(data.roomId).emit('gameGuess', {
        player: sender.name,
        avatar: sender.avatar,
        message: data.message,
        timestamp: Date.now()
      });
    });

    // --- Winner Picked (Pictionary) ---
    socket.on('winnerPicked', (data) => {
      const room = rooms.get(data.roomId);
      if (!room || !room.game) return;

      // Validate sender is the drawer
      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender || sender.name !== room.game.drawerName) return;

      const winner = room.players.find(p => p.name === data.winnerName);
      if (!winner) return;

      const points = data.timerExpired ? 50 : room.game.currentPickValue;

      // Award points to both drawer and winner
      sender.score = (sender.score || 0) + points;
      winner.score = (winner.score || 0) + points;

      // Increment pick value for next pick
      room.game.currentPickValue += 100;

      // Track round scores
      const rs = room.game.roundScores;
      const round = room.game.currentRound;
      if (!rs[sender.name]) rs[sender.name] = [];
      if (!rs[winner.name]) rs[winner.name] = [];
      rs[sender.name].push({ round, points });
      rs[winner.name].push({ round, points });

      // Broadcast updated scores
      io.to(data.roomId).emit('scoresUpdated', { players: room.players });

      // Broadcast winnerPicked to room for announcement
      io.to(data.roomId).emit('winnerPicked', {
        winnerName: data.winnerName,
        drawerName: sender.name,
        points,
        word: room.game.currentWord
      });

      // If timer expired, advance to next round after announcement delay
      if (data.timerExpired) {
        room.game.paused = false;
        room.game.timerEndTime = null;
        room.game.timerRemainingMs = null;
        setTimeout(() => {
          if (room.game) {
            advanceRound(io, room, data.roomId);
          }
        }, 3000);
        return;
      }

      // After 2s announcement, pick new word and continue drawing
      setTimeout(() => {
        if (!room.game) return;
        room.game.paused = false;
        const endTime = Date.now() + (room.game.timerRemainingMs || 0);
        room.game.timerEndTime = endTime;
        room.game.timerRemainingMs = null;
        const newWord = pickWord(room.game.usedWords);
        room.game.usedWords.push(newWord);
        room.game.currentWord = newWord;

        io.to(data.roomId).emit('continueDrawing', { nextPickValue: room.game.currentPickValue, endTime });

        const drawerPlayer = room.players.find(p => p.name === room.game.drawerName);
        if (drawerPlayer) {
          io.to(drawerPlayer.socketId).emit('yourWord', { word: newWord });
        }
      }, 2000);
    });

    // --- Kick Player (Master only) ---
    socket.on('kickPlayer', (data) => {
      const room = rooms.get(data.roomId);
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      // Validate sender is the room master
      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender) {
        socket.emit('error', { message: 'You are not in this room' });
        console.log(`kickPlayer failed: sender not found for socket ${socket.id} in room ${data.roomId}`);
        return;
      }
      if (sender.name !== room.master) {
        socket.emit('error', { message: 'Only the room master can kick players' });
        console.log(`kickPlayer failed: ${sender.name} is not master (master is ${room.master})`);
        return;
      }

      // Find the player to kick
      const playerToKick = room.players.find(p => p.name === data.playerName);
      if (!playerToKick) return;

      // Can't kick yourself
      if (playerToKick.name === sender.name) return;

      // Cancel any pending grace period for this player
      const key = `${data.roomId}:${data.playerName}`;
      const pending = disconnectedPlayers.get(key);
      if (pending) {
        clearTimeout(pending.timer);
        disconnectedPlayers.delete(key);
      }

      // Remove player from room
      room.players = room.players.filter(p => p.name !== data.playerName);

      // Notify the kicked player
      io.to(playerToKick.socketId).emit('youWereKicked', { roomId: data.roomId });

      // Notify remaining players
      io.to(data.roomId).emit('playerKicked', { roomId: data.roomId, playerName: data.playerName });

      console.log(`${data.playerName} was kicked from room ${data.roomId} by ${sender.name}`);

      // If kicked player was drawing during a game, advance the round
      if (room.game && room.game.drawerName === data.playerName) {
        // Update drawing order to remove kicked player
        room.game.drawingOrder = room.game.drawingOrder.filter(p => p.name !== data.playerName);
        room.game.totalRounds = room.game.drawingOrder.length;

        io.to(data.roomId).emit('roundResult', {
          winnerName: null,
          points: 0,
          currentRound: room.game.currentRound,
          totalRounds: room.game.totalRounds
        });

        setTimeout(() => {
          if (room.game) {
            // Adjust current drawer index since we removed a player
            if (room.game.currentDrawerIndex > 0) {
              room.game.currentDrawerIndex--;
            }
            advanceRound(io, room, data.roomId);
          }
        }, 2000);
      }
    });

    // --- Skip Player Turn (Master only, during game) ---
    socket.on('skipPlayerTurn', (data) => {
      const room = rooms.get(data.roomId);
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }
      if (!room.game) {
        socket.emit('error', { message: 'No active game' });
        return;
      }

      // Validate sender is the room master
      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender) {
        socket.emit('error', { message: 'You are not in this room' });
        console.log(`skipPlayerTurn failed: sender not found for socket ${socket.id} in room ${data.roomId}`);
        return;
      }
      if (sender.name !== room.master) {
        socket.emit('error', { message: 'Only the room master can skip turns' });
        console.log(`skipPlayerTurn failed: ${sender.name} is not master (master is ${room.master})`);
        return;
      }

      // Can only skip the current drawer
      if (room.game.drawerName !== data.playerName) return;

      // Emit skip notification
      io.to(data.roomId).emit('drawerSkipped', { playerName: data.playerName, reason: 'master_skipped' });

      io.to(data.roomId).emit('roundResult', {
        winnerName: null,
        points: 0,
        currentRound: room.game.currentRound,
        totalRounds: room.game.totalRounds
      });

      // Advance to next round after brief delay
      setTimeout(() => {
        if (room.game) {
          advanceRound(io, room, data.roomId);
        }
      }, 2000);

      console.log(`${data.playerName}'s turn was skipped in room ${data.roomId} by ${sender.name}`);
    });

    // --- End Game Early (Master only) ---
    socket.on('endGameEarly', (data) => {
      const room = rooms.get(data.roomId);
      if (!room || !room.game) return;

      // Validate sender is the room master
      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender || sender.name !== room.master) return;

      // Reset all player scores earned during this game
      room.players.forEach(p => { p.score = 0; });

      // End the game without recording history
      io.to(data.roomId).emit('gameEnded', { finalScores: [], gameHistory: room.gameHistory || [], cancelled: true });
      room.game = null;
    });

    // --- No Winner (Pictionary) ---
    socket.on('noWinner', (data) => {
      const room = rooms.get(data.roomId);
      if (!room || !room.game) return;

      // Validate sender is the drawer
      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender || sender.name !== room.game.drawerName) return;

      io.to(data.roomId).emit('roundResult', {
        winnerName: null,
        points: 0,
        currentRound: room.game.currentRound,
        totalRounds: room.game.totalRounds
      });

      // After 3s display, advance to next round
      setTimeout(() => {
        advanceRound(io, room, data.roomId);
      }, 3000);
    });

    // --- Chat Message ---
    socket.on('chatMessage', (data) => {
      const room = rooms.get(data.roomId);
      if (!room) return;

      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender) return;

      io.to(data.roomId).emit('chatMessage', {
        player: sender.name,
        avatar: sender.avatar,
        message: data.message,
        timestamp: Date.now()
      });
    });

    // --- Change Avatar ---
    socket.on('changeAvatar', (data) => {
      const { roomId, avatar } = data;
      const room = rooms.get(roomId);
      if (!room) return;

      const player = room.players.find(p => p.socketId === socket.id);
      if (!player) return;

      // Check if avatar is already taken by another player
      const taken = room.players.find(p => p.avatar === avatar && p.name !== player.name);
      if (taken) {
        socket.emit('avatarTaken', { avatar });
        return;
      }

      const wasMetaAvatar = player.avatar === 'meta';
      player.avatar = avatar;
      io.to(roomId).emit('avatarChanged', { roomId, playerName: player.name, avatar });
      console.log(`${player.name} changed avatar to ${avatar} in room ${roomId}`);

      // Cancel avatar selection timer if player is selecting a non-meta avatar
      if (wasMetaAvatar && avatar !== 'meta') {
        const timerKey = `${roomId}:${player.name}`;
        const pending = avatarSelectionTimers.get(timerKey);
        if (pending) {
          clearTimeout(pending.timer);
          avatarSelectionTimers.delete(timerKey);
          console.log(`Avatar selection timer cancelled for ${player.name} in room ${roomId}`);
        }
      }
    });

    // --- Disconnect: grace period before removing player ---
    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);

      // Handle online user cleanup
      if (socket.userId) {
        const userId = socket.userId;
        onlineUsers.delete(userId);

        // Notify friends that user is offline
        if (socket.friendIds && socket.friendIds.length > 0) {
          broadcastToFriends(io, userId, socket.friendIds, 'friendOffline', { userId });
        }

        console.log(`User ${userId} is now offline`);
      }

      rooms.forEach((room, roomId) => {
        const player = room.players.find(p => p.socketId === socket.id);
        if (!player) return;

        // Cancel any pending avatar selection timer for this player
        const avatarTimerKey = `${roomId}:${player.name}`;
        const pendingAvatarTimer = avatarSelectionTimers.get(avatarTimerKey);
        if (pendingAvatarTimer) {
          clearTimeout(pendingAvatarTimer.timer);
          avatarSelectionTimers.delete(avatarTimerKey);
        }

        // If disconnecting player is current drawer during active game, treat as noWinner + advance
        if (room.game && room.game.drawerName === player.name) {
          io.to(roomId).emit('roundResult', {
            winnerName: null,
            points: 0,
            currentRound: room.game.currentRound,
            totalRounds: room.game.totalRounds
          });
          setTimeout(() => {
            advanceRound(io, room, roomId);
          }, 3000);
        }

        // Mark disconnected but don't remove yet
        player.connected = false;
        const key = `${roomId}:${player.name}`;

        // Notify other players that this player is disconnected (but not removed yet)
        io.to(roomId).emit('playerDisconnected', { roomId, playerName: player.name });

        console.log(`${player.name} disconnected from room ${roomId}, grace period started (${GRACE_PERIOD_MS / 1000}s)`);

        const timer = setTimeout(() => {
          disconnectedPlayers.delete(key);

          // Re-check room still exists
          const currentRoom = rooms.get(roomId);
          if (!currentRoom) return;

          // Remove the player
          currentRoom.players = currentRoom.players.filter(p => p.name !== player.name);
          console.log(`Grace period expired — ${player.name} removed from room ${roomId}`);

          // If room is empty, delete it
          if (currentRoom.players.length === 0) {
            // Clean up masterRooms tracking
            if (masterRooms.get(currentRoom.master) === roomId) {
              masterRooms.delete(currentRoom.master);
            }
            rooms.delete(roomId);
            console.log(`Room ${roomId} removed (empty)`);
          } else {
            // Notify remaining players
            io.to(roomId).emit('playerLeft', { roomId, playerName: player.name });
          }
        }, GRACE_PERIOD_MS);

        disconnectedPlayers.set(key, { timer });
      });
    });
  });
}

module.exports = { setupSockets };
