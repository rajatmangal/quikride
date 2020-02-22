const express = require('express');
const authentication = require('../utils/authentication.util')
const router = new express.Router();

router.get('/map', authentication.checkAuthentication, (req,res) => {
    res.render('map.ejs',{ name: req.user.username});
});

module.exports = router