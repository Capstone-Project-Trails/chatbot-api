const express = require('express');
const router = express.Router();
const handler = require('./handler');

// Define API routes
router.post('/chat', handler.handleChatRequest);

module.exports = router;
