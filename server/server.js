const app = require('./app');
const prisma = require('./config/db');

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';
const dbUrl = process.env.DATABASE_URL;

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

async function start() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to DB:', dbUrl);
    
    // Initialize background jobs after DB connection
    const dailyScan = require('./jobs/dailyScan');
    dailyScan();
    const alertScheduler = require('./jobs/alertScheduler');
    alertScheduler();
    console.log('✅ Background jobs initialized');
    
  } catch (e) {
    console.error('❌ DB connection failed:', e.message);
  }
  app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
  });
}

start();
