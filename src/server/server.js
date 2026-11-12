const { WebSocketServer } = require('ws');

// Create WebSocket server on port 8080
const wss = new WebSocketServer({ port: 8080 });

// Store active rooms
// roomId -> { white: ws, black: ws }
const rooms = new Map();

wss.on('connection', (ws) => {
  console.log('New client connected');
  ws.roomId = null;
  ws.color = null;

  ws.on('message', (message) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch (e) {
      return console.error('Invalid JSON');
    }

    // 1. Handle Joining a Room
    if (data.type === 'join') {
      const roomId = data.roomId;
      ws.roomId = roomId;

      if (!rooms.has(roomId)) {
        // Create new room, user is white
        rooms.set(roomId, { white: ws, black: null });
        ws.color = 'w';
        ws.send(JSON.stringify({ type: 'joined', color: 'w' }));
        console.log(`Room ${roomId} created by White`);
      } else {
        const room = rooms.get(roomId);
        if (!room.black) {
          // Join existing room as black
          room.black = ws;
          ws.color = 'b';
          
          // Tell Black they joined and send current board state (if White already moved)
          ws.send(JSON.stringify({ 
            type: 'joined', 
            color: 'b',
            boardState: data.currentBoard // Fallback just in case
          }));

          // Tell White that Black has arrived
          room.white.send(JSON.stringify({ type: 'opponent_joined' }));
          console.log(`Room ${roomId} joined by Black`);
        } else {
          // Room is full
          ws.send(JSON.stringify({ type: 'error', message: 'Room is full' }));
        }
      }
    }

    // 2. Handle Moves
    if (data.type === 'move') {
      const room = rooms.get(ws.roomId);
      if (!room) return;

      // Broadcast the move to the OTHER player in the room
      const opponent = ws.color === 'w' ? room.black : room.white;
      
      if (opponent && opponent.readyState === 1) { // 1 means OPEN
        opponent.send(JSON.stringify({
          type: 'opponent_move',
          boardState: data.boardState,
          currentTurn: data.currentTurn
        }));
      }
    }
    
    // 3. Handle Resets
    if (data.type === 'reset') {
        const room = rooms.get(ws.roomId);
        if (!room) return;
        const opponent = ws.color === 'w' ? room.black : room.white;
        if (opponent && opponent.readyState === 1) {
            opponent.send(JSON.stringify({ type: 'reset' }));
        }
    }
  });

  ws.on('close', () => {
    if (ws.roomId && rooms.has(ws.roomId)) {
      const room = rooms.get(ws.roomId);
      const opponent = ws.color === 'w' ? room.black : room.white;
      
      // Notify opponent of disconnection
      if (opponent && opponent.readyState === 1) {
        opponent.send(JSON.stringify({ type: 'opponent_disconnected' }));
      }
      
      // Cleanup room
      if (ws.color === 'w') rooms.delete(ws.roomId);
      else if (room) room.black = null;
    }
  });
});

console.log('WebSocket server running on ws://localhost:8080');