const express = require('express');
const passport = require('passport');
const pass = require('../config/passport-config');
const authentication = require('../utils/authentication.util')
const regConfig = require('../config/register-config')
const thread = require('../models/thread');
const messages = require('../models/messages');
const router = new express.Router();
const moment = require("moment");

router.get('/', authentication.checkAuthentication, (req,res) => {
    thread.find({ users: req.user.username}, async (err,res2) => {
        if(res2 == null) {
            res.locals.title = "Home Page";
            res.render('index.ejs',{ name: req.user.username , messages: []});
        } else {
            function compare(a,b) {
                let comparison = 0;
                if (a.last_updated >= b.last_updated) {
                    comparison = -1;
                } else if (a.last_updated < b.last_updated) {
                    comparison = 1;
                }
                return comparison;
            }
            res2.sort(compare);
            var sender = res2.slice(0,4);
            for(var i = 0 ; i < sender.length ; i++) {
                let count = 0;
                for(var j = 0 ; j < sender[i].users.length ; j++) {
                    if(sender[i].users[j] != req.user.username) {
                        sender[i].sender = sender[i].users[j];
                        count++;
                    }
                }
                sender[i].time = moment(sender[i].last_updated).format('MMMM Do YYYY, h:mm:ss a');
                if(count == 0) {
                    sender[i].sender = "You";
                }
            }
            res.locals.title = "Home Page";
            res.render('index.ejs',{ name: req.user.username, messages: sender,moment:moment});
        }
    });
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

router.delete('/logout', (req,res) => {
    req.logOut();
    res.redirect('/login');
})

module.exports = router