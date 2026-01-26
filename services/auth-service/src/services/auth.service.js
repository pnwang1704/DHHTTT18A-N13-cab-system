const repo = require('../repositories/auth.repo');

async function listAuths() {
  // TODO: implement Auth listing logic using repo
  return repo.findAll();
}

async function createAuth(data) {
  // TODO: implement Auth creation logic using repo
  return repo.create(data);
}

module.exports = {
  listAuths,
  createAuth
};
