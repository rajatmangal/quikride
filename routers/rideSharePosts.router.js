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
    var post  = new postsModel({
        username: req.user.username, 
        pickUp: req.body.pickUp,
        pickUpPoint: {type: "Point", coordinates: [parseFloat(req.body.pickupLocationLng), parseFloat(req.body.pickupLocationLat),] },
        dropOff:req.body.dropOff, 
        dropOffPoint: {type: "Point", coordinates: [parseFloat(req.body.dropoffLocationLng), parseFloat(req.body.dropoffLocationLat)] },
        radius: req.body.radius, 
        perKm: req.body.perKm
    });
    await postsModel.create(post, (err, pos)=>{
        console.log(err);
        if(err) {
            console.log(err);
            req.flash('error', err.message);
            return ;
        }
        console.log("New Post Saved");
        return res.redirect('/posts/rideshare');
    });
});

router.get('/posts/search', async (req, res)=>{
    var pickUpLat = parseFloat(req.query.pickUpLat);
    var pickUpLon = parseFloat(req.query.pickUpLon);
    var dropOffLat = parseFloat(req.query.dropOffLat);
    var dropOffLng = parseFloat(req.query.dropOffLng);
    var query = {};
    if (pickUpLat && pickUpLon) {
        query.pickUpPoint = {
            $near: {
                $gemometry: { 
                    type: "Point",
                    coordinates: [pickUpLon, pickUpLat]
                }
            }
        };
    }
    
    if (dropOffLat && dropOffLng) {
        query.dropOffPoint = {
            $near: {
                $gemometry: { 
                    type: "Point",
                    coordinates: [dropOffLng, dropOffLat]
                }
            }
        }
    }
    var posts = await postsModel.find(query, (err, res)=>{
        if(err){
            return res.status(404).send('No Ride Share posts found!');
        }
    });
    return res.json(posts);
});

module.exports = router ;