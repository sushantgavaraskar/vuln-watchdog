const cron = require('node-cron');
const emailService = require('../services/emailService');

module.exports = () => {
  cron.schedule('0 * * * *', async () => {
    // TODO: Fetch users and alert configs, send emails
    // await emailService.sendAlert(user, alert);
    console.log('Alert scheduler ran');
  });
};