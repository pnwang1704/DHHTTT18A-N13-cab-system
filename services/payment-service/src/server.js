require('dotenv').config();
const app = require('./app');
// const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 4007;

(async () => {
  try {
    // await connectDB();
    console.log('[PAYMENT-SERVICE] Starting service...');
    app.listen(PORT, () => {
      console.log('Payment Service listening on port ' + PORT);
    });
  } catch (err) {
    console.error('Failed to start Payment Service', err);
    process.exit(1);
  }
})();
