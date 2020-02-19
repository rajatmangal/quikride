if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const passport = require('passport');
const flash = require('express-flash');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
const passwordValidator = require('password-validator');
const mongoose = require('mongoose');
const adminRouter = require('./routers/admin.router');
const app = express();
const User = require('./models/user');
const passConfig = require('./config/passport-config')
const regConfig = require('./config/register-config')
const port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/users', {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;

app.set('view-engine', 'ejs')

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use('/admin', adminRouter);
app.use(cookieParser());
app.use(flash());
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

app.post('/register', checkNotAuthenticated, async (req,res) => {
    regConfig.registerUser(req,res);
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
app.listen(port, (res,req) => {
    console.log(`Listening to port ${port}`);
});


