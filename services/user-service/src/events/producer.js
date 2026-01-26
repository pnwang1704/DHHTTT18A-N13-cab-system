// TODO: implement event producer for User Service

async function publish(eventName, payload) {
  console.log('[USER-SERVICE] publish event', eventName, payload);
}

module.exports = {
  publish
};
