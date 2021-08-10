const { User } = require('../../models');
const { Room } = require('../../models');

const format = user => {
  const { id, username } = user;
  return {
    id,
    username,
    tokenAccess: user.generateToken(),
  };
};

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

exports.register = async (req, res, next) => {
  // console.log(req.body);
  // res.status(200).send(req.body);
  try {
    const newUser = await User.register(req.body);

    res.status(201).json({
      status: 'success',
      user: newUser,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      error: err.message,
      stack: err.stack,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    if (!req.body.username || !req.body.password)
      throw new Error('Please input username and password');

    const user = await User.authenticate(req.body);

    res.status(200).json(format(user));
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      error: err.message,
      stack: err.stack,
    });
  }
};

exports.whoami = async (req, res, next) => {
  const currentUser = req.user;
  res.status(200).json({
    status: 'success',
    currentUser,
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

  let matchInfo = matchRoom.matchInfo;
  let player1Choices = matchRoom.player1Choices;
  let player2Choices = matchRoom.player2Choices;

  if (matchInfo.length === 3)
    res.status(200).json({
      status: 'success',
      message: 'Game Ended!',
    });
  else {
    if (player === 'Player 1') {
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
        room[0].matchInfo
      );

      res.status(200).json({
        status: 'success',
        player1: room[0].player1Choices,
        player2: room[0].player2Choices,
        result,
        room: roomUpdate,
      });
    } else if (player === 'Player 2') {
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
        room[0].matchInfo
      );

      res.status(200).json({
        status: 'success',
        player1: room[0].player1Choices,
        player2: room[0].player2Choices,
        result,
        room: roomUpdate,
      });
    }
  }
};
