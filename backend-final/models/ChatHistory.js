// models/ChatHistory.js

const mongoose = require('mongoose');

const ChatHistorySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  totalMessage: {
    type: Number,
    required: true,
  },
  messageType: {
    type: String,
    default: 'Campaign',
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ChatHistory', ChatHistorySchema);