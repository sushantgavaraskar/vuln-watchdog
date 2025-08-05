const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'vulnwatchdog-uploads';

class CloudStorage {
  /**
   * Upload file to cloud storage
   * @param {string} filePath - Local file path
   * @param {string} fileName - Name to store in cloud
   * @returns {Promise<string>} - Cloud storage URL
   */
  static async uploadFile(filePath, fileName) {
    try {
      const fileContent = fs.readFileSync(filePath);
      
      const params = {
        Bucket: BUCKET_NAME,
        Key: `uploads/${fileName}`,
        Body: fileContent,
        ContentType: this.getContentType(fileName),
        ACL: 'private', // Private by default for security
        Metadata: {
          'upload-date': new Date().toISOString(),
          'original-filename': fileName
        }
      };

      const result = await s3.upload(params).promise();
      return result.Location;
    } catch (error) {
      console.error('Cloud storage upload error:', error);
      throw new Error('Failed to upload file to cloud storage');
    }
  }

  /**
   * Download file from cloud storage
   * @param {string} fileKey - File key in cloud storage
   * @param {string} localPath - Local path to save file
   */
  static async downloadFile(fileKey, localPath) {
    try {
      const params = {
        Bucket: BUCKET_NAME,
        Key: fileKey
      };

      const result = await s3.getObject(params).promise();
      fs.writeFileSync(localPath, result.Body);
    } catch (error) {
      console.error('Cloud storage download error:', error);
      throw new Error('Failed to download file from cloud storage');
    }
  }

  /**
   * Delete file from cloud storage
   * @param {string} fileKey - File key in cloud storage
   */
  static async deleteFile(fileKey) {
    try {
      const params = {
        Bucket: BUCKET_NAME,
        Key: fileKey
      };

      await s3.deleteObject(params).promise();
    } catch (error) {
      console.error('Cloud storage delete error:', error);
      // Don't throw error for cleanup operations
    }
  }

  /**
   * Get presigned URL for temporary access
   * @param {string} fileKey - File key in cloud storage
   * @param {number} expiresIn - Expiration time in seconds (default: 3600)
   * @returns {Promise<string>} - Presigned URL
   */
  static async getPresignedUrl(fileKey, expiresIn = 3600) {
    try {
      const params = {
        Bucket: BUCKET_NAME,
        Key: fileKey,
        Expires: expiresIn
      };

      return await s3.getSignedUrlPromise('getObject', params);
    } catch (error) {
      console.error('Cloud storage presigned URL error:', error);
      throw new Error('Failed to generate presigned URL');
    }
  }

  /**
   * Get content type based on file extension
   * @param {string} fileName - File name
   * @returns {string} - Content type
   */
  static getContentType(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    const contentTypes = {
      '.json': 'application/json',
      '.txt': 'text/plain',
      '.xml': 'application/xml',
      '.lock': 'text/plain'
    };
    return contentTypes[ext] || 'application/octet-stream';
  }

  /**
   * Check if cloud storage is configured
   * @returns {boolean}
   */
  static isConfigured() {
    return !!(process.env.AWS_ACCESS_KEY_ID && 
              process.env.AWS_SECRET_ACCESS_KEY && 
              process.env.AWS_S3_BUCKET);
  }
}

module.exports = CloudStorage; 