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
const User = require('../models/user');

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

router.get('/:name', authentication.checkAuthentication, (req,res) => {
    res.locals.title = "profile";
    // retrieve user info
    User.find({username: req.params.name}, (err, user) => {
        if (err) return handleError(err);
        console.log('user is: ', user);
        res.render('partials/profile.ejs', {user: user[0]});
    })
});

// authentication.checkAuthentication, 
router.get('/profile/:name', (req,res) => {
    res.locals.title = "editProfile";
    // update user info
    User.find({username: req.params.name}, (err, user) => {
        if (err) return handleError(err);
        console.log('user is: ', user);
        res.render('partials/editProfile.ejs', {user: user[0]});
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

    console.log(req.body)

    newUsername = req.params.name
    returnToLogin = false
    User.find({username: req.params.name}, (err, user) => {
        if (err) return handleError(err);

        var message = undefined;
        
        // udpate last name 
        if (req.body.fname != ''){
            const filter = { username: req.params.name };
            const update = { firstName: req.body.fname};
            updateUser(filter, update);
        }
        // udpate first name 
        if (req.body.lname != ''){
            const filter = { username: req.params.name };
            const update = { lastName: req.body.lname};
            updateUser(filter, update);
        }
        
        // udpate password
        if (req.body.newPassword !== req.body.newPassword2){
            message = "Those Passwords didn't match. Please try again.";
            return res.render('partials/editProfile.ejs', {user: user[0], message: message});  
        }
        if (req.body.newPassword == req.body.newPassword2 && req.body.newPassword != '' && req.body.newPassword2 != '')    {
            if (!regConfig.checkPassword(req.body.newPassword)){
                message = "Your password must have a least length of 8 and should include at least 1 digit, \
1 Uppercase Letter ,1 Lowercase Letter and 1 special character.";  
                return res.render('partials/editProfile.ejs', {user: user[0], message: message});   
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
        
        // udpate user name 
        if (req.body.uname != ''){
            if (!regConfig.checkUsername(req.body.uname)){
                message = "username should have a minimum length of 6 and maximum of 20";
                return res.render('partials/editProfile.ejs', {user: user[0], message: message});
            }
            newUsername = req.body.uname;
            const filter = { username: req.params.name };
            const update = { username: req.body.uname };
            updateUser(filter, update);
        }

        // update email
        if (req.body.email != ''){
            const filter = { username: req.params.name };
            const update = { email: req.body.email};
            updateUser(filter, update);
        }

        console.log('looking for user: ', newUsername);
        findUser({ username: newUsername }).then(function(result){
            console.log("result is ", result);
            if (returnToLogin){
                return res.render('login.ejs');
            }
            else{
                return res.render('partials/profile.ejs', {user: result});
            }
        })
    })
});

module.exports = router