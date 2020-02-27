const express = require('express');
const postsModel = require('../models/posts');
const authentication = require('../utils/authentication.util');
const Joi = require('joi');
const router = new express.Router();


router.get('/post/create', authentication.checkNotAuthenticated, (req, res)=>{
    res.locals.title = "Create Post";
    res.render('createPost.ejs');
    console.log('reached!');
});
router.get('/posts', authentication.checkNotAuthenticated, async (req, res)=>{
    const posts = await postsModel.find({}, (err, res)=>{
        if(err){
            res.status(404).send('No posts found!');
            return;
        }
    });
    console.log(posts);
    res.locals.title = "Posts";
    res.render('posts.ejs', {posts: posts});
});

router.post('/post/create', authentication.checkNotAuthenticated, async (req, res)=>{
    console.log('HAPPY SINGH');
    res.render('createPost.ejs');

    const { error } = validatePosts(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    var post  = new postsModel({username: req.body.username, pickuplocation: req.body.pickUpLocation, dropofflocation:req.body.dropOffLocation, usermessage: req.body.description, ridecost: 0});
    await postsModel.create(post, (err, pos)=>{
        if(err) {
            req.flash('error', err.message);
            return ;
        }
        console.log("New Post Saved");
        res.send(post);
    })
    res.send(req.body);

});
function validatePosts(post){
    const schema = {
        username: Joi.string().min(6).max(20).required(),
        pickUpLocation: Joi.string().min(3).max(20).required(),
        dropOffLocation: Joi.string().min(3).max(20).required(),
        description: Joi.string().min(5).max(20).required()
    };
    return Joi.validate(post, schema);
}
module.exports = router ;