const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Supported file types and their extensions
const SUPPORTED_FILES = {
  'package.json': 'application/json',
  'requirements.txt': 'text/plain',
  'pom.xml': 'application/xml',
  'Gemfile': 'text/plain',
  'composer.json': 'application/json',
  'go.mod': 'text/plain',
  'yarn.lock': 'text/plain',
  'package-lock.json': 'application/json'
};

// File size limits (in bytes)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES_PER_REQUEST = 1;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and original extension
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const ext = path.extname(file.originalname);
    const filename = `${timestamp}_${randomString}${ext}`;
    cb(null, filename);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Check file extension
  const ext = path.extname(file.originalname).toLowerCase();
  const filename = file.originalname.toLowerCase();
  
  // Check if file is supported
  const isSupported = Object.keys(SUPPORTED_FILES).some(supportedFile => 
    filename === supportedFile.toLowerCase() || 
    filename.endsWith(supportedFile.toLowerCase())
  );
  
  if (!isSupported) {
    return cb(new Error(`Unsupported file type. Supported files: ${Object.keys(SUPPORTED_FILES).join(', ')}`), false);
  }
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return cb(new Error(`File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`), false);
  }
  
  cb(null, true);
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES_PER_REQUEST
  }
});

// Cleanup function to remove uploaded files
const cleanupFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error cleaning up file:', error);
  }
};

// Middleware to handle upload errors
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB` 
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        error: `Too many files. Maximum: ${MAX_FILES_PER_REQUEST} file per request` 
      });
    }
    return res.status(400).json({ error: 'File upload error' });
  }
  
  if (error.message.includes('Unsupported file type')) {
    return res.status(400).json({ 
      error: error.message,
      supportedFiles: Object.keys(SUPPORTED_FILES)
    });
  }
  
  return res.status(500).json({ error: 'Internal server error' });
};

module.exports = {
  upload,
  cleanupFile,
  handleUploadError,
  SUPPORTED_FILES,
  MAX_FILE_SIZE,
  MAX_FILES_PER_REQUEST
}; 