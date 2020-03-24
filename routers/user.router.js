const express = require('express');
const passport = require('passport');
const pass = require('../config/passport-config');
const authentication = require('../utils/authentication.util')
const regConfig = require('../config/register-config')
const thread = require('../models/thread');
const messages = require('../models/messages');
const posts = require('../models/posts');
const postsModel = require('../models/shareRidePosts');
const router = new express.Router();
const moment = require("moment");
const chatUtil = require("../chat/chat-utils");

router.get('/', authentication.checkAuthentication, (req,res) => {

    var pickUpLat = parseFloat(req.query.pickupLocationLat);
    var pickUpLon = parseFloat(req.query.pickupLocationLng);
    var dropOffLat = parseFloat(req.query.dropoffLocationLat);
    var dropOffLng = parseFloat(req.query.dropoffLocationLng);

    var postsQuery = {};
    if (pickUpLat && pickUpLon) {
        postsQuery.pickUpPoint = {
            $near: {
                $geometry: { 
                    type: "Point",
                    coordinates: [-119.2720107, 50.2670137],
                },
                $maxDistance: 10000,
            }
        };
    }
    if (dropOffLat && dropOffLng) {
        postsQuery.dropOffPoint = {
            $near: {
                $geometry: { 
                    type: "Point",
                    coordinates: [dropOffLng, dropOffLat],
                },
                $maxDistance: 10000,
            }
        }
    }
    if (pickUpLat && pickUpLon && dropOffLat && dropOffLng) {
        var tempPostsQuery = {$and: []};
        tempPostsQuery.$and = [{pickUpPoint: postsQuery.pickUpPoint}, {dropOffPoint: postsQuery.dropOffPoint}];
        postsQuery = {pickUpPoint: postsQuery.pickUpPoint};
    }

    thread.find({ users: req.user.username}, async (err,res2) => {
        if(res2 == null) {
            res.locals.title = "Home Page";
            res.render('index.ejs',{ name: req.user.username , messages: [] });
        } else {
            var sender = await chatUtil.generateMessages(res2, req.user.username);
            const posts1 = await postsModel.find(postsQuery, (err, res5)=>{
                if(err){
                    console.log(err);
                    return;
                }
            });
            var unread = await chatUtil.unreadMessages(res2, req.user.username);
            res.locals.title = "Home Page";
            res.render('index.ejs',{ user: req.user, messagesList: sender,moment:moment, posts: posts1, unread:unread});
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

router.get('/auth/google', passport.authenticate('google', {
    scope:['profile','email']
}));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

router.delete('/logout', (req,res) => {
    req.logOut();
    res.redirect('/home');
})

module.exports = router