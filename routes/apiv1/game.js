const express = require('express');
const router = express.Router();

const gameController = require('../controllers/game');

router.get('/game/score/:id', gameController.getGameScore);

router.post('/game/score/:id', gameController.postGameScore);

// router.get('/game/profile/:id', gameController.getUserProfile);

router.get('/game/:id', gameController.getGame);

module.exports = router;
