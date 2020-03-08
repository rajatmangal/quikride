const express = require('express');
const driversModel = require('../models/drivers');
const authentication = require('../utils/authentication.util');
const Joi = require('joi');
const router = new express.Router();

//To Do: 1. verify input data 2. 
var userFound = false ;
router.get('/driver/registration', authentication.checkAuthentication, async (req, res)=>{
    if(req.user.isDriver){
        userFound = true ;
        res.locals.title="Driver exists.";
        res.render('registerDriver.ejs', {
            userfound: true,
            user: req.user,
        });
        return ;
    }else{
        res.locals.title= "Register as a driver";
        res.render('registerDriver.ejs', {user: req.user,userfound:false});
        return;
    }
});

router.post('/driver/registration', authentication.checkAuthentication, async (req, res)=>{    
    const posts = await driversModel.find({}, (err, res)=>{
        if(err){
            res.status(404).send('No posts found!');
            return;
        }
    });
    console.log(req.body.fullNameOnLicense)
    var driver_reg  = new driversModel({username: req.user.username, userid: req.user._id, 
        fullNameOnLicense: req.body.fullNameOnLicense, licenseClass:req.body.licenseClass, 
        licenseNumber: req.body.licenseNumber, carName:req.body.carName, carModel:req.body.carModel});
    await driversModel.create(driver_reg, (err, pos)=>{
        if(err) {
            console.log(err)
            req.flash('error', err.message);
            return ;
        }
        console.log("New Driver Registered!");
        return res.redirect('/');
    });
});


module.exports = router ;
