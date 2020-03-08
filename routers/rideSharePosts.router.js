const express = require('express');
const postsModel = require('../models/shareRidePosts');
const authentication = require('../utils/authentication.util');
const chatUtil = require('../chat/chat-utils');
const Joi = require('joi');
const router = new express.Router();

router.get('/post/create/rideshare', authentication.checkAuthentication, (req, res)=>{
    if(!req.user.isDriver)  {
        return res.redirect('/')
    }
    res.locals.title = "Create Ride Share Post";
    return res.render('createRideSharePosts.ejs', {user: req.user});
});

router.get('/posts/rideshare', authentication.checkAuthentication, async (req, res)=>{
    if(!req.user.isDriver)  {
        return res.redirect('/')
    }
    const posts = await postsModel.find({}, (err, res)=>{
        if(err){
            return res.status(404).send('No Ride Share posts found!');
        }
    });
    console.log(posts);
    res.locals.title = "Posts";
    return res.render('rideSharePosts.ejs', {user: req.user,posts: posts});
});

router.post('/post/create/rideshare', authentication.checkAuthentication, async (req, res)=>{
    var post  = new postsModel({username: req.user.username, pickUp: req.body.pickUp, 
        dropOff:req.body.dropOff, radius: req.body.radius, perKm: req.body.perKm});
    await postsModel.create(post, (err, pos)=>{
        if(err) {
            req.flash('error', err.message);
            return ;
        }
        console.log("New Post Saved");
        return res.redirect('/posts/rideshare');
    });
});

module.exports = router ;