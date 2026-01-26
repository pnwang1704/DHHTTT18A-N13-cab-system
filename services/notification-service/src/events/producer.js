// TODO: implement event producer for Notification Service

async function publish(eventName, payload) {
  console.log('[NOTIFICATION-SERVICE] publish event', eventName, payload);
}

module.exports = {
  publish
};
