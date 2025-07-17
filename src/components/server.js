// Simple chat server with socket.io
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Lưu trữ tin nhắn trong RAM (có thể thay bằng database nếu muốn)
let messages = [];

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Gửi toàn bộ tin nhắn cũ cho client mới
  socket.emit('chat_history', messages);

  // Lắng nghe tin nhắn mới
  socket.on('chat_message', (msg) => {
    const message = {
      id: Date.now(),
      user: msg.user, // {id, name, role}
      text: msg.text,
      time: new Date().toISOString()
    };
    messages.push(message);
    // Gửi cho tất cả client
    io.emit('chat_message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.CHAT_PORT || 4000;
server.listen(PORT, () => {
  console.log(`Socket.io chat server running on port ${PORT}`);
}); 