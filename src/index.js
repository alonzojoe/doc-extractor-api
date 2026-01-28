const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const fs = require("fs")
require("dotenv").config();

const config = require("./config")
const documentRoutes = require("./routes/document.routes")

const app = express()
const PORT = config.port

if(!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads')
}

app.use(helmet())

app.use(cors({
    origin: config.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests.'
})

app.use(limiter)
app.use(express.json())
app.use(express.urlencoded({extended: true}));

app.get("/", (_, res) => {
    res.json({
        message: 'Document Extractor POC API',
        version: '1.0.0',
        endpoints: {
            health: '/api/documents/health',
            extract: 'POST /api/documents/extract'
        }
    })
})

app.use('/api/documents', documentRoutes)

app.use((_, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

app.use((err, req, res, next) => {
    console.log('Error: ', err)

    if (err.message.includes('File too large')) {
      return res.status(413).json({
        error: 'Payload Too Large',
        message: 'File size exceeds the maximum allowed size'
      });
    }

    if (err.message.includes('Invalid file type')) {
      return res.status(400).json({
        error: 'Bad Request',
        message: err.message
      });
    }

    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message || 'Something went wrong'
    });
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${config.nodeEnv}`);
    console.log(`CORS enabled for: ${config.frontendUrl}`);
})