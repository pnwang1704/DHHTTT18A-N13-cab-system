require('dotenv').config();
const app = require('./app');
// const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 4009;

(async () => {
  try {
    // await connectDB();
    console.log('[REVIEW-SERVICE] Starting service...');
    app.listen(PORT, () => {
      console.log('Review Service listening on port ' + PORT);
    });
  } catch (err) {
    console.error('Failed to start Review Service', err);
    process.exit(1);
  }
})();
