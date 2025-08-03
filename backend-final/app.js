// app.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB
connectDB();

// Import Routes
const uploadRoutes = require('./routes/uploadRoutes');
const chatRoutes = require('./routes/chatRoutes');
const emailRoutes = require('./routes/emailRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();

// ✅ CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://192.168.1.2:3000',
];

// Add production frontend URL from .env (if available)
if (process.env.NODE_ENV === 'production' && process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., Postman or mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      const errorMsg = 'CORS policy: Origin not allowed → ' + origin;
      return callback(new Error(errorMsg), false);
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/messages', messageRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('✅ Backend server is running!');
});

// 404 Fallback
app.use((req, res) => {
  res.status(404).json({ message: '❌ Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('💥 Unhandled Error:', err.message || err);
  res.status(500).json({ message: '🔥 Internal Server Error' });
});

module.exports = app;
