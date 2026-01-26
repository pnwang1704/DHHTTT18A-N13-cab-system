require('dotenv').config();
const app = require('./app');
// const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 4004;

(async () => {
  try {
    // await connectDB();
    console.log('[BOOKING-SERVICE] Starting service...');
    app.listen(PORT, () => {
      console.log('Booking Service listening on port ' + PORT);
    });
  } catch (err) {
    console.error('Failed to start Booking Service', err);
    process.exit(1);
  }
})();
