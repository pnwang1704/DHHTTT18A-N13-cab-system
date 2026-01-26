const repo = require('../repositories/user.repo');

async function listUsers() {
  // TODO: implement User listing logic using repo
  return repo.findAll();
}

async function createUser(data) {
  // TODO: implement User creation logic using repo
  return repo.create(data);
}

module.exports = {
  listUsers,
  createUser
};
