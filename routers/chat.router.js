const express = require('express');
const moment = require('moment');
const mongoose = require('mongoose');
const thread = require('../models/thread');
const messages = require('../models/messages');
const User = require('../models/user');
const authentication = require('../utils/authentication.util')
const router = new express.Router();



router.get('/chats', authentication.checkAuthentication, async (req,res) => {
    const users = await User.find({}, (err,res) => {
        if(err) {
            throw err;
        }
    });
    res.locals.title = "Chats";
    res.render('chats.ejs', {
        user: req.user,
        users: users
    })
});

router.get('/chat/:id', authentication.checkAuthentication, async (req,res) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.redirect('/');
    }
    user1 = await User.findOne({_id : mongoose.Types.ObjectId(req.params.id)}, (err,res2) => {
        if(err) {
            throw error
        }
    });
    thread.findOne({$or: [{'group_name': req.user._id.toString()+ req.params.id}, {'group_name':  req.params.id+ req.user._id.toString()}]}, async(err,res1) => {
        if(res1===null) {
            //create a new thread
            user2 = await User.findOne({_id : req.user._id}, (err,res2) => {
                if(err) {
                    throw error
                }
            });
            // users: [req.user._id, mongoose.Types.ObjectId(req.params.id)]
            var newThread = new thread({ users: [user1.username, user2.username], group_name: req.user._id.toString()+ req.params.id, created_by: new mongoose.Types.ObjectId(), created_at: new Date().getTime(), id: req.params.id, last_message: "", last_sender: "", last_updated: new Date().getTime()});
            thread.create(newThread, (err,res2) => {
                 if(err) {
                     throw err;
                 }
                 else {
                    res.locals.title = "Chat";
                    res.render('chat.ejs', {user: req.user, id: req.user._id.toString()+ req.params.id, userId: user1.username, messages: []})
                 }
             });
            
        } else {
            thread.findOne({ users: req.user.username}, (err,res2) => {
                if(res2 == null) {
                    res.send("Sorry not authorized");
                } else{
                    messages.find({thread: res1.group_name}, (err,res3) =>{
                        if(err) {
                            throw err;
                        } else{
                            var mes = res3;
                            for(var i = 0; i < mes.length ; i++) {
                                mes[i].created = moment(mes[i].created_at).format('MMMM Do YYYY h:mm a')
                            }
                            res.locals.title = "Chat";
                            res.render('chat.ejs', {user: req.user, id: res1.group_name, userId: user1.username, messages: mes})
                        }
                    });
                }
            });
        }
    })
})

module.exports = router