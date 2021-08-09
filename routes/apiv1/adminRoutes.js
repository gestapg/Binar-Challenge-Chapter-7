const express = require('express');
const router = express.Router();
const adminControllers = require('../../controllers/api-v1/adminController');
const userController = require('../../controllers/api-v1/adminController');
const gameController = require('../../controllers/api-v1/gameController');

router.get('/dashboard', adminControllers.getAdminDashboard);

router.get('/dashboard/details/:id', adminControllers.getUserDetails);

router.get('/dashboard/edit/:id', adminControllers.getEditUser);

router.post('/dashboard/update/:id', adminControllers.putEditUser);

router.get('/dashboard/delete/:id', adminControllers.getDeleteUser);

router.get('/biodata/:id', userController.getUserBiodataInput);

router.post('/biodata/:id', userController.postUserBiodataInput);

router.get('/game/score/:id', gameController.getGameScore);

router.post('/game/score/:id', gameController.postGameScore);

router.get('/game/:id', gameController.getGame);

router.get('/login', userController.getUserLogin);

router.post(
  '/login',
  userController.userValidationLogin,
  userController.postUserLogin
);

router.get('/', gameController.getMainPage);

router.get('/signup', userController.getUserSignUp);

router.post(
  '/signup',
  userController.userValidationSignUp,
  userController.postUserSignUp
);

module.exports = router;
