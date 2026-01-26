require('dotenv').config();

module.exports = {
  services: {
    auth: process.env.AUTH_SERVICE_URL,
    user: process.env.USER_SERVICE_URL,
    driver: process.env.DRIVER_SERVICE_URL,
    booking: process.env.BOOKING_SERVICE_URL,
    ride: process.env.RIDE_SERVICE_URL,
    pricing: process.env.PRICING_SERVICE_URL,
    payment: process.env.PAYMENT_SERVICE_URL,
    notification: process.env.NOTIFICATION_SERVICE_URL,
    review: process.env.REVIEW_SERVICE_URL
  }
};
