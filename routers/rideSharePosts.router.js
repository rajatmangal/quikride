const express = require('express');
const postsModel = require('../models/shareRidePosts');
const authentication = require('../utils/authentication.util');
const chatUtil = require('../chat/chat-utils');
const Joi = require('joi');
const router = new express.Router();

router.get('/post/create/rideshare', authentication.checkAuthentication, (req, res)=>{
    res.locals.title = "Create Ride Share Post";
    res.render('createRideSharePosts.ejs', {user: req.user});
    console.log('reached!');
});

router.get('/posts/rideshare', authentication.checkAuthentication, async (req, res)=>{
    const posts = await postsModel.find({}, (err, res)=>{
        if(err){
            res.status(404).send('No Ride Share posts found!');
            return;
        }
    });
    console.log(posts);
    res.locals.title = "Posts";
    res.render('rideSharePosts.ejs', {user: req.user,posts: posts});
});

router.post('/post/create/rideshare', authentication.checkAuthentication, async (req, res)=>{
    // const { error } = validatePosts(req.body);
    // if(error){
    //     res.status(400).send(error.details[0].message);
    //     return;
    // }
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