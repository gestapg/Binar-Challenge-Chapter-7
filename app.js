const express = require('express');
const morgan = require('morgan');
const passport = require('passport');

const apiV1Router = require('./routes/apiv1/apiV1Routes');

const userRouter = require('./routes/apiv2/userRoutes');
const adminRouter = require('./routes/apiv2/adminRoutes');

const app = express();
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(passport.initialize());

// V1
app.use('/api/v1/admin', apiV1Router);

// V2
app.use('/api/v2/users', userRouter);
app.use('/api/v2/admin', adminRouter);

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

module.exports = app;
