const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
var configAuth = require('./auth');

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

passport.use(new FacebookStrategy({
  clientID: configAuth.facebookAuth.clientID,
  clientSecret: configAuth.facebookAuth.clientSecret,
  callbackURL: configAuth.facebookAuth.callbackURL,
  profileFields: configAuth.facebookAuth.profileFields
},
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    console.log(profile.emails);
    User.findOne({ 'facebookId': profile.id }, async function (err, user) {
      if (err) { return done(err); }
      if (user) {  return done(null, user); }
      else {
        var newUser = new User();
        newUser.facebookId = profile.id;
        newUser.firstName = profile.name.givenName;
        newUser.lastName = profile.name.familyName;
        newUser.username = profile.displayName;
        newUser.email = profile.emails[0].value;
        newUser.emailConfirmed = true;
        newUser.linkExpires = 0;

        newUser.save(function(err) {
          if (err) {throw err;}
          return done(null, newUser);
        })
      }
    });
  }
));

passport.use(new GoogleStrategy({
  clientID: configAuth.googleAuth.clientID,
  clientSecret: configAuth.googleAuth.clientSecret,
  callbackURL: configAuth.googleAuth.callbackURL
},
  function(accessToken, refreshToken, profile, cb) {
    User.findOne({ googleId: profile.id }, function (err, user) {
      if (err) { return cb(err); }
        if (user) {  return cb(null, user); }
        else {
          var newUser = new User();
          newUser.googleId = profile.id;
          newUser.firstName = profile.name.givenName;
          newUser.lastName = profile.name.familyName;
          newUser.username = profile.displayName;
          newUser.email = profile.emails[0].value;
          newUser.emailConfirmed = true;
          newUser.linkExpires = 0;

          newUser.save(function(err) {
            if (err) {throw err;}
            return cb(null, newUser);
          })
        }
    });
  }
));
