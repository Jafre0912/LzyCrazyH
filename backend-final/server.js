// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const path = require('path');
// const fs = require('fs');

// dotenv.config();

// const uploadRoutes = require('./routes/uploadRoutes');
// const chatRoutes = require('./routes/chatRoutes');
// const emailRoutes = require('./routes/emailRoutes');
// const messageRoutes = require('./routes/messageRoutes');

// const app = express();

// // ✅ Simple and direct CORS setup for local development
// app.use(cors({ origin: "http://localhost:3000" }));

// app.use(express.json());

// const dataDir = process.env.DATA_STORAGE_PATH || 'C:\\lzycrazy-data';
// if (!fs.existsSync(dataDir)) {
//   fs.mkdirSync(dataDir, { recursive: true });
// }

// app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// // API Routes
// app.use('/api/upload', uploadRoutes);
// app.use('/api/chat', chatRoutes);
// app.use('/api/emails', emailRoutes);
// app.use('/api/messages', messageRoutes);

// app.get('/', (req, res) => {
//   res.send('Backend server is running!');
// });

// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });



// server.js
const app = require('./app');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Use the port provided by the hosting provider, or 5001 for local development
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});