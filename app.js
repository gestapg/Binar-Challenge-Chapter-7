const express = require('express');
const morgan = require('morgan');
const passport = require('passport');

// const adminRouter = require('./routes/adminRoutes');
const userRouter = require('./routes/apiv2/userRoutes');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use('/api/v1/admin', userRouter);
app.use('/api/v2/users', userRouter);

module.exports = app;
