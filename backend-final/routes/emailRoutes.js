const express = require('express');
const router = express.Router();
const multer = require('multer');
const { sendEmail } = require('../controllers/emailController');

// Create a multer instance that stores files in memory as buffers
const memoryUpload = multer({ storage: multer.memoryStorage() });

// Use the new multer instance for this route
router.post('/send', memoryUpload.array('attachments', 5), sendEmail);

module.exports = router;