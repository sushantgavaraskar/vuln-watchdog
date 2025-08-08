#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 * 
 * This script validates that all required environment variables are properly set
 * and have valid values. It can be run during build or development to catch
 * configuration issues early.
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}

// Configuration validation
const validateConfig = () => {
  const errors = [];
  const warnings = [];

  // Required environment variables
  const required = [
    'NEXT_PUBLIC_API_BASE_URL',
    'NEXT_PUBLIC_JWT_STORAGE_KEY',
    'NEXT_PUBLIC_USER_STORAGE_KEY'
  ];

  // Check required variables
  required.forEach(key => {
    if (!process.env[key]) {
      errors.push(`Missing required environment variable: ${key}`);
    }
  });

  // Validate API URL format
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (apiUrl && !apiUrl.startsWith('http')) {
    errors.push('NEXT_PUBLIC_API_BASE_URL must be a valid HTTP/HTTPS URL');
  }

  // Validate numeric values
  const numericVars = [
    { key: 'NEXT_PUBLIC_MAX_FILE_SIZE', min: 1 },
    { key: 'NEXT_PUBLIC_API_TIMEOUT', min: 1000 },
    { key: 'NEXT_PUBLIC_SSE_RECONNECT_INTERVAL', min: 1000 },
    { key: 'NEXT_PUBLIC_TOAST_DURATION', min: 1000 }
  ];

  numericVars.forEach(({ key, min }) => {
    const value = process.env[key];
    if (value) {
      const num = parseInt(value, 10);
      if (isNaN(num) || num < min) {
        errors.push(`${key} must be a number greater than or equal to ${min}`);
      }
    }
  });

  // Check for deprecated or unused variables
  const deprecated = [
    'REACT_APP_', // React Create App prefix (we use Next.js)
    'VITE_', // Vite prefix (we use Next.js)
  ];

  Object.keys(process.env).forEach(key => {
    deprecated.forEach(prefix => {
      if (key.startsWith(prefix)) {
        warnings.push(`Potentially deprecated environment variable: ${key}`);
      }
    });
  });

  // Validate file types array
  const allowedFileTypes = process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES;
  if (allowedFileTypes) {
    const types = allowedFileTypes.split(',').map(t => t.trim()).filter(Boolean);
    if (types.length === 0) {
      errors.push('NEXT_PUBLIC_ALLOWED_FILE_TYPES must contain at least one file type');
    }
  }

  // Check for development vs production settings
  if (process.env.NODE_ENV === 'production') {
    if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
      warnings.push('NEXT_PUBLIC_DEV_MODE should be false in production');
    }
    if (process.env.NEXT_PUBLIC_ENABLE_DEBUG_MODE === 'true') {
      warnings.push('NEXT_PUBLIC_ENABLE_DEBUG_MODE should be false in production');
    }
    if (process.env.NEXT_PUBLIC_ENABLE_MOCK_API === 'true') {
      warnings.push('NEXT_PUBLIC_ENABLE_MOCK_API should be false in production');
    }
  }

  return { errors, warnings };
};

// Main execution
const main = () => {
  console.log('🔍 Validating environment configuration...\n');

  const { errors, warnings } = validateConfig();

  // Display results
  if (errors.length > 0) {
    console.error('❌ Configuration errors found:');
    errors.forEach(error => console.error(`  - ${error}`));
    console.error('\nPlease fix these errors before continuing.');
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn('⚠️  Configuration warnings:');
    warnings.forEach(warning => console.warn(`  - ${warning}`));
    console.warn('\nThese warnings should be addressed but won\'t prevent the application from running.');
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ Environment configuration is valid!');
  } else if (errors.length === 0) {
    console.log('✅ Environment configuration is valid (with warnings).');
  }

  // Display current configuration summary
  console.log('\n📋 Current Configuration Summary:');
  console.log(`  API Base URL: ${process.env.NEXT_PUBLIC_API_BASE_URL || 'Not set'}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'Not set'}`);
  console.log(`  Dev Mode: ${process.env.NEXT_PUBLIC_DEV_MODE || 'Not set'}`);
  console.log(`  Debug Mode: ${process.env.NEXT_PUBLIC_ENABLE_DEBUG_MODE || 'Not set'}`);
  console.log(`  SSE Enabled: ${process.env.NEXT_PUBLIC_ENABLE_SSE || 'Not set'}`);
  console.log(`  File Upload Enabled: ${process.env.NEXT_PUBLIC_ENABLE_FILE_UPLOAD || 'Not set'}`);
  console.log(`  Admin Features Enabled: ${process.env.NEXT_PUBLIC_ENABLE_ADMIN_FEATURES || 'Not set'}`);
};

// Run validation
main();
