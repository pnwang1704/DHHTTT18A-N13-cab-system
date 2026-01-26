require('dotenv').config();
const app = require('./app');
// const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 4008;

(async () => {
  try {
    // await connectDB();
    console.log('[NOTIFICATION-SERVICE] Starting service...');
    app.listen(PORT, () => {
      console.log('Notification Service listening on port ' + PORT);
    });
  } catch (err) {
    console.error('Failed to start Notification Service', err);
    process.exit(1);
  }
})();
