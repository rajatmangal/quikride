const express = require('express');
const postsModel = require('../models/shareRidePosts');
const drivers = require('../models/drivers');
const User = require('../models/user');
const thread = require('../models/thread');
const ride = require('../models/ridesrequest');
const rideRating = require('../models/rideRating');
const authentication = require('../utils/authentication.util');
const chatUtil = require('../chat/chat-utils');
const Joi = require('joi');
const router = new express.Router();
const flash = require('express-flash-messages');
const mongoose = require('mongoose');

router.get('/post/create/rideshare', authentication.checkAuthentication, (req, res)=>{
    if(!req.user.isDriver)  {
        return res.redirect('/')
    }
    res.locals.title = "Create Ride Share Post";
    return res.render('createRideSharePosts.ejs', {user: req.user});
});

router.get('/postride/:id', authentication.checkAuthentication, async (req, res)=>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        req.flash('error', "This post is either do not exist or is no longer available.");
        return res.redirect('/')
    }
    const posts = await postsModel.find({_id: mongoose.Types.ObjectId(req.params.id)}, (err, res)=>{
        if(err){
            console.log(err);
        }
    });
    if(posts.length == 0) {
        req.flash('error', "This post is either do not exist or is no longer available.");
        return res.redirect('/')
    }
    const driver = await drivers.find({username: posts[0].username}, (err, res)=>{
        if(err){
            console.log(err);
        }
    });
    res.locals.title = "Posts";
    var id2 = await User.findOne({username: driver[0].username}, (err, pos)=> {
        if(err) {
            console.log(err);
        }
    })
    await thread.findOne({$or: [{'group_name': req.user._id.toString()+ id2._id.toString()}, {'group_name':  id2._id.toString()+ req.user._id.toString()}]}, async(err,res1) => {
        console.log("res1 is ", res1);
        if(res1===null) {
            groupId = id2._id.toString()+ req.user._id.toString()
            var newThread = new thread({ users: [req.user.username, id2.username], group_name: id2._id.toString()+ req.user._id.toString(), created_by: new mongoose.Types.ObjectId(), created_at: new Date().getTime(), id: req.user._id, last_message: "", last_sender: "", last_updated: new Date().getTime()});
            console.log("Hello");
            await thread.create(newThread, (err,res2) => {
                 if(err) {
                     throw err;
                 }
             });
        } else {
            groupId = res1.group_name;
        }

    });
    ratings = await rideRating.find({driver: driver.username}, async (err, res) => {
        if(err) {
            console.log(err);
        }
    })
    var avgRating = 0;
    for(let i = 0 ; i < ratings.length ; i++) {
        avgRating += ratings[i].rating;
    }
    avgRating = avgRating/ratings.length;
    return res.render('postdisplay.ejs', {user: req.user, driver: driver,posts: posts[0], groupId:groupId, avgRating:avgRating});
});

router.post('/postride/:id', authentication.checkAuthentication, async (req, res)=>{
    var post  = new ride({rider:req.body.rider, driver:req.body.driver, message:req.body.message
                                , pickup: req.body.pickup, dropoff:req.body.dropoff, id: req.params.id, status:"pending", groupId: req.body.groupId});
    console.log(post)
    await ride.create(post, (err, pos)=>{
        if(err) {
            console.log(err);
            return ;
        }
        req.flash('success', "Request successfully Sent.");
        return res.redirect('/postride/'+req.params.id);
    });
});

router.post('/post/create/rideshare', authentication.checkAuthentication, async (req, res)=>{
    let smoking = req.body.smoking;
    let luggage = req.body.luggage;
    if(req.body.luggage != 'on') {
        luggage = "off";
    }
    if(req.body.smoking != 'on') {
        smoking = "off";
    }
    var post  = new postsModel({username: req.user.username, userId: req.user._id, pickUp: req.body.pickUp, 
        dropOff:req.body.dropOff, radius: req.body.radius, perKm: req.body.perKm,
        pickUpPoint: {type: "Point", coordinates: [parseFloat(req.body.pickupLocationLng), parseFloat(req.body.pickupLocationLat),] },
        dropOffPoint: {type: "Point", coordinates: [parseFloat(req.body.dropoffLocationLng), parseFloat(req.body.dropoffLocationLat)] },
        smoking:smoking, luggage: luggage, usermessage: req.body.message, profilePic: req.user.profilePic,
        date:req.body.date, seats:req.body.seats});
    await postsModel.create(post, (err, pos)=>{
        console.log(err);
        if(err) {
            console.log(err);
            req.flash('error', err.message);
            return ;
        }
        console.log("New Post Saved");
        console.log(pos)
        return res.redirect('/postride/'+pos._id);
    });
});


router.get('/myrideposts', authentication.checkAuthentication, async(req, res)=>{
    const posts = await postsModel.find({username: req.user.username}, (err, res)=>{
        if(err){
            return res.status(404).send('No Ride Share posts found!');
        }
    });
    res.locals.title = "My Ride Posts";
    return res.render('myRidePosts.ejs', {user: req.user, posts: posts});
});


router.get('/postride/edit/:id', authentication.checkAuthentication, async (req, res)=>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        req.flash('error', "This post is either do not exist or is no longer available.");
        return res.redirect('/')
    }
    const posts = await postsModel.find({_id: mongoose.Types.ObjectId(req.params.id)}, (err, res)=>{
        if(err){
            return res.status(404).send('No Ride Share posts found!');
        }
    });
    if(posts.length == 0) {
        req.flash('error', "This post is either do not exist or is no longer available.");
        return res.redirect('/')
    }
    res.locals.title = "Edit Post";
    return res.render('editRideShare.ejs', {user: req.user, posts: posts[0]});
});

router.post('/postride/edit/:id', authentication.checkAuthentication, async (req, res)=>{
    let smoking = req.body.smoking;
    let luggage = req.body.luggage;
    if(req.body.luggage != 'on') {
        luggage = "off";
    }
    if(req.body.smoking != 'on') {
        smoking = "off";
    }
    var filter= {_id: req.params.id};
    var update= {pickUp: req.body.pickUp, dropOff:req.body.dropOff, radius: req.body.radius, perKm: req.body.perKm,
        pickUpPoint: {type: "Point", coordinates: [parseFloat(req.body.pickupLocationLng), parseFloat(req.body.pickupLocationLat),] },
        dropOffPoint: {type: "Point", coordinates: [parseFloat(req.body.dropoffLocationLng), parseFloat(req.body.dropoffLocationLat)] },
        smoking:smoking, luggage: luggage, usermessage: req.body.message, date:req.body.date, seats:req.body.seats};
    await postsModel.findOneAndUpdate(filter, update, function(err, doc) {
        if (err) return res.send(500, {error: err});
        return res.redirect('/postride/'+req.params.id);
    });
});

router.get('/posts/search', authentication.checkAuthentication, async (req, res)=>{
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