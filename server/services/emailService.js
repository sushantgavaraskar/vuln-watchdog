const nodemailer = require('nodemailer');

// Create transporter with fallback for testing
const createTransporter = () => {
  // If email credentials are not configured, use a mock transporter
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email credentials not configured, using mock transporter');
    return nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      secure: false,
      ignoreTLS: true,
      auth: {
        user: 'test',
        pass: 'test'
      }
    });
  }

  // Production SMTP configuration
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_USER,
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  // Gmail configuration (fallback)
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const transporter = createTransporter();

exports.sendAlert = async (user, alert) => {
  try {
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email credentials not configured, skipping email send');
      return { success: false, message: 'Email not configured' };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: user.email,
      subject: alert.subject,
      text: alert.text,
      html: alert.html || alert.text // Support HTML emails
    };
    
    await transporter.sendMail(mailOptions);
    
    console.log('Alert email sent to:', user.email);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Email send error:', error);
    
    // Always return a result instead of throwing in development/test
    return { 
      success: false, 
      message: 'Email failed but continuing', 
      error: error.message 
    };
  }
};

// Enhanced email functions for production
exports.sendSecurityAlert = async (user, vulnerability) => {
  const alert = {
    subject: `🚨 Security Alert: ${vulnerability.title}`,
    text: `Critical vulnerability detected in your project: ${vulnerability.description}`,
    html: `
      <h2>🚨 Security Alert</h2>
      <p><strong>Vulnerability:</strong> ${vulnerability.title}</p>
      <p><strong>Severity:</strong> ${vulnerability.severity}</p>
      <p><strong>Description:</strong> ${vulnerability.description}</p>
      <p><strong>CVE ID:</strong> ${vulnerability.cveId || 'N/A'}</p>
      <hr>
      <p>Please update your dependencies immediately.</p>
    `
  };
  
  return await exports.sendAlert(user, alert);
};

exports.sendDailyDigest = async (user, summary) => {
  const alert = {
    subject: `📊 Daily Security Digest - ${new Date().toLocaleDateString()}`,
    text: `Daily security summary: ${summary.totalVulnerabilities} vulnerabilities found across ${summary.totalProjects} projects.`,
    html: `
      <h2>📊 Daily Security Digest</h2>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Projects Scanned:</strong> ${summary.totalProjects}</p>
      <p><strong>Total Vulnerabilities:</strong> ${summary.totalVulnerabilities}</p>
      <p><strong>Critical:</strong> ${summary.criticalCount}</p>
      <p><strong>High:</strong> ${summary.highCount}</p>
      <p><strong>Medium:</strong> ${summary.mediumCount}</p>
      <p><strong>Low:</strong> ${summary.lowCount}</p>
    `
  };
  
  return await exports.sendAlert(user, alert);
};

exports.sendWelcomeEmail = async (user) => {
  const alert = {
    subject: '🎉 Welcome to VulnWatchdog!',
    text: `Welcome ${user.name}! Your account has been successfully created.`,
    html: `
      <h2>🎉 Welcome to VulnWatchdog!</h2>
      <p>Hello ${user.name},</p>
      <p>Your account has been successfully created. You can now:</p>
      <ul>
        <li>Create projects to monitor</li>
        <li>Upload dependency files for scanning</li>
        <li>Receive real-time security alerts</li>
        <li>View detailed vulnerability reports</li>
      </ul>
      <p>Get started by creating your first project!</p>
    `
  };
  
  return await exports.sendAlert(user, alert);
};

// Test email configuration
exports.testEmailConfig = async () => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return { success: false, message: 'Email not configured' };
    }

    await transporter.verify();
    return { success: true, message: 'Email configuration is valid' };
  } catch (error) {
    return { success: false, message: 'Email configuration failed', error: error.message };
  }
};