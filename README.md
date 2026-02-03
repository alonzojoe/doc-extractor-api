# Document Extractor Backend API

Backend API for extracting structured data from PDF documents using Mistral AI.

## 🚀 Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **Mistral AI** - Document extraction AI
- **pdf-parse** - PDF text extraction
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Node.js 20+ installed
- Mistral AI API key ([Get one here](https://console.mistral.ai/))

## 🛠️ Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Create environment file:**
```bash
cp .env.example .env
```

3. **Add your Mistral API key to `.env`:**
```env
MISTRAL_API_KEY=your_actual_api_key_here
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
MAX_FILE_SIZE=your_desired_maximum_file_size
```

## 🏃 Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Health Check
```
GET /api/documents/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-28T10:00:00.000Z",
  "uptime": 123.45
}
```

### Extract Document
```
POST /api/documents/extract
```

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: 
  - `document`: PDF file (max 10MB)

**Example using cURL:**
```bash
curl -X POST http://localhost:3000/api/documents/extract \
  -F "document=@/path/to/invoice.pdf"
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "documentType": "Invoice",
    "extractedFields": {
      "invoiceNumber": "INV-2024-001",
      "date": "2024-01-27",
      "total": "$1,234.56",
      "vendor": "Acme Corporation",
      "items": [...]
    },
    "confidence": 0.95
  }
}
```

**Error Response (400/500):**
```json
{
  "error": "Error type",
  "message": "Error message"
}
```

## 📁 Project Structure

```
doc-extractor-api/
├── src/
│   ├── config/
│   │   └── index.js          # Environment configuration
│   ├── controllers/
│   │   └── document.controller.js
│   ├── services/
│   │   ├── document.service.js
│   │   └── mistral.service.js
│   ├── middleware/
│   │   └── upload.middleware.js
│   ├── routes/
│   │   └── document.routes.js
│   ├── app.js                # Express app setup
│   └── server.js             # Server entry point
├── uploads/                  # Temporary file storage
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🔒 Security Features

- **Helmet** - Security headers
- **CORS** - Configured for frontend origin only
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **File Validation** - Only PDF files allowed
- **File Size Limit** - Maximum 10MB per file

## 🔧 Configuration

All configuration is in `.env`:

```env
PORT=5000                          # Server port
NODE_ENV=development               # Environment
FRONTEND_URL=http://localhost:5173 # CORS origin
MISTRAL_API_KEY=xxx                # Your Mistral API key
MAX_FILE_SIZE=10485760             # Max file size (10MB)
```

## 📝 Notes

- Uploaded files are automatically deleted after processing
- PDF text is extracted before sending to Mistral AI
- The API uses Mistral's `pixtral-12b-2409` model for document processing

## 🐛 Troubleshooting

**"MISTRAL_API_KEY is required"**
- Add your API key to `.env` file

**"Invalid file type"**
- Only PDF files are supported

**"File too large"**
- Maximum file size is 10MB (configurable in `.env`)

**CORS errors**
- Make sure `FRONTEND_URL` in `.env` matches your frontend URL