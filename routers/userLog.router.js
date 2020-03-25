const express = require('express');
const ridesModel = require('../models/ridesrequest');
const authentication = require('../utils/authentication.util');
const Joi = require('joi');
const router = new express.Router();

router.get('/userLogs', authentication.checkAuthentication, async (req, res)=>{
    const isDriver = req.user.isDriver;
    activeRequests = [];
    var query = {};
    if(isDriver){
        query = {$and: [{driver:req.user.username}, {status:'started'}]};
    }
    else{
        query = {$and: [{rider:req.user.username}, {status:'started'}]};
    }
    activeRequests = await ridesModel.find(query, 
    (err, res)=>{
        if(err){
            //Todo:: handle error
            return;
        }
    });
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

router.post('/canceled/:id', authentication.checkAuthentication, async (req, res)=>{
    var id = req.params.id ;
    console.log('id is' + id);
    const waiter = await ridesModel.findOneAndUpdate({_id: id}, {status:"canceled"}, {useFindAndModify: false}, (err, res)=>{
        if(err){
            //Todo :: Handle Error
            return;
        }
    });
    return res.redirect('/userLogs');
});

router.get('/userLogs/accepted', authentication.checkAuthentication, async (req, res)=>{
    const isDriver = req.user.isDriver;
    var query = {};
    var queryStarted = {};
    if(isDriver){
        query = {$and: [{driver: req.user.username}, {status:"accepted"}]};
        queryStarted = {$and:[{driver: req.user.username}, {status:"started"}]};
    }else{
        query = {$and: [{rider: req.user.username}, {status:"accepted"}]};
        queryStarted = {$and:[{rider: req.user.username}, {status:"started"}]};
    }
    const historical = await ridesModel.find(query, (err, res)=>{
            if(err){
                //Todo: handle error
                return ;
            }
    });
    console.log(historical);
    const activeRequests = await ridesModel.find(queryStarted, 
            (err, res)=>{
                if(err){
                    //Todo:: handle error
                    return;
                }
            });
    res.locals.title = "Accepted Requests";
    return res.render('userLog.ejs', {activeRequests: activeRequests, historical: historical, isDriver:isDriver});
});

router.get('/userLogs/rejected', authentication.checkAuthentication, async (req, res)=>{
    const isDriver = req.user.isDriver;
    var query = {};
    var queryStarted = {};
    if(isDriver){
        query = {$and: [{driver: req.user.username}, {status:"rejected"}]};
        queryStarted = {$and:[{driver: req.user.username}, {status:"started"}]};
    }else{
        query = {$and: [{rider: req.user.username}, {status:"rejected"}]};
        queryStarted = {$and:[{rider: req.user.username}, {status:"started"}]};
    }
    const historical = await ridesModel.find(query, (err, res)=>{
            if(err){
                //Todo: handle error
                return ;
            }
    });
    console.log(historical);
    const activeRequests = await ridesModel.find(queryStarted, 
            (err, res)=>{
                if(err){
                    //Todo:: handle error
                    return;
                }
            });
    res.locals.title = "Rejected Requests";
    return res.render('userLog.ejs', {activeRequests: activeRequests, historical: historical, isDriver:isDriver});
});

router.get('/userLogs/ended', authentication.checkAuthentication, async (req, res)=>{
    const isDriver = req.user.isDriver;
    var query = {};
    var queryStarted = {};
    if(isDriver){
        query = {$and: [{driver: req.user.username}, {status:"ended"}]};
        queryStarted = {$and:[{driver: req.user.username}, {status:"started"}]};
    }else{
        query = {$and: [{rider: req.user.username}, {status:"ended"}]};
        queryStarted = {$and:[{rider: req.user.username}, {status:"started"}]};
    }
    const historical = await ridesModel.find(query, (err, res)=>{
            if(err){
                //Todo: handle error
                return ;
            }
    });
    console.log(historical);
    const activeRequests = await ridesModel.find(queryStarted, 
            (err, res)=>{
                if(err){
                    //Todo:: handle error
                    return;
                }
            });
    res.locals.title = "Ended Requests";
    return res.render('userLog.ejs', {activeRequests: activeRequests, historical: historical, isDriver:isDriver});
});

router.get('/userLogs/canceled', authentication.checkAuthentication, async (req, res)=>{
    const isDriver = req.user.isDriver;
    var query = {};
    var queryStarted = {};
    if(isDriver){
        query = {$and: [{driver: req.user.username}, {status:"canceled"}]};
        queryStarted = {$and:[{driver: req.user.username}, {status:"started"}]};
    }else{
        query = {$and: [{rider: req.user.username}, {status:"canceled"}]};
        queryStarted = {$and:[{rider: req.user.username}, {status:"started"}]};
    }
    const historical = await ridesModel.find(query, (err, res)=>{
            if(err){
                //Todo: handle error
                return ;
            }
    });
    console.log(historical);
    const activeRequests = await ridesModel.find(queryStarted, 
            (err, res)=>{
                if(err){
                    //Todo:: handle error
                    return;
                }
            });
    res.locals.title = "Canceled Requests";
    return res.render('userLog.ejs', {activeRequests: activeRequests, historical: historical, isDriver:isDriver});
});

module.exports = router ;