const service = require('../services/user.service');

async function listUsers(req, res, next) {
  try {
    const items = await service.listUsers();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const item = await service.createUser(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listUsers,
  createUser
};
