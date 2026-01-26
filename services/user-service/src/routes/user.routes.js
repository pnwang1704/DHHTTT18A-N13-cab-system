const express = require('express');
const controller = require('../controllers/user.controller');

const router = express.Router();

router.get('/', controller.listUsers);
router.post('/', controller.createUser);

module.exports = router;
