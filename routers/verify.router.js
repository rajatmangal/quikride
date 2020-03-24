const express = require('express');
const User = require('../models/user');
const authentication = require('../utils/authentication.util')
const router = new express.Router();

router.get('/verify/:token', authentication.checkNotAuthenticated, async (req,res) => {
    var user = await User.findOne({ emailToken: req.params.token, linkExpires: { $gt: new Date().getTime() }});
    if (!user) {
        req.flash('error', 'Invalid or expired link. Redirecting to home page...');
        return res.redirect('/home');
    }
    user.emailConfirmed = true;
    user.emailToken = "";
    user.linkExpires = 0;
    await user.save();
    res.locals.title = "Verify Account";
    res.render('verify.ejs', {
        token: req.params.token
    });
});

module.exports = router