// TODO: implement event producer for Driver Service

async function publish(eventName, payload) {
  console.log('[DRIVER-SERVICE] publish event', eventName, payload);
}

module.exports = {
  publish
};
