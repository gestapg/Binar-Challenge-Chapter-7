const express = require('express');
const router = express.Router();

const userController = require('../controllers/users');

router.get('/signup', userController.getUserSignUp);

router.post(
  '/signup',
  userController.userValidationSignUp,
  userController.postUserSignUp
);

module.exports = router;
