// TODO: implement event producer for Payment Service

async function publish(eventName, payload) {
  console.log('[PAYMENT-SERVICE] publish event', eventName, payload);
}

module.exports = {
  publish
};
