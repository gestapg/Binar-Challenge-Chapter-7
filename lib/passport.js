const passport = require('passport');
const { Strategy: jwtStrategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../models');

const options = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: 'super-duper-secret-no-one-knows-exactly',
};

passport.use(
  new jwtStrategy(options, async (payload, done) => {
    User.findByPk(payload.id)
      .then(user => done(null, user))
      .catch(err => done(err, false));
  })
);

module.exports = passport;
