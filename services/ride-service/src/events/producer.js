// TODO: implement event producer for Ride Service

async function publish(eventName, payload) {
  console.log('[RIDE-SERVICE] publish event', eventName, payload);
}

module.exports = {
  publish
};
