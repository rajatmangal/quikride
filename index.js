if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passwordValidator = require('password-validator');
const app = express();

const User = require('./models/user');
const port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/users', {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;

app.set('view-engine', 'ejs')
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(cookieParser());
app.use(flash());


passport.use(new LocalStrategy(
    function(username, password, done) {
    console.log(username);
      User.findOne({ username: username }, async function (err, user) {
        console.log(user);
        if (err) { return done(err); }
        if (!user) {  return done(null, false, {message: 'No user with that email'}) }
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
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var username = req.body.username;
        var email = req.body.email;
        var passwordCheck =  new passwordValidator();
        passwordCheck
            .is().min(8)                                    // Minimum length 8
            .is().max(20)                                  // Maximum length 100
            .has().uppercase()                              // Must have uppercase letters
            .has().lowercase()
            .has().symbols()                              // Must have lowercase letters
            .has().digits()                                 // Must have digits
            .has().not().spaces()                           // Should not have spaces
            .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
        if(!passwordCheck.validate(req.body.password)) {
            return res.render('register.ejs', {
                message: "Your password must have a least length of 8 and should include atleast 1 digit, 1 Uppercase Letter ,1 Lowercase Letter and 1 special character."
            });
        }
        else {
            const hashedPassword = await bcrypt.hash(req.body.password,10);
            var newUser = new User({firstName: firstName, lastName: lastName, username: username, email: email,password:hashedPassword});
            await User.register(newUser, req.body.password, function(err, user) {
                if(err) {
                    // console.log(err.message);
                    req.flash('error', err.message);
                    // console.log(req.flash('error'));
                    return res.render('register.ejs', {
                        message: err.message
                    });
                }
                else {
                }
                    passport.authenticate("local")(req, res, function() {
                    return res.redirect('/');
                });
            });
        }
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


