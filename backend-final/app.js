// app.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Import Routes
const uploadRoutes = require('./routes/uploadRoutes');
const chatRoutes = require('./routes/chatRoutes');
const emailRoutes = require('./routes/emailRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();

// --- CORS Configuration ---
// This list now includes your local and all Vercel domains.
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://192.168.1.2:3000',
  'https://lzy-crazy-h.vercel.app',
  'https://lzy-crazy-h-git-main-jare-alams-projects.vercel.app',
  'https://lzy-crazy-9iubosup2-jare-alams-projects.vercel.app'
];

// This line is a good fallback, but the array above is the main fix.
if (process.env.NODE_ENV === 'production' && process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman) or from our list
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      const errorMsg = 'CORS policy: The origin is not allowed → ' + origin;
      return callback(new Error(errorMsg), false);
    }
  },
  credentials: true,
};

// Use CORS middleware with our options
app.use(cors(corsOptions));

// Body parsers to handle JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
app.use('/api/upload', uploadRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/messages', messageRoutes);

// --- Health Check and Error Handling ---

// Health Check endpoint
app.get('/', (req, res) => {
  res.send('✅ Backend server is running!');
});

// 404 Fallback for routes that don't exist
app.use((req, res) => {
  res.status(404).json({ message: '❌ Route not found' });
});

// Global Error Handler for any unhandled errors
app.use((err, req, res, next) => {
  console.error('💥 Unhandled Error:', err.message || err);
  res.status(500).json({ message: '🔥 Internal Server Error' });
});

module.exports = app;
