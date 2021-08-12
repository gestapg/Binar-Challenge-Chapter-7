const express = require('express');
const userController = require('../../controllers/api-v2/userController');
const authController = require('../../controllers/api-v2/authController');
const roomController = require('../../controllers/api-v2/roomController');
const restrict = require('../../utils/restrict');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/whoami', restrict, authController.whoami);

router.post('/create-room', restrict, roomController.createRoom);
router.post('/join', restrict, roomController.playerJoin);
router.put('/fight/:room_id', restrict, roomController.playGame);
router.get('/result/:room_id', restrict, roomController.matchResult);

module.exports = router;
