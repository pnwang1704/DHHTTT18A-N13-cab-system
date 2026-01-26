// TODO: implement event producer for Pricing Service

async function publish(eventName, payload) {
  console.log('[PRICING-SERVICE] publish event', eventName, payload);
}

module.exports = {
  publish
};
