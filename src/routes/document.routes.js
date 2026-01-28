const express = require("express")
const DocumentController = require("../controllers/document.controller")
const upload = require("../middleware/upload.middleware")

const router = express.Router()
const documentController = new DocumentController()

router.post('/extract', upload.single('document'), documentController.extractDocument)

router.get('/health', documentController.healthCheck)

module.exports = router