const repo = require('../repositories/notification.repo');

async function listNotifications() {
  // TODO: implement Notification listing logic using repo
  return repo.findAll();
}

async function createNotification(data) {
  // TODO: implement Notification creation logic using repo
  return repo.create(data);
}

module.exports = {
  listNotifications,
  createNotification
};
