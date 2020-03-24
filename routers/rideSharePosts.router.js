const express = require('express');
const postsModel = require('../models/shareRidePosts');
const drivers = require('../models/drivers');
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

router.get('/postride/:id', authentication.checkAuthentication, async (req, res)=>{
    if(!req.user.isDriver)  {
        return res.redirect('/')
    }
    const posts = await postsModel.find({_id: req.params.id}, (err, res)=>{
        if(err){
            return res.status(404).send('No Ride Share posts found!');
        }
    });
    const driver = await drivers.find({username: posts[0].username}, (err, res)=>{
        if(err){
            return res.status(404).send('No Ride Share posts found!');
        }
    });
    console.log(posts);
    res.locals.title = "Posts";
    return res.render('postDisplay.ejs', {user: req.user, driver: driver,posts: posts[0]});
});

router.post('/post/create/rideshare', authentication.checkAuthentication, async (req, res)=>{
    let smoking = req.body.smoking;
    let luggage = req.body.luggage;
    if(req.body.luggage != 'on') {
        luggage = "off"
    }
    if(req.body.smoking != 'on') {
        smoking = "off"
    }
    var post  = new postsModel({username: req.user.username, pickUp: req.body.pickUp, 
        dropOff:req.body.dropOff, radius: req.body.radius, perKm: req.body.perKm,
        smoking:smoking, luggage: luggage, usermessage: req.body.message,
        date:req.body.date, seats:req.body.seats});
    await postsModel.create(post, (err, pos)=>{
        if(err) {
            req.flash('error', err.message);
            return ;
        }
        console.log("New Post Saved");
        console.log(pos)
        return res.redirect('/postride/'+pos._id);
    });
});

module.exports = router ;