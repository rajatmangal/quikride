const express = require('express');
const ridesModel = require('../models/ridesrequest');
const authentication = require('../utils/authentication.util');
const Joi = require('joi');
const router = new express.Router();

router.get('/userLogs', authentication.checkAuthentication, async (req, res)=>{
    const isDriver = req.user.isDriver;
    activeRequests = []
    if(isDriver){
        activeRequests = await ridesModel.find({$and:[{driver: req.user.username}, 
            {status:"started"}]}, 
        (err, res)=>{
        if(err){
            //Todo:: handle error
            return;
        }
        });
    }else{
        activeRequests = await ridesModel.find({$and:[{rider: req.user.username}, 
            {status:"started"}]}, 
        (err, res)=>{
        if(err){
            //Todo:: handle error
            return;
        }
        });
    }
    res.locals.title = "User Log";
    return res.render('userLog.ejs', {activeRequests: activeRequests, historical: [], isDriver: isDriver});
});

router.post('/start/:id', authentication.checkAuthentication, async (req, res)=>{
    var id = req.params.id ;
    console.log('id is' + id);
    const waiter = await ridesModel.findOneAndUpdate({_id: id}, {status:"started"}, {useFindAndModify: false}, (err, res)=>{
        if(err){
            //Todo :: Handle Error
            return;
        }
    });
    return res.redirect('/userLogs');
});


router.post('/end/:id', authentication.checkAuthentication, async (req, res)=>{
    var id = req.params.id ;
    console.log('id is' + id);
    const waiter = await ridesModel.findOneAndUpdate({_id: id}, {status:"ended"}, {useFindAndModify: false}, (err, res)=>{
        if(err){
            //Todo :: Handle Error
            return;
        }
    });
    return res.redirect('/userLogs');
});

router.get('/userLogs/accepted', authentication.checkAuthentication, async (req, res)=>{
    const historical = await ridesModel.find({$and: [{driver: req.user.username}, {status:"accepted"}]}, (err, res)=>{
            if(err){
                //Todo: handle error
                return ;
            }
    });
    console.log(historical);
    const activeRequests = await ridesModel.find({$and:[{driver: req.user.username}, 
        {status:"started"}
        ]}, 
            (err, res)=>{
                if(err){
                    //Todo:: handle error
                    return;
                }
            });
    res.locals.title = "Accepted Requests";
    return res.render('userLog.ejs', {activeRequests: activeRequests, historical: historical});
});

router.get('/userLogs/rejected', authentication.checkAuthentication, async (req, res)=>{
    const historical = await ridesModel.find({$and: [{driver: req.user.username}, {status:"rejected"}]}, (err, res)=>{
            if(err){
                //Todo: handle error
                return ;
            }
    });
    console.log(historical);
    const activeRequests = await ridesModel.find({$and:[{driver: req.user.username}, 
        {status:"started"}
        ]}, 
            (err, res)=>{
                if(err){
                    //Todo:: handle error
                    return;
                }
            });
    res.locals.title = "Rejected Requests";
    return res.render('userLog.ejs', {activeRequests: activeRequests, historical: historical});
});

router.get('/userLogs/ended', authentication.checkAuthentication, async (req, res)=>{
    const historical = await ridesModel.find({$and: [{driver: req.user.username}, {status:"ended"}]}, (err, res)=>{
            if(err){
                //Todo: handle error
                return ;
            }
    });
    console.log(historical);
    const activeRequests = await ridesModel.find({$and:[{driver: req.user.username}, 
        {status:"started"}
        ]}, 
            (err, res)=>{
                if(err){
                    //Todo:: handle error
                    return;
                }
            });
    res.locals.title = "Completed Requests";
    return res.render('userLog.ejs', {activeRequests: activeRequests, historical: historical});
});

module.exports = router ;