require('dotenv').config();
const app = require('./app');
// const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 4003;

(async () => {
  try {
    // await connectDB();
    console.log('[DRIVER-SERVICE] Starting service...');
    app.listen(PORT, () => {
      console.log('Driver Service listening on port ' + PORT);
    });
  } catch (err) {
    console.error('Failed to start Driver Service', err);
    process.exit(1);
  }
})();
