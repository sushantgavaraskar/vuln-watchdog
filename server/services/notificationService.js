const prisma = require('../config/db');
const emailService = require('./emailService');

class NotificationService {
  /**
   * Create a new notification for a user
   * @param {number} userId - User ID
   * @param {string} message - Notification message
   * @param {string} type - Notification type (security, scan, system, etc.)
   * @param {object} metadata - Additional data for the notification
   * @returns {Promise<object>} Created notification
   */
  static async createNotification(userId, message, type = 'system', metadata = {}) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId,
          message,
          type,
          metadata: JSON.stringify(metadata),
          read: false
        }
      });

      // Check if user has email notifications enabled
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user && user.emailNotifications) {
        await this.sendEmailNotification(user, message, type);
      }

      // Send real-time notification via SSE if available
      try {
        const notificationController = require('../controllers/notificationController');
        await notificationController.sendNotificationToUser(userId, notification);
        await notificationController.updateUnreadCount(userId);
      } catch (sseError) {
        console.log('SSE not available, notification saved to database');
      }

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Create security alert notification
   * @param {number} userId - User ID
   * @param {object} vulnerability - Vulnerability details
   * @param {number} projectId - Project ID
   */
  static async createSecurityAlert(userId, vulnerability, projectId) {
    const message = `Security Alert: ${vulnerability.title} found in your project. Severity: ${vulnerability.severity}`;
    const metadata = {
      vulnerabilityId: vulnerability.id,
      projectId,
      severity: vulnerability.severity,
      cveId: vulnerability.cveId
    };

    return await this.createNotification(userId, message, 'security', metadata);
  }

  /**
   * Create scan completion notification
   * @param {number} userId - User ID
   * @param {number} projectId - Project ID
   * @param {object} scanResults - Scan results
   */
  static async createScanCompleteNotification(userId, projectId, scanResults) {
    const { totalDependencies, totalVulnerabilities, criticalVulnerabilities } = scanResults.summary;
    
    let message = `Scan completed for your project. Found ${totalDependencies} dependencies`;
    if (totalVulnerabilities > 0) {
      message += ` with ${totalVulnerabilities} vulnerabilities (${criticalVulnerabilities} critical)`;
    } else {
      message += ' with no vulnerabilities found';
    }

    const metadata = {
      projectId,
      totalDependencies,
      totalVulnerabilities,
      criticalVulnerabilities
    };

    return await this.createNotification(userId, message, 'scan', metadata);
  }

  /**
   * Create system notification
   * @param {number} userId - User ID
   * @param {string} message - System message
   * @param {string} level - Notification level (info, warning, error)
   */
  static async createSystemNotification(userId, message, level = 'info') {
    const metadata = { level };
    return await this.createNotification(userId, message, 'system', metadata);
  }

  /**
   * Create project collaboration notification
   * @param {number} userId - User ID
   * @param {string} projectName - Project name
   * @param {string} action - Action performed (added, removed, updated)
   */
  static async createCollaborationNotification(userId, projectName, action) {
    const message = `You have been ${action} to project: ${projectName}`;
    const metadata = { projectName, action };
    return await this.createNotification(userId, message, 'collaboration', metadata);
  }

  /**
   * Send email notification
   * @param {object} user - User object
   * @param {string} message - Notification message
   * @param {string} type - Notification type
   */
  static async sendEmailNotification(user, message, type) {
    try {
      const subject = `VulnWatchdog ${type.charAt(0).toUpperCase() + type.slice(1)} Alert`;
      await emailService.sendAlert(user, { subject, text: message });
    } catch (error) {
      console.error('Error sending email notification:', error);
      // Don't throw error for email failures
    }
  }

  /**
   * Mark notification as read
   * @param {number} notificationId - Notification ID
   * @param {number} userId - User ID (for security)
   */
  static async markAsRead(notificationId, userId) {
    try {
      const notification = await prisma.notification.update({
        where: { 
          id: notificationId,
          userId // Ensure user owns the notification
        },
        data: { read: true }
      });
      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Get user notifications with pagination
   * @param {number} userId - User ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} type - Filter by type
   */
  static async getUserNotifications(userId, page = 1, limit = 20, type = null) {
    try {
      const skip = (page - 1) * limit;
      const where = { userId };
      
      if (type) {
        where.type = type;
      }

      const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        }),
        prisma.notification.count({ where })
      ]);

      return {
        notifications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  }

  /**
   * Get unread notification count for user
   * @param {number} userId - User ID
   */
  static async getUnreadCount(userId) {
    try {
      return await prisma.notification.count({
        where: { userId, read: false }
      });
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for user
   * @param {number} userId - User ID
   */
  static async markAllAsRead(userId) {
    try {
      await prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true }
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Delete old notifications (cleanup)
   * @param {number} daysOld - Delete notifications older than this many days
   */
  static async cleanupOldNotifications(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      await prisma.notification.deleteMany({
        where: {
          createdAt: { lt: cutoffDate },
          read: true // Only delete read notifications
        }
      });
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
      throw error;
    }
  }
}

module.exports = NotificationService; 