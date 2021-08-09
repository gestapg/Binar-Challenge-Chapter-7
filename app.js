const express = require('express');
const morgan = require('morgan');
const passport = require('passport');

// const adminRouter = require('./routes/adminRoutes');
const admninRouter = require('./routes/apiv1/adminRoutes');
const userRouter = require('./routes/apiv2/userRoutes');

const app = express();

app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use('/api/v1/admin', admninRouter);
app.use('/api/v2/users', userRouter);

app.all('*', (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = 'fail';
  err.statusCode = 404;

  next();
});

module.exports = app;
