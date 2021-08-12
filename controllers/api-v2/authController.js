const { User } = require('../../models');
const { User_biodata } = require('../../models');

const format = user => {
  const { id, username } = user;
  return {
    id,
    username,
    tokenAccess: user.generateToken(),
  };
};

exports.register = async (req, res, next) => {
  try {
    if (
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.nationality ||
      !req.body.tribe
    )
      throw new Error(
        'Please input your biodata (firstName, lastName, nationality, tribe)'
      );

    const newUser = await User.register(req.body);
    const newBiodata = await User_biodata.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      nationality: req.body.nationality,
      tribe: req.body.tribe,
      userId: newUser.id,
    });

    res.status(201).json({
      status: 'success',
      user: newUser,
      biodata: newBiodata,
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
