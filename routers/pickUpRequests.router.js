const express = require('express');
const ridesModel = require('../models/ridesrequest');
const authentication = require('../utils/authentication.util');
const Joi = require('joi');
const router = new express.Router();

router.get('/pickUprequests', authentication.checkAuthentication, async (req, res)=>{
    res.locals.title = "My Posts Requests";
    const isDriver = req.user.isDriver ;
    var requests = []
    if(isDriver){
        requests= await ridesModel.find({$and:[{driver: req.user.username},
            {status:"pending"}]}, (err, res)=>{
            if(err){
                // Todo:: Handle Error
                return;
            }
        });
    }else{
        requests= await ridesModel.find({$and:[{rider: req.user.username},
            {status:"pending"}]}, (err, res)=>{
            if(err){
                // Todo:: Handle Error
                return;
            }
        });
    }
    
    console.log(isDriver);
    return res.render('pickUpRequests.ejs', {requests: requests, isDriver:isDriver, user:req.user});
});

router.post('/accept/:id', authentication.checkAuthentication, async (req, res)=>{
    var id = req.params.id ;
    console.log(id);
    const waiter = await ridesModel.findOneAndUpdate({_id: id}, {status:"accepted"}, {useFindAndModify: false}, (err, res)=>{
        if(err){
            //Todo :: Handle Error
            return;
        }
    });
    return res.redirect('/userLogs');
});

router.post('/reject/:id', authentication.checkAuthentication, async (req, res)=>{
    var id = req.params.id ;
    console.log('id rejected is ' + id);
    const waiter = await ridesModel.findOneAndUpdate({_id: id}, {status:"rejected"}, {useFindAndModify: false}, (err, res)=>{
        if(err){
            //Todo :: Handle Error
            return;
        }
    });
    return res.redirect('/pickUprequests');
});

router.post('/cancel/:id', authentication.checkAuthentication, async (req, res)=>{
    var id = req.params.id ;
    console.log('id rejected is ' + id);
    const waiter = await ridesModel.findOneAndUpdate({_id: id}, {status:"canceled"}, {useFindAndModify: false}, (err, res)=>{
        if(err){
            //Todo :: Handle Error
            return;
        }
    });
    return res.redirect('/pickUprequests');
});
module.exports = router ;