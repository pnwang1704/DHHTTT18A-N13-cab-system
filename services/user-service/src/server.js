require('dotenv').config();
const app = require('./app');
// const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 4002;

(async () => {
  try {
    // await connectDB();
    console.log('[USER-SERVICE] Starting service...');
    app.listen(PORT, () => {
      console.log('User Service listening on port ' + PORT);
    });
  } catch (err) {
    console.error('Failed to start User Service', err);
    process.exit(1);
  }
})();
