const fs = require("fs").promises
const pdfParse = require("pdf-parse")
const path = require("path")
const MistralService = require("./mistral.service")

class DocumentService {
    constructor() {
        this.mistralService = new MistralService()
    }

    async processDocument(filepath) {
        try {
            const fileExtension = path.extname(filepath).toLowerCase()
            const mimeType = this.getMimeType(filepath)

            if (fileExtension === '.pdf') {
                return await this.processPDF(filepath)
            } else if (['.jpg', '.jpeg', '.png', '.webp'].includes(fileExtension)) {
                return await this.processImage(filepath, mimeType)
            } else {
                throw new Error('Unsupported file type')
            }

        } catch (error) {
            console.log('error: ', error)
            throw error
        } finally {
            await this.deleteFile(filepath)
            console.log('File deleted')
        }
    }

    async processPDF(filepath) {
        const dataBuffer = await fs.readFile(filepath)
        const pdfData = await pdfParse(dataBuffer)
        const extractedText = pdfData.text

        if (!extractedText || extractedText.trim().length === 0) {
            throw new Error("No text found in the PDF document.")
        }

        console.log('Extracted text from PDF:', `${extractedText.substring(0, 100)}...`)

        const result = await this.mistralService.extractFromText(extractedText)
        return result
    }

    async processImage(filepath, mimeType) {
        const imageBuffer = await fs.readFile(filepath)
        const base64Image = imageBuffer.toString('base64')

        console.log('Processing image with Mistral vision model...')

        const result = await this.mistralService.extractFromImage(base64Image, mimeType)
        return result
    }


    getMimeType(filepath) {
        const ext = path.extname(filepath).toLowerCase()
        const mimeTypes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.webp': 'image/webp',
            '.pdf': 'application/pdf'
        }
        return mimeTypes[ext] || 'application/octet-stream'
    }

    async deleteFile(filepath) {
        try {
            await fs.unlink(filepath)
            console.log('Deleted file:', filepath)
        } catch (error) {
            console.log('Error deleting file:', error)
        }
    }
}

module.exports = DocumentService