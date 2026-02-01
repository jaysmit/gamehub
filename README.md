# GameHub

Multiplayer game room platform with real-time sockets and user profiles.

## Project Structure

```
gamehub/
├── public/
│   └── index.html          ← Your existing frontend (unchanged)
├── src/
│   ├── models/
│   │   └── User.js         ← Mongoose schema for user profiles
│   ├── routes/
│   │   └── users.js        ← REST API: GET/POST/DELETE /api/users
│   └── sockets.js          ← Socket.io event handlers (createRoom, joinRoom, etc.)
├── server.js               ← Entry point: Express + Socket.io + MongoDB
├── package.json
├── .env.example            ← Copy to .env for local dev
└── .gitignore
```

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Create your .env file
cp .env.example .env
# Edit .env and paste your MongoDB Atlas connection string

# 3. Run the server
npm start
# Server starts on http://localhost:3000
```

## API Endpoints

| Method | Endpoint          | Description                        |
|--------|-------------------|------------------------------------|
| GET    | /api/users        | List all users                     |
| GET    | /api/users/:name  | Get user by name                   |
| POST   | /api/users        | Create or update a user (upsert)   |
| DELETE | /api/users/:name  | Delete a user                      |

## Socket.io Events

These match the events your frontend's `MockSocket` class already uses:

| Client → Server | Server → Client  | Description                      |
|-----------------|------------------|----------------------------------|
| createRoom      | roomCreated      | Create a new game room           |
| joinRoom        | roomJoined       | Join an existing room            |
|                 | playerJoined     | Broadcast to others on join      |
| toggleGame      | gamesUpdated     | Toggle a game in the room        |
| startGame       | gameStarting     | Start the selected game          |

## Deploying to Railway

1. Push this repo to GitHub.
2. Go to [Railway](https://railway.app) → New Project → Deploy from GitHub.
3. Add environment variables in Railway's settings:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - Railway sets `PORT` automatically, no action needed.
4. Deploy. Done.

## Next Steps

When you're ready to swap the frontend from `MockSocket` to real Socket.io:

1. Add this `<script>` tag to `index.html` (before your app script):
   ```html
   <script src="/socket.io/socket.io.js"></script>
   ```
2. Replace the `MockSocket` class and instantiation with:
   ```js
   const socket = io();
   ```
   The event names are already identical, so nothing else needs to change.
