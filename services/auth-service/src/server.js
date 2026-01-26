require('dotenv').config();
const app = require('./app');
// const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 4001;

(async () => {
  try {
    // await connectDB();
    console.log('[AUTH-SERVICE] Starting service...');
    app.listen(PORT, () => {
      console.log('Auth Service listening on port ' + PORT);
    });
  } catch (err) {
    console.error('Failed to start Auth Service', err);
    process.exit(1);
  }
})();
