const express = require('express');
const userController = require('../../controllers/api-v2/userController');
const authController = require('../../controllers/api-v2/authController');
const restrict = require('../../utils/restrict');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/whoami', restrict, authController.whoami);
router.post('/create-room', restrict, authController.createRoom);
router.post('/join', restrict, authController.playerJoin);
router.put('/fight/:room_id', restrict, authController.playGame);
// router.post('/result/:room_id', restrict, authController.gameResult);

router.route('/').get(userController.getAllUsers);

router.route('/:id').get(userController.getUser);

module.exports = router;
