// TODO: implement event producer for Booking Service

async function publish(eventName, payload) {
  console.log('[BOOKING-SERVICE] publish event', eventName, payload);
}

module.exports = {
  publish
};
