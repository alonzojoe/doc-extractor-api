const express = require('express');
const { extractDocument, healthCheck } = require('../controllers/document.controller');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

// Extract document endpoint
router.post('/extract', upload.single('document'), extractDocument);

// Health check
router.get('/health', healthCheck);

module.exports = router;