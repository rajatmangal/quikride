const express = require('express');
const postsModel = require('../models/posts');
const driversModel = require('../models/drivers');
const authentication = require('../utils/authentication.util');
const Joi = require('joi');
const Client = require("@googlemaps/google-maps-services-js").Client;
const router = new express.Router();

router.get('/post/create', authentication.checkAuthentication, async (req, res)=>{
    res.locals.title = "Create Post";
    if(req.user.isDriver){
        return res.render('createPost.ejs', {user: req.user, isDriver: true});
    }
    return res.render('createPost.ejs', {user: req.user, isDriver:false});
});

router.get('/posts', authentication.checkAuthentication, async (req, res)=>{
    const posts = await postsModel.find({}, (err, res)=>{
        if(err){
            res.status(404).send('No posts found!');
            return;
        }
    });
    console.log(posts);
    res.locals.title = "Posts";
    res.render('posts.ejs', {user: req.user, posts: posts});
});

router.post('/post/create', authentication.checkAuthentication, async (req, res)=>{
    const { error } = validatePosts(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    var dropoffLocation = req.body.dropoffLocation;
    var pickupLocation = req.body.pickupLocation;

    var pickupLocationLat = req.body.pickupLocationLat;
    var pickupLocationLng = req.body.pickupLocationLng;

    var dropoffLocationLat = req.body.dropoffLocationLat;
    var dropoffLocationLng = req.body.dropoffLocationLng;

    console.log(req.body);


    var post  = new postsModel({username: req.user.username, 
        userId:req.user._id.toString(), 
        pickuplocation: pickupLocation, 
        dropofflocation: dropoffLocation, 
        pickupLocationLat: pickupLocationLat,
        pickupLocationLng: pickupLocationLng,
        dropoffLocationLat: dropoffLocationLat,
        dropoffLocationLng: dropoffLocationLng,
        usermessage: req.body.description, ridecost: 0});
    await postsModel.create(post, (err, pos)=>{
        if(err) {
            req.flash('error', err.message);
            return ;
        }
        console.log("New Post Saved");
        return res.redirect('/posts');
    });
});

function validatePosts(post){
    const schema = {
        pickupLocation: Joi.string().min(3).max(50).required(),
        dropoffLocation: Joi.string().min(3).max(50).required(),
        description: Joi.string().min(5).max(20).required(),
        pickupLocationLat: Joi.string(),
        pickupLocationLng: Joi.string(),
        dropoffLocationLat: Joi.string(),
        dropoffLocationLng: Joi.string(),
    };
    return Joi.validate(post, schema);
}
module.exports = router ;