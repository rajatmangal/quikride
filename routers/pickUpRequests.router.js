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
    console.log(requests);
    // res.end();
    res.render('pickUpRequests.ejs', {requests: requests});
});


module.exports = router ;