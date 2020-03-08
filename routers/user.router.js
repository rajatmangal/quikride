const express = require('express');
const passport = require('passport');
const pass = require('../config/passport-config');
const authentication = require('../utils/authentication.util')
const regConfig = require('../config/register-config')
const thread = require('../models/thread');
const messages = require('../models/messages');
const posts = require('../models/posts');
const router = new express.Router();
const moment = require("moment");
const chatUtil = require("../chat/chat-utils");

router.get('/', authentication.checkAuthentication, (req,res) => {
    thread.find({ users: req.user.username}, async (err,res2) => {
        if(res2 == null) {
            res.locals.title = "Home Page";
            res.render('index.ejs',{ name: req.user.username , messages: [] });
        } else {
            var sender = await chatUtil.generateMessages(res2, req.user.username);
            const posts1 = await posts.find({}, (err, res5)=>{
                if(err){
                    res.status(404).send('No posts found!');
                    return;
                }
            });
            res.locals.title = "Home Page";
            res.render('index.ejs',{ user: req.user, messagesList: sender,moment:moment, posts: posts1});
        }
    });
});

router.get('/home', authentication.checkNotAuthenticated, (req,res) => {
    res.locals.title = "Home";
    res.render('home.ejs');
});

router.get('/login', authentication.checkNotAuthenticated, (req,res) => {
    res.locals.title = "Login";
    res.render('login.ejs');
});

router.get('/register', authentication.checkNotAuthenticated, (req,res) => {
    res.locals.title = "Register";
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

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));

router.delete('/logout', (req,res) => {
    req.logOut();
    res.redirect('/home');
})

module.exports = router