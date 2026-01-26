require('dotenv').config();
const app = require('./app');
// const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 4005;

(async () => {
  try {
    // await connectDB();
    console.log('[RIDE-SERVICE] Starting service...');
    app.listen(PORT, () => {
      console.log('Ride Service listening on port ' + PORT);
    });
  } catch (err) {
    console.error('Failed to start Ride Service', err);
    process.exit(1);
  }
})();
