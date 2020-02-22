const express = require('express');
const passport = require('passport');
const pass = require('../config/passport-config');
const authentication = require('../utils/authentication.util')
const regConfig = require('../config/register-config')
const router = new express.Router();

router.get('/', authentication.checkAuthentication, (req,res) => {
    res.render('index.ejs',{ name: req.user.username});
});

router.get('/login', authentication.checkNotAuthenticated, (req,res) => {
    res.render('login.ejs');
});

router.get('/register', authentication.checkNotAuthenticated, (req,res) => {
    res.render('register.ejs');
});

router.post('/login', authentication.checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true 
}));

router.post('/register', authentication.checkNotAuthenticated, async (req,res) => {
    regConfig.registerUser(req,res);
});

router.delete('/logout', (req,res) => {
    req.logOut();
    res.redirect('/login');
})

module.exports = router