const express = require('express');
const User = require('../models/user');
const authentication = require('../utils/authentication.util')
const router = new express.Router();

router.get('/verify', authentication.checkNotAuthenticated, (req,res) => {
    res.render('verify.ejs');
});

router.post('/verify', authentication.checkNotAuthenticated, async (req,res) => {
    try {
        const {emailToken} = req.body;
        const user = await User.findOne({'emailToken': emailToken});
        if (!user) {
            req.flash('error', 'User associated with this token not found');
            res.redirect('/verify');
            return;
        }
        user.emailConfirmed = true;
        user.emailToken = '';
        await user.save();
        res.redirect('/login');
    } catch(error) {
        console.log(error);
    }
});

module.exports = router