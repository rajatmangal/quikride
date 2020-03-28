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
const User = require('../models/user');
const geoLocation = require("../utils/geoLocation");

router.get('/', authentication.checkAuthentication, (req,res) => {
    var pickUpLat = parseFloat(req.query.pickupLocationLat);
    var pickUpLon = parseFloat(req.query.pickupLocationLng);
    var dropOffLat = parseFloat(req.query.dropoffLocationLat);
    var dropOffLng = parseFloat(req.query.dropoffLocationLng);

    var postsQuery = {};

    thread.find({ users: req.user.username}, async (err,res2) => {
        if(res2 == null) {
            res.locals.title = "Home Page";
            res.render('index.ejs',{ name: req.user.username , messages: [] });
        } else {
            var sender = await chatUtil.generateMessages(res2, req.user.username);
            var allPosts = await postsModel.find(postsQuery, (err, res5)=>{
                if(err){
                    console.log(err);
                    return;
                }
            });
            var filteredPosts = [];
            if (pickUpLat && pickUpLon && dropOffLat && dropOffLng) {
                for (var i = 0; i < allPosts.length; i++) {
                    var post = allPosts[i];
                    var pickUpDistance = geoLocation.getDistanceFromLatLonInKm(pickUpLat, pickUpLon, post.pickUpPoint.coordinates[1], post.pickUpPoint.coordinates[0]);
                    var dropOffDistance = geoLocation.getDistanceFromLatLonInKm(dropOffLat, dropOffLng, post.dropOffPoint.coordinates[1], post.dropOffPoint.coordinates[0]);
                    if (pickUpDistance < post.radius && dropOffDistance < post.radius) {
                        filteredPosts.push(post);
                    }
                }
            } else {
                filteredPosts = allPosts;
            }

            var unread = await chatUtil.unreadMessages(res2, req.user.username);
            res.locals.title = "Home Page";
            res.render('index.ejs',{ user: req.user, messagesList: sender,moment:moment, posts: filteredPosts, unread:unread, req: req});
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

router.get('/profile/:name', authentication.checkAuthentication, (req,res) => {
    res.locals.title = "profile";
    // retrieve user info
    User.find({username: req.params.name}, (err, user) => {
        if (err) return handleError(err);
        console.log('user is: ', user);
        res.render('profile.ejs', {user: user[0]});
    })
});

// authentication.checkAuthentication, 
router.get('/profile/edit/:name', (req,res) => {
    res.locals.title = "editProfile";
    // update user info
    User.find({username: req.params.name}, (err, user) => {
        if (err) return handleError(err);
        console.log('user is: ', user);
        res.render('editProfile.ejs', {user: user[0]});
    })
});

async function updateUser(filter, update){
    doc = await User.findOneAndUpdate(filter, update);
    return doc;
}

async function findUser(filter){
    doc = await User.findOne(filter);
    return doc;
}


router.post('/profile/edit/:name', async (req,res) => {
    console.log('If password changed, go back to login');
    console.log('others changed, go back to user profile');
    console.log('If email changed, send validation and update after validate?');
    newUsername = req.params.name
    returnToLogin = false
    User.find({username: req.params.name}, (err, user) => {
        if (err) return handleError(err);

        var message = undefined;
        
        // update last name 
        if (req.body.fname != ''){
            const filter = { username: req.params.name };
            const update = { firstName: req.body.fname};
            updateUser(filter, update);
        }
        // update first name 
        if (req.body.lname != ''){
            const filter = { username: req.params.name };
            const update = { lastName: req.body.lname};
            updateUser(filter, update);
        }
        
        // update password
        if (req.body.newPassword !== req.body.newPassword2){
            message = "Those Passwords didn't match. Please try again.";
            return res.render('editProfile.ejs', {user: user[0], message: message});  
        }
        if (req.body.newPassword == req.body.newPassword2 && req.body.newPassword != '' && req.body.newPassword2 != '')    {
            if (!regConfig.checkPassword(req.body.newPassword)){
                message = "Your password must have a least length of 8 and should include at least 1 digit, 1 Uppercase Letter ,1 Lowercase Letter and 1 special character.";  
                return res.render('editProfile.ejs', {user: user[0], message: message});   
            }
            // hash and update password, send an email to confirm password changed
            returnToLogin = true;
            regConfig.hashPassword(req.body.newPassword).then(function(hashedPassword){
                const filter = { username: req.params.name };
                const update = { password: hashedPassword};
                console.log('hashed password is now : ', hashedPassword);      
                updateUser(filter, update);
            }); 
        }
        console.log(req.user);
        return res.redirect('/profile/'+req.user.username);
    })
});

module.exports = router