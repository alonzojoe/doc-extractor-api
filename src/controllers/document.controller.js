const DocumentService = require("../services/document.service")

class DocumentController {
    constuctor() {
        this.documentService = new DocumentService()
    }

    extractDocument = async (req, res) => {
        try {
            if(!req.file) {
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'No file uploaded'
                })
            }

            console.log('Processing file: ', req.file.originalname)

            const extractedData = await this.documentService.processDocument(req.file.path)

            req.status(200).json({
                success: true,
                data: extractedData
            })

        } catch (error) {
            console.log('Error processing document:', error)

            req.status(500).json({
                erro: 'Internal Server Error',
                message: error?.message || 'Failed to process document'
            })
        }
    }

    healthCheck = async (_, res) => {
        res.status(200).json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        })
    }
}

module.exports = DocumentController()