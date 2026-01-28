const multer = require("multer")
const path = require("path")
const config = require("../config")


const storage = multer.diskStorage({
    destination: (_, _, cb) => {
        cb(null, '/uploads')
    },
    filename: (_, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`)
    }
})

const fileFilter = (_, file, cb) => {
  const allowedMimes = ['application/pdf'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF files are allowed.'));
  }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fieldSize: config.maxFileSize
    }
})


module.exports = upload