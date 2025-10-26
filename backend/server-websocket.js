const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const http = require('http');

const app = express();
app.use(cors());
app.use(express.json());

let messages = [];

// ===== MIDDLEWARE =====
function validateMessage(req, res, next) {
  const { sender, text } = req.body;
  if (!sender || !text) {
    return res.status(400).json({ error: "Sender and message text are required." });
  }
  next();
}

function logRequest(req, res, next) {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
}

app.use(logRequest);

// ===== CREATE HTTP + WEBSOCKET SERVER =====
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// ===== BROADCAST FUNCTION (DEFINED EARLY) =====
function broadcast(data) {
  console.log(`📡 Broadcasting to ${wss.clients.size} clients:`, data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // 1 = OPEN
      client.send(JSON.stringify(data));
    }
  });
}

// ===== HTTP ROUTES =====
app.get('/messages', (req, res) => {
  res.json(messages);
});

app.post('/messages', validateMessage, (req, res) => {
  const { sender, text } = req.body;
  const id = messages.length + 1;
  const msg = { 
    id, 
    sender, 
    text, 
    time: new Date().toISOString(),
    likes: 0,
    dislikes: 0
  };
  messages.push(msg);
  
  console.log('✅ New message created:', msg);
  broadcast({ type: 'newMessage', message: msg });
  
  res.status(201).json(msg);
});

// 👍 LIKE MESSAGE
app.post('/messages/:id/like', (req, res) => {
  const id = Number(req.params.id);
  console.log('👍 Like request for message ID:', id);
  
  const msg = messages.find(m => m.id === id);
  
  if (msg) {
    msg.likes += 1;
    console.log('👍 Message liked! New count:', msg.likes);
    
    broadcast({ type: 'likeMessage', messageId: id, likes: msg.likes });
    
    res.json({ id: msg.id, likes: msg.likes });
  } else {
    console.error('❌ Message not found:', id);
    res.status(404).json({ error: "Message not found" });
  }
});

// 👎 DISLIKE MESSAGE
app.post('/messages/:id/dislike', (req, res) => {
  const id = Number(req.params.id);
  console.log('👎 Dislike request for message ID:', id);
  
  const msg = messages.find(m => m.id === id);
  
  if (msg) {
    msg.dislikes += 1;
    console.log('👎 Message disliked! New count:', msg.dislikes);
    
    broadcast({ type: 'dislikeMessage', messageId: id, dislikes: msg.dislikes });
    
    res.json({ id: msg.id, dislikes: msg.dislikes });
  } else {
    console.error('❌ Message not found:', id);
    res.status(404).json({ error: "Message not found" });
  }
});

// DELETE MESSAGE
app.delete('/messages/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = messages.findIndex(m => m.id === id);
  
  if (index !== -1) {
    messages.splice(index, 1);
    console.log('🗑️ Message deleted:', id);
    
    broadcast({ type: 'deleteMessage', messageId: id });
    
    return res.sendStatus(204);
  }
  res.status(404).json({ error: "Message not found" });
});

// ===== WEBSOCKET CONNECTION HANDLER =====
wss.on('connection', (ws) => {
  console.log('🟢 New WebSocket client connected. Total clients:', wss.clients.size);
  
  // Send all existing messages to new client
  ws.send(JSON.stringify({ type: 'allMessages', messages }));
  
  ws.on('close', () => {
    console.log('🔴 Client disconnected. Remaining clients:', wss.clients.size);
  });
});


// ===== START SERVER =====
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on port ${PORT}`);
  console.log('📡 Real-time chat with like/dislike is ready!');
});
