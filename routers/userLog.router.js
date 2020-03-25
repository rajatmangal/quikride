const express = require('express');
const ridesModel = require('../models/ridesrequest');
const authentication = require('../utils/authentication.util');
const Joi = require('joi');
const router = new express.Router();

router.get('/userLogs', authentication.checkAuthentication, async (req, res)=>{
    res.render('p')
})


module.exports = router ;