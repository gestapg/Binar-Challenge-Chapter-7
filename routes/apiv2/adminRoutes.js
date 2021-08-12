const express = require('express');
const userController = require('../../controllers/api-v2/userController');
const authController = require('../../controllers/api-v2/authController');
const roomController = require('../../controllers/api-v2/roomController');
const restrict = require('../../utils/restrict');

const router = express.Router();

router.route('/allUsers').get(restrict, userController.getAllUsers);
router.route('/allRooms').get(restrict, roomController.getAllRooms);

module.exports = router;
