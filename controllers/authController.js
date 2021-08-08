const { User } = require('./../models');

const format = user => {
  const { uuid, username } = user;
  return {
    id: uuid,
    username,
    tokenAccess: user.generateToken(),
  };
};

exports.register = async (req, res, next) => {
  // console.log(req.body);
  // res.status(200).send(req.body);
  try {
    const newUser = await User.register(req.body);

    res.status(200).json({
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
