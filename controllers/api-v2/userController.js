const { User } = require('../../models');

exports.getAllUsers = async (req, res, next) => {
  const allUser = await User.findAll();

  res.status(200).json({
    status: 'success',
    length: allUser.length,
    users: allUser,
  });
};

exports.getUser = (req, res, next) => {
  res.status(200).send('HELLO WORLD');
};
