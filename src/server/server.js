const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const { loadModel } = require('../services/loadModel');
const { handleChatRequest, handleSocketChat } = require('./handler');
const dotenv = require('dotenv');
const socketIo = require('socket.io');

dotenv.config();

const serviceAccount = require('../../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://trails-capstoneproject.firebaseio.com'
  });
}

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  }
});

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

loadModel(process.env.MODEL_URL)
  .then(model => {
    app.set('model', model);
    console.log('Model loaded successfully');
  })
  .catch(error => {
    console.error('Failed to load model:', error);
    process.exit(1);
  });

app.post('/api/chat', handleChatRequest);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('chat message', async (msg) => {
    console.log('Received message:', msg);
    const response = await handleSocketChat(msg, app);
    socket.emit('chat response', response);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
