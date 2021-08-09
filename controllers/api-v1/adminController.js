// const User = require('../models/user');
const { check, body, validationResult, Result } = require('express-validator');
const { sequelize, User, User_biodata } = require('../../models');

const Admin = require('../utils/admin');

////////// USER SIGN UP //////////////
exports.getUserSignUp = (req, res, next) => {
  res.render('layouts/signup', { title: 'Sign Up', style: 'login.css' });
};

exports.userValidationSignUp = [
  body('userName').custom(async value => {
    const duplicate = await User.findOne({ where: { userName: value } });
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
    const { userName, email, password } = req.body;
    User.create({ userName, email, password })
      .then(result => {
        const id = result.dataValues.id;
        res.redirect(`/biodata/${id}`);
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

exports.userValidationLogin = body('userName').custom(
  async (value, { req }) => {
    if (value === 'admin') {
      const admin = Admin.duplicateCheckUserName(value);
      if (admin && admin.password === req.body.password) {
        return true;
      } else return false;
    }
    const user = await User.findOne({ where: { userName: value } });
    if (!user) {
      throw new Error('Invalid Username, Please sign up first!');
    } else if (user.password !== req.body.password) {
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
  const userName = req.body.userName;
  if (userName === 'admin') {
    res.redirect('/admin/dashboard');
  } else {
    User.findOne({ where: { userName } })
      .then(user => {
        res.redirect(`/game/${user.id}`);
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
      res.redirect('/login');
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

exports.putEditUser = (req, res, next) => {
  const userId = req.params.id;
  const { userName, email, password, firstName, lastName, nationality, tribe } =
    req.body;

  User.update(
    {
      userName,
      email,
      password,
    },
    {
      where: {
        id: userId,
      },
    }
  )
    .then(result => {
      User_biodata.update(
        {
          firstName,
          lastName,
          nationality,
          tribe,
        },
        { where: { userId } }
      ).then(result => {
        res.redirect('/admin/dashboard');
      });
    })
    .catch(err => console.log(err));
};

exports.getDeleteUser = (req, res, next) => {
  const userId = req.params.id;
  const user = User.findOne({ where: { id: userId } });
  if (!user) {
    res.status(404);
    res.render('layouts/404');
  } else {
    User.destroy({ where: { id: userId } }).then(result => {
      User_biodata.destroy({ where: { userId } })
        .then(result => {
          res.redirect('/admin/dashboard');
        })
        .catch(err => console.log(err));
    });
  }
};
