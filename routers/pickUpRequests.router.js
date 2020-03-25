const express = require('express');
const ridesModel = require('../models/ridesrequest');
const authentication = require('../utils/authentication.util');
const Joi = require('joi');
const router = new express.Router();

router.get('/pickUprequests', authentication.checkAuthentication, async (req, res)=>{
    res.locals.title = "My Posts Requests";
    const requests= await ridesModel.find({driver: req.user.username}, (err, res)=>{
        if(err){
            // Todo:: Handle Error
            return;
        }
    });
    return res.render('pickUpRequests.ejs', {requests: requests});
});

router.post('/accept/:id', authentication.checkAuthentication, async (req, res)=>{
    var id = req.params.id ;
    console.log(id);
    const waiter = await ridesModel.findOneAndUpdate({id: id}, {status:"accepted"}, {useFindAndModify: false}, (err, res)=>{
        if(err){
            //Todo :: Handle Error
            return;
        }
    });
    return res.redirect('/userLogs');
});

router.post('/reject/:id', authentication.checkAuthentication, async (req, res)=>{
    var id = req.params.id ;
    console.log(id);
    const waiter = await ridesModel.findOneAndUpdate({id: id}, {status:"rejected"}, {useFindAndModify: false}, (err, res)=>{
        if(err){
            //Todo :: Handle Error
            return;
        }
    });
    return res.redirect('/pickUprequests');
});

module.exports = router ;