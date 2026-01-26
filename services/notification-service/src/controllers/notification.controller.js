const service = require('../services/notification.service');

async function listNotifications(req, res, next) {
  try {
    const items = await service.listNotifications();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

async function createNotification(req, res, next) {
  try {
    const item = await service.createNotification(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listNotifications,
  createNotification
};
