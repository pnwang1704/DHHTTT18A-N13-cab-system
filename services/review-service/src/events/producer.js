// TODO: implement event producer for Review Service

async function publish(eventName, payload) {
  console.log('[REVIEW-SERVICE] publish event', eventName, payload);
}

module.exports = {
  publish
};
