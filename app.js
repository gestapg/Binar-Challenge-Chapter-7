const express = require('express');
const morgan = require('morgan');

// const adminRouter = require('./routes/adminRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

app.use(morgan('dev'));

app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/users', userRouter);

module.exports = app;
