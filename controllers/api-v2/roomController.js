const { Room } = require('../../models');

async function activePlayer(id, roomId) {
  const matchRoom = await Room.findOne({ where: { id: roomId } });
  if (!matchRoom) {
    return 'Not found!';
  }
  if (id == matchRoom.player1Id) {
    return 'Player 1';
  } else if (id == matchRoom.player2Id) {
    return 'Player 2';
  } else {
    return 'Not found!';
  }
}

const calcResult = (player1Pick, player2Pick) => {
  if (!player1Pick || !player2Pick) return `Another player has not picked yet`;
  if (player1Pick === player2Pick) return 'DRAW';
  if (player1Pick === 'R')
    return player2Pick === 'S' ? 'PLAYER 1 WIN' : 'PLAYER 2 WIN';
  if (player1Pick === 'P')
    return player2Pick === 'R' ? 'PLAYER 1 WIN' : 'PLAYER 2 WIN';
  if (player1Pick === 'S')
    return player2Pick === 'P' ? 'PLAYER 1 WIN' : 'PLAYER 2 WIN';
};

const getResult = (arr1, arr2, gameResult) => {
  for (let i = 0; i < arr1.length || i < arr2.length; i++) {
    const result = calcResult(arr1[i], arr2[i]);
    gameResult.push(result);
  }
  return gameResult;
};

exports.getAllRooms = async (req, res, next) => {
  const allRooms = await Room.findAll();
  console.log(allRooms);

  res.status(200).json({
    status: 'success',
    length: allRooms.length,
    rooms: allRooms,
  });
};

exports.createRoom = async (req, res, next) => {
  try {
    const newRoom = await Room.createRoom(req.body);

    res.status(201).json({
      status: 'success',
      room_id: newRoom.id,
      room: newRoom,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      error: err.message,
      stack: err.stack,
    });
  }
};

exports.playerJoin = async (req, res, next) => {
  try {
    if (!req.body.id || !req.body.player2Id)
      throw new Error('Please input room id and player 2 id');

    const roomId = req.body.id;
    const matchRoom = await Room.findOne({ where: { id: roomId } });
    if (!matchRoom) throw new Error(`Could not find room with id : ${roomId}`);
    if (matchRoom.player2Id !== null)
      throw new Error(`Another player already joined this room`);

    const roomArray = await Room.update(
      { player2Id: req.body.player2Id },
      { where: { id: roomId }, returning: true }
    );

    const [_, room] = [...roomArray];
    res.status(200).json({
      status: 'success',
      room: room,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      error: err.message,
      stack: err.stack,
    });
  }
};

exports.playGame = async (req, res, next) => {
  const matchRoom = await Room.findOne({ where: { id: req.params.room_id } });
  const player = await activePlayer(req.body.userId, req.params.room_id);

  let matchInfo = [];
  let player1Choices = matchRoom.player1Choices;
  let player2Choices = matchRoom.player2Choices;

  if (player === 'Player 1') {
    if (player1Choices.length === 3) {
      res.status(400).json({
        status: 'fail',
        message: 'Game Ended! Player has already picked 3 choices',
      });
    }

    if (!req.body.pick)
      throw new Error(`Please pick your choices between "R", "P", "S"`);

    player1Choices.push(req.body.pick);
    const roomUpdate = await Room.update(
      { player1Choices },
      { where: { id: req.params.room_id }, returning: true }
    );
    const [_, room] = [...roomUpdate];

    const result = getResult(
      room[0].player1Choices,
      room[0].player2Choices,
      matchInfo
    );

    await Room.update(
      { matchInfo: result },
      { where: { id: req.params.room_id } }
    );

    res.status(200).json({
      status: 'success',
      player1: room[0].player1Choices,
      player2: room[0].player2Choices,
      result,
    });
  } else if (player === 'Player 2') {
    if (player2Choices.length === 3) {
      res.status(400).json({
        status: 'fail',
        message: 'Game Ended! Player has already picked 3 choices',
      });
    }
    if (!req.body.pick)
      throw new Error(`Please pick your choices between "R", "P", "S"`);

    player2Choices.push(req.body.pick);
    const roomUpdate = await Room.update(
      { player2Choices },
      { where: { id: req.params.room_id }, returning: true }
    );
    const [_, room] = [...roomUpdate];

    const result = getResult(
      room[0].player1Choices,
      room[0].player2Choices,
      matchInfo
    );

    await Room.update(
      { matchInfo: result },
      { where: { id: req.params.room_id } }
    );

    res.status(200).json({
      status: 'success',
      player1: room[0].player1Choices,
      player2: room[0].player2Choices,
      result,
    });
  }
};

exports.matchResult = async (req, res, next) => {
  try {
    const room = await Room.findOne({ where: { id: req.params.room_id } });

    res.status(200).json({
      status: 'success',
      matchResult: room.matchInfo,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Result could not be found',
    });
  }
};
