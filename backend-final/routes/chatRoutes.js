const express = require('express');
const router = express.Router();

// 1. Import the entire controller object
const chatController = require('../controllers/chatController');

// 2. Use the specific function from the controller for the route
//router.get('/history', chatController.getChatHistory);

module.exports = router;