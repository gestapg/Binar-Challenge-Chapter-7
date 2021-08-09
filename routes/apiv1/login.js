const express = require('express');
const router = express.Router();

const userController = require('../controllers/users');

router.get('/login', userController.getUserLogin);

router.post(
  '/login',
  userController.userValidationLogin,
  userController.postUserLogin
);

module.exports = router;
