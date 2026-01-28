const DocumentService = require('../services/document.service');

const documentService = new DocumentService();

const extractDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'No file uploaded'
      });
    }

    console.log('File info:', req.file);
    console.log('Processing file:', req.file.originalname);

    const extractedData = await documentService.processDocument(req.file.path);

    res.status(200).json({
      success: true,
      data: extractedData
    });
  } catch (error) {
    console.error('Error processing document:', error);
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to process document'
    });
  }
};

const healthCheck = async (_, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
};

module.exports = {
  extractDocument,
  healthCheck
};