const app = require('./app');
const prisma = require('./config/db');

const PORT = process.env.PORT || 10000; // Render sets PORT

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
    console.log('✅ Connected to DB:', process.env.DATABASE_URL);
    
    // Initialize background jobs after DB connection
    const dailyScan = require('./jobs/dailyScan');
    dailyScan();
    const alertScheduler = require('./jobs/alertScheduler');
    alertScheduler();
    console.log('✅ Background jobs initialized');
    
  } catch (e) {
    console.error('❌ DB connection failed:', e.message);
    console.log('⚠️ Starting server without database connection...');
  }
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

start();
