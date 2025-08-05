# Production File Upload Guide

## 🚀 Overview

This guide covers production-ready file upload handling for VulnWatchdog, including security, performance, and scalability considerations.

## 🔒 Security Features

### File Validation
- **File Type Validation**: Only supported dependency files are accepted
- **File Size Limits**: Maximum 5MB per file
- **File Count Limits**: Maximum 1 file per request
- **Content Validation**: Files are parsed to ensure they contain valid dependency data

### Supported File Types
```
package.json          - Node.js dependencies
requirements.txt      - Python dependencies  
pom.xml              - Java/Maven dependencies
Gemfile              - Ruby dependencies
composer.json        - PHP dependencies
go.mod               - Go dependencies
yarn.lock            - Yarn lock file
package-lock.json    - NPM lock file
```

### Security Measures
- **Unique Filenames**: Prevents filename conflicts and path traversal
- **Temporary Storage**: Files are processed and immediately deleted
- **Input Sanitization**: All file content is validated before processing
- **Access Control**: Files can only be uploaded by authenticated users
- **Project Ownership**: Users can only upload to their own projects

## 📁 Storage Options

### 1. Local Storage (Default)
```javascript
// Files stored temporarily in server/uploads/
// Automatically cleaned up after processing
```

**Pros:**
- Simple setup
- No external dependencies
- Fast processing

**Cons:**
- Limited scalability
- Disk space management required
- No redundancy

### 2. Cloud Storage (AWS S3)
```javascript
// Files stored in S3 bucket
// Configure with environment variables
```

**Environment Variables:**
```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=vulnwatchdog-uploads
```

**Pros:**
- Scalable and reliable
- Automatic backup and redundancy
- Cost-effective for large volumes
- CDN integration possible

**Cons:**
- Additional complexity
- Network latency
- Cost considerations

## 🔧 Configuration

### Environment Variables
```bash
# File Upload Limits
MAX_FILE_SIZE=5242880          # 5MB in bytes
MAX_FILES_PER_REQUEST=1        # Files per upload

# Storage Configuration
STORAGE_TYPE=local             # local or s3
UPLOAD_DIR=uploads            # Local upload directory

# AWS S3 (if using cloud storage)
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=vulnwatchdog-uploads
```

### Upload Configuration
```javascript
// utils/uploadConfig.js
const uploadConfig = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 1,
  allowedFiles: ['package.json', 'requirements.txt', ...],
  storage: 'local' // or 's3'
};
```

## 🚀 Performance Optimization

### 1. File Processing
```javascript
// Stream processing for large files
const stream = fs.createReadStream(filePath);
const chunks = [];
stream.on('data', chunk => chunks.push(chunk));
stream.on('end', () => {
  const content = Buffer.concat(chunks).toString();
  // Process content
});
```

### 2. Parallel Processing
```javascript
// Process multiple dependencies in parallel
const dependencyPromises = deps.map(dep => 
  cveFetcher.fetchCVEs(dep)
);
const results = await Promise.allSettled(dependencyPromises);
```

### 3. Caching
```javascript
// Cache CVE data to reduce API calls
const cacheKey = `${dep.name}@${dep.version}`;
let issues = await cache.get(cacheKey);
if (!issues) {
  issues = await cveFetcher.fetchCVEs(dep);
  await cache.set(cacheKey, issues, 3600); // 1 hour
}
```

## 📊 Monitoring and Logging

### Upload Metrics
```javascript
// Track upload statistics
const uploadStats = {
  totalUploads: 0,
  successfulUploads: 0,
  failedUploads: 0,
  averageProcessingTime: 0,
  fileTypeDistribution: {}
};
```

### Error Logging
```javascript
// Comprehensive error logging
console.error('Upload Error:', {
  userId: req.user.id,
  projectId: req.body.projectId,
  fileName: file.originalname,
  fileSize: file.size,
  error: error.message,
  timestamp: new Date().toISOString()
});
```

## 🔄 File Lifecycle

### 1. Upload Process
```
User Upload → Validation → Storage → Processing → Cleanup
```

### 2. Processing Steps
```
1. File Validation (type, size, content)
2. Parse Dependencies
3. Fetch CVE Data
4. Store in Database
5. Generate Report
6. Cleanup Temporary Files
```

### 3. Error Handling
```javascript
try {
  // Upload processing
} catch (error) {
  // Log error
  // Cleanup files
  // Return user-friendly error
} finally {
  // Always cleanup temporary files
}
```

## 🛡️ Security Best Practices

### 1. File Validation
- ✅ Check file extension
- ✅ Validate file content
- ✅ Limit file size
- ✅ Scan for malware (optional)

### 2. Access Control
- ✅ Require authentication
- ✅ Validate project ownership
- ✅ Rate limiting on uploads

### 3. Data Protection
- ✅ Encrypt sensitive data
- ✅ Secure file storage
- ✅ Regular security audits

## 📈 Scaling Considerations

### 1. Horizontal Scaling
```javascript
// Use Redis for session storage
// Implement load balancing
// Use CDN for static files
```

### 2. Database Optimization
```javascript
// Use database connection pooling
// Implement query optimization
// Add proper indexing
```

### 3. Caching Strategy
```javascript
// Cache CVE data
// Cache scan results
// Use Redis for session management
```

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] Configure environment variables
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Test file upload limits
- [ ] Validate security measures

### Post-deployment
- [ ] Monitor upload success rates
- [ ] Track processing times
- [ ] Monitor storage usage
- [ ] Set up alerts for failures
- [ ] Regular security audits

## 🔧 Troubleshooting

### Common Issues

1. **File Upload Fails**
   - Check file size limits
   - Validate file type
   - Check disk space
   - Verify permissions

2. **Processing Timeout**
   - Increase timeout limits
   - Optimize processing logic
   - Use background jobs

3. **Storage Issues**
   - Monitor disk usage
   - Implement cleanup jobs
   - Consider cloud storage

### Debug Commands
```bash
# Check upload directory
ls -la uploads/

# Monitor file uploads
tail -f logs/upload.log

# Check disk usage
df -h

# Monitor memory usage
htop
```

## 📚 Additional Resources

- [Multer Documentation](https://github.com/expressjs/multer)
- [AWS S3 Best Practices](https://docs.aws.amazon.com/s3/)
- [Node.js File Upload Security](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security](https://expressjs.com/en/advanced/best-practices-security.html) 