const express = require('express');
const postsModel = require('../models/posts');
const driversModel = require('../models/drivers');
const authentication = require('../utils/authentication.util');
const Joi = require('joi');
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

router.get('/myposts', authentication.checkAuthentication, async (req, res)=>{
    const posts = await postsModel.find({userId: req.user._id}, (err, res)=>{
        if(err){
            res.status(404).send('No posts found!');
            return;
        }
    });
    console.log(posts);
    res.locals.title = "My Posts";
    res.render('myPosts.ejs', {user: req.user, posts: posts});
});

router.get('/posts/edit/:id', authentication.checkAuthentication, async (req, res)=>{
    const posts = await postsModel.find({_id: req.params.id}, (err, res)=>{
        if(err){
            res.status(404).send('No posts found!');
            return;
        }
    });
    console.log(posts);
    res.locals.title = "Edit Post";
    res.render('editPost.ejs', {user: req.user, posts: posts[0]});
});

router.post('/posts/edit/:id', authentication.checkAuthentication, async (req, res)=>{
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

    var filter= {_id: req.params.id};
    var update = {
        pickuplocation: pickupLocation, 
        dropofflocation: dropoffLocation, 
        pickupLocationLat: pickupLocationLat,
        pickupLocationLng: pickupLocationLng,
        dropoffLocationLat: dropoffLocationLat,
        dropoffLocationLng: dropoffLocationLng,
        usermessage: req.body.description};
    await postsModel.findOneAndUpdate(filter, update, function(err, doc) {
        if (err) return res.send(500, {error: err});
        return res.redirect('/myposts');
    });

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
        pickupLocation: Joi.string().min(3).max(500).required(),
        dropoffLocation: Joi.string().min(3).max(500).required(),
        description: Joi.string().min(5).max(2000).required(),
        pickupLocationLat: Joi.string(),
        pickupLocationLng: Joi.string(),
        dropoffLocationLat: Joi.string(),
        dropoffLocationLng: Joi.string(),
    };
    return Joi.validate(post, schema);
}
module.exports = router ;