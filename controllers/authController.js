const { User } = require('./../models');
const { Room } = require('./../models');

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

function getWinner(fullMatch) {
  matchStr = fullMatch.join('');

  switch (matchStr) {
    case 'RR':
    case 'PP':
    case 'SS':
      return 'Draw';
    case 'RS':
    case 'SP':
    case 'PR':
      return 'Player 1 Win';
    case 'SR':
    case 'PS':
    case 'RP':
      return 'Player 2 Win';
    default:
      return 'The Game has not been finished yet';
  }
}

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

    await Room.update(
      { player2Id: req.body.player2Id },
      { where: { id: roomId } }
    );

    res.status(200).json({
      status: 'success',
      room: matchRoom,
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

  const matchInfo = matchRoom.matchInfo;

  if (matchInfo.every(el => el != ''))
    res.status(200).json({
      status: 'success',
      message: 'Game Ended!',
    });
  else {
    if (player === 'Player 1') {
      for (let i = 0; i < matchInfo.length; i += 2) {
        if (matchInfo[i] == '') {
          matchInfo[i] = req.body.pick;
          break;
        }
      }
    } else if (player === 'Player 2') {
      for (let i = 1; i < matchInfo.length; i += 2) {
        if (matchInfo[i] == '') {
          matchInfo[i] = req.body.pick;
          break;
        }
      }
    }

    const match = await Room.update(
      { matchInfo: matchInfo },
      { where: { id: req.params.room_id }, returning: true }
    );
    res.status(200).json(match);
  }
};

exports.gameResult = async (req, res, next) => {
  matchRoom = await Room.findOne({ where: { id: req.params.room_id } });
  matchInfo = matchRoom.matchInfo;
  let winner = '';
  switch (req.body.round) {
    case 1:
      winner = getWinner(matchInfo.slice(0, 2));
      break;
    case 2:
      winner = getWinner(matchInfo.slice(2, 4));
      break;
    case 3:
      winner = getWinner(matchInfo.slice(4, 6));
      break;
  }
  console.log(winner);

  if (winner != '') res.json({ message: winner });
  else res.json({ message: 'error' });
};
