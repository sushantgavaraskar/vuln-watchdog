// Logger util
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, 'app.log');

const formatMessage = (level, message, data = null) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...(data && { data })
  };
  return JSON.stringify(logEntry) + '\n';
};

const writeToFile = (logEntry) => {
  try {
    fs.appendFileSync(logFile, logEntry);
  } catch (error) {
    console.error('Error writing to log file:', error);
  }
};

exports.log = (message, data = null) => {
  const logEntry = formatMessage('INFO', message, data);
  console.log(message, data ? data : '');
  writeToFile(logEntry);
};

exports.error = (message, error = null) => {
  const logEntry = formatMessage('ERROR', message, error ? error.stack : null);
  console.error(message, error ? error : '');
  writeToFile(logEntry);
};

exports.warn = (message, data = null) => {
  const logEntry = formatMessage('WARN', message, data);
  console.warn(message, data ? data : '');
  writeToFile(logEntry);
};

exports.debug = (message, data = null) => {
  if (process.env.NODE_ENV === 'development') {
    const logEntry = formatMessage('DEBUG', message, data);
    console.log(`[DEBUG] ${message}`, data ? data : '');
    writeToFile(logEntry);
  }
};

// Log API requests
exports.logRequest = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    };
    
    exports.log(`${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`, logData);
  });
  
  next();
};