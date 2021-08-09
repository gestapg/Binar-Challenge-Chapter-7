const express = require('express');
const router = express.Router();

const userController = require('../controllers/users');

router.get('/biodata/:id', userController.getUserBiodataInput);

router.post('/biodata/:id', userController.postUserBiodataInput);

// router.post(
//   '/login',
//   userController.userValidationLogin,
//   userController.postUserLogin
// );

module.exports = router;
