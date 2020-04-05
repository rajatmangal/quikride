const express = require('express');
const ridesModel = require('../models/ridesrequest');
const rideRatingModel = require('../models/rideRating');
const authentication = require('../utils/authentication.util');
const Joi = require('joi');
const router = new express.Router();

router.get('/userLogs', authentication.checkAuthentication, async (req, res)=>{
    const isDriver = req.user.isDriver;
    activeRequests = [];
    var query = {};
    var rated = false ;
    var rating  = 0 ;
    if(isDriver){
        query = {$and: [{driver:req.user.username}, {status:'started'}]};
        queryStarted = {$and:[{driver: req.user.username}]};
    }
    else{
        query = {$and: [{rider:req.user.username}, {status:'started'}]};
        queryStarted = {$and:[{rider: req.user.username}]};
    }
    activeRequests = await ridesModel.find(query, 
    (err, res)=>{
        if(err){
            //Todo:: handle error
            return;
        }
    });
    const historical = await ridesModel.find(queryStarted, (err, res)=>{
        if(err){
            //Todo: handle error
            return ;
        }
    });     
    if(activeRequests.length > 0 ){
        const rideRating  = await rideRatingModel.find({rideRequestId: activeRequests[0]._id}, (err, res)=>{
            if(err){
                return ;
            }
        });
        if(rideRating.length>0){
            console.log("rated ");
            rated = true ;
            rating =rideRating[0].rating ;
        }
    }
    res.locals.title = "User Log";
    return res.render('userLog.ejs', {activeRequests: activeRequests, historical: historical, isDriver: isDriver, user:req.user, rated:rated, rating: rating});
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

router.get('/rate/:id/:rating', authentication.checkAuthentication, async (req, res)=>{
    var id = (req.params.id);
    console.log('happy ' + id);
    var rid = (req.params.rating);
    console.log('happy ' + rid);
    var rideRating = new rideRatingModel({
        rideRequestId: id,
        rider: req.user.username,
        rating: rid
    });
    await rideRatingModel.create(rideRating, (err, pos)=>{
        if(err) {
            req.flash('error', err.message);
            return ;
        }
        console.log("New Rating Saved");
        return res.redirect('/userLogs');
    });
    
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
    return res.render('userLog.ejs', {activeRequests: activeRequests, historical: historical, isDriver:isDriver, user:req.user});
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
    return res.render('userLog.ejs', {activeRequests: activeRequests, historical: historical, isDriver:isDriver, user:req.user});
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
    return res.render('userLog.ejs', {activeRequests: activeRequests, historical: historical, isDriver:isDriver, user:req.user});
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
    return res.render('userLog.ejs', {activeRequests: activeRequests, historical: historical, isDriver:isDriver, user:req.user});
});

module.exports = router ;