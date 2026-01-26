const service = require('../services/auth.service');

async function listAuths(req, res, next) {
  try {
    const items = await service.listAuths();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

async function createAuth(req, res, next) {
  try {
    const item = await service.createAuth(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listAuths,
  createAuth
};
