// TODO: implement event producer for Auth Service

async function publish(eventName, payload) {
  console.log('[AUTH-SERVICE] publish event', eventName, payload);
}

module.exports = {
  publish
};
