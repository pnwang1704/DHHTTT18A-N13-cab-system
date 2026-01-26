const express = require('express');
const controller = require('../controllers/auth.controller');

const router = express.Router();

router.get('/', controller.listAuths);
router.post('/', controller.createAuth);

module.exports = router;
