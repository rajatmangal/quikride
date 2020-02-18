if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const initializePassport = require('./passport-config');
const app = express();

const User = require('./models/user');
const port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/users', {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;

app.set('view-engine', 'ejs')
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));


passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, async function (err, user) {
        if (err) { return done(err); }
        if (!user) {  return done(null, false, {message: 'No user with that email'}) }
        if (await bcrypt.compare(password, user.password)) { 
            return done(null, false, {message: 'Incorrect Password'});
        }
        return done(null, user);
      });
    }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({extended : false}));


app.get('/', checkAuthentication, (req,res) => {
    res.render('index.ejs',{ name: req.user.username});
});

app.get('/login', checkNotAuthenticated, (req,res) => {
    res.render('login.ejs');
});

app.get('/register', checkNotAuthenticated, (req,res) => {
    res.render('register.ejs');
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true 
}));

app.post('/register', checkNotAuthenticated,async (req,res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var username = req.body.username;
        var email = req.body.email;
        console.log(firstName)
        console.log(lastName)
        console.log(username)
        console.log(email)
        var newUser = new User({firstName: firstName, lastName: lastName, username: username, email: email,password:hashedPassword});
        await User.register(newUser, hashedPassword, function(err, user) {
            if(err) {
            console.log(err);
            return res.render('/register.ejs');
            }
            else {
                passport.authenticate('local')(req, res, function() {
                res.redirect('/');
            });
            console.log("Added")
            }
        }); 
        res.redirect('/login');
    } catch (e){
        console.log(e)
        res.redirect('/register');
    }
});

app.delete('/logout', (req,res) => {
    req.logOut();
    res.redirect('/login');
})

function checkAuthentication(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}
app.listen(port);


