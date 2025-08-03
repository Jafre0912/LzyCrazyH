const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

const { sendMessage } = require('../controllers/messageController');

router.post('/send', upload.single('image'), sendMessage);

module.exports = router;