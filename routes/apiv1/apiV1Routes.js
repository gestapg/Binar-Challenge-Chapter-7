const express = require('express');
const router = express.Router();
const adminControllers = require('../../controllers/api-v1/adminController');
const gameController = require('../../controllers/api-v1/gameController');

router.get('/', gameController.getMainPage);

// USER or ADMIN LOGIN ROUTES
router.get('/login', adminControllers.getUserLogin);
router.post(
  '/login',
  adminControllers.userValidationLogin,
  adminControllers.postUserLogin
);

// USER REGISTER ROUTES
router.get('/signup', adminControllers.getUserSignUp);
router.post(
  '/signup',
  adminControllers.userValidationSignUp,
  adminControllers.postUserSignUp
);

// USER INPUT BIODATA ROUTES
router.get('/biodata/:id', adminControllers.getUserBiodataInput);
router.post('/biodata/:id', adminControllers.postUserBiodataInput);

// GAME SINGLE PLAYER ROUTES
router.get('/game/score/:id', gameController.getGameScore);
router.post('/game/score/:id', gameController.postGameScore);
router.get('/game/:id', gameController.getGame);

// ADMIN DASHBOARD ROUTES
router.get('/dashboard', adminControllers.getAdminDashboard);
router.get('/dashboard/details/:id', adminControllers.getUserDetails);
router.get('/dashboard/edit/:id', adminControllers.getEditUser);
router.post('/dashboard/update/:id', adminControllers.putEditUser);
router.get('/dashboard/delete/:id', adminControllers.getDeleteUser);

module.exports = router;
