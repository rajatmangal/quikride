const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, async function (err, user) {
        if (err) { return done(err); }
        if (!user) {  return done(null, false, {message: 'No user with that email'}) }
        if (!user.emailConfirmed) {  return done(null, false, {message: 'Please confirm your account via email to log in.'}) }
        if (await bcrypt.compare(password, user.password)) { 
        }
        bcrypt.compare(password, user.password, function (err, result) {
            if (result == true) {
                return done(null, user);
            } else {
                return done(null, false, {message: 'Incorrect Password'});
            }
          });
      });
    }
));
