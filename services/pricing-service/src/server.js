require('dotenv').config();
const app = require('./app');
// const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 4006;

(async () => {
  try {
    // await connectDB();
    console.log('[PRICING-SERVICE] Starting service...');
    app.listen(PORT, () => {
      console.log('Pricing Service listening on port ' + PORT);
    });
  } catch (err) {
    console.error('Failed to start Pricing Service', err);
    process.exit(1);
  }
})();
