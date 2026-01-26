const repo = require('../repositories/driver.repo');

async function listDrivers() {
  // TODO: implement Driver listing logic using repo
  return repo.findAll();
}

async function createDriver(data) {
  // TODO: implement Driver creation logic using repo
  return repo.create(data);
}

module.exports = {
  listDrivers,
  createDriver
};
