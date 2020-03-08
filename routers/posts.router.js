const express = require('express');
const postsModel = require('../models/posts');
const driversModel = require('../models/drivers');
const authentication = require('../utils/authentication.util');
const Joi = require('joi');
const router = new express.Router();

router.get('/post/create', authentication.checkAuthentication, async (req, res)=>{
    res.locals.title = "Create Post";
    const userCurrent = await driversModel.findOne({'username':req.user.username});
    if(userCurrent){
        res.render('createPost.ejs', {user: req.user, isDriver: true});
    }
    res.render('createPost.ejs', {user: req.user, isDriver:false});
    console.log('reached!');
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
    var post  = new postsModel({username: req.user.username, pickuplocation: req.body.pickUpLocation, 
        dropofflocation:req.body.dropOffLocation, 
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
        pickUpLocation: Joi.string().min(3).max(20).required(),
        dropOffLocation: Joi.string().min(3).max(20).required(),
        description: Joi.string().min(5).max(20).required()
    };
    return Joi.validate(post, schema);
}
module.exports = router ;