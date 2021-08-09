const express = require('express');
const router = express.Router();

const mainPageController = require('../controllers/game');

router.get('/', mainPageController.getMainPage);

module.exports = router;
