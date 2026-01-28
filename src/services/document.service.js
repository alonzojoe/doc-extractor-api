const fs = require("fs").promises
const pdfParse = require("pdf-parse")
const MistralService = require("./mistral.service")

class DocumentService {
    constructor() {
        this.mistralService = new MistralService()
    }

    async processDocument(filepath) {
        try {

            const dataBuffer = await fs.readFile(filepath)

            const pdfData = await pdfParse(dataBuffer)
            const extractedText = pdfData.text;

            if (!extractedText || extractedText.trim().length === 0) {
                throw new Error("No text found in the pdf doc.")
            }

            console.log('extracted text from pdf doc.: ', `${extractedText.substring(0, 100)}...`)

            const result = await this.mistralService.extractFromText(extractedText)

            return result;

        } catch (error) {
            console.log('error: ', error)
            throw error
        } finally {
            await this.deleteFile(filepath)
            console.log('finally')
        }
    }

    async deleteFile(filepath) {
        try {
            await fs.unlink(filepath)
            console.log('deleted file: ', filepath)
        } catch (error) {
            console.log('an error occured while deling the file: ', error)
        }
    }

}

module.exports = DocumentService