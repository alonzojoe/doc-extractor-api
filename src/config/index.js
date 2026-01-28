require("dotenv").config()

module.exports = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    mistralApiKey: process.env.MISTRAL_API_KEY || '',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10)
}