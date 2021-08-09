// const User = require('../models/user');
const { check, body, validationResult, Result } = require('express-validator');
const { sequelize, User, User_biodata } = require('../../models');
const bcrypt = require('bcrypt');

// const Admin = require('../utils/admin');

////////// USER SIGN UP //////////////
exports.getUserSignUp = (req, res, next) => {
  res.render('layouts/signup', { title: 'Sign Up', style: 'login.css' });
};

exports.userValidationSignUp = [
  body('username').custom(async value => {
    const duplicate = await User.findOne({ where: { username: value } });
    if (duplicate) {
      throw new Error('Username already exsist');
    }
    return true;
  }),
  check('email', 'Email invalid, example : name@example.com').isEmail(),
  body('email').custom(async value => {
    const duplicate = await User.findOne({ where: { email: value } });
    if (duplicate) {
      throw new Error('Email already exsist');
    }
    return true;
  }),
];

exports.postUserSignUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('layouts/signup', {
      title: 'Sign Up',
      style: 'login.css',
      errors: errors.array(),
    });
  } else {
    const { username, email, password } = req.body;
    const encryptedPassword = bcrypt.hashSync(password, 10);
    User.create({ username, email, password: encryptedPassword })
      .then(result => {
        const id = result.dataValues.id;
        res.redirect(`/api/v1/admin/biodata/${id}`);
      })
      .catch(err => {
        console.log(err);
      });
  }
};

////////// USER LOGIN ////////////
exports.getUserLogin = (req, res, next) => {
  const title = 'Login';
  const style = 'login.css';
  res.render('layouts/login', { title, style });
};

exports.userValidationLogin = body('username').custom(
  async (value, { req }) => {
    if (value === 'admin') {
      const admin = Admin.duplicateCheckUserName(value);
      if (admin && admin.password === req.body.password) {
        return true;
      } else return false;
    }
    const user = await User.findOne({ where: { username: value } });
    const result = bcrypt.compareSync(req.body.password, user.password);
    if (!user) {
      throw new Error('Invalid Username, Please sign up first!');
    } else if (!result) {
      throw new Error('Wrong password!!');
    } else {
      return true;
    }
  }
);

exports.postUserLogin = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('layouts/login', {
      title: 'Login',
      style: 'login.css',
      errors: errors.array(),
    });
  }
  const username = req.body.username;
  if (username === 'admin') {
    res.redirect('/admin/dashboard');
  } else {
    User.findOne({ where: { username } })
      .then(user => {
        res.redirect(`/api/v1/admin/game/${user.id}`);
      })
      .catch(err => {
        console.log(err);
      });
  }
};

//////////// USER INPUT BIODATA ///////////////
exports.getUserBiodataInput = (req, res, next) => {
  const title = 'Fill in Biodata';
  const style = 'login.css';
  const userId = req.params.id;
  res.render('layouts/biodata', { title, style, userId });
};

exports.postUserBiodataInput = async (req, res, next) => {
  const { firstName, lastName, nationality, tribe, userId } = req.body;
  User_biodata.create({
    firstName,
    lastName,
    nationality,
    tribe,
    userId,
  })
    .then(result => {
      res.redirect('/api/v1/admin/login');
    })
    .catch(err => {
      console.log(err);
    });
};

///////////////// ADMIN DASHBOARD ////////////////
exports.getAdminDashboard = (req, res, next) => {
  User.findAll()
    .then(users => {
      res.render('layouts/dashboard', {
        title: 'Dashboard',
        style: 'dashboard.css',
        users,
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getUserDetails = async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findOne({ where: { id: userId } });
  const biodata = await User_biodata.findOne({ where: { userId } });
  res.render('layouts/details', {
    title: 'Details',
    style: '',
    user,
    biodata,
  });
};

exports.getEditUser = async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findOne({ where: { id: userId } });
  const biodata = await User_biodata.findOne({ where: { userId } });

  res.render('layouts/user-edit', {
    title: 'Edit Page',
    style: '',
    user,
    biodata,
    userId,
  });
};

exports.putEditUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      nationality,
      tribe,
    } = req.body;
    const encryptedPassword = bcrypt.hashSync(password, 10);

    await User.update(
      { username, email, password: encryptedPassword },
      { where: { id: userId } }
    );
    await User_biodata.update(
      { firstName, lastName, nationality, tribe },
      { where: { userId } }
    );

    res.redirect('/api/v1/admin/dashboard');
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

exports.getDeleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = User.findOne({ where: { id: userId } });
    if (!user) {
      res.status(404);
      res.render('layouts/404');
    } else {
      await User.destroy({ where: { id: userId } });
      await User_biodata.destroy({ where: { userId } });
      res.redirect('/api/v1/admin/dashboard');
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};
